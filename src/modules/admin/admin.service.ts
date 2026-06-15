import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStore } from '../../store/in-memory.store';
import { UserStatus } from '../../store/models';

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
}
