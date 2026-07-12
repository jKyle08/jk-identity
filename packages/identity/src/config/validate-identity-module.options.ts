import type { IdentityModuleOptions } from './identity-module.options';

const REQUIRED_ADAPTER_KEYS = [
  'identityRepository',
  'sessionRepository',
  'emailAdapter',
  'auditAdapter',
] as const;

const REQUIRED_AUTH_KEYS = [
  'jwtSecret',
  'jwtRefreshSecret',
  'accessTokenExpiration',
  'refreshTokenExpiration',
] as const;

/**
 * Validates {@link IdentityModuleOptions} before module registration.
 * Throws a descriptive error when required adapters or auth config are missing.
 */
export function validateIdentityModuleOptions(options: IdentityModuleOptions): void {
  const errors: string[] = [];

  if (!options) {
    throw new Error(
      '@jk/identity: IdentityModule.register() requires an options object. ' +
        'See https://github.com/jKyle08/jk-identity#documentation for setup.',
    );
  }

  if (!options.adapters) {
    errors.push(
      'adapters — provide identityRepository, sessionRepository, emailAdapter, and auditAdapter. ' +
        'Use createMemoryAdapters() from @jk/identity-memory for local development.',
    );
  } else {
    for (const key of REQUIRED_ADAPTER_KEYS) {
      if (!options.adapters[key]) {
        errors.push(
          `adapters.${key} — required adapter is missing. ` +
            `Implement the ${key} port or use a reference adapter from @jk/identity-memory.`,
        );
      }
    }
  }

  if (!options.auth) {
    errors.push('auth — provide jwtSecret, jwtRefreshSecret, accessTokenExpiration, and refreshTokenExpiration.');
  } else {
    for (const key of REQUIRED_AUTH_KEYS) {
      const value = options.auth[key];
      if (value === undefined || value === null || value === '') {
        errors.push(`auth.${key} — required auth configuration is missing or empty.`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `@jk/identity configuration error:\n` +
        errors.map((e) => `  • ${e}`).join('\n') +
        '\n\nExample:\n' +
        '  IdentityModule.register({\n' +
        '    adapters: createMemoryAdapters(),\n' +
        '    auth: {\n' +
        '      jwtSecret: process.env.JWT_SECRET,\n' +
        '      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,\n' +
        '      accessTokenExpiration: "15m",\n' +
        '      refreshTokenExpiration: "30d",\n' +
        '    },\n' +
        '  })',
    );
  }
}
