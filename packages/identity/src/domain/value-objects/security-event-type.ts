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
