import { DomainEvent } from './domain-event';
import { ProviderType } from '../value-objects/provider-type';

export class ProviderLinkedEvent extends DomainEvent {
  readonly eventName = 'identity.provider_linked';

  constructor(
    readonly identityId: string,
    readonly provider: ProviderType,
  ) {
    super();
  }
}
