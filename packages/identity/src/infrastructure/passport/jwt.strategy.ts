import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IDENTITY_MODULE_OPTIONS } from '../../config/identity-module.options';
import type { IdentityModuleOptions } from '../../config/identity-module.options';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../domain/ports/identity.repository';
import {
  SESSION_REPOSITORY,
  SessionRepository,
} from '../../domain/ports/session.repository';
import { TokenPayload } from '../../domain/ports/token-service.port';

export interface AuthenticatedRequestUser {
  identityId: string;
  sessionId: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(IDENTITY_MODULE_OPTIONS)
    options: IdentityModuleOptions,
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: options.auth.jwtSecret,
    });
  }

  async validate(payload: TokenPayload): Promise<AuthenticatedRequestUser> {
    const identity = await this.identityRepository.findById(payload.sub);

    if (!identity || !identity.canAuthenticate()) {
      throw new UnauthorizedException('Invalid token');
    }

    const session = await this.sessionRepository.findSessionById(payload.sessionId);
    if (!session || !session.isActive()) {
      throw new UnauthorizedException('Session expired or revoked');
    }

    return {
      identityId: payload.sub,
      sessionId: payload.sessionId,
      email: payload.email,
    };
  }
}
