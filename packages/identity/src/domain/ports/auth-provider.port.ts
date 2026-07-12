import { ProviderType } from '../value-objects/provider-type';

export interface AuthProviderProfile {
  providerUserId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface AuthProvider {
  readonly type: ProviderType;
  authenticate(credentials: unknown): Promise<AuthProviderProfile>;
}

export const AUTH_PROVIDER = Symbol('AUTH_PROVIDER');
