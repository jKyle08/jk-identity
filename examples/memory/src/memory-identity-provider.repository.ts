import { randomUUID } from 'crypto';
import {
  IdentityProvider,
  LinkProviderInput,
  ProviderType,
} from '@jk/identity';

/**
 * In-memory store for OAuth and email identity providers.
 * Reference implementation — composed by MemoryIdentityRepository.
 */
export class MemoryIdentityProviderRepository {
  private readonly providers = new Map<string, IdentityProvider>();
  private readonly byIdentityAndType = new Map<string, string>();
  private readonly byProviderUser = new Map<string, string>();

  private identityTypeKey(identityId: string, provider: ProviderType): string {
    return `${identityId}:${provider}`;
  }

  private providerUserKey(provider: ProviderType, providerUserId: string): string {
    return `${provider}:${providerUserId}`;
  }

  link(input: LinkProviderInput): IdentityProvider {
    const id = randomUUID();
    const provider = IdentityProvider.create({
      id,
      identityId: input.identityId,
      provider: input.provider,
      providerUserId: input.providerUserId,
      email: input.email,
      metadata: input.metadata,
    });

    this.providers.set(id, provider);
    this.byIdentityAndType.set(
      this.identityTypeKey(input.identityId, input.provider),
      id,
    );
    this.byProviderUser.set(
      this.providerUserKey(input.provider, input.providerUserId),
      id,
    );

    return provider;
  }

  findByType(identityId: string, provider: ProviderType): IdentityProvider | null {
    const id = this.byIdentityAndType.get(this.identityTypeKey(identityId, provider));
    return id ? (this.providers.get(id) ?? null) : null;
  }

  findByProviderUserId(
    provider: ProviderType,
    providerUserId: string,
  ): IdentityProvider | null {
    const id = this.byProviderUser.get(this.providerUserKey(provider, providerUserId));
    return id ? (this.providers.get(id) ?? null) : null;
  }

  clear(): void {
    this.providers.clear();
    this.byIdentityAndType.clear();
    this.byProviderUser.clear();
  }
}
