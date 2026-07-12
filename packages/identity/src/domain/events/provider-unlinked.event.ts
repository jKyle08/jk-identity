import { DomainEvent } from './domain-event';
import { ProviderType } from '../value-objects/provider-type';

export class ProviderUnlinkedEvent extends DomainEvent {
  readonly eventName = 'identity.provider_unlinked';

  constructor(
    readonly identityId: string,
    readonly provider: ProviderType,
  ) {
    super();
  }
}
