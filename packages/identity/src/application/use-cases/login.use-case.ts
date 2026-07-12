import { Inject, Injectable } from '@nestjs/common';
import { SecurityEventType } from '../../domain/value-objects/security-event-type';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../domain/ports/identity.repository';
import {
  AUDIT_ADAPTER,
  AuditAdapter,
  LoginAuditMetadata,
} from '../../domain/ports/audit.adapter';
import {
  EMAIL_ADAPTER,
  EmailAdapter,
} from '../../domain/ports/email.adapter';
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from '../../domain/ports/event-publisher.port';
import { IdentityLoggedInEvent } from '../../domain/events/identity-logged-in.event';
import { IDENTITY_MODULE_OPTIONS } from '../../config/identity-module.options';
import type { IdentityModuleOptions } from '../../config/identity-module.options';
import {
  DEFAULT_LOCKOUT_DURATION_MINUTES,
  DEFAULT_MAX_LOGIN_ATTEMPTS,
} from '../../constants';
import {
  AccountLockedException,
  EmailNotVerifiedException,
  InvalidCredentialsException,
} from '../../utils/exceptions';
import { normalizeEmail } from '../../utils';
import { PasswordService } from '../services/password.service';
import { SessionService } from '../services/session.service';

export interface LoginInput {
  email: string;
  password: string;
  metadata?: LoginAuditMetadata;
}

interface LoginAttemptRecord {
  count: number;
  lockedUntil?: Date;
}

@Injectable()
export class LoginUseCase {
  private readonly loginAttempts = new Map<string, LoginAttemptRecord>();

  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(AUDIT_ADAPTER)
    private readonly auditAdapter: AuditAdapter,
    @Inject(EMAIL_ADAPTER)
    private readonly emailAdapter: EmailAdapter,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
    @Inject(IDENTITY_MODULE_OPTIONS)
    private readonly options: IdentityModuleOptions,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
  ) {}

  async execute(input: LoginInput) {
    const email = normalizeEmail(input.email);
    this.checkLockout(email);

    const credentials = await this.identityRepository.findPasswordHashByEmail(email);

    if (!credentials) {
      await this.recordFailedAttempt(email, 'Identity not found', input.metadata);
      throw new InvalidCredentialsException();
    }

    const identity = await this.identityRepository.findById(credentials.identityId);

    if (!identity || !identity.canAuthenticate()) {
      await this.recordFailedAttempt(email, 'Account not active', input.metadata);
      throw new InvalidCredentialsException();
    }

    const isValid = await this.passwordService.verify(credentials.passwordHash, input.password);

    if (!isValid) {
      await this.recordFailedAttempt(email, 'Invalid password', input.metadata);
      throw new InvalidCredentialsException();
    }

    if (!identity.emailVerified) {
      throw new EmailNotVerifiedException();
    }

    this.loginAttempts.delete(email);

    const session = await this.sessionService.createSession(
      identity.id,
      identity.primaryEmail,
      input.metadata,
    );

    await this.auditAdapter.recordLogin(identity.id, input.metadata);
    await this.eventPublisher.publish(
      new IdentityLoggedInEvent(identity.id, session.session.id, input.metadata?.ipAddress),
    );

    if (this.options.sendLoginNotification) {
      await this.emailAdapter.sendLoginNotification(identity.primaryEmail, {
        ipAddress: input.metadata?.ipAddress,
        device: input.metadata?.deviceName ?? input.metadata?.device,
        browser: input.metadata?.browser,
        operatingSystem: input.metadata?.operatingSystem,
        timestamp: new Date(),
      });
    }

    return {
      identity,
      ...session,
    };
  }

  private checkLockout(email: string): void {
    const record = this.loginAttempts.get(email);
    if (record?.lockedUntil && record.lockedUntil > new Date()) {
      throw new AccountLockedException();
    }
  }

  private async recordFailedAttempt(
    email: string,
    reason: string,
    metadata?: LoginAuditMetadata,
  ): Promise<void> {
    const maxAttempts = this.options.rateLimit?.maxLoginAttempts ?? DEFAULT_MAX_LOGIN_ATTEMPTS;
    const lockoutMinutes =
      this.options.rateLimit?.lockoutDurationMinutes ?? DEFAULT_LOCKOUT_DURATION_MINUTES;

    const record = this.loginAttempts.get(email) ?? { count: 0 };
    record.count += 1;

    if (record.count >= maxAttempts) {
      record.lockedUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
      record.count = 0;
    }

    this.loginAttempts.set(email, record);
    await this.auditAdapter.recordFailedLogin(email, reason, metadata);
    await this.auditAdapter.recordSecurityEvent(null, SecurityEventType.LOGIN_FAILED, {
      email,
      reason,
      ...metadata,
    });
  }
}
