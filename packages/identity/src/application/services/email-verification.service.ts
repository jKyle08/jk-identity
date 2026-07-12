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
import { EmailVerifiedEvent } from '../../domain/events/email-verified.event';
import { IDENTITY_MODULE_OPTIONS } from '../../config/identity-module.options';
import type { IdentityModuleOptions } from '../../config/identity-module.options';
import {
  DEFAULT_VERIFICATION_TOKEN_EXPIRATION_HOURS,
} from '../../constants';
import { addHours, generateSecureToken } from '../../utils';
import { InvalidTokenException, IdentityNotFoundException } from '../../utils/exceptions';
import { TokenService } from './token.service';

@Injectable()
export class EmailVerificationService {
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
    private readonly tokenService: TokenService,
  ) {}

  async sendVerificationEmail(identityId: string): Promise<void> {
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new IdentityNotFoundException();
    }

    if (identity.emailVerified) {
      return;
    }

    const token = generateSecureToken();
    const tokenHash = await this.tokenService.hashToken(token);
    const expirationHours =
      this.options.verificationTokenExpirationHours ??
      DEFAULT_VERIFICATION_TOKEN_EXPIRATION_HOURS;

    await this.sessionRepository.createVerificationToken(
      identity.id,
      identity.primaryEmail,
      tokenHash,
      addHours(new Date(), expirationHours),
    );

    await this.emailAdapter.sendVerificationEmail(
      identity.primaryEmail,
      token,
      identity.displayName ?? identity.fullName,
    );
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = await this.tokenService.hashToken(token);
    const verificationToken =
      await this.sessionRepository.findVerificationTokenByHash(tokenHash);

    if (!verificationToken || !verificationToken.isValid()) {
      throw new InvalidTokenException('Invalid or expired verification token');
    }

    await this.identityRepository.verifyEmail(verificationToken.identityId);
    await this.sessionRepository.markVerificationTokenUsed(verificationToken.id);
    await this.eventPublisher.publish(
      new EmailVerifiedEvent(verificationToken.identityId, verificationToken.email),
    );
  }
}
