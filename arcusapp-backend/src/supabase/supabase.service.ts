import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import * as schema from './schema';

@Injectable()
export class SupabaseService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly databaseUrl: string | undefined;
  private readonly client: Sql | null;
  private readonly db: PostgresJsDatabase<typeof schema> | null;
  private readonly preparedStatementsEnabled: boolean;
  private readonly connectionMode: 'direct-or-session' | 'transaction-pooler';
  private connectionVerified = false;
  private lastConnectionCheckAt: string | null = null;
  private lastConnectionError: string | null = null;

  constructor(private readonly configService: ConfigService) {
    this.databaseUrl = this.configService.get<string>('DATABASE_URL');
    this.connectionMode = this.isTransactionPooler(this.databaseUrl)
      ? 'transaction-pooler'
      : 'direct-or-session';
    this.preparedStatementsEnabled =
      this.connectionMode !== 'transaction-pooler';

    this.client = this.databaseUrl
      ? postgres(this.databaseUrl, {
          prepare: this.preparedStatementsEnabled,
        })
      : null;
    this.db = this.client ? drizzle(this.client, { schema }) : null;
  }

  async onModuleInit() {
    const status = this.getStatus();

    this.logger.log(
      `Supabase database status: configured=${status.configured}, databaseUrlConfigured=${status.databaseUrlConfigured}, connectionMode=${status.connectionMode}, preparedStatementsEnabled=${status.preparedStatementsEnabled}`,
    );

    if (!this.db) {
      this.logger.warn(
        'Supabase database is not initialized. Set DATABASE_URL to enable Drizzle.',
      );
      return;
    }

    await this.ensureAuthTables();
    await this.verifyConnection();
  }

  async onApplicationShutdown() {
    if (this.client) {
      await this.client.end();
    }
  }

  getDb(): PostgresJsDatabase<typeof schema> {
    if (!this.db) {
      throw new Error(
        'Supabase database is not initialized. Set DATABASE_URL.',
      );
    }

    return this.db;
  }

  private async verifyConnection() {
    try {
      await this.getDb().execute(sql`select 1 as result`);
      this.lastConnectionCheckAt = new Date().toISOString();
      this.connectionVerified = true;
      this.lastConnectionError = null;
      this.logger.log('Supabase Drizzle connection check succeeded.');
    } catch (error) {
      this.lastConnectionCheckAt = new Date().toISOString();
      this.connectionVerified = false;
      this.lastConnectionError =
        error instanceof Error ? error.message : 'Unknown connection error';
      this.logger.error(
        `Supabase Drizzle connection check failed: ${this.lastConnectionError}`,
      );
    }
  }

  private async ensureAuthTables() {
    try {
      await this.getDb().execute(sql`
        create extension if not exists pgcrypto;

        create table if not exists public.users (
          id uuid primary key default gen_random_uuid(),
          email varchar(255) not null unique,
          username varchar(80) not null,
          password_hash text not null,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        );

        create index if not exists users_email_idx on public.users (email);
      `);
      this.logger.log('Ensured auth tables exist.');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown schema bootstrap error';
      this.logger.error(`Failed to ensure auth tables exist: ${message}`);
    }
  }

  private isTransactionPooler(value: string | undefined) {
    if (!value) {
      return false;
    }

    try {
      return new URL(value).port === '6543';
    } catch {
      return false;
    }
  }

  getStatus() {
    return {
      configured: Boolean(this.db),
      databaseUrlConfigured: Boolean(this.databaseUrl),
      driver: 'drizzle-postgres-js',
      connectionMode: this.connectionMode,
      preparedStatementsEnabled: this.preparedStatementsEnabled,
      connectionVerified: this.connectionVerified,
      lastConnectionCheckAt: this.lastConnectionCheckAt,
      lastConnectionError: this.lastConnectionError,
    };
  }
}
