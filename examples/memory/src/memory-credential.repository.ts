/**
 * In-memory credential store for password hashes.
 * Reference implementation — not a domain port; composed by MemoryIdentityRepository.
 */
export class MemoryCredentialRepository {
  private readonly hashesByIdentityId = new Map<string, string>();
  private readonly identityIdByEmail = new Map<string, string>();

  set(identityId: string, email: string, passwordHash: string): void {
    this.hashesByIdentityId.set(identityId, passwordHash);
    this.identityIdByEmail.set(email.trim().toLowerCase(), identityId);
  }

  getByIdentityId(identityId: string): string | undefined {
    return this.hashesByIdentityId.get(identityId);
  }

  findByEmail(email: string): { identityId: string; passwordHash: string } | null {
    const normalized = email.trim().toLowerCase();
    const identityId = this.identityIdByEmail.get(normalized);
    if (!identityId) {
      return null;
    }
    const passwordHash = this.hashesByIdentityId.get(identityId);
    if (!passwordHash) {
      return null;
    }
    return { identityId, passwordHash };
  }

  update(identityId: string, passwordHash: string): void {
    this.hashesByIdentityId.set(identityId, passwordHash);
  }

  remove(identityId: string, email: string): void {
    this.hashesByIdentityId.delete(identityId);
    this.identityIdByEmail.delete(email.trim().toLowerCase());
  }

  clear(): void {
    this.hashesByIdentityId.clear();
    this.identityIdByEmail.clear();
  }
}
