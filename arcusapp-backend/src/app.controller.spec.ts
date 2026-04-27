import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getStatus: jest.fn().mockReturnValue({
              message: 'Arcus backend is running',
              supabase: {
                configured: false,
                databaseUrlConfigured: false,
                driver: 'drizzle-postgres-js',
                connectionMode: 'direct-or-session',
                preparedStatementsEnabled: true,
                connectionVerified: false,
                lastConnectionCheckAt: null,
                lastConnectionError: null,
              },
            }),
            getSupabaseStatus: jest.fn().mockReturnValue({
              configured: false,
              databaseUrlConfigured: false,
              driver: 'drizzle-postgres-js',
              connectionMode: 'direct-or-session',
              preparedStatementsEnabled: true,
              connectionVerified: false,
              lastConnectionCheckAt: null,
              lastConnectionError: null,
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return backend status', () => {
      expect(appController.getStatus()).toEqual({
        message: 'Arcus backend is running',
        supabase: {
          configured: false,
          databaseUrlConfigured: false,
          driver: 'drizzle-postgres-js',
          connectionMode: 'direct-or-session',
          preparedStatementsEnabled: true,
          connectionVerified: false,
          lastConnectionCheckAt: null,
          lastConnectionError: null,
        },
      });
    });

    it('should return supabase status', () => {
      expect(appController.getSupabaseStatus()).toEqual({
        configured: false,
        databaseUrlConfigured: false,
        driver: 'drizzle-postgres-js',
        connectionMode: 'direct-or-session',
        preparedStatementsEnabled: true,
        connectionVerified: false,
        lastConnectionCheckAt: null,
        lastConnectionError: null,
      });
    });
  });
});
