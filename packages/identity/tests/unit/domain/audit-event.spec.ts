import { AuditEvent, AuditEventType } from '../../../src';

describe('AuditEvent', () => {
  it('creates a login audit event', () => {
    const event = AuditEvent.create({
      id: 'audit-1',
      identityId: 'identity-1',
      type: AuditEventType.LOGIN,
      ipAddress: '127.0.0.1',
    });

    expect(event.type).toBe(AuditEventType.LOGIN);
    expect(event.success).toBe(true);
    expect(event.identityId).toBe('identity-1');
  });

  it('marks failed login as unsuccessful', () => {
    const event = AuditEvent.create({
      id: 'audit-2',
      type: AuditEventType.FAILED_LOGIN,
      failureReason: 'Invalid password',
    });

    expect(event.success).toBe(false);
    expect(event.failureReason).toBe('Invalid password');
  });
});
