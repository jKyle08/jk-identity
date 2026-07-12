import { DomainEvent } from './domain-event';

export class PasswordResetEvent extends DomainEvent {
  readonly eventName = 'identity.password_reset';

  constructor(readonly identityId: string) {
    super();
  }
}
