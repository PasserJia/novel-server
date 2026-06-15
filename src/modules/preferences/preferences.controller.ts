import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User } from '../../store/models';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SavePreferencesDto } from './dto';
import { PreferencesService } from './preferences.service';

@UseGuards(AuthGuard)
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  get(@CurrentUser() user: User) {
    return this.preferencesService.get(user.id);
  }

  @Put()
  save(@CurrentUser() user: User, @Body() dto: SavePreferencesDto) {
    return this.preferencesService.save(user.id, dto);
  }
}
