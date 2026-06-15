import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InMemoryStore } from '../../store/in-memory.store';
import { PublicUser } from '../../store/models';
import { LoginDto, RegisterDto, ResetPasswordDto } from './dto';

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
}
