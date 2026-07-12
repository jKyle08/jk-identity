import { Injectable } from '@nestjs/common';
import { EventPublisher } from '../../domain/ports/event-publisher.port';
import { DomainEvent } from '../../domain/events/domain-event';

@Injectable()
export class InMemoryEventPublisher implements EventPublisher {
  private readonly handlers = new Map<string, Array<(event: DomainEvent) => void>>();

  on(eventName: string, handler: (event: DomainEvent) => void): void {
    const existing = this.handlers.get(eventName) ?? [];
    existing.push(handler);
    this.handlers.set(eventName, existing);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) ?? [];
    for (const handler of handlers) {
      handler(event);
    }
  }
}
