/**
 * Extension point for multi-factor authentication.
 * Not implemented in v0.2.0.
 */
export interface MfaAdapter {
  enroll(identityId: string, method: string): Promise<{ secret?: string; qrCodeUrl?: string }>;
  verify(identityId: string, code: string, method?: string): Promise<boolean>;
  disable(identityId: string, method: string): Promise<void>;
  listMethods(identityId: string): Promise<string[]>;
}

export const MFA_ADAPTER = Symbol('MFA_ADAPTER');
