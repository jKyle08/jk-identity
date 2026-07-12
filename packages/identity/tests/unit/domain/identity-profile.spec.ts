import { IdentityProfile } from '../../../src';

describe('IdentityProfile', () => {
  it('creates a profile with full name', () => {
    const profile = IdentityProfile.create({
      identityId: 'id-1',
      firstName: 'Jane',
      middleName: 'M',
      lastName: 'Doe',
      suffix: 'Jr',
    });

    expect(profile.fullName).toBe('Jane M Doe Jr');
    expect(profile.identityId).toBe('id-1');
  });

  it('applies profile updates', () => {
    const profile = IdentityProfile.create({
      identityId: 'id-1',
      firstName: 'Jane',
      lastName: 'Doe',
    });

    const updated = profile.withUpdates({ country: 'US' });
    expect(updated.country).toBe('US');
    expect(updated.firstName).toBe('Jane');
  });
});
