import { randomBytes, randomUUID } from 'crypto';

export function generateSecureToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

export function generateId(): string {
  return randomUUID();
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function addDuration(date: Date, duration: string): Date {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(date.getTime() + value * multipliers[unit]);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
