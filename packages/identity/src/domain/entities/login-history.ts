import { AuditEventType } from '../value-objects/audit-event-type';
import { AuditEvent, AuditEventProps } from './audit-event';

/**
 * @deprecated Use AuditEvent instead.
 */
export interface LoginHistoryProps {
  id: string;
  identityId: string;
  success: boolean;
  ipAddress?: string | null;
  userAgent?: string | null;
  device?: string | null;
  browser?: string | null;
  operatingSystem?: string | null;
  failureReason?: string | null;
  createdAt: Date;
}

/**
 * @deprecated Use AuditEvent instead.
 */
export class LoginHistory {
  private constructor(private readonly props: LoginHistoryProps) {}

  static create(
    props: Omit<LoginHistoryProps, 'createdAt'> & { createdAt?: Date },
  ): LoginHistory {
    return new LoginHistory({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  static reconstitute(props: LoginHistoryProps): LoginHistory {
    return new LoginHistory(props);
  }

  static fromAuditEvent(event: AuditEvent): LoginHistory {
    return LoginHistory.reconstitute({
      id: event.id,
      identityId: event.identityId ?? '',
      success: event.success,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      device: event.deviceName,
      browser: event.browser,
      operatingSystem: event.operatingSystem,
      failureReason: event.failureReason,
      createdAt: event.createdAt,
    });
  }

  toAuditEvent(): AuditEvent {
    return AuditEvent.create({
      id: this.props.id,
      identityId: this.props.identityId,
      type: this.props.success ? AuditEventType.LOGIN : AuditEventType.FAILED_LOGIN,
      ipAddress: this.props.ipAddress,
      userAgent: this.props.userAgent,
      deviceName: this.props.device,
      browser: this.props.browser,
      operatingSystem: this.props.operatingSystem,
      failureReason: this.props.failureReason,
      createdAt: this.props.createdAt,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get identityId(): string {
    return this.props.identityId;
  }

  get success(): boolean {
    return this.props.success;
  }

  get ipAddress(): string | null | undefined {
    return this.props.ipAddress;
  }

  get userAgent(): string | null | undefined {
    return this.props.userAgent;
  }

  get device(): string | null | undefined {
    return this.props.device;
  }

  get browser(): string | null | undefined {
    return this.props.browser;
  }

  get operatingSystem(): string | null | undefined {
    return this.props.operatingSystem;
  }

  get failureReason(): string | null | undefined {
    return this.props.failureReason;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toProps(): LoginHistoryProps {
    return { ...this.props };
  }
}

export type { AuditEventProps };
