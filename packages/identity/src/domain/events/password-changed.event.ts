import { DomainEvent } from './domain-event';

export class PasswordChangedEvent extends DomainEvent {
  readonly eventName = 'identity.password_changed';

  constructor(readonly identityId: string) {
    super();
  }
}
