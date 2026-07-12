import { AccountStatus, Identity } from '../../../src';

describe('Identity', () => {
  const baseAuth = {
    id: 'id-1',
    primaryEmail: 'user@example.com',
    accountStatus: AccountStatus.ACTIVE,
    emailVerified: true,
    mobileVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const baseProfile = {
    firstName: 'Jane',
    lastName: 'Doe',
  };

  it('creates an active identity', () => {
    const identity = Identity.create(baseAuth, baseProfile);
    expect(identity.id).toBe('id-1');
    expect(identity.primaryEmail).toBe('user@example.com');
    expect(identity.fullName).toBe('Jane Doe');
    expect(identity.isActive()).toBe(true);
  });

  it('reports canAuthenticate false when suspended', () => {
    const identity = Identity.create(
      { ...baseAuth, accountStatus: AccountStatus.SUSPENDED },
      baseProfile,
    );
    expect(identity.canAuthenticate()).toBe(false);
  });

  it('reports canAuthenticate false when deleted', () => {
    const identity = Identity.create(
      { ...baseAuth, deletedAt: new Date() },
      baseProfile,
    );
    expect(identity.canAuthenticate()).toBe(false);
  });

  it('updates auth and profile independently', () => {
    const identity = Identity.create(baseAuth, baseProfile);
    const updated = identity
      .withAuthUpdates({ emailVerified: true })
      .withProfileUpdates({ displayName: 'JD' });

    expect(updated.displayName).toBe('JD');
    expect(updated.emailVerified).toBe(true);
  });
});
