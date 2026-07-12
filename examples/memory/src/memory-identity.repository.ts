import {
  AccountStatus,
  CreateIdentityInput,
  Gender,
  Identity,
  IdentityProvider,
  IdentityRepository,
  LinkProviderInput,
  ProviderType,
  UpdateIdentityInput,
  normalizeEmail,
} from '@jk/identity';
import { MemoryCredentialRepository } from './memory-credential.repository';
import { MemoryIdentityProviderRepository } from './memory-identity-provider.repository';

/**
 * In-memory implementation of {@link IdentityRepository}.
 * Composes credential and provider stores for reference and testing.
 */
export class MemoryIdentityRepository implements IdentityRepository {
  private readonly identities = new Map<string, Identity>();
  private readonly byEmail = new Map<string, string>();

  constructor(
    private readonly credentials: MemoryCredentialRepository = new MemoryCredentialRepository(),
    private readonly providers: MemoryIdentityProviderRepository = new MemoryIdentityProviderRepository(),
  ) {}

  get credentialRepository(): MemoryCredentialRepository {
    return this.credentials;
  }

  get identityProviderRepository(): MemoryIdentityProviderRepository {
    return this.providers;
  }

  async findById(id: string): Promise<Identity | null> {
    return this.identities.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<Identity | null> {
    const id = this.byEmail.get(normalizeEmail(email));
    return id ? (this.identities.get(id) ?? null) : null;
  }

  async create(input: CreateIdentityInput): Promise<Identity> {
    const id = crypto.randomUUID();
    const email = normalizeEmail(input.primaryEmail);

    if (this.byEmail.has(email)) {
      throw new Error(`Email already exists: ${email}`);
    }

    const identity = Identity.create(
      {
        id,
        primaryEmail: email,
        secondaryEmail: input.secondaryEmail ? normalizeEmail(input.secondaryEmail) : undefined,
        accountStatus: AccountStatus.PENDING_VERIFICATION,
        emailVerified: false,
        mobileVerified: false,
      },
      {
        firstName: input.firstName,
        middleName: input.middleName,
        lastName: input.lastName,
        suffix: input.suffix,
        displayName: input.displayName,
        mobileNumber: input.mobileNumber,
        telephoneNumber: input.telephoneNumber,
        preferredLanguage: input.preferredLanguage,
        timezone: input.timezone,
        country: input.country,
      },
    );

    this.identities.set(id, identity);
    this.byEmail.set(email, id);
    return identity;
  }

  async update(id: string, input: UpdateIdentityInput): Promise<Identity> {
    const identity = this.identities.get(id);
    if (!identity) {
      throw new Error(`Identity not found: ${id}`);
    }

    const profileUpdates: Record<string, unknown> = {};
    if (input.firstName !== undefined) profileUpdates.firstName = input.firstName;
    if (input.middleName !== undefined) profileUpdates.middleName = input.middleName;
    if (input.lastName !== undefined) profileUpdates.lastName = input.lastName;
    if (input.suffix !== undefined) profileUpdates.suffix = input.suffix;
    if (input.displayName !== undefined) profileUpdates.displayName = input.displayName;
    if (input.avatarUrl !== undefined) profileUpdates.avatarUrl = input.avatarUrl;
    if (input.mobileNumber !== undefined) profileUpdates.mobileNumber = input.mobileNumber;
    if (input.telephoneNumber !== undefined) profileUpdates.telephoneNumber = input.telephoneNumber;
    if (input.dateOfBirth !== undefined) profileUpdates.dateOfBirth = input.dateOfBirth;
    if (input.gender !== undefined) {
      profileUpdates.gender = input.gender ? (input.gender as Gender) : null;
    }
    if (input.preferredLanguage !== undefined) {
      profileUpdates.preferredLanguage = input.preferredLanguage;
    }
    if (input.timezone !== undefined) profileUpdates.timezone = input.timezone;
    if (input.country !== undefined) profileUpdates.country = input.country;

    const authUpdates: Record<string, unknown> = {};
    if (input.secondaryEmail !== undefined) {
      authUpdates.secondaryEmail = input.secondaryEmail
        ? normalizeEmail(input.secondaryEmail)
        : null;
    }

    let updated = identity;
    if (Object.keys(authUpdates).length > 0) {
      updated = updated.withAuthUpdates(authUpdates);
    }
    if (Object.keys(profileUpdates).length > 0) {
      updated = updated.withProfileUpdates(profileUpdates);
    }

    this.identities.set(id, updated);
    return updated;
  }

  async verifyEmail(id: string): Promise<Identity> {
    const identity = this.identities.get(id);
    if (!identity) {
      throw new Error(`Identity not found: ${id}`);
    }

    const updated = identity.withAuthUpdates({
      emailVerified: true,
      accountStatus: AccountStatus.ACTIVE,
    });
    this.identities.set(id, updated);
    return updated;
  }

  async verifyMobile(id: string): Promise<Identity> {
    const identity = this.identities.get(id);
    if (!identity) {
      throw new Error(`Identity not found: ${id}`);
    }

    const updated = identity.withAuthUpdates({ mobileVerified: true });
    this.identities.set(id, updated);
    return updated;
  }

  async updatePasswordHash(identityId: string, passwordHash: string): Promise<void> {
    const identity = this.identities.get(identityId);
    if (!identity) {
      throw new Error(`Identity not found: ${identityId}`);
    }
    this.credentials.update(identityId, passwordHash);
    this.credentials.set(identityId, identity.primaryEmail, passwordHash);
  }

  async findPasswordHashByEmail(
    email: string,
  ): Promise<{ identityId: string; passwordHash: string } | null> {
    return this.credentials.findByEmail(email);
  }

  async linkProvider(input: LinkProviderInput): Promise<IdentityProvider> {
    const identity = this.identities.get(input.identityId);
    if (!identity) {
      throw new Error(`Identity not found: ${input.identityId}`);
    }
    return this.providers.link(input);
  }

  async findProviderByType(
    identityId: string,
    provider: ProviderType,
  ): Promise<IdentityProvider | null> {
    return this.providers.findByType(identityId, provider);
  }

  async findProviderByProviderUserId(
    provider: ProviderType,
    providerUserId: string,
  ): Promise<IdentityProvider | null> {
    return this.providers.findByProviderUserId(provider, providerUserId);
  }

  async updateLastLogin(id: string, date: Date = new Date()): Promise<void> {
    const identity = this.identities.get(id);
    if (!identity) {
      throw new Error(`Identity not found: ${id}`);
    }
    this.identities.set(id, identity.withAuthUpdates({ lastLoginAt: date }));
  }

  clear(): void {
    this.identities.clear();
    this.byEmail.clear();
    this.credentials.clear();
    this.providers.clear();
  }
}
