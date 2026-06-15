import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { SearchNovelsDto } from './dto';
import { NovelsService } from './novels.service';

@UseGuards(AuthGuard)
@Controller()
export class NovelsController {
  constructor(private readonly novelsService: NovelsService) {}

  @Get('novels/search')
  search(@Query() dto: SearchNovelsDto) {
    return this.novelsService.search(dto);
  }

  @Get('novels/:id')
  findNovel(@Param('id', ParseIntPipe) id: number) {
    return this.novelsService.findNovel(id);
  }

  @Get('novels/:id/chapters')
  listChapters(@Param('id', ParseIntPipe) id: number) {
    return this.novelsService.listChapters(id);
  }

  @Get('novels/:novelId/chapter/:num')
  getChapterByOrder(
    @Param('novelId', ParseIntPipe) novelId: number,
    @Param('num', ParseIntPipe) num: number,
  ) {
    return this.novelsService.getChapterByOrder(novelId, num);
  }

  @Get('chapters/:id')
  findChapter(@Param('id', ParseIntPipe) id: number) {
    return this.novelsService.findChapter(id);
  }
}
