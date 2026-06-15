import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import {
  AdminUser,
  BookshelfItem,
  Chapter,
  Novel,
  PublicUser,
  ReadingProgress,
  Session,
  User,
  UserPreferences,
} from './models';
import { hashPassword, verifyPassword } from './passwords';

const ONLINE_WINDOW_MS = 5 * 60 * 1000;

@Injectable()
export class InMemoryStore {
  private nextUserId = 1;
  private nextNovelId = 1;
  private nextChapterId = 1;
  private nextBookshelfId = 1;
  private nextProgressId = 1;
  private nextPreferencesId = 1;

  private readonly users = new Map<number, User>();
  private readonly sessions = new Map<string, Session>();
  private readonly novels = new Map<number, Novel>();
  private readonly chapters = new Map<number, Chapter>();
  private readonly bookshelf = new Map<number, BookshelfItem>();
  private readonly progress = new Map<number, ReadingProgress>();
  private readonly preferences = new Map<number, UserPreferences>();

  constructor() {
    this.createUser({
      username: 'admin',
      password: 'Admin12345',
      nickname: 'Administrator',
      role: 'admin',
    });
  }

  hashPassword(password: string): string {
    return hashPassword(password);
  }

  verifyPassword(password: string, storedHash: string): boolean {
    return verifyPassword(password, storedHash);
  }

  createUser(input: {
    username: string;
    password: string;
    nickname?: string;
    phone?: string;
    email?: string;
    role?: User['role'];
  }): User {
    const now = new Date().toISOString();
    const user: User = {
      id: this.nextUserId++,
      username: input.username,
      passwordHash: this.hashPassword(input.password),
      nickname: input.nickname,
      phone: input.phone,
      email: input.email,
      role: input.role ?? 'user',
      status: 'enabled',
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return user;
  }

  listUsers(): AdminUser[] {
    const onlineSince = Date.now() - ONLINE_WINDOW_MS;
    const presence = new Map<number, { isOnline: boolean; lastOnlineAt?: string }>();
    for (const session of this.sessions.values()) {
      const current = presence.get(session.userId) ?? { isOnline: false };
      const lastOnlineAt = session.onlineSinceAt || session.createdAt;
      const currentLastOnline = current.lastOnlineAt ? Date.parse(current.lastOnlineAt) : -Infinity;
      if (Date.parse(lastOnlineAt) > currentLastOnline) {
        current.lastOnlineAt = lastOnlineAt;
      }
      if (Date.parse(session.lastSeenAt) >= onlineSince) {
        current.isOnline = true;
      }
      presence.set(session.userId, current);
    }
    return Array.from(this.users.values()).map((user) => ({
      ...this.toPublicUser(user),
      isOnline: user.status === 'enabled' && !!presence.get(user.id)?.isOnline,
      lastOnlineAt: presence.get(user.id)?.lastOnlineAt,
    }));
  }

  findUserById(id: number): User | undefined {
    return this.users.get(id);
  }

  findUserByUsername(username: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  findUserByContact(contact: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.email === contact || user.phone === contact);
  }

  updateUser(user: User): User {
    user.updatedAt = new Date().toISOString();
    this.users.set(user.id, user);
    return user;
  }

  toPublicUser(user: User): PublicUser {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }

  createSession(userId: number): Session {
    const now = new Date().toISOString();
    const session: Session = {
      token: randomBytes(32).toString('hex'),
      userId,
      createdAt: now,
      lastSeenAt: now,
      onlineSinceAt: now,
    };
    this.sessions.set(session.token, session);
    return session;
  }

  findSession(token: string): Session | undefined {
    return this.sessions.get(token);
  }

  touchSession(token: string): Session | undefined {
    const session = this.sessions.get(token);
    if (!session) {
      return undefined;
    }
    const now = new Date();
    if (Date.parse(session.lastSeenAt) < now.getTime() - ONLINE_WINDOW_MS) {
      session.onlineSinceAt = now.toISOString();
    }
    session.lastSeenAt = now.toISOString();
    this.sessions.set(token, session);
    return session;
  }

  deleteSession(token: string): void {
    this.sessions.delete(token);
  }

  deleteSessionsForUser(userId: number): void {
    for (const [token, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(token);
      }
    }
  }

  upsertNovel(input: {
    title: string;
    author: string;
    description?: string;
    coverUrl?: string;
    sourceCode: string;
    sourceNovelId: string;
    sourceUrl?: string;
  }): Novel {
    const existing = Array.from(this.novels.values()).find(
      (novel) => novel.sourceCode === input.sourceCode && novel.sourceNovelId === input.sourceNovelId,
    );
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const novel: Novel = {
      id: this.nextNovelId++,
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    this.novels.set(novel.id, novel);
    return novel;
  }

  findNovel(id: number): Novel | undefined {
    return this.novels.get(id);
  }

  listChapters(novelId: number): Chapter[] {
    return Array.from(this.chapters.values())
      .filter((chapter) => chapter.novelId === novelId)
      .sort((a, b) => a.chapterOrder - b.chapterOrder);
  }

  replaceChapters(
    novelId: number,
    entries: Array<{ num: number; title: string; sourceUrl?: string }>,
  ): void {
    for (const entry of entries) {
      const existing = this.getChapterByOrder(novelId, entry.num);
      const now = new Date().toISOString();
      if (existing) {
        existing.title = entry.title;
        existing.sourceChapterId = String(entry.num);
        existing.sourceUrl = entry.sourceUrl;
        existing.updatedAt = now;
      } else {
        const chapter: Chapter = {
          id: this.nextChapterId++,
          novelId,
          title: entry.title,
          chapterOrder: entry.num,
          sourceChapterId: String(entry.num),
          sourceUrl: entry.sourceUrl,
          createdAt: now,
          updatedAt: now,
        };
        this.chapters.set(chapter.id, chapter);
      }
    }
  }

  getChapterByOrder(novelId: number, order: number): Chapter | undefined {
    return this.listChapters(novelId).find((chapter) => chapter.chapterOrder === order);
  }

  ensureChapterStub(novelId: number, num: number, title: string, sourceUrl?: string): Chapter {
    const existing = this.getChapterByOrder(novelId, num);
    if (existing) {
      return existing;
    }
    const now = new Date().toISOString();
    const chapter: Chapter = {
      id: this.nextChapterId++,
      novelId,
      title,
      chapterOrder: num,
      sourceChapterId: String(num),
      sourceUrl,
      createdAt: now,
      updatedAt: now,
    };
    this.chapters.set(chapter.id, chapter);
    return chapter;
  }

  updateChapterContent(chapterId: number, content: string, title?: string): Chapter | undefined {
    const chapter = this.chapters.get(chapterId);
    if (!chapter) {
      return undefined;
    }
    const now = new Date().toISOString();
    chapter.content = content;
    chapter.contentCachedAt = now;
    if (title) {
      chapter.title = title;
    }
    chapter.updatedAt = now;
    this.chapters.set(chapterId, chapter);
    return chapter;
  }

  findChapter(id: number): Chapter | undefined {
    return this.chapters.get(id);
  }

  listBookshelf(userId: number): Array<BookshelfItem & { novel: Novel }> {
    return Array.from(this.bookshelf.values())
      .filter((item) => item.userId === userId && item.status === 'active')
      .sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt) || b.id - a.id)
      .map((item) => ({ ...item, novel: this.novels.get(item.novelId)! }));
  }

  addBookshelfItem(userId: number, novelId: number): BookshelfItem {
    const existing = Array.from(this.bookshelf.values()).find((item) => item.userId === userId && item.novelId === novelId);
    if (existing) {
      const now = new Date().toISOString();
      existing.status = 'active';
      existing.addedAt = now;
      existing.updatedAt = now;
      return existing;
    }

    const now = new Date().toISOString();
    const item: BookshelfItem = {
      id: this.nextBookshelfId++,
      userId,
      novelId,
      sortOrder: this.nextBookshelfId,
      status: 'active',
      addedAt: now,
      updatedAt: now,
    };
    this.bookshelf.set(item.id, item);
    return item;
  }

  updateBookshelfItem(userId: number, id: number, patch: Partial<BookshelfItem>): BookshelfItem | undefined {
    const item = this.bookshelf.get(id);
    if (!item || item.userId !== userId || item.status !== 'active') {
      return undefined;
    }

    Object.assign(item, patch, { updatedAt: new Date().toISOString() });
    this.bookshelf.set(id, item);
    return item;
  }

  deleteBookshelfItem(userId: number, id: number): boolean {
    const item = this.bookshelf.get(id);
    if (!item || item.userId !== userId || item.status !== 'active') {
      return false;
    }

    item.status = 'deleted';
    item.updatedAt = new Date().toISOString();
    return true;
  }

  getProgress(userId: number, novelId: number): ReadingProgress | undefined {
    return Array.from(this.progress.values()).find((item) => item.userId === userId && item.novelId === novelId);
  }

  upsertProgress(userId: number, novelId: number, input: Partial<ReadingProgress>): ReadingProgress {
    const existing = this.getProgress(userId, novelId);
    if (existing) {
      Object.assign(existing, input, { updatedAt: new Date().toISOString() });
      return existing;
    }

    const item: ReadingProgress = {
      id: this.nextProgressId++,
      userId,
      novelId,
      progressPercent: input.progressPercent ?? 0,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.progress.set(item.id, item);
    return item;
  }

  getPreferences(userId: number): UserPreferences {
    const existing = Array.from(this.preferences.values()).find((item) => item.userId === userId);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const item: UserPreferences = {
      id: this.nextPreferencesId++,
      userId,
      bookshelfTheme: {},
      tabbarTheme: {},
      readerTheme: {},
      createdAt: now,
      updatedAt: now,
    };
    this.preferences.set(item.id, item);
    return item;
  }

  savePreferences(
    userId: number,
    input: Partial<Pick<UserPreferences, 'bookshelfTheme' | 'tabbarTheme' | 'readerTheme'>>,
  ): UserPreferences {
    const item = this.getPreferences(userId);
    Object.assign(item, input, { updatedAt: new Date().toISOString() });
    this.preferences.set(item.id, item);
    return item;
  }
}
