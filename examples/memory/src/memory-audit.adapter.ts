import {
  AuditAdapter,
  AuditEvent,
  AuditEventType,
  LoginAuditMetadata,
  SecurityEventType,
  toAuditEventType,
} from '@jk/identity';

/**
 * In-memory implementation of {@link AuditAdapter}.
 * Records audit events for inspection during development and testing.
 */
export class MemoryAuditAdapter implements AuditAdapter {
  readonly events: AuditEvent[] = [];

  async recordLogin(identityId: string, metadata?: LoginAuditMetadata): Promise<void> {
    this.events.push(
      AuditEvent.create({
        id: crypto.randomUUID(),
        identityId,
        type: AuditEventType.LOGIN,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        deviceName: metadata?.deviceName ?? metadata?.device,
        browser: metadata?.browser,
        operatingSystem: metadata?.operatingSystem,
        country: metadata?.country,
      }),
    );
  }

  async recordLogout(identityId: string, sessionId?: string): Promise<void> {
    this.events.push(
      AuditEvent.create({
        id: crypto.randomUUID(),
        identityId,
        type: AuditEventType.LOGOUT,
        metadata: sessionId ? { sessionId } : undefined,
      }),
    );
  }

  async recordFailedLogin(
    email: string,
    reason: string,
    metadata?: LoginAuditMetadata,
  ): Promise<void> {
    this.events.push(
      AuditEvent.create({
        id: crypto.randomUUID(),
        type: AuditEventType.FAILED_LOGIN,
        failureReason: reason,
        metadata: { email, ...metadata },
      }),
    );
  }

  async recordSecurityEvent(
    identityId: string | null,
    type: SecurityEventType,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    this.events.push(
      AuditEvent.create({
        id: crypto.randomUUID(),
        identityId,
        type: toAuditEventType(type),
        metadata,
      }),
    );
  }

  clear(): void {
    this.events.length = 0;
  }
}
