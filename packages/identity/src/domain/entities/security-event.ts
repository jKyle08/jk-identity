import { SecurityEventType } from '../value-objects/security-event-type';

export interface SecurityEventProps {
  id: string;
  identityId?: string | null;
  type: SecurityEventType;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export class SecurityEvent {
  private constructor(private readonly props: SecurityEventProps) {}

  static create(
    props: Omit<SecurityEventProps, 'createdAt'> & { createdAt?: Date },
  ): SecurityEvent {
    return new SecurityEvent({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  static reconstitute(props: SecurityEventProps): SecurityEvent {
    return new SecurityEvent(props);
  }

  get id(): string {
    return this.props.id;
  }

  get identityId(): string | null | undefined {
    return this.props.identityId;
  }

  get type(): SecurityEventType {
    return this.props.type;
  }

  get ipAddress(): string | null | undefined {
    return this.props.ipAddress;
  }

  get userAgent(): string | null | undefined {
    return this.props.userAgent;
  }

  get metadata(): Record<string, unknown> | null | undefined {
    return this.props.metadata;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toProps(): SecurityEventProps {
    return { ...this.props };
  }
}
