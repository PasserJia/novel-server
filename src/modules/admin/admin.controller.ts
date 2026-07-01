import { Controller, Delete, Get, Param, Patch, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';

@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Patch('users/:id/enable')
  enable(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.setStatus(id, 'enabled');
  }

  @Patch('users/:id/disable')
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.setStatus(id, 'disabled');
  }

  @Patch('users/:id/reset-password')
  resetPassword(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.resetPassword(id);
  }

  @Delete('users/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('sources')
  listSources() {
    return this.adminService.listSources();
  }

  @Patch('sources/:code/enable')
  enableSource(@Param('code') code: string) {
    return this.adminService.setSourceEnabled(code, true);
  }

  @Patch('sources/:code/disable')
  disableSource(@Param('code') code: string) {
    return this.adminService.setSourceEnabled(code, false);
  }
}
