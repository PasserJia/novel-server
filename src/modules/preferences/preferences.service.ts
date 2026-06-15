import { Injectable } from '@nestjs/common';
import { InMemoryStore } from '../../store/in-memory.store';
import { SavePreferencesDto } from './dto';

@Injectable()
export class PreferencesService {
  constructor(private readonly store: InMemoryStore) {}

  async get(userId: number) {
    return this.store.getPreferences(userId);
  }

  async save(userId: number, dto: SavePreferencesDto) {
    return this.store.savePreferences(userId, dto);
  }
}
