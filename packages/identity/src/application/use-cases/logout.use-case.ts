import { Inject, Injectable } from '@nestjs/common';
import {
  AUDIT_ADAPTER,
  AuditAdapter,
} from '../../domain/ports/audit.adapter';
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from '../../domain/ports/event-publisher.port';
import { IdentityLoggedOutEvent } from '../../domain/events/identity-logged-out.event';
import { SessionService } from '../services/session.service';

export interface LogoutInput {
  identityId: string;
  sessionId?: string;
  allSessions?: boolean;
}

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(AUDIT_ADAPTER)
    private readonly auditAdapter: AuditAdapter,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
    private readonly sessionService: SessionService,
  ) {}

  async execute(input: LogoutInput): Promise<void> {
    if (input.allSessions) {
      await this.sessionService.revokeAllSessions(input.identityId);
    } else if (input.sessionId) {
      await this.sessionService.revokeSession(input.identityId, input.sessionId);
    }

    await this.auditAdapter.recordLogout(input.identityId, input.sessionId);
    await this.eventPublisher.publish(
      new IdentityLoggedOutEvent(input.identityId, input.sessionId, input.allSessions),
    );
  }
}
