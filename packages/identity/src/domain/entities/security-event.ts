import { AuditEventType } from '../value-objects/audit-event-type';
import { SecurityEventType } from '../value-objects/security-event-type';
import { AuditEvent } from './audit-event';

/**
 * @deprecated Use AuditEvent instead.
 */
export interface SecurityEventProps {
  id: string;
  identityId?: string | null;
  type: SecurityEventType;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

/**
 * @deprecated Use AuditEvent instead.
 */
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

  static fromAuditEvent(event: AuditEvent): SecurityEvent {
    const typeMap: Partial<Record<AuditEventType, SecurityEventType>> = {
      [AuditEventType.LOGIN]: SecurityEventType.LOGIN_SUCCESS,
      [AuditEventType.FAILED_LOGIN]: SecurityEventType.LOGIN_FAILED,
      [AuditEventType.LOGOUT]: SecurityEventType.LOGOUT,
      [AuditEventType.PASSWORD_CHANGED]: SecurityEventType.PASSWORD_CHANGED,
      [AuditEventType.PASSWORD_RESET]: SecurityEventType.PASSWORD_RESET,
      [AuditEventType.EMAIL_VERIFIED]: SecurityEventType.EMAIL_VERIFIED,
      [AuditEventType.PROVIDER_LINKED]: SecurityEventType.PROVIDER_LINKED,
      [AuditEventType.PROVIDER_UNLINKED]: SecurityEventType.PROVIDER_UNLINKED,
      [AuditEventType.SESSION_REVOKED]: SecurityEventType.SESSION_REVOKED,
      [AuditEventType.SESSION_CREATED]: SecurityEventType.SUSPICIOUS_ACTIVITY,
    };

    return SecurityEvent.reconstitute({
      id: event.id,
      identityId: event.identityId,
      type: typeMap[event.type] ?? SecurityEventType.SUSPICIOUS_ACTIVITY,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      metadata: event.metadata,
      createdAt: event.createdAt,
    });
  }

  toAuditEvent(): AuditEvent {
    const typeMap: Partial<Record<SecurityEventType, AuditEventType>> = {
      [SecurityEventType.LOGIN_SUCCESS]: AuditEventType.LOGIN,
      [SecurityEventType.LOGIN_FAILED]: AuditEventType.FAILED_LOGIN,
      [SecurityEventType.LOGOUT]: AuditEventType.LOGOUT,
      [SecurityEventType.PASSWORD_CHANGED]: AuditEventType.PASSWORD_CHANGED,
      [SecurityEventType.PASSWORD_RESET]: AuditEventType.PASSWORD_RESET,
      [SecurityEventType.EMAIL_VERIFIED]: AuditEventType.EMAIL_VERIFIED,
      [SecurityEventType.PROVIDER_LINKED]: AuditEventType.PROVIDER_LINKED,
      [SecurityEventType.PROVIDER_UNLINKED]: AuditEventType.PROVIDER_UNLINKED,
      [SecurityEventType.SESSION_REVOKED]: AuditEventType.SESSION_REVOKED,
    };

    return AuditEvent.create({
      id: this.props.id,
      identityId: this.props.identityId,
      type: typeMap[this.props.type] ?? AuditEventType.FAILED_LOGIN,
      ipAddress: this.props.ipAddress,
      userAgent: this.props.userAgent,
      metadata: this.props.metadata,
      createdAt: this.props.createdAt,
    });
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
