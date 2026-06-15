import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookshelfModule } from './modules/bookshelf/bookshelf.module';
import { NovelsModule } from './modules/novels/novels.module';
import { PreferencesModule } from './modules/preferences/preferences.module';
import { ReadingProgressModule } from './modules/reading-progress/reading-progress.module';
import { SourcesModule } from './modules/sources/sources.module';
import { WebModule } from './modules/web/web.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    StoreModule,
    AuthModule,
    AdminModule,
    BookshelfModule,
    SourcesModule,
    NovelsModule,
    ReadingProgressModule,
    PreferencesModule,
    WebModule,
  ],
})
export class AppModule {}
