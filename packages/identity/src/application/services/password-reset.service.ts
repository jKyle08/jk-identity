import { Inject, Injectable } from '@nestjs/common';
import {
  EMAIL_ADAPTER,
  EmailAdapter,
} from '../../domain/ports/email.adapter';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../domain/ports/identity.repository';
import {
  SESSION_REPOSITORY,
  SessionRepository,
} from '../../domain/ports/session.repository';
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from '../../domain/ports/event-publisher.port';
import { PasswordResetEvent } from '../../domain/events/password-reset.event';
import { IDENTITY_MODULE_OPTIONS } from '../../config/identity-module.options';
import type { IdentityModuleOptions } from '../../config/identity-module.options';
import {
  DEFAULT_PASSWORD_RESET_TOKEN_EXPIRATION_HOURS,
} from '../../constants';
import { addHours, generateSecureToken, normalizeEmail } from '../../utils';
import { InvalidTokenException } from '../../utils/exceptions';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Injectable()
export class PasswordResetService {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @Inject(EMAIL_ADAPTER)
    private readonly emailAdapter: EmailAdapter,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
    @Inject(IDENTITY_MODULE_OPTIONS)
    private readonly options: IdentityModuleOptions,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async requestPasswordReset(email: string): Promise<void> {
    const normalizedEmail = normalizeEmail(email);
    const identity = await this.identityRepository.findByEmail(normalizedEmail);

    // Always succeed silently to prevent email enumeration
    if (!identity) {
      return;
    }

    const token = generateSecureToken();
    const tokenHash = await this.tokenService.hashToken(token);
    const expirationHours =
      this.options.passwordResetTokenExpirationHours ??
      DEFAULT_PASSWORD_RESET_TOKEN_EXPIRATION_HOURS;

    await this.sessionRepository.createPasswordResetToken(
      identity.id,
      identity.primaryEmail,
      tokenHash,
      addHours(new Date(), expirationHours),
    );

    await this.emailAdapter.sendPasswordResetEmail(
      identity.primaryEmail,
      token,
      identity.displayName ?? identity.fullName,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = await this.tokenService.hashToken(token);
    const resetToken = await this.sessionRepository.findPasswordResetTokenByHash(tokenHash);

    if (!resetToken || !resetToken.isValid()) {
      throw new InvalidTokenException('Invalid or expired password reset token');
    }

    const passwordHash = await this.passwordService.hash(newPassword);
    await this.identityRepository.updatePasswordHash(resetToken.identityId, passwordHash);
    await this.sessionRepository.markPasswordResetTokenUsed(resetToken.id);
    await this.sessionRepository.revokeAllSessions(resetToken.identityId);
    await this.eventPublisher.publish(new PasswordResetEvent(resetToken.identityId));
  }
}
