import { IdentitySession } from '../../../src';

describe('IdentitySession', () => {
  const future = new Date(Date.now() + 60_000);
  const past = new Date(Date.now() - 60_000);

  const baseProps = {
    id: 'session-1',
    identityId: 'identity-1',
    refreshTokenId: 'rt-1',
    expiresAt: future,
  };

  it('is active when not revoked and not expired', () => {
    const session = IdentitySession.create(baseProps);
    expect(session.isActive()).toBe(true);
    expect(session.isRevoked()).toBe(false);
    expect(session.isExpired()).toBe(false);
  });

  it('is not active when revoked', () => {
    const session = IdentitySession.create(baseProps).revoke();
    expect(session.isActive()).toBe(false);
    expect(session.isRevoked()).toBe(true);
  });

  it('is expired when past expiresAt', () => {
    const session = IdentitySession.create({ ...baseProps, expiresAt: past });
    expect(session.isExpired()).toBe(true);
    expect(session.isActive()).toBe(false);
  });
});
