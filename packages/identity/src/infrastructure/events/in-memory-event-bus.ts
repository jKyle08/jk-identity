import { Injectable } from '@nestjs/common';
import { EventBus } from '../../domain/ports/event-bus.port';
import { DomainEvent } from '../../domain/events/domain-event';

@Injectable()
export class InMemoryEventBus implements EventBus {
  private readonly handlers = new Map<string, Array<(event: DomainEvent) => void>>();

  subscribe(eventName: string, handler: (event: DomainEvent) => void): void {
    const existing = this.handlers.get(eventName) ?? [];
    existing.push(handler);
    this.handlers.set(eventName, existing);
  }

  /** @deprecated Use subscribe instead. */
  on(eventName: string, handler: (event: DomainEvent) => void): void {
    this.subscribe(eventName, handler);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) ?? [];
    for (const handler of handlers) {
      handler(event);
    }
  }
}

/** @deprecated Use InMemoryEventBus instead. */
export { InMemoryEventBus as InMemoryEventPublisher };
