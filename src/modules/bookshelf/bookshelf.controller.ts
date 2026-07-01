import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../store/models';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { BookshelfService } from './bookshelf.service';
import { AddBookshelfDto, ManualBookDto, UpdateBookshelfDto } from './dto';

@UseGuards(AuthGuard)
@Controller('bookshelf')
export class BookshelfController {
  constructor(private readonly bookshelfService: BookshelfService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.bookshelfService.list(user.id);
  }

  @Post()
  add(@CurrentUser() user: User, @Body() dto: AddBookshelfDto) {
    return this.bookshelfService.add(user.id, dto);
  }

  @Post('manual')
  addManual(@CurrentUser() user: User, @Body() dto: ManualBookDto) {
    return this.bookshelfService.addManual(user.id, dto);
  }

  @Patch(':id')
  update(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookshelfDto) {
    return this.bookshelfService.update(user.id, id, dto);
  }

  @Post(':id/cover')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  setCover(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: { buffer: Buffer; mimetype: string; originalname: string; size: number },
  ) {
    return this.bookshelfService.setCover(user.id, id, file);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.bookshelfService.remove(user.id, id);
  }
}
