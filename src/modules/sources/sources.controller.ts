import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('sources')
export class SourcesController {
  @Get()
  listSources() {
    return [
      {
        code: 'quanben',
        name: 'quanben.io',
        baseUrl: 'https://www.quanben.io/',
        enabled: true,
      },
    ];
  }
}
