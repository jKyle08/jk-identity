import { DomainEvent } from './domain-event';

export class IdentityCreatedEvent extends DomainEvent {
  readonly eventName = 'identity.created';

  constructor(
    readonly identityId: string,
    readonly email: string,
  ) {
    super();
  }
}
