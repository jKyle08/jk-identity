import { SecurityEventType } from '../value-objects/security-event-type';

export interface LoginAuditMetadata {
  ipAddress?: string;
  userAgent?: string;
  device?: string;
  browser?: string;
  operatingSystem?: string;
}

export interface AuditAdapter {
  recordLogin(identityId: string, metadata?: LoginAuditMetadata): Promise<void>;
  recordLogout(identityId: string, sessionId?: string): Promise<void>;
  recordFailedLogin(email: string, reason: string, metadata?: LoginAuditMetadata): Promise<void>;
  recordSecurityEvent(
    identityId: string | null,
    type: SecurityEventType,
    metadata?: Record<string, unknown>,
  ): Promise<void>;
}

export const AUDIT_ADAPTER = Symbol('AUDIT_ADAPTER');
