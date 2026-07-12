import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemoryAdapters, MemoryAdaptersBundle } from '@jk/identity-memory';
import { IdentityModule, IdentityModuleOptions } from '../../src';

export const TEST_AUTH_CONFIG = {
  jwtSecret: 'test-jwt-secret',
  jwtRefreshSecret: 'test-jwt-refresh-secret',
  accessTokenExpiration: '15m',
  refreshTokenExpiration: '30d',
} as const;

export const TEST_PASSWORD = 'SecureP@ss1';

export interface TestAppContext {
  app: INestApplication;
  adapters: MemoryAdaptersBundle;
  module: TestingModule;
}

export function createTestModuleOptions(
  adapters: MemoryAdaptersBundle,
  overrides: Partial<IdentityModuleOptions> = {},
): IdentityModuleOptions {
  return {
    adapters,
    auth: TEST_AUTH_CONFIG,
    verificationTokenExpirationHours: 24,
    passwordResetTokenExpirationHours: 1,
    ...overrides,
  };
}

export async function createTestApp(
  overrides: Partial<IdentityModuleOptions> = {},
): Promise<TestAppContext> {
  const adapters = createMemoryAdapters();
  const module = await Test.createTestingModule({
    imports: [IdentityModule.register(createTestModuleOptions(adapters, overrides))],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();

  return { app, adapters, module };
}
