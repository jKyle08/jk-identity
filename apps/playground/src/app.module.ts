import { Module } from '@nestjs/common';
import { IdentityModule } from '@jk/identity';
import { createMemoryAdapters } from '@jk/identity-memory';

const adapters = createMemoryAdapters();

@Module({
  imports: [
    IdentityModule.register({
      adapters,
      auth: {
        jwtSecret: process.env.JWT_SECRET ?? 'playground-jwt-secret-change-in-production',
        jwtRefreshSecret:
          process.env.JWT_REFRESH_SECRET ?? 'playground-refresh-secret-change-in-production',
        accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION ?? '15m',
        refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION ?? '30d',
      },
      oauth: process.env.GOOGLE_CLIENT_ID
        ? {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
              callbackUrl:
                process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3000/auth/google/callback',
            },
          }
        : undefined,
      sendLoginNotification: process.env.SEND_LOGIN_NOTIFICATION === 'true',
      rateLimit: {
        maxLoginAttempts: Number(process.env.MAX_LOGIN_ATTEMPTS ?? 5),
        lockoutDurationMinutes: Number(process.env.LOCKOUT_DURATION_MINUTES ?? 15),
      },
    }),
  ],
})
export class AppModule {}
