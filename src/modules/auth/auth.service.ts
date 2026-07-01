import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { InMemoryStore } from '../../store/in-memory.store';
import { PublicUser, User } from '../../store/models';
import { LoginDto, RegisterDto, ResetPasswordDto } from './dto';

const AVATAR_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/heic': '.heic',
  'image/heif': '.heif',
  'image/avif': '.avif',
};

const MAX_AVATAR_SIZE = 10 * 1024 * 1024;

@Injectable()
export class AuthService {
  constructor(private readonly store: InMemoryStore) {}

  async register(dto: RegisterDto): Promise<{ token: string; user: PublicUser }> {
    if (await this.store.findUserByUsername(dto.username)) {
      throw new BadRequestException('Username already exists');
    }
    if ((dto.email || dto.phone) && (await this.store.findUserByContact(dto.email ?? dto.phone!))) {
      throw new BadRequestException('Contact already exists');
    }

    const user = await this.store.createUser(dto);
    const session = await this.store.createSession(user.id);
    return { token: session.token, user: this.store.toPublicUser(user) };
  }

  async login(dto: LoginDto): Promise<{ token: string; user: PublicUser }> {
    const user = await this.store.findUserByUsername(dto.username);
    if (!user || !this.store.verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid username or password');
    }
    if (user.status !== 'enabled') {
      throw new UnauthorizedException('Account is disabled');
    }

    user.lastLoginAt = new Date().toISOString();
    await this.store.updateUser(user);
    const session = await this.store.createSession(user.id);
    return { token: session.token, user: this.store.toPublicUser(user) };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ success: true }> {
    const user = await this.store.findUserByUsername(dto.username);
    if (!user || user.status !== 'enabled') {
      throw new BadRequestException('Account cannot reset password');
    }
    if (user.email !== dto.contact && user.phone !== dto.contact) {
      throw new BadRequestException('Username and contact do not match');
    }

    user.passwordHash = this.store.hashPassword(dto.newPassword);
    await this.store.updateUser(user);
    await this.store.deleteSessionsForUser(user.id);
    return { success: true };
  }

  async logout(token: string): Promise<{ success: true }> {
    await this.store.deleteSession(token);
    return { success: true };
  }

  async heartbeat(token: string): Promise<{ success: true }> {
    await this.store.touchSession(token);
    return { success: true };
  }

  async setAvatar(
    user: User,
    file: { buffer: Buffer; mimetype: string; originalname: string; size: number },
  ): Promise<PublicUser> {
    if (!file || !file.buffer) {
      throw new BadRequestException('未收到图片文件');
    }
    const ext = AVATAR_EXT[file.mimetype];
    if (!ext) {
      throw new BadRequestException('只支持 JPG / PNG / GIF / WEBP / HEIC / HEIF / AVIF 图片');
    }
    if (file.size > MAX_AVATAR_SIZE) {
      throw new BadRequestException('图片不能超过 10MB');
    }

    const uploadsDir = join(process.cwd(), 'uploads');
    mkdirSync(uploadsDir, { recursive: true });
    const name = `avatar-${user.id}-${Date.now()}-${randomBytes(4).toString('hex')}${ext}`;
    writeFileSync(join(uploadsDir, name), file.buffer);

    user.avatarUrl = `/uploads/${name}`;
    await this.store.updateUser(user);
    return this.store.toPublicUser(user);
  }
}
