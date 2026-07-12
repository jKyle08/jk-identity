import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { IDENTITY_MODULE_OPTIONS } from '../../config/identity-module.options';
import type { IdentityModuleOptions } from '../../config/identity-module.options';
import { ProviderType } from '../../domain/value-objects/provider-type';
import { OAuthLoginUseCase } from '../../application/use-cases/oauth-login.use-case';

interface GoogleProfile {
  id: string;
  emails?: Array<{ value: string; verified?: boolean }>;
  name?: { givenName?: string; familyName?: string };
  displayName?: string;
  photos?: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(IDENTITY_MODULE_OPTIONS)
    options: IdentityModuleOptions,
    private readonly oauthLoginUseCase: OAuthLoginUseCase,
  ) {
    const googleConfig = options.oauth?.google;
    if (!googleConfig) {
      throw new Error('Google OAuth configuration is required');
    }

    super({
      clientID: googleConfig.clientId,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackUrl ?? '/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const email = profile.emails?.[0]?.value;
      const result = await this.oauthLoginUseCase.execute({
        provider: ProviderType.GOOGLE,
        profile: {
          providerUserId: profile.id,
          email,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          displayName: profile.displayName,
          avatarUrl: profile.photos?.[0]?.value,
          metadata: { accessToken },
        },
      });

      done(null, result);
    } catch (error) {
      done(error as Error, false);
    }
  }
}
