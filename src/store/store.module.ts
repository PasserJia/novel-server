import { Global, Module } from '@nestjs/common';
import { InMemoryStore } from './in-memory.store';
import { MysqlStore } from './mysql.store';

@Global()
@Module({
  providers: [
    {
      provide: InMemoryStore,
      useClass: process.env.STORE_DRIVER === 'mysql' ? MysqlStore : InMemoryStore,
    },
  ],
  exports: [InMemoryStore],
})
export class StoreModule {}
