import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStore } from '../../store/in-memory.store';

@Injectable()
export class SearchHistoryService {
  constructor(private readonly store: InMemoryStore) {}

  list(userId: number) {
    return this.store.listSearchHistory(userId);
  }

  async remove(userId: number, id: number) {
    const deleted = await this.store.deleteSearchHistoryItem(userId, id);
    if (!deleted) {
      throw new NotFoundException('Search history not found');
    }
    return { success: true };
  }

  async clear(userId: number) {
    await this.store.clearSearchHistory(userId);
    return { success: true };
  }
}
