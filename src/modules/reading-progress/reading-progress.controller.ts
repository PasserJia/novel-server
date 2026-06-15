import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { User } from '../../store/models';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SaveReadingProgressDto } from './dto';
import { ReadingProgressService } from './reading-progress.service';

@UseGuards(AuthGuard)
@Controller('reading-progress')
export class ReadingProgressController {
  constructor(private readonly readingProgressService: ReadingProgressService) {}

  @Get(':novelId')
  get(@CurrentUser() user: User, @Param('novelId', ParseIntPipe) novelId: number) {
    return this.readingProgressService.get(user.id, novelId);
  }

  @Put(':novelId')
  save(
    @CurrentUser() user: User,
    @Param('novelId', ParseIntPipe) novelId: number,
    @Body() dto: SaveReadingProgressDto,
  ) {
    return this.readingProgressService.save(user.id, novelId, dto);
  }
}
