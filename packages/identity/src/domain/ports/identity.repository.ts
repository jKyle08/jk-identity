import { Identity } from '../entities/identity';
import { IdentityProvider } from '../entities/identity-provider';
import { ProviderType } from '../value-objects/provider-type';

export interface CreateIdentityInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  displayName?: string;
  primaryEmail: string;
  secondaryEmail?: string;
  mobileNumber?: string;
  telephoneNumber?: string;
  preferredLanguage?: string;
  timezone?: string;
  country?: string;
}

export interface UpdateIdentityInput {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  suffix?: string | null;
  displayName?: string | null;
  secondaryEmail?: string | null;
  mobileNumber?: string | null;
  telephoneNumber?: string | null;
  avatarUrl?: string | null;
  dateOfBirth?: Date | null;
  gender?: string | null;
  preferredLanguage?: string | null;
  timezone?: string | null;
  country?: string | null;
}

export interface LinkProviderInput {
  identityId: string;
  provider: ProviderType;
  providerUserId: string;
  email?: string;
  metadata?: Record<string, unknown>;
}

export interface IdentityRepository {
  findById(id: string): Promise<Identity | null>;
  findByEmail(email: string): Promise<Identity | null>;
  create(input: CreateIdentityInput): Promise<Identity>;
  update(id: string, input: UpdateIdentityInput): Promise<Identity>;
  verifyEmail(id: string): Promise<Identity>;
  verifyMobile(id: string): Promise<Identity>;
  updatePasswordHash(identityId: string, passwordHash: string): Promise<void>;
  findPasswordHashByEmail(email: string): Promise<{ identityId: string; passwordHash: string } | null>;
  linkProvider(input: LinkProviderInput): Promise<IdentityProvider>;
  findProviderByType(identityId: string, provider: ProviderType): Promise<IdentityProvider | null>;
  findProviderByProviderUserId(
    provider: ProviderType,
    providerUserId: string,
  ): Promise<IdentityProvider | null>;
  updateLastLogin(id: string, date?: Date): Promise<void>;
}

export const IDENTITY_REPOSITORY = Symbol('IDENTITY_REPOSITORY');
