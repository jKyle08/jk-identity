import type { IdentityAdapters } from '@jk/identity';
import { MemoryAuditAdapter } from './memory-audit.adapter';
import { MemoryCredentialRepository } from './memory-credential.repository';
import { MemoryIdentityProviderRepository } from './memory-identity-provider.repository';
import { MemoryIdentityRepository } from './memory-identity.repository';
import { MemoryNotificationAdapter } from './memory-notification.adapter';
import { MemorySessionRepository } from './memory-session.repository';
import { MemoryStorageAdapter } from './memory-storage.adapter';
import { MemoryVerificationRepository } from './memory-verification.repository';

export { MemoryAuditAdapter } from './memory-audit.adapter';
export { MemoryCredentialRepository } from './memory-credential.repository';
export { MemoryIdentityProviderRepository } from './memory-identity-provider.repository';
export { MemoryIdentityRepository } from './memory-identity.repository';
export { MemoryNotificationAdapter } from './memory-notification.adapter';
export type { MemoryEmailRecord } from './memory-notification.adapter';
export { MemorySessionRepository } from './memory-session.repository';
export { MemoryStorageAdapter } from './memory-storage.adapter';
export { MemoryVerificationRepository } from './memory-verification.repository';

/** Alias matching the phase spec naming convention. */
export { MemoryNotificationAdapter as MemoryEmailAdapter } from './memory-notification.adapter';

export interface MemoryAdaptersBundle extends IdentityAdapters {
  /** Shared credential store (password hashes). */
  credentialRepository: MemoryCredentialRepository;
  /** Shared provider store (OAuth / email links). */
  identityProviderRepository: MemoryIdentityProviderRepository;
  /** Shared verification and password-reset token store. */
  verificationRepository: MemoryVerificationRepository;
  /** Typed identity repository instance. */
  identityRepository: MemoryIdentityRepository;
  /** Typed session repository instance. */
  sessionRepository: MemorySessionRepository;
  /** Typed email adapter instance. */
  emailAdapter: MemoryNotificationAdapter;
  /** Typed audit adapter instance. */
  auditAdapter: MemoryAuditAdapter;
  /** Optional in-memory storage adapter. */
  storageAdapter?: MemoryStorageAdapter;
}

export interface CreateMemoryAdaptersOptions {
  includeStorage?: boolean;
}

/**
 * Creates a connected set of in-memory adapters ready for {@link IdentityModule.register}.
 *
 * @example
 * ```ts
 * const adapters = createMemoryAdapters();
 * IdentityModule.register({
 *   adapters,
 *   auth: { jwtSecret: '...', jwtRefreshSecret: '...', ... },
 * });
 * ```
 */
export function createMemoryAdapters(
  options: CreateMemoryAdaptersOptions = {},
): MemoryAdaptersBundle {
  const credentialRepository = new MemoryCredentialRepository();
  const identityProviderRepository = new MemoryIdentityProviderRepository();
  const verificationRepository = new MemoryVerificationRepository();

  const identityRepository = new MemoryIdentityRepository(
    credentialRepository,
    identityProviderRepository,
  );
  const sessionRepository = new MemorySessionRepository(verificationRepository);
  const emailAdapter = new MemoryNotificationAdapter();
  const auditAdapter = new MemoryAuditAdapter();

  const bundle: MemoryAdaptersBundle = {
    identityRepository,
    sessionRepository,
    emailAdapter,
    auditAdapter,
    credentialRepository,
    identityProviderRepository,
    verificationRepository,
  };

  if (options.includeStorage) {
    bundle.storageAdapter = new MemoryStorageAdapter();
  }

  return bundle;
}

/**
 * Clears all data from a memory adapters bundle.
 */
export function clearMemoryAdapters(adapters: MemoryAdaptersBundle): void {
  adapters.identityRepository.clear();
  adapters.sessionRepository.clear();
  adapters.emailAdapter.clear();
  adapters.auditAdapter.clear();
  adapters.storageAdapter?.clear();
}
