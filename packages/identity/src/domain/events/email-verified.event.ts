import { DomainEvent } from './domain-event';

export class EmailVerifiedEvent extends DomainEvent {
  readonly eventName = 'identity.email_verified';

  constructor(
    readonly identityId: string,
    readonly email: string,
  ) {
    super();
  }
}
