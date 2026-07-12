/**
 * Extension point for authenticator app (TOTP) providers.
 * Not implemented in v0.2.0.
 */
export interface AuthenticatorAdapter {
  generateSecret(identityId: string): Promise<{ secret: string; otpauthUrl: string }>;
  verifyCode(identityId: string, code: string): Promise<boolean>;
  isEnabled(identityId: string): Promise<boolean>;
}

export const AUTHENTICATOR_ADAPTER = Symbol('AUTHENTICATOR_ADAPTER');
