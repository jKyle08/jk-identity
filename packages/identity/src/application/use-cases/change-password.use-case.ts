import { Inject, Injectable } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../domain/ports/identity.repository';
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from '../../domain/ports/event-publisher.port';
import { PasswordChangedEvent } from '../../domain/events/password-changed.event';
import { SecurityEventType } from '../../domain/value-objects/security-event-type';
import {
  AUDIT_ADAPTER,
  AuditAdapter,
} from '../../domain/ports/audit.adapter';
import { InvalidCredentialsException, IdentityNotFoundException } from '../../utils/exceptions';
import { PasswordService } from '../services/password.service';
import { SessionService } from '../services/session.service';

export interface ChangePasswordInput {
  identityId: string;
  currentPassword: string;
  newPassword: string;
}

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(AUDIT_ADAPTER)
    private readonly auditAdapter: AuditAdapter,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const identity = await this.identityRepository.findById(input.identityId);

    if (!identity) {
      throw new IdentityNotFoundException();
    }

    const credentials = await this.identityRepository.findPasswordHashByEmail(
      identity.primaryEmail,
    );

    if (!credentials) {
      throw new InvalidCredentialsException();
    }

    const isValid = await this.passwordService.verify(
      credentials.passwordHash,
      input.currentPassword,
    );

    if (!isValid) {
      throw new InvalidCredentialsException('Current password is incorrect');
    }

    const passwordHash = await this.passwordService.hash(input.newPassword);
    await this.identityRepository.updatePasswordHash(identity.id, passwordHash);
    await this.sessionService.revokeAllSessions(identity.id);
    await this.eventPublisher.publish(new PasswordChangedEvent(identity.id));
    await this.auditAdapter.recordSecurityEvent(
      identity.id,
      SecurityEventType.PASSWORD_CHANGED,
    );
  }
}
