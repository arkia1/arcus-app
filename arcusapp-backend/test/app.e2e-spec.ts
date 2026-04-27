import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/main';

type StatusResponse = {
  message: string;
  supabase: {
    driver: string;
    lastConnectionError: string | null;
  };
};

type SupabaseStatusResponse = {
  driver: string;
  lastConnectionError: string | null;
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((response) => {
        const body = response.body as StatusResponse;

        expect(body.message).toBe('Arcus backend is running');
        expect(body.supabase).toEqual(
          expect.objectContaining({
            driver: 'drizzle-postgres-js',
            lastConnectionError: null,
          }),
        );
      });
  });

  it('/supabase/status (GET)', () => {
    return request(app.getHttpServer())
      .get('/supabase/status')
      .expect(200)
      .expect((response) => {
        const body = response.body as SupabaseStatusResponse;

        expect(body).toEqual(
          expect.objectContaining({
            driver: 'drizzle-postgres-js',
            lastConnectionError: null,
          }),
        );
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
