import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcryptjs';
import { users } from '../supabase/schema';
import { SupabaseService } from '../supabase/supabase.service';
import type { AuthenticatedUser, SafeUser } from './auth.types';
import type { LoginDto } from './dto/login.dto';
import type { SignupDto } from './dto/signup.dto';

type JwtPayload = {
  sub: string;
  email: string;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(payload: SignupDto) {
    const db = this.supabaseService.getDb();
    const email = payload.email.trim().toLowerCase();
    const username = payload.username.trim();

    const [existingUser] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      throw new BadRequestException('An account already exists for this email');
    }

    const passwordHash = await hash(payload.password, 12);

    const [createdUser] = await db
      .insert(users)
      .values({
        email,
        username,
        passwordHash,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return this.createAuthResponse(createdUser);
  }

  async login(payload: LoginDto) {
    const db = this.supabaseService.getDb();
    const email = payload.email.trim().toLowerCase();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await compare(payload.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createAuthResponse({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async getUserById(userId: string) {
    const db = this.supabaseService.getDb();

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async verifyAccessToken(token: string): Promise<AuthenticatedUser> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.getUserById(payload.sub);

      return {
        id: user.id,
        email: user.email,
        username: user.username,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }

  getCookieOptions() {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: isProduction,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    };
  }

  private async createAuthResponse(user: SafeUser) {
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      user,
      token,
    };
  }
}
