import { Argon2PasswordHasher } from '../../../src/infrastructure/hashing/argon2-password-hasher';

describe('Argon2PasswordHasher', () => {
  const hasher = new Argon2PasswordHasher();

  it('hashes and verifies passwords', async () => {
    const hash = await hasher.hash('SecureP@ss1');
    expect(hash).toBeTruthy();
    expect(await hasher.verify(hash, 'SecureP@ss1')).toBe(true);
    expect(await hasher.verify(hash, 'WrongP@ss1')).toBe(false);
  });
});
