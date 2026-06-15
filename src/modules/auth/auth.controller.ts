import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '../../store/models';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginDto, RegisterDto, ResetPasswordDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Req() request: { token: string }) {
    return this.authService.logout(request.token);
  }

  @UseGuards(AuthGuard)
  @Post('heartbeat')
  heartbeat(@Req() request: { token: string }) {
    return this.authService.heartbeat(request.token);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@CurrentUser() user: User) {
    return user;
  }
}
