export const IDENTITY_MODULE_OPTIONS = 'IDENTITY_MODULE_OPTIONS';

/** JWT signing and expiration configuration for access and refresh tokens. */
export interface AuthConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  accessTokenExpiration: string;
  refreshTokenExpiration: string;
}

/** Google OAuth client configuration. Enabled when provided to {@link IdentityModule.register}. */
export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl?: string;
}

export interface OAuthConfig {
  google?: GoogleOAuthConfig;
}

export interface RateLimitConfig {
  maxLoginAttempts?: number;
  lockoutDurationMinutes?: number;
}

/** Consumer-provided adapter implementations for persistence and notifications. */
export interface IdentityAdapters {
  identityRepository: import('../domain/ports/identity.repository').IdentityRepository;
  sessionRepository: import('../domain/ports/session.repository').SessionRepository;
  emailAdapter: import('../domain/ports/email.adapter').EmailAdapter;
  auditAdapter: import('../domain/ports/audit.adapter').AuditAdapter;
  storageAdapter?: import('../domain/ports/storage.adapter').StorageAdapter;
  smsAdapter?: import('../domain/ports/sms.adapter').SmsAdapter;
}

/**
 * Options for {@link IdentityModule.register}.
 *
 * Required: `adapters` (identityRepository, sessionRepository, emailAdapter, auditAdapter)
 * and `auth` (JWT secrets and token expiration).
 */
export interface IdentityModuleOptions {
  adapters: IdentityAdapters;
  auth: AuthConfig;
  oauth?: OAuthConfig;
  rateLimit?: RateLimitConfig;
  verificationTokenExpirationHours?: number;
  passwordResetTokenExpirationHours?: number;
  sendLoginNotification?: boolean;
}
