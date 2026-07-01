import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { Pool, ResultSetHeader, RowDataPacket, createPool } from 'mysql2/promise';
import {
  AdminUser,
  BookshelfItem,
  Chapter,
  Novel,
  NovelSource,
  PublicUser,
  ReadingProgress,
  SearchHistoryItem,
  Session,
  User,
  UserPreferences,
} from './models';
import { hashPassword, verifyPassword } from './passwords';

type DbRow = RowDataPacket & Record<string, unknown>;

@Injectable()
export class MysqlStore implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER ?? 'novel_server',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'novel_server',
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
      charset: 'utf8mb4',
      timezone: 'local',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.createSchema();
    await this.ensureAdminUser();
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  hashPassword(password: string): string {
    return hashPassword(password);
  }

  verifyPassword(password: string, storedHash: string): boolean {
    return verifyPassword(password, storedHash);
  }

  async createUser(input: {
    username: string;
    password: string;
    nickname?: string;
    phone?: string;
    email?: string;
    role?: User['role'];
  }): Promise<User> {
    const passwordHash = this.hashPassword(input.password);
    const [result] = await this.pool.execute<ResultSetHeader>(
      `INSERT INTO users (username, password_hash, nickname, phone, email, role, status)
       VALUES (?, ?, ?, ?, ?, ?, 'enabled')`,
      [input.username, passwordHash, input.nickname ?? null, input.phone ?? null, input.email ?? null, input.role ?? 'user'],
    );
    const user = await this.findUserById(result.insertId);
    if (!user) {
      throw new Error('Created user not found');
    }
    return user;
  }

  async listUsers(): Promise<AdminUser[]> {
    const [rows] = await this.pool.query<DbRow[]>(`
      SELECT users.*,
        EXISTS(
          SELECT 1
          FROM sessions
          WHERE sessions.user_id = users.id
            AND sessions.last_seen_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 MINUTE)
          LIMIT 1
        ) AS is_online,
        (
          SELECT MAX(sessions.online_since_at)
          FROM sessions
          WHERE sessions.user_id = users.id
        ) AS last_online_at
      FROM users
      ORDER BY users.id ASC
    `);
    return rows.map((row) => {
      const user = this.toPublicUser(this.mapUser(row));
      return {
        ...user,
        isOnline: user.status === 'enabled' && Boolean(Number(row.is_online ?? 0)),
        lastOnlineAt: row.last_online_at ? this.dateToIso(row.last_online_at) : undefined,
      };
    });
  }

  async findUserById(id: number): Promise<User | undefined> {
    const [rows] = await this.pool.execute<DbRow[]>('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] ? this.mapUser(rows[0]) : undefined;
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    const [rows] = await this.pool.execute<DbRow[]>('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] ? this.mapUser(rows[0]) : undefined;
  }

  async findUserByContact(contact: string): Promise<User | undefined> {
    const [rows] = await this.pool.execute<DbRow[]>('SELECT * FROM users WHERE email = ? OR phone = ?', [contact, contact]);
    return rows[0] ? this.mapUser(rows[0]) : undefined;
  }

  async updateUser(user: User): Promise<User> {
    await this.pool.execute(
      `UPDATE users
       SET password_hash = ?, nickname = ?, phone = ?, email = ?, avatar_url = ?, role = ?, status = ?, last_login_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        user.passwordHash,
        user.nickname ?? null,
        user.phone ?? null,
        user.email ?? null,
        user.avatarUrl ?? null,
        user.role,
        user.status,
        user.lastLoginAt ? new Date(user.lastLoginAt) : null,
        user.id,
      ],
    );
    const updated = await this.findUserById(user.id);
    if (!updated) {
      throw new Error('Updated user not found');
    }
    return updated;
  }

  async deleteUser(id: number): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  toPublicUser(user: User): PublicUser {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }

  async createSession(userId: number): Promise<Session> {
    const now = new Date().toISOString();
    const session: Session = {
      token: randomBytes(32).toString('hex'),
      userId,
      createdAt: now,
      lastSeenAt: now,
      onlineSinceAt: now,
    };
    await this.pool.execute(
      'INSERT INTO sessions (token, user_id, last_seen_at, online_since_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      [session.token, userId],
    );
    return session;
  }

  async findSession(token: string): Promise<Session | undefined> {
    const [rows] = await this.pool.execute<DbRow[]>('SELECT * FROM sessions WHERE token = ?', [token]);
    return rows[0] ? this.mapSession(rows[0]) : undefined;
  }

  async touchSession(token: string): Promise<Session | undefined> {
    await this.pool.execute(
      `UPDATE sessions
       SET online_since_at = CASE
             WHEN last_seen_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 MINUTE) THEN CURRENT_TIMESTAMP
             ELSE online_since_at
           END,
           last_seen_at = CURRENT_TIMESTAMP
       WHERE token = ?`,
      [token],
    );
    return this.findSession(token);
  }

  async deleteSession(token: string): Promise<void> {
    await this.pool.execute('DELETE FROM sessions WHERE token = ?', [token]);
  }

  async deleteSessionsForUser(userId: number): Promise<void> {
    await this.pool.execute('DELETE FROM sessions WHERE user_id = ?', [userId]);
  }

  async listNovelSources(): Promise<NovelSource[]> {
    const [rows] = await this.pool.execute<DbRow[]>(
      'SELECT * FROM novel_sources ORDER BY sort_order ASC, code ASC',
    );
    return rows.map((row) => this.mapNovelSource(row));
  }

  async updateNovelSourceEnabled(code: string, enabled: boolean): Promise<NovelSource | undefined> {
    const [rows] = await this.pool.execute<DbRow[]>('SELECT * FROM novel_sources WHERE code = ?', [code]);
    if (!rows[0]) {
      return undefined;
    }
    if (!enabled) {
      const [countRows] = await this.pool.execute<DbRow[]>(
        'SELECT COUNT(*) AS count FROM novel_sources WHERE enabled = 1',
      );
      if (Number(countRows[0]?.count ?? 0) <= 1 && Boolean(Number(rows[0].enabled ?? 0))) {
        return undefined;
      }
    }
    await this.pool.execute(
      'UPDATE novel_sources SET enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?',
      [enabled ? 1 : 0, code],
    );
    const [updatedRows] = await this.pool.execute<DbRow[]>('SELECT * FROM novel_sources WHERE code = ?', [code]);
    return updatedRows[0] ? this.mapNovelSource(updatedRows[0]) : undefined;
  }

  async upsertNovel(input: {
    title: string;
    author: string;
    description?: string;
    coverUrl?: string;
    sourceCode: string;
    sourceNovelId: string;
    sourceUrl?: string;
  }): Promise<Novel> {
    const existing = await this.findNovelBySource(input.sourceCode, input.sourceNovelId);
    if (existing) {
      return existing;
    }

    const [result] = await this.pool.execute<ResultSetHeader>(
      `INSERT INTO novels (title, author, description, cover_url, source_code, source_novel_id, source_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        input.title,
        input.author,
        input.description ?? null,
        input.coverUrl ?? null,
        input.sourceCode,
        input.sourceNovelId,
        input.sourceUrl ?? null,
      ],
    );
    const novel = await this.findNovel(result.insertId);
    if (!novel) {
      throw new Error('Created novel not found');
    }
    return novel;
  }

  async findNovel(id: number): Promise<Novel | undefined> {
    const [rows] = await this.pool.execute<DbRow[]>('SELECT * FROM novels WHERE id = ?', [id]);
    return rows[0] ? this.mapNovel(rows[0]) : undefined;
  }

  async listChapters(novelId: number): Promise<Chapter[]> {
    const [rows] = await this.pool.execute<DbRow[]>(
      'SELECT * FROM chapters WHERE novel_id = ? ORDER BY chapter_order ASC',
      [novelId],
    );
    return rows.map((row) => this.mapChapter(row));
  }

  async replaceChapters(
    novelId: number,
    entries: Array<{ num: number; title: string; sourceUrl?: string }>,
  ): Promise<void> {
    const BATCH = 200;
    for (let i = 0; i < entries.length; i += BATCH) {
      const slice = entries.slice(i, i + BATCH);
      const placeholders = slice.map(() => '(?, ?, ?, ?, ?)').join(', ');
      const params: Array<string | number | null> = [];
      for (const entry of slice) {
        params.push(novelId, entry.title, entry.num, String(entry.num), entry.sourceUrl ?? null);
      }
      // 依赖 uniq_novel_order(novel_id, chapter_order) 做 upsert，刻意不写 content（保留已缓存正文）
      await this.pool.query(
        `INSERT INTO chapters (novel_id, title, chapter_order, source_chapter_id, source_url)
         VALUES ${placeholders}
         ON DUPLICATE KEY UPDATE title = VALUES(title), source_chapter_id = VALUES(source_chapter_id),
                                 source_url = VALUES(source_url), updated_at = CURRENT_TIMESTAMP`,
        params,
      );
    }
  }

  async getChapterByOrder(novelId: number, order: number): Promise<Chapter | undefined> {
    const [rows] = await this.pool.execute<DbRow[]>(
      'SELECT * FROM chapters WHERE novel_id = ? AND chapter_order = ?',
      [novelId, order],
    );
    return rows[0] ? this.mapChapter(rows[0]) : undefined;
  }

  async ensureChapterStub(
    novelId: number,
    num: number,
    title: string,
    sourceUrl?: string,
  ): Promise<Chapter> {
    const existing = await this.getChapterByOrder(novelId, num);
    if (existing) {
      return existing;
    }
    await this.pool.execute(
      `INSERT INTO chapters (novel_id, title, chapter_order, source_chapter_id, source_url)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP`,
      [novelId, title, num, String(num), sourceUrl ?? null],
    );
    const chapter = await this.getChapterByOrder(novelId, num);
    if (!chapter) {
      throw new Error('Created chapter not found');
    }
    return chapter;
  }

  async updateChapterContent(
    chapterId: number,
    content: string,
    title?: string,
  ): Promise<Chapter | undefined> {
    await this.pool.execute(
      `UPDATE chapters
       SET content = ?, content_cached_at = CURRENT_TIMESTAMP,
           title = COALESCE(?, title), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [content, title ?? null, chapterId],
    );
    return this.findChapter(chapterId);
  }

  async findChapter(id: number): Promise<Chapter | undefined> {
    const [rows] = await this.pool.execute<DbRow[]>('SELECT * FROM chapters WHERE id = ?', [id]);
    return rows[0] ? this.mapChapter(rows[0]) : undefined;
  }

  async listBookshelf(userId: number): Promise<Array<BookshelfItem & { novel: Novel }>> {
    const [rows] = await this.pool.execute<DbRow[]>(
      `SELECT b.*, n.id AS novel_id_value, n.title, n.author, n.description, n.cover_url, n.source_code, n.source_novel_id,
              n.source_url, n.created_at AS novel_created_at, n.updated_at AS novel_updated_at
       FROM user_bookshelves b
       JOIN novels n ON n.id = b.novel_id
       WHERE b.user_id = ? AND b.status = 'active'
       ORDER BY b.added_at DESC, b.id DESC`,
      [userId],
    );
    return rows.map((row) => ({
      ...this.mapBookshelfItem(row),
      novel: {
        id: Number(row.novel_id_value),
        title: String(row.title),
        author: String(row.author),
        description: this.optionalString(row.description),
        coverUrl: this.optionalString(row.cover_url),
        sourceCode: String(row.source_code),
        sourceNovelId: String(row.source_novel_id),
        sourceUrl: this.optionalString(row.source_url),
        createdAt: this.dateToIso(row.novel_created_at),
        updatedAt: this.dateToIso(row.novel_updated_at),
      },
    }));
  }

  async addBookshelfItem(userId: number, novelId: number): Promise<BookshelfItem> {
    const [existingRows] = await this.pool.execute<DbRow[]>(
      'SELECT * FROM user_bookshelves WHERE user_id = ? AND novel_id = ?',
      [userId, novelId],
    );
    if (existingRows[0]) {
      await this.pool.execute(
        `UPDATE user_bookshelves
         SET status = 'active', added_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [existingRows[0].id],
      );
      return (await this.findBookshelfItem(Number(existingRows[0].id)))!;
    }

    const [maxRows] = await this.pool.execute<DbRow[]>(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order FROM user_bookshelves WHERE user_id = ?',
      [userId],
    );
    const sortOrder = Number(maxRows[0]?.next_sort_order ?? 1);
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO user_bookshelves (user_id, novel_id, sort_order, status) VALUES (?, ?, ?, "active")',
      [userId, novelId, sortOrder],
    );
    return (await this.findBookshelfItem(result.insertId))!;
  }

  async updateBookshelfItem(userId: number, id: number, patch: Partial<BookshelfItem>): Promise<BookshelfItem | undefined> {
    const item = await this.findBookshelfItem(id);
    if (!item || item.userId !== userId || item.status !== 'active') {
      return undefined;
    }

    await this.pool.execute(
      `UPDATE user_bookshelves
       SET custom_title = ?, custom_cover_url = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        patch.customTitle ?? item.customTitle ?? null,
        patch.customCoverUrl ?? item.customCoverUrl ?? null,
        patch.sortOrder ?? item.sortOrder,
        id,
      ],
    );
    return this.findBookshelfItem(id);
  }

  async deleteBookshelfItem(userId: number, id: number): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      `UPDATE user_bookshelves
       SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ? AND status = 'active'`,
      [id, userId],
    );
    return result.affectedRows > 0;
  }

  async getProgress(userId: number, novelId: number): Promise<ReadingProgress | undefined> {
    const [rows] = await this.pool.execute<DbRow[]>(
      'SELECT * FROM reading_progress WHERE user_id = ? AND novel_id = ?',
      [userId, novelId],
    );
    return rows[0] ? this.mapProgress(rows[0]) : undefined;
  }

  async upsertProgress(userId: number, novelId: number, input: Partial<ReadingProgress>): Promise<ReadingProgress> {
    await this.pool.execute(
      `INSERT INTO reading_progress
       (user_id, novel_id, chapter_id, chapter_order, scroll_position, paragraph_index, progress_percent)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         chapter_id = VALUES(chapter_id),
         chapter_order = VALUES(chapter_order),
         scroll_position = VALUES(scroll_position),
         paragraph_index = VALUES(paragraph_index),
         progress_percent = VALUES(progress_percent),
         updated_at = CURRENT_TIMESTAMP`,
      [
        userId,
        novelId,
        input.chapterId ?? null,
        input.chapterOrder ?? null,
        input.scrollPosition ?? null,
        input.paragraphIndex ?? null,
        input.progressPercent ?? 0,
      ],
    );
    const progress = await this.getProgress(userId, novelId);
    if (!progress) {
      throw new Error('Saved progress not found');
    }
    return progress;
  }

  async listSearchHistory(userId: number, limit = 20): Promise<SearchHistoryItem[]> {
    const safeLimit = Math.max(1, Math.min(50, Math.floor(Number(limit) || 20)));
    const [rows] = await this.pool.execute<DbRow[]>(
      `SELECT *
       FROM search_history
       WHERE user_id = ?
       ORDER BY last_searched_at DESC, id DESC
       LIMIT ${safeLimit}`,
      [userId],
    );
    return rows.map((row) => this.mapSearchHistory(row));
  }

  async recordSearchHistory(userId: number, keyword: string): Promise<SearchHistoryItem> {
    const normalized = keyword.trim();
    await this.pool.execute(
      `INSERT INTO search_history (user_id, keyword, search_count, last_searched_at)
       VALUES (?, ?, 1, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         search_count = search_count + 1,
         last_searched_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, normalized],
    );
    const [rows] = await this.pool.execute<DbRow[]>(
      'SELECT * FROM search_history WHERE user_id = ? AND keyword = ?',
      [userId, normalized],
    );
    return this.mapSearchHistory(rows[0]);
  }

  async deleteSearchHistoryItem(userId: number, id: number): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'DELETE FROM search_history WHERE user_id = ? AND id = ?',
      [userId, id],
    );
    return result.affectedRows > 0;
  }

  async clearSearchHistory(userId: number): Promise<void> {
    await this.pool.execute('DELETE FROM search_history WHERE user_id = ?', [userId]);
  }

  async getPreferences(userId: number): Promise<UserPreferences> {
    const [rows] = await this.pool.execute<DbRow[]>('SELECT * FROM user_preferences WHERE user_id = ?', [userId]);
    if (rows[0]) {
      return this.mapPreferences(rows[0]);
    }

    const [result] = await this.pool.execute<ResultSetHeader>(
      `INSERT INTO user_preferences (user_id, bookshelf_theme, tabbar_theme, reader_theme)
       VALUES (?, '{}', '{}', '{}')`,
      [userId],
    );
    const [createdRows] = await this.pool.execute<DbRow[]>('SELECT * FROM user_preferences WHERE id = ?', [result.insertId]);
    return this.mapPreferences(createdRows[0]);
  }

  async savePreferences(
    userId: number,
    input: Partial<Pick<UserPreferences, 'bookshelfTheme' | 'tabbarTheme' | 'readerTheme'>>,
  ): Promise<UserPreferences> {
    const current = await this.getPreferences(userId);
    await this.pool.execute(
      `UPDATE user_preferences
       SET bookshelf_theme = ?, tabbar_theme = ?, reader_theme = ?, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [
        JSON.stringify(input.bookshelfTheme ?? current.bookshelfTheme),
        JSON.stringify(input.tabbarTheme ?? current.tabbarTheme),
        JSON.stringify(input.readerTheme ?? current.readerTheme),
        userId,
      ],
    );
    return this.getPreferences(userId);
  }

  private async findNovelBySource(sourceCode: string, sourceNovelId: string): Promise<Novel | undefined> {
    const [rows] = await this.pool.execute<DbRow[]>(
      'SELECT * FROM novels WHERE source_code = ? AND source_novel_id = ?',
      [sourceCode, sourceNovelId],
    );
    return rows[0] ? this.mapNovel(rows[0]) : undefined;
  }

  private async findBookshelfItem(id: number): Promise<BookshelfItem | undefined> {
    const [rows] = await this.pool.execute<DbRow[]>('SELECT * FROM user_bookshelves WHERE id = ?', [id]);
    return rows[0] ? this.mapBookshelfItem(rows[0]) : undefined;
  }

  private async ensureAdminUser(): Promise<void> {
    const existing = await this.findUserByUsername('admin');
    if (!existing) {
      await this.createUser({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD ?? 'Admin12345',
        nickname: 'Administrator',
        role: 'admin',
      });
    }
  }

  private async ensureSessionLastSeenColumn(): Promise<void> {
    const [rows] = await this.pool.execute<DbRow[]>(
      `SELECT COUNT(*) AS count
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'sessions'
         AND COLUMN_NAME = 'last_seen_at'`,
    );
    if (Number(rows[0]?.count ?? 0) > 0) {
      return;
    }

    await this.pool.query('ALTER TABLE sessions ADD COLUMN last_seen_at DATETIME NULL AFTER created_at');
    await this.pool.query('UPDATE sessions SET last_seen_at = created_at WHERE last_seen_at IS NULL');
    await this.pool.query('ALTER TABLE sessions MODIFY last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
  }

  private async ensureUserAvatarColumn(): Promise<void> {
    const [rows] = await this.pool.execute<DbRow[]>(
      `SELECT COUNT(*) AS count
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'users'
         AND COLUMN_NAME = 'avatar_url'`,
    );
    if (Number(rows[0]?.count ?? 0) > 0) {
      return;
    }

    await this.pool.query('ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) NULL AFTER email');
  }

  private async ensureSessionOnlineSinceColumn(): Promise<void> {
    const [rows] = await this.pool.execute<DbRow[]>(
      `SELECT COUNT(*) AS count
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'sessions'
         AND COLUMN_NAME = 'online_since_at'`,
    );
    if (Number(rows[0]?.count ?? 0) > 0) {
      return;
    }

    await this.pool.query('ALTER TABLE sessions ADD COLUMN online_since_at DATETIME NULL AFTER last_seen_at');
    await this.pool.query('UPDATE sessions SET online_since_at = last_seen_at WHERE online_since_at IS NULL');
    await this.pool.query('ALTER TABLE sessions MODIFY online_since_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
  }

  private async createSchema(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        nickname VARCHAR(100) NULL,
        phone VARCHAR(50) NULL UNIQUE,
        email VARCHAR(255) NULL UNIQUE,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        status VARCHAR(20) NOT NULL DEFAULT 'enabled',
        avatar_url VARCHAR(500) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login_at DATETIME NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await this.ensureUserAvatarColumn();
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        token VARCHAR(128) NOT NULL PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        online_since_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_sessions_user_id (user_id),
        CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await this.ensureSessionLastSeenColumn();
    await this.ensureSessionOnlineSinceColumn();
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS novel_sources (
        code VARCHAR(50) NOT NULL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        base_url VARCHAR(500) NOT NULL,
        enabled TINYINT(1) NOT NULL DEFAULT 1,
        sort_order INT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await this.pool.execute(
      `INSERT INTO novel_sources (code, name, base_url, enabled, sort_order)
       VALUES ('quanben', 'quanben.io', 'https://www.quanben.io/', 1, 10)
       ON DUPLICATE KEY UPDATE name = VALUES(name), base_url = VALUES(base_url), sort_order = VALUES(sort_order)`,
    );
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS novels (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        description TEXT NULL,
        cover_url VARCHAR(500) NULL,
        source_code VARCHAR(50) NOT NULL,
        source_novel_id VARCHAR(255) NOT NULL,
        source_url VARCHAR(500) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_source_novel (source_code, source_novel_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS chapters (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        novel_id BIGINT UNSIGNED NOT NULL,
        title VARCHAR(255) NOT NULL,
        chapter_order INT NOT NULL,
        source_chapter_id VARCHAR(255) NULL,
        source_url VARCHAR(500) NULL,
        content LONGTEXT NULL,
        content_cached_at DATETIME NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_novel_order (novel_id, chapter_order),
        INDEX idx_chapters_novel_id (novel_id),
        CONSTRAINT fk_chapters_novel FOREIGN KEY (novel_id) REFERENCES novels(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS user_bookshelves (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        novel_id BIGINT UNSIGNED NOT NULL,
        custom_title VARCHAR(255) NULL,
        custom_cover_url VARCHAR(500) NULL,
        sort_order INT NOT NULL DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_user_novel (user_id, novel_id),
        INDEX idx_bookshelf_user_status (user_id, status),
        CONSTRAINT fk_bookshelf_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_bookshelf_novel FOREIGN KEY (novel_id) REFERENCES novels(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS reading_progress (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        novel_id BIGINT UNSIGNED NOT NULL,
        chapter_id BIGINT UNSIGNED NULL,
        chapter_order INT NULL,
        scroll_position INT NULL,
        paragraph_index INT NULL,
        progress_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_user_progress (user_id, novel_id),
        CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_progress_novel FOREIGN KEY (novel_id) REFERENCES novels(id) ON DELETE CASCADE,
        CONSTRAINT fk_progress_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS search_history (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        keyword VARCHAR(255) NOT NULL,
        search_count INT NOT NULL DEFAULT 1,
        last_searched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_user_keyword (user_id, keyword),
        INDEX idx_search_history_user_last (user_id, last_searched_at),
        CONSTRAINT fk_search_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL UNIQUE,
        bookshelf_theme JSON NOT NULL,
        tabbar_theme JSON NOT NULL,
        reader_theme JSON NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS uploaded_files (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        storage_key VARCHAR(500) NOT NULL,
        url VARCHAR(500) NOT NULL,
        size INT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_uploaded_files_user_id (user_id),
        CONSTRAINT fk_uploaded_files_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  private mapUser(row: DbRow): User {
    return {
      id: Number(row.id),
      username: String(row.username),
      passwordHash: String(row.password_hash),
      nickname: this.optionalString(row.nickname),
      phone: this.optionalString(row.phone),
      email: this.optionalString(row.email),
      avatarUrl: this.optionalString(row.avatar_url),
      role: row.role === 'admin' ? 'admin' : 'user',
      status: row.status === 'disabled' ? 'disabled' : 'enabled',
      createdAt: this.dateToIso(row.created_at),
      updatedAt: this.dateToIso(row.updated_at),
      lastLoginAt: row.last_login_at ? this.dateToIso(row.last_login_at) : undefined,
    };
  }

  private mapSession(row: DbRow): Session {
    return {
      token: String(row.token),
      userId: Number(row.user_id),
      createdAt: this.dateToIso(row.created_at),
      lastSeenAt: row.last_seen_at ? this.dateToIso(row.last_seen_at) : this.dateToIso(row.created_at),
      onlineSinceAt: row.online_since_at ? this.dateToIso(row.online_since_at) : this.dateToIso(row.created_at),
    };
  }

  private mapNovel(row: DbRow): Novel {
    return {
      id: Number(row.id),
      title: String(row.title),
      author: String(row.author),
      description: this.optionalString(row.description),
      coverUrl: this.optionalString(row.cover_url),
      sourceCode: String(row.source_code),
      sourceNovelId: String(row.source_novel_id),
      sourceUrl: this.optionalString(row.source_url),
      createdAt: this.dateToIso(row.created_at),
      updatedAt: this.dateToIso(row.updated_at),
    };
  }

  private mapNovelSource(row: DbRow): NovelSource {
    return {
      code: String(row.code),
      name: String(row.name),
      baseUrl: String(row.base_url),
      enabled: Boolean(Number(row.enabled ?? 0)),
      sortOrder: Number(row.sort_order ?? 0),
      updatedAt: this.dateToIso(row.updated_at),
    };
  }

  private mapChapter(row: DbRow): Chapter {
    return {
      id: Number(row.id),
      novelId: Number(row.novel_id),
      title: String(row.title),
      chapterOrder: Number(row.chapter_order),
      sourceChapterId: this.optionalString(row.source_chapter_id),
      sourceUrl: this.optionalString(row.source_url),
      content: this.optionalString(row.content),
      contentCachedAt: row.content_cached_at ? this.dateToIso(row.content_cached_at) : undefined,
      createdAt: this.dateToIso(row.created_at),
      updatedAt: this.dateToIso(row.updated_at),
    };
  }

  private mapBookshelfItem(row: DbRow): BookshelfItem {
    return {
      id: Number(row.id),
      userId: Number(row.user_id),
      novelId: Number(row.novel_id),
      customTitle: this.optionalString(row.custom_title),
      customCoverUrl: this.optionalString(row.custom_cover_url),
      sortOrder: Number(row.sort_order),
      status: row.status === 'deleted' ? 'deleted' : 'active',
      addedAt: this.dateToIso(row.added_at),
      updatedAt: this.dateToIso(row.updated_at),
    };
  }

  private mapProgress(row: DbRow): ReadingProgress {
    return {
      id: Number(row.id),
      userId: Number(row.user_id),
      novelId: Number(row.novel_id),
      chapterId: row.chapter_id == null ? undefined : Number(row.chapter_id),
      chapterOrder: row.chapter_order == null ? undefined : Number(row.chapter_order),
      scrollPosition: row.scroll_position == null ? undefined : Number(row.scroll_position),
      paragraphIndex: row.paragraph_index == null ? undefined : Number(row.paragraph_index),
      progressPercent: Number(row.progress_percent),
      updatedAt: this.dateToIso(row.updated_at),
    };
  }

  private mapSearchHistory(row: DbRow): SearchHistoryItem {
    return {
      id: Number(row.id),
      userId: Number(row.user_id),
      keyword: String(row.keyword),
      searchCount: Number(row.search_count ?? 1),
      lastSearchedAt: this.dateToIso(row.last_searched_at),
      createdAt: this.dateToIso(row.created_at),
      updatedAt: this.dateToIso(row.updated_at),
    };
  }

  private mapPreferences(row: DbRow): UserPreferences {
    return {
      id: Number(row.id),
      userId: Number(row.user_id),
      bookshelfTheme: this.parseJson(row.bookshelf_theme),
      tabbarTheme: this.parseJson(row.tabbar_theme),
      readerTheme: this.parseJson(row.reader_theme),
      createdAt: this.dateToIso(row.created_at),
      updatedAt: this.dateToIso(row.updated_at),
    };
  }

  private parseJson(value: unknown): Record<string, unknown> {
    if (typeof value === 'object' && value !== null) {
      return value as Record<string, unknown>;
    }
    if (typeof value !== 'string') {
      return {};
    }
    return JSON.parse(value) as Record<string, unknown>;
  }

  private optionalString(value: unknown): string | undefined {
    return value == null ? undefined : String(value);
  }

  private dateToIso(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return new Date(String(value)).toISOString();
  }
}
