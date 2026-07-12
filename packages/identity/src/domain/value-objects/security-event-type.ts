import { AuditEventType } from './audit-event-type';

/**
 * @deprecated Use AuditEventType instead. Retained for AuditAdapter backward compatibility.
 */
export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  PASSWORD_CHANGED = 'password_changed',
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFIED = 'email_verified',
  PROVIDER_LINKED = 'provider_linked',
  PROVIDER_UNLINKED = 'provider_unlinked',
  SESSION_REVOKED = 'session_revoked',
  ACCOUNT_LOCKED = 'account_locked',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
}

export function toAuditEventType(type: SecurityEventType): AuditEventType {
  const mapping: Record<SecurityEventType, AuditEventType> = {
    [SecurityEventType.LOGIN_SUCCESS]: AuditEventType.LOGIN,
    [SecurityEventType.LOGIN_FAILED]: AuditEventType.FAILED_LOGIN,
    [SecurityEventType.LOGOUT]: AuditEventType.LOGOUT,
    [SecurityEventType.PASSWORD_CHANGED]: AuditEventType.PASSWORD_CHANGED,
    [SecurityEventType.PASSWORD_RESET]: AuditEventType.PASSWORD_RESET,
    [SecurityEventType.EMAIL_VERIFIED]: AuditEventType.EMAIL_VERIFIED,
    [SecurityEventType.PROVIDER_LINKED]: AuditEventType.PROVIDER_LINKED,
    [SecurityEventType.PROVIDER_UNLINKED]: AuditEventType.PROVIDER_UNLINKED,
    [SecurityEventType.SESSION_REVOKED]: AuditEventType.SESSION_REVOKED,
    [SecurityEventType.ACCOUNT_LOCKED]: AuditEventType.FAILED_LOGIN,
    [SecurityEventType.SUSPICIOUS_ACTIVITY]: AuditEventType.FAILED_LOGIN,
  };

  return mapping[type];
}
