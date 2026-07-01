import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStore } from '../../store/in-memory.store';
import { UserStatus } from '../../store/models';

const INITIAL_PASSWORD = 'guest2026';

@Injectable()
export class AdminService {
  constructor(private readonly store: InMemoryStore) {}

  async listUsers() {
    return this.store.listUsers();
  }

  async setStatus(id: number, status: UserStatus) {
    const user = await this.store.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role === 'admin' && status === 'disabled') {
      throw new BadRequestException('Disabling admin accounts is not allowed in this scaffold');
    }

    user.status = status;
    await this.store.updateUser(user);
    if (status === 'disabled') {
      await this.store.deleteSessionsForUser(user.id);
    }
    return this.store.toPublicUser(user);
  }

  async resetPassword(id: number) {
    const user = await this.store.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role === 'admin') {
      throw new BadRequestException('Resetting admin passwords is not allowed in this scaffold');
    }

    user.passwordHash = this.store.hashPassword(INITIAL_PASSWORD);
    await this.store.updateUser(user);
    await this.store.deleteSessionsForUser(user.id);
    return { success: true, initialPassword: INITIAL_PASSWORD };
  }

  async deleteUser(id: number) {
    const user = await this.store.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role === 'admin') {
      throw new BadRequestException('Deleting admin accounts is not allowed in this scaffold');
    }

    await this.store.deleteSessionsForUser(user.id);
    const deleted = await this.store.deleteUser(user.id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
    return { success: true };
  }

  async listSources() {
    return this.store.listNovelSources();
  }

  async setSourceEnabled(code: string, enabled: boolean) {
    const current = await this.store.listNovelSources();
    const source = current.find((item) => item.code === code);
    if (!source) {
      throw new NotFoundException('Novel source not found');
    }
    if (!enabled && source.enabled && current.filter((item) => item.enabled).length <= 1) {
      throw new BadRequestException('至少需要保留一个启用的小说网站');
    }
    const updated = await this.store.updateNovelSourceEnabled(code, enabled);
    if (!updated) {
      throw new BadRequestException('至少需要保留一个启用的小说网站');
    }
    return updated;
  }
}
