export class PhoneNumber {
  private constructor(private readonly value: string) {}

  static create(phone: string): PhoneNumber {
    const normalized = phone.replace(/[\s\-().]/g, '');
    if (!PhoneNumber.isValid(normalized)) {
      throw new Error('Invalid phone number');
    }
    return new PhoneNumber(normalized);
  }

  static isValid(phone: string): boolean {
    return /^\+?[1-9]\d{6,14}$/.test(phone);
  }

  toString(): string {
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}
