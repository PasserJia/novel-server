import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { User } from '../../store/models';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SearchHistoryService } from './search-history.service';

@UseGuards(AuthGuard)
@Controller('search-history')
export class SearchHistoryController {
  constructor(private readonly searchHistoryService: SearchHistoryService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.searchHistoryService.list(user.id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.searchHistoryService.remove(user.id, id);
  }

  @Delete()
  clear(@CurrentUser() user: User) {
    return this.searchHistoryService.clear(user.id);
  }
}
