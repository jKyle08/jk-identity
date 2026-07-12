export class DisplayName {
  private constructor(private readonly value: string) {}

  static create(displayName: string): DisplayName {
    const trimmed = displayName.trim();
    if (!trimmed) {
      throw new Error('Display name cannot be empty');
    }
    if (trimmed.length > 100) {
      throw new Error('Display name must be 100 characters or fewer');
    }
    return new DisplayName(trimmed);
  }

  static createOptional(displayName?: string | null): DisplayName | null {
    if (!displayName?.trim()) {
      return null;
    }
    return DisplayName.create(displayName);
  }

  toString(): string {
    return this.value;
  }

  equals(other: DisplayName): boolean {
    return this.value === other.value;
  }
}
