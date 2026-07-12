import { Inject, Injectable } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from './domain/ports/identity.repository';
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from './domain/ports/event-publisher.port';
import { DomainEvent } from './domain/events/domain-event';
import { IdentityNotFoundException } from './utils/exceptions';
import { toIdentityResponse } from './presentation/interceptors/auth-response.mapper';
import { InMemoryEventPublisher } from './infrastructure/events/in-memory-event-publisher';

@Injectable()
export class IdentityService {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
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
    if (this.eventPublisher instanceof InMemoryEventPublisher) {
      this.eventPublisher.on(eventName, handler);
    }
  }
}
