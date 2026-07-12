/**
 * Extension point for WebAuthn / Passkey authentication.
 * Not implemented in v0.2.0 — consumers may provide adapters in future releases.
 */
export interface PasskeyAdapter {
  registerChallenge(identityId: string): Promise<{ challenge: string; options: unknown }>;
  verifyRegistration(identityId: string, response: unknown): Promise<void>;
  authenticateChallenge(identityId?: string): Promise<{ challenge: string; options: unknown }>;
  verifyAuthentication(response: unknown): Promise<{ identityId: string }>;
}

export const PASSKEY_ADAPTER = Symbol('PASSKEY_ADAPTER');
