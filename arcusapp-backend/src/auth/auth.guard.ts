import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { AUTH_COOKIE_NAME, IS_PUBLIC_KEY } from './auth.constants';
import { AuthService } from './auth.service';
import type { AuthenticatedUser } from './auth.types';

type AuthenticatedRequest = Request & {
  cookies?: Record<string, string | undefined>;
  authUser?: AuthenticatedUser;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication is required');
    }

    request.authUser = await this.authService.verifyAccessToken(token);
    return true;
  }

  private extractToken(request: AuthenticatedRequest) {
    const authorization = request.headers.authorization;

    if (
      typeof authorization === 'string' &&
      authorization.startsWith('Bearer ')
    ) {
      return authorization.slice(7);
    }

    const cookies = request.cookies as Record<string, unknown> | undefined;
    const cookieValue = cookies?.[AUTH_COOKIE_NAME];
    return typeof cookieValue === 'string' ? cookieValue : null;
  }
}
