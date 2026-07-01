export type UserRole = 'user' | 'admin';
export type UserStatus = 'enabled' | 'disabled';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  nickname?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface PublicUser {
  id: number;
  username: string;
  nickname?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AdminUser extends PublicUser {
  isOnline: boolean;
  lastOnlineAt?: string;
}

export interface Session {
  token: string;
  userId: number;
  createdAt: string;
  lastSeenAt: string;
  onlineSinceAt: string;
}

export interface Novel {
  id: number;
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  sourceCode: string;
  sourceNovelId: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: number;
  novelId: number;
  title: string;
  chapterOrder: number;
  sourceChapterId?: string;
  sourceUrl?: string;
  content?: string;
  contentCachedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookshelfItem {
  id: number;
  userId: number;
  novelId: number;
  customTitle?: string;
  customCoverUrl?: string;
  sortOrder: number;
  status: 'active' | 'deleted';
  addedAt: string;
  updatedAt: string;
}

export interface ReadingProgress {
  id: number;
  userId: number;
  novelId: number;
  chapterId?: number;
  chapterOrder?: number;
  scrollPosition?: number;
  paragraphIndex?: number;
  progressPercent: number;
  updatedAt: string;
}

export interface UserPreferences {
  id: number;
  userId: number;
  bookshelfTheme: Record<string, unknown>;
  tabbarTheme: Record<string, unknown>;
  readerTheme: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedFile {
  id: number;
  userId: number;
  fileType: 'cover' | 'background' | 'avatar' | 'poster';
  storageKey: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}
