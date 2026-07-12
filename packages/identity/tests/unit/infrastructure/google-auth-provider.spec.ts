import { GoogleAuthProvider } from '../../../src/infrastructure/oauth/google-auth-provider';

describe('GoogleAuthProvider', () => {
  const provider = new GoogleAuthProvider();

  it('maps Google token payload to auth profile', async () => {
    const profile = await provider.authenticate({
      sub: 'google-user-123',
      email: 'user@gmail.com',
      given_name: 'Jane',
      family_name: 'Doe',
      name: 'Jane Doe',
      picture: 'https://example.com/avatar.jpg',
    });

    expect(profile.providerUserId).toBe('google-user-123');
    expect(profile.email).toBe('user@gmail.com');
    expect(profile.firstName).toBe('Jane');
    expect(profile.avatarUrl).toBe('https://example.com/avatar.jpg');
  });
});
