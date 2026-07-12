import { MIN_PASSWORD_LENGTH } from '../../shared/constants';
import { WeakPasswordException } from '../../shared/exceptions';

export class Password {
  private constructor(private readonly value: string) {}

  static create(password: string): Password {
    Password.validate(password);
    return new Password(password);
  }

  static validate(password: string): void {
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new WeakPasswordException(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      throw new WeakPasswordException(
        'Password must contain uppercase, lowercase, number, and special character',
      );
    }
  }

  toString(): string {
    return this.value;
  }
}
