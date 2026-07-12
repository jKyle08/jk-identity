import { validateIdentityModuleOptions } from '../../../src/config/validate-identity-module.options';
import { createMemoryAdapters } from '@apxon-jk/identity-memory';

describe('validateIdentityModuleOptions', () => {
  it('throws when options object is missing', () => {
    expect(() => validateIdentityModuleOptions(undefined as never)).toThrow(
      '@apxon-jk/identity: IdentityModule.register() requires an options object',
    );
  });

  it('throws with helpful message when adapters are missing', () => {
    expect(() =>
      validateIdentityModuleOptions({
        adapters: {} as never,
        auth: {
          jwtSecret: 'secret',
          jwtRefreshSecret: 'refresh',
          accessTokenExpiration: '15m',
          refreshTokenExpiration: '30d',
        },
      }),
    ).toThrow(/adapters\.identityRepository/);
  });

  it('throws when auth secrets are empty', () => {
    const adapters = createMemoryAdapters();
    expect(() =>
      validateIdentityModuleOptions({
        adapters,
        auth: {
          jwtSecret: '',
          jwtRefreshSecret: 'refresh',
          accessTokenExpiration: '15m',
          refreshTokenExpiration: '30d',
        },
      }),
    ).toThrow(/auth\.jwtSecret/);
  });

  it('passes with valid options', () => {
    const adapters = createMemoryAdapters();
    expect(() =>
      validateIdentityModuleOptions({
        adapters,
        auth: {
          jwtSecret: 'secret',
          jwtRefreshSecret: 'refresh',
          accessTokenExpiration: '15m',
          refreshTokenExpiration: '30d',
        },
      }),
    ).not.toThrow();
  });
});
