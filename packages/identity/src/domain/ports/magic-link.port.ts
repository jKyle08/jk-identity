/**
 * Extension point for magic-link authentication.
 * Not implemented in v0.2.0.
 */
export interface MagicLinkAdapter {
  sendMagicLink(email: string, redirectUrl: string): Promise<void>;
  verifyMagicLink(token: string): Promise<{ identityId: string; email: string }>;
}

export const MAGIC_LINK_ADAPTER = Symbol('MAGIC_LINK_ADAPTER');
