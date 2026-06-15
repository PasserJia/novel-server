import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BookshelfController } from './bookshelf.controller';
import { BookshelfService } from './bookshelf.service';

@Module({
  imports: [AuthModule],
  controllers: [BookshelfController],
  providers: [BookshelfService],
})
export class BookshelfModule {}
