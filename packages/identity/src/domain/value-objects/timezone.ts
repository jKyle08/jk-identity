export class Timezone {
  private constructor(private readonly value: string) {}

  static create(timezone: string): Timezone {
    const trimmed = timezone.trim();
    if (!Timezone.isValid(trimmed)) {
      throw new Error('Invalid timezone');
    }
    return new Timezone(trimmed);
  }

  static createOptional(timezone?: string | null): Timezone | null {
    if (!timezone?.trim()) {
      return null;
    }
    return Timezone.create(timezone);
  }

  static isValid(timezone: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return true;
    } catch {
      return false;
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: Timezone): boolean {
    return this.value === other.value;
  }
}
