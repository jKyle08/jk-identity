export const IDENTITY_MODULE_OPTIONS = 'IDENTITY_MODULE_OPTIONS';

export interface AuthConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  accessTokenExpiration: string;
  refreshTokenExpiration: string;
}

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

export interface IdentityAdapters {
  identityRepository: import('../domain/ports/identity.repository').IdentityRepository;
  sessionRepository: import('../domain/ports/session.repository').SessionRepository;
  emailAdapter: import('../domain/ports/email.adapter').EmailAdapter;
  auditAdapter: import('../domain/ports/audit.adapter').AuditAdapter;
  storageAdapter?: import('../domain/ports/storage.adapter').StorageAdapter;
  smsAdapter?: import('../domain/ports/sms.adapter').SmsAdapter;
}

export interface IdentityModuleOptions {
  adapters: IdentityAdapters;
  auth: AuthConfig;
  oauth?: OAuthConfig;
  rateLimit?: RateLimitConfig;
  verificationTokenExpirationHours?: number;
  passwordResetTokenExpirationHours?: number;
  sendLoginNotification?: boolean;
}
