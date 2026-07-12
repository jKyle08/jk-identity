import { DynamicModule, Module, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import {
  IDENTITY_MODULE_OPTIONS,
  IdentityModuleOptions,
} from './config/identity-module.options';
import { validateIdentityModuleOptions } from './config/validate-identity-module.options';
import { IDENTITY_REPOSITORY } from './domain/ports/identity.repository';
import { SESSION_REPOSITORY } from './domain/ports/session.repository';
import { EMAIL_ADAPTER } from './domain/ports/email.adapter';
import { AUDIT_ADAPTER } from './domain/ports/audit.adapter';
import { STORAGE_ADAPTER } from './domain/ports/storage.adapter';
import { SMS_ADAPTER } from './domain/ports/sms.adapter';
import { PASSWORD_HASHER } from './domain/ports/password-hasher.port';
import { TOKEN_SERVICE } from './domain/ports/token-service.port';
import { EVENT_BUS } from './domain/ports/event-bus.port';

import { PasswordService } from './application/services/password.service';
import { TokenService } from './application/services/token.service';
import { SessionService } from './application/services/session.service';
import { EmailVerificationService } from './application/services/email-verification.service';
import { PasswordResetService } from './application/services/password-reset.service';

import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { OAuthLoginUseCase } from './application/use-cases/oauth-login.use-case';

import { Argon2PasswordHasher } from './infrastructure/hashing/argon2-password-hasher';
import { JwtTokenService } from './infrastructure/jwt/jwt-token.service';
import { InMemoryEventBus } from './infrastructure/events/in-memory-event-bus';
import { LocalStrategy } from './infrastructure/passport/local.strategy';
import { JwtStrategy } from './infrastructure/passport/jwt.strategy';
import { GoogleStrategy } from './infrastructure/passport/google.strategy';
import { GoogleAuthProvider } from './infrastructure/oauth/google-auth-provider';

import { AuthController } from './presentation/controllers/auth.controller';
import { SessionController } from './presentation/controllers/session.controller';
import { GlobalIdentityExceptionFilter } from './presentation/filters/identity-exception.filter';

import { IdentityService } from './identity.service';

const APPLICATION_PROVIDERS = [
  PasswordService,
  TokenService,
  SessionService,
  EmailVerificationService,
  PasswordResetService,
  RegisterUseCase,
  LoginUseCase,
  LogoutUseCase,
  ChangePasswordUseCase,
  OAuthLoginUseCase,
  IdentityService,
];

const INFRASTRUCTURE_PROVIDERS = [
  { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasher },
  { provide: TOKEN_SERVICE, useClass: JwtTokenService },
  { provide: EVENT_BUS, useClass: InMemoryEventBus },
  LocalStrategy,
  JwtStrategy,
  GoogleAuthProvider,
];

/**
 * NestJS module for identity and authentication.
 *
 * Register with {@link IdentityModule.register} and provide adapter implementations
 * for your persistence and notification infrastructure.
 *
 * @example
 * ```ts
 * IdentityModule.register({
 *   adapters: createMemoryAdapters(),
 *   auth: {
 *     jwtSecret: process.env.JWT_SECRET!,
 *     jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
 *     accessTokenExpiration: '15m',
 *     refreshTokenExpiration: '30d',
 *   },
 * })
 * ```
 */
@Module({})
export class IdentityModule {
  /**
   * Registers the identity module with consumer-provided adapters and configuration.
   *
   * @param options - Adapters, JWT auth config, and optional OAuth/rate-limit settings
   * @throws Error when required adapters or auth configuration are missing
   */
  static register(options: IdentityModuleOptions): DynamicModule {
    validateIdentityModuleOptions(options);
    const adapterProviders: Provider[] = [
      { provide: IDENTITY_MODULE_OPTIONS, useValue: options },
      { provide: IDENTITY_REPOSITORY, useValue: options.adapters.identityRepository },
      { provide: SESSION_REPOSITORY, useValue: options.adapters.sessionRepository },
      { provide: EMAIL_ADAPTER, useValue: options.adapters.emailAdapter },
      { provide: AUDIT_ADAPTER, useValue: options.adapters.auditAdapter },
    ];

    if (options.adapters.storageAdapter) {
      adapterProviders.push({
        provide: STORAGE_ADAPTER,
        useValue: options.adapters.storageAdapter,
      });
    }

    if (options.adapters.smsAdapter) {
      adapterProviders.push({
        provide: SMS_ADAPTER,
        useValue: options.adapters.smsAdapter,
      });
    }

    const passportProviders: Provider[] = [...INFRASTRUCTURE_PROVIDERS];

    if (options.oauth?.google) {
      passportProviders.push(GoogleStrategy);
    }

    return {
      module: IdentityModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: options.auth.jwtSecret,
          signOptions: {
            expiresIn: options.auth.accessTokenExpiration as `${number}${'s' | 'm' | 'h' | 'd'}`,
          },
        }),
      ],
      controllers: [AuthController, SessionController],
      providers: [
        ...adapterProviders,
        ...passportProviders,
        ...APPLICATION_PROVIDERS,
        {
          provide: APP_FILTER,
          useClass: GlobalIdentityExceptionFilter,
        },
      ],
      exports: [
        IdentityService,
        PasswordService,
        TokenService,
        SessionService,
        EmailVerificationService,
        PasswordResetService,
        GoogleAuthProvider,
        IDENTITY_REPOSITORY,
        SESSION_REPOSITORY,
        EMAIL_ADAPTER,
        AUDIT_ADAPTER,
        EVENT_BUS,
      ],
    };
  }
}
