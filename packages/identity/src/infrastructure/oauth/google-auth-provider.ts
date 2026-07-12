import { Injectable } from '@nestjs/common';
import { ProviderType } from '../../domain/value-objects/provider-type';
import { AuthProviderProfile } from '../../domain/ports/auth-provider.port';
import { BaseAuthProvider } from './base-auth-provider';

export interface GoogleTokenPayload {
  sub: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}

@Injectable()
export class GoogleAuthProvider extends BaseAuthProvider {
  readonly type = ProviderType.GOOGLE;

  async authenticate(credentials: unknown): Promise<AuthProviderProfile> {
    const payload = credentials as GoogleTokenPayload;

    return {
      providerUserId: payload.sub,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      displayName: payload.name,
      avatarUrl: payload.picture,
      metadata: payload as unknown as Record<string, unknown>,
    };
  }
}
