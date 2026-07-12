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
  IdentityProvider,
  IdentitySession,
  RefreshToken,
  VerificationToken,
  PasswordResetToken,
  LoginHistory,
  SecurityEvent,
} from './domain/entities';

export type {
  IdentityProps,
  IdentityProviderProps,
  IdentitySessionProps,
  RefreshTokenProps,
  VerificationTokenProps,
  PasswordResetTokenProps,
  LoginHistoryProps,
  SecurityEventProps,
} from './domain/entities';

// Domain - Value Objects
export {
  AccountStatus,
  Email,
  Gender,
  ProviderType,
  SecurityEventType,
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
  EventPublisher,
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
  EVENT_PUBLISHER,
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

// Utilities & Exceptions
export * from './utils/exceptions';
export { validatePasswordStrength, parseUserAgent } from './utils/password';
export { generateSecureToken, generateId, normalizeEmail } from './utils';

// Constants
export * from './constants';
