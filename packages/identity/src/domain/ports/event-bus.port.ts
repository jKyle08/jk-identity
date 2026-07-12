import { DomainEvent } from '../events/domain-event';

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe(eventName: string, handler: (event: DomainEvent) => void): void;
}

export const EVENT_BUS = Symbol('EVENT_BUS');

/** @deprecated Use EventBus and EVENT_BUS instead. */
export type EventPublisher = EventBus;

/** @deprecated Use EVENT_BUS instead. */
export const EVENT_PUBLISHER = EVENT_BUS;
