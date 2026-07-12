import { Inject, Injectable } from '@nestjs/common';
import { IdentitySession } from '../../domain/entities/identity-session';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../domain/ports/identity.repository';
import {
  SESSION_REPOSITORY,
  SessionMetadata,
  SessionRepository,
} from '../../domain/ports/session.repository';
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from '../../domain/ports/event-publisher.port';
import { SessionCreatedEvent } from '../../domain/events/session-created.event';
import { SessionRevokedEvent } from '../../domain/events/session-revoked.event';
import { IDENTITY_MODULE_OPTIONS } from '../../config/identity-module.options';
import type { IdentityModuleOptions } from '../../config/identity-module.options';
import { addDuration } from '../../utils';
import { TokenService } from './token.service';

export interface CreateSessionResult {
  session: IdentitySession;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
    @Inject(IDENTITY_MODULE_OPTIONS)
    private readonly options: IdentityModuleOptions,
    private readonly tokenService: TokenService,
  ) {}

  async createSession(
    identityId: string,
    email: string,
    metadata?: SessionMetadata,
  ): Promise<CreateSessionResult> {
    const refreshTokenPlain = await this.tokenService.generateRefreshToken();
    const refreshTokenHash = await this.tokenService.hashToken(refreshTokenPlain);
    const now = new Date();

    const result = await this.sessionRepository.createSession({
      identityId,
      refreshTokenHash,
      refreshTokenExpiresAt: addDuration(now, this.options.auth.refreshTokenExpiration),
      sessionExpiresAt: addDuration(now, this.options.auth.refreshTokenExpiration),
      metadata,
    });

    const tokens = await this.tokenService.generateTokens(
      identityId,
      result.session.id,
      email,
    );

    await this.identityRepository.updateLastLogin(identityId);
    await this.eventPublisher.publish(
      new SessionCreatedEvent(identityId, result.session.id),
    );

    return {
      session: result.session,
      accessToken: tokens.accessToken,
      refreshToken: refreshTokenPlain,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
    };
  }

  async getSessions(identityId: string): Promise<IdentitySession[]> {
    return this.sessionRepository.findSessionsByIdentityId(identityId);
  }

  async revokeSession(identityId: string, sessionId: string): Promise<void> {
    await this.sessionRepository.revokeSession(sessionId);
    await this.eventPublisher.publish(new SessionRevokedEvent(identityId, sessionId));
  }

  async revokeAllSessions(identityId: string): Promise<void> {
    await this.sessionRepository.revokeAllSessions(identityId);
    await this.eventPublisher.publish(
      new SessionRevokedEvent(identityId, '', true),
    );
  }

  async refreshSession(refreshToken: string): Promise<CreateSessionResult> {
    const tokenHash = await this.tokenService.hashToken(refreshToken);
    const storedToken = await this.sessionRepository.findRefreshTokenByHash(tokenHash);

    if (!storedToken || !storedToken.isActive()) {
      throw new Error('Invalid refresh token');
    }

    const session = await this.sessionRepository.findSessionById(storedToken.sessionId);
    if (!session || !session.isActive()) {
      throw new Error('Session expired');
    }

    const identity = await this.identityRepository.findById(storedToken.identityId);
    if (!identity) {
      throw new Error('Identity not found');
    }

    const newRefreshTokenPlain = await this.tokenService.generateRefreshToken();
    const newRefreshTokenHash = await this.tokenService.hashToken(newRefreshTokenPlain);
    const now = new Date();

    const result = await this.sessionRepository.refreshSession(
      session.id,
      storedToken.id,
      newRefreshTokenHash,
      addDuration(now, this.options.auth.refreshTokenExpiration),
    );

    const tokens = await this.tokenService.generateTokens(
      identity.id,
      result.session.id,
      identity.primaryEmail,
    );

    return {
      session: result.session,
      accessToken: tokens.accessToken,
      refreshToken: newRefreshTokenPlain,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
    };
  }
}
