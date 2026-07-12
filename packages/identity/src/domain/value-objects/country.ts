export class Country {
  private constructor(private readonly value: string) {}

  static create(country: string): Country {
    const normalized = country.trim().toUpperCase();
    if (!Country.isValid(normalized)) {
      throw new Error('Invalid country code');
    }
    return new Country(normalized);
  }

  static createOptional(country?: string | null): Country | null {
    if (!country?.trim()) {
      return null;
    }
    return Country.create(country);
  }

  static isValid(country: string): boolean {
    return /^[A-Z]{2}$/.test(country);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Country): boolean {
    return this.value === other.value;
  }
}
