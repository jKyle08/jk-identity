import { MIN_PASSWORD_LENGTH } from '../constants';
import { WeakPasswordException } from './exceptions';

export function validatePasswordStrength(password: string): void {
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

export interface ParsedUserAgent {
  device?: string;
  browser?: string;
  operatingSystem?: string;
}

export function parseUserAgent(userAgent?: string): ParsedUserAgent {
  if (!userAgent) {
    return {};
  }

  const browser = /Chrome/i.test(userAgent)
    ? 'Chrome'
    : /Firefox/i.test(userAgent)
      ? 'Firefox'
      : /Safari/i.test(userAgent)
        ? 'Safari'
        : /Edge/i.test(userAgent)
          ? 'Edge'
          : 'Unknown';

  const operatingSystem = /Windows/i.test(userAgent)
    ? 'Windows'
    : /Mac OS/i.test(userAgent)
      ? 'macOS'
      : /Android/i.test(userAgent)
        ? 'Android'
        : /iPhone|iPad/i.test(userAgent)
          ? 'iOS'
          : /Linux/i.test(userAgent)
            ? 'Linux'
            : 'Unknown';

  const device = /Mobile|Android|iPhone/i.test(userAgent) ? 'Mobile' : 'Desktop';

  return { device, browser, operatingSystem };
}
