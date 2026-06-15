import { Injectable } from '@nestjs/common';
import { InMemoryStore } from '../../store/in-memory.store';
import { SaveReadingProgressDto } from './dto';

@Injectable()
export class ReadingProgressService {
  constructor(private readonly store: InMemoryStore) {}

  async get(userId: number, novelId: number) {
    return (await this.store.getProgress(userId, novelId)) ?? null;
  }

  async save(userId: number, novelId: number, dto: SaveReadingProgressDto) {
    return this.store.upsertProgress(userId, novelId, dto);
  }
}
