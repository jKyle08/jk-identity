import { Module } from '@nestjs/common';
import { IdentityModule } from '@apxon-jk/identity';
import { adapters } from './adapters';

@Module({
  imports: [
    IdentityModule.register({
      adapters,
      auth: {
        jwtSecret: process.env.JWT_SECRET ?? 'consumer-dev-jwt-secret-change-me',
        jwtRefreshSecret:
          process.env.JWT_REFRESH_SECRET ?? 'consumer-dev-refresh-secret-change-me',
        accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION ?? '15m',
        refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION ?? '30d',
      },
    }),
  ],
})
export class AppModule {}
