import { Email, Password, WeakPasswordException } from '../../../src';

describe('Email', () => {
  it('normalizes and validates email', () => {
    const email = Email.create('  User@Example.COM  ');
    expect(email.toString()).toBe('user@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => Email.create('not-an-email')).toThrow('Invalid email address');
  });
});

describe('Password', () => {
  it('accepts a strong password', () => {
    expect(() => Password.create('SecureP@ss1')).not.toThrow();
  });

  it('rejects short passwords', () => {
    expect(() => Password.create('Sh0rt!')).toThrow(WeakPasswordException);
  });

  it('rejects passwords missing character classes', () => {
    expect(() => Password.create('securepass1')).toThrow(WeakPasswordException);
  });
});
