import { AuditEventType } from '../value-objects/audit-event-type';

export interface AuditEventProps {
  id: string;
  identityId?: string | null;
  type: AuditEventType;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceName?: string | null;
  browser?: string | null;
  operatingSystem?: string | null;
  country?: string | null;
  failureReason?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export class AuditEvent {
  private constructor(private readonly props: AuditEventProps) {}

  static create(
    props: Omit<AuditEventProps, 'createdAt'> & { createdAt?: Date },
  ): AuditEvent {
    return new AuditEvent({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  static reconstitute(props: AuditEventProps): AuditEvent {
    return new AuditEvent(props);
  }

  get id(): string {
    return this.props.id;
  }

  get identityId(): string | null | undefined {
    return this.props.identityId;
  }

  get type(): AuditEventType {
    return this.props.type;
  }

  get ipAddress(): string | null | undefined {
    return this.props.ipAddress;
  }

  get userAgent(): string | null | undefined {
    return this.props.userAgent;
  }

  get deviceName(): string | null | undefined {
    return this.props.deviceName;
  }

  get browser(): string | null | undefined {
    return this.props.browser;
  }

  get operatingSystem(): string | null | undefined {
    return this.props.operatingSystem;
  }

  get country(): string | null | undefined {
    return this.props.country;
  }

  get failureReason(): string | null | undefined {
    return this.props.failureReason;
  }

  get metadata(): Record<string, unknown> | null | undefined {
    return this.props.metadata;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get success(): boolean {
    return this.props.type !== AuditEventType.FAILED_LOGIN;
  }

  toProps(): AuditEventProps {
    return { ...this.props };
  }
}
