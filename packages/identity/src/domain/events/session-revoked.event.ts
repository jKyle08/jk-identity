import { DomainEvent } from './domain-event';

export class SessionRevokedEvent extends DomainEvent {
  readonly eventName = 'identity.session_revoked';

  constructor(
    readonly identityId: string,
    readonly sessionId: string,
    readonly allSessions?: boolean,
  ) {
    super();
  }
}
