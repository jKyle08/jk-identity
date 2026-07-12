import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { IDENTITY_MODULE_OPTIONS } from '../../config/identity-module.options';
import type { IdentityModuleOptions } from '../../config/identity-module.options';
import {
  TokenPayload,
  TokenServicePort,
} from '../../domain/ports/token-service.port';
import { generateSecureToken } from '../../utils';

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(IDENTITY_MODULE_OPTIONS)
    private readonly options: IdentityModuleOptions,
  ) {}

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      { ...payload },
      {
        secret: this.options.auth.jwtSecret,
        expiresIn: this.options.auth.accessTokenExpiration as `${number}${'s' | 'm' | 'h' | 'd'}`,
      },
    );
  }

  async generateRefreshToken(): Promise<string> {
    return generateSecureToken(48);
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: this.options.auth.jwtSecret,
    });
  }

  async hashToken(token: string): Promise<string> {
    return createHash('sha256').update(token).digest('hex');
  }

  async verifyTokenHash(token: string, hash: string): Promise<boolean> {
    const tokenHash = await this.hashToken(token);
    return tokenHash === hash;
  }
}
