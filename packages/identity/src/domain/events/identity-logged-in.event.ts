import { DomainEvent } from './domain-event';

export class IdentityLoggedInEvent extends DomainEvent {
  readonly eventName = 'identity.logged_in';

  constructor(
    readonly identityId: string,
    readonly sessionId: string,
    readonly ipAddress?: string,
  ) {
    super();
  }
}
