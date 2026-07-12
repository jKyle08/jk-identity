import { EmailAdapter } from '@jk/identity';

export interface MemoryEmailRecord {
  to: string;
  type: 'verification' | 'password_reset' | 'login_notification';
  token?: string;
  identityName?: string;
  metadata?: Record<string, unknown>;
  sentAt: Date;
}

/**
 * In-memory implementation of {@link EmailAdapter}.
 * Stores sent emails for inspection during development and testing.
 */
export class MemoryNotificationAdapter implements EmailAdapter {
  readonly sentEmails: MemoryEmailRecord[] = [];

  async sendVerificationEmail(
    to: string,
    token: string,
    identityName?: string,
  ): Promise<void> {
    this.sentEmails.push({
      to,
      type: 'verification',
      token,
      identityName,
      sentAt: new Date(),
    });
  }

  async sendPasswordResetEmail(
    to: string,
    token: string,
    identityName?: string,
  ): Promise<void> {
    this.sentEmails.push({
      to,
      type: 'password_reset',
      token,
      identityName,
      sentAt: new Date(),
    });
  }

  async sendLoginNotification(
    to: string,
    metadata: {
      ipAddress?: string;
      device?: string;
      browser?: string;
      operatingSystem?: string;
      timestamp: Date;
    },
  ): Promise<void> {
    this.sentEmails.push({
      to,
      type: 'login_notification',
      metadata,
      sentAt: new Date(),
    });
  }

  getLastVerificationToken(to: string): string | undefined {
    const record = [...this.sentEmails]
      .reverse()
      .find((e) => e.type === 'verification' && e.to === to);
    return record?.token;
  }

  getLastPasswordResetToken(to: string): string | undefined {
    const record = [...this.sentEmails]
      .reverse()
      .find((e) => e.type === 'password_reset' && e.to === to);
    return record?.token;
  }

  clear(): void {
    this.sentEmails.length = 0;
  }
}
