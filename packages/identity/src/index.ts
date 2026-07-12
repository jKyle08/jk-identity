// Module
export { IdentityModule } from './identity.module';
export { IdentityService } from './identity.service';

// Config
export {
  IDENTITY_MODULE_OPTIONS,
  type IdentityModuleOptions,
  type IdentityAdapters,
  type AuthConfig,
  type OAuthConfig,
  type GoogleOAuthConfig,
  type RateLimitConfig,
} from './config/identity-module.options';

// Domain - Entities
export {
  Identity,
  IdentityProfile,
  IdentityProvider,
  IdentitySession,
  RefreshToken,
  VerificationToken,
  PasswordResetToken,
  AuditEvent,
  LoginHistory,
  SecurityEvent,
} from './domain/entities';

export type {
  IdentityProps,
  IdentityAuthProps,
  IdentityProfileProps,
  IdentityProviderProps,
  IdentitySessionProps,
  RefreshTokenProps,
  VerificationTokenProps,
  PasswordResetTokenProps,
  AuditEventProps,
  LoginHistoryProps,
  SecurityEventProps,
} from './domain/entities';

// Domain - Value Objects
export {
  AccountStatus,
  Email,
  Gender,
  ProviderType,
  AuditEventType,
  SecurityEventType,
  toAuditEventType,
  FullName,
  PhoneNumber,
  Password,
  DisplayName,
  Country,
  Timezone,
} from './domain/value-objects';

// Domain - Events
export {
  DomainEvent,
  IdentityCreatedEvent,
  IdentityLoggedInEvent,
  IdentityLoggedOutEvent,
  PasswordChangedEvent,
  PasswordResetEvent,
  EmailVerifiedEvent,
  ProviderLinkedEvent,
  ProviderUnlinkedEvent,
  SessionCreatedEvent,
  SessionRevokedEvent,
} from './domain/events';

// Domain - Ports (Interfaces)
export type {
  IdentityRepository,
  CreateIdentityInput,
  UpdateIdentityInput,
  LinkProviderInput,
  SessionRepository,
  SessionMetadata,
  CreateSessionInput,
  CreateSessionResult,
  EmailAdapter,
  AuditAdapter,
  LoginAuditMetadata,
  StorageAdapter,
  SmsAdapter,
  AuthProvider,
  AuthProviderProfile,
  PasswordHasher,
  TokenServicePort,
  TokenPayload,
  TokenPair,
  EventBus,
  EventPublisher,
  PasskeyAdapter,
  MfaAdapter,
  MagicLinkAdapter,
  DeviceTrustAdapter,
  AuthenticatorAdapter,
} from './domain/ports';

export {
  IDENTITY_REPOSITORY,
  SESSION_REPOSITORY,
  EMAIL_ADAPTER,
  AUDIT_ADAPTER,
  STORAGE_ADAPTER,
  SMS_ADAPTER,
  AUTH_PROVIDER,
  PASSWORD_HASHER,
  TOKEN_SERVICE,
  EVENT_BUS,
  EVENT_PUBLISHER,
  PASSKEY_ADAPTER,
  MFA_ADAPTER,
  MAGIC_LINK_ADAPTER,
  DEVICE_TRUST_ADAPTER,
  AUTHENTICATOR_ADAPTER,
} from './domain/ports';

// Application Services
export {
  PasswordService,
  TokenService,
  SessionService,
  EmailVerificationService,
  PasswordResetService,
} from './application/services';

export type { AuthTokens, CreateSessionResult as SessionCreateResult } from './application/services';

// Use Cases
export {
  RegisterUseCase,
  LoginUseCase,
  LogoutUseCase,
  ChangePasswordUseCase,
  OAuthLoginUseCase,
} from './application/use-cases';

export type {
  RegisterInput,
  LoginInput,
  LogoutInput,
  ChangePasswordInput,
  OAuthLoginInput,
} from './application/use-cases';

// Infrastructure - Auth Providers
export { BaseAuthProvider } from './infrastructure/oauth/base-auth-provider';
export { GoogleAuthProvider } from './infrastructure/oauth/google-auth-provider';
export { InMemoryEventBus, InMemoryEventPublisher } from './infrastructure/events/in-memory-event-bus';

// Presentation
export {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ResendVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  RefreshTokenDto,
  AuthTokensResponseDto,
  IdentityResponseDto,
  AuthResponseDto,
} from './presentation/dto';

export { CurrentIdentity } from './presentation/decorators';
export { JwtAuthGuard, GoogleAuthGuard, LocalAuthGuard, IdentityGuard } from './presentation/guards';
export { IdentityExceptionFilter, GlobalIdentityExceptionFilter } from './presentation/filters/identity-exception.filter';

// Shared - Utilities & Exceptions
export * from './shared/exceptions';
export { validatePasswordStrength, parseUserAgent } from './shared/utils/password';
export type { ParsedUserAgent } from './shared/utils/password';
export { generateSecureToken, generateId, normalizeEmail } from './shared/utils';

// Constants
export * from './shared/constants';
