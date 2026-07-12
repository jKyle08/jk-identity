export interface EmailAdapter {
  sendVerificationEmail(to: string, token: string, identityName?: string): Promise<void>;
  sendPasswordResetEmail(to: string, token: string, identityName?: string): Promise<void>;
  sendLoginNotification(
    to: string,
    metadata: {
      ipAddress?: string;
      device?: string;
      browser?: string;
      operatingSystem?: string;
      timestamp: Date;
    },
  ): Promise<void>;
}

export const EMAIL_ADAPTER = Symbol('EMAIL_ADAPTER');
