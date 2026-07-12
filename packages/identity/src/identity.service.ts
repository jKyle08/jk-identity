import { Inject, Injectable } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from './domain/ports/identity.repository';
import { EVENT_BUS, EventBus } from './domain/ports/event-bus.port';
import { DomainEvent } from './domain/events/domain-event';
import { IdentityNotFoundException } from './shared/exceptions';
import { toIdentityResponse } from './presentation/interceptors/auth-response.mapper';
import { InMemoryEventBus } from './infrastructure/events/in-memory-event-bus';

@Injectable()
export class IdentityService {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
  ) {}

  async findById(id: string) {
    const identity = await this.identityRepository.findById(id);
    if (!identity) {
      throw new IdentityNotFoundException();
    }
    return toIdentityResponse(identity);
  }

  async findByEmail(email: string) {
    const identity = await this.identityRepository.findByEmail(email);
    if (!identity) {
      throw new IdentityNotFoundException();
    }
    return toIdentityResponse(identity);
  }

  onDomainEvent(eventName: string, handler: (event: DomainEvent) => void): void {
    if (this.eventBus instanceof InMemoryEventBus) {
      this.eventBus.subscribe(eventName, handler);
    }
  }
}
