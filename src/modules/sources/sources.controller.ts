import { Controller, Get, UseGuards } from '@nestjs/common';
import { InMemoryStore } from '../../store/in-memory.store';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('sources')
export class SourcesController {
  constructor(private readonly store: InMemoryStore) {}

  @Get()
  listSources() {
    return this.store.listNovelSources();
  }
}
