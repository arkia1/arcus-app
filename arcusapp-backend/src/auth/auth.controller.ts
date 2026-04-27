import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AUTH_COOKIE_NAME } from './auth.constants';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import type { AuthenticatedUser } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(
    @Body() payload: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signup(payload);
    response.cookie(
      AUTH_COOKIE_NAME,
      result.token,
      this.authService.getCookieOptions(),
    );

    return {
      user: result.user,
    };
  }

  @Public()
  @Post('login')
  async login(
    @Body() payload: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(payload);
    response.cookie(
      AUTH_COOKIE_NAME,
      result.token,
      this.authService.getCookieOptions(),
    );

    return {
      user: result.user,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(AUTH_COOKIE_NAME, this.authService.getCookieOptions());

    return {
      success: true,
    };
  }

  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    return {
      user: await this.authService.getUserById(user.id),
    };
  }
}
