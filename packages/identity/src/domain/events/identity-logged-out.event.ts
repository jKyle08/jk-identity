import { DomainEvent } from './domain-event';

export class IdentityLoggedOutEvent extends DomainEvent {
  readonly eventName = 'identity.logged_out';

  constructor(
    readonly identityId: string,
    readonly sessionId?: string,
    readonly allSessions?: boolean,
  ) {
    super();
  }
}
