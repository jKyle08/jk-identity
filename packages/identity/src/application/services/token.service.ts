import { Inject, Injectable } from '@nestjs/common';
import { IDENTITY_MODULE_OPTIONS } from '../../config/identity-module.options';
import type { IdentityModuleOptions } from '../../config/identity-module.options';
import {
  TOKEN_SERVICE,
  TokenPayload,
  TokenServicePort,
} from '../../domain/ports/token-service.port';
import { addDuration } from '../../utils';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

@Injectable()
export class TokenService {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort,
    @Inject(IDENTITY_MODULE_OPTIONS)
    private readonly options: IdentityModuleOptions,
  ) {}

  async generateRefreshToken(): Promise<string> {
    return this.tokenService.generateRefreshToken();
  }

  async generateTokens(
    identityId: string,
    sessionId: string,
    email: string,
  ): Promise<AuthTokens> {
    const payload: TokenPayload = {
      sub: identityId,
      sessionId,
      email,
    };

    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken();
    const now = new Date();

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt: addDuration(now, this.options.auth.accessTokenExpiration),
      refreshTokenExpiresAt: addDuration(now, this.options.auth.refreshTokenExpiration),
    };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.tokenService.verifyAccessToken(token);
  }

  async hashToken(token: string): Promise<string> {
    return this.tokenService.hashToken(token);
  }

  async verifyTokenHash(token: string, hash: string): Promise<boolean> {
    return this.tokenService.verifyTokenHash(token, hash);
  }
}
