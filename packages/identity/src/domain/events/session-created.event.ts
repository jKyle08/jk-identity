import { DomainEvent } from './domain-event';

export class SessionCreatedEvent extends DomainEvent {
  readonly eventName = 'identity.session_created';

  constructor(
    readonly identityId: string,
    readonly sessionId: string,
  ) {
    super();
  }
}
