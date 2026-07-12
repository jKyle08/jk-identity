export class FullName {
  private constructor(
    private readonly firstName: string,
    private readonly middleName: string | null,
    private readonly lastName: string,
    private readonly suffix: string | null,
  ) {}

  static create(
    firstName: string,
    lastName: string,
    middleName?: string | null,
    suffix?: string | null,
  ): FullName {
    const trimmedFirst = firstName?.trim();
    const trimmedLast = lastName?.trim();

    if (!trimmedFirst) {
      throw new Error('First name is required');
    }
    if (!trimmedLast) {
      throw new Error('Last name is required');
    }

    return new FullName(
      trimmedFirst,
      middleName?.trim() || null,
      trimmedLast,
      suffix?.trim() || null,
    );
  }

  static fromParts(parts: {
    firstName: string;
    middleName?: string | null;
    lastName: string;
    suffix?: string | null;
  }): FullName {
    return FullName.create(parts.firstName, parts.lastName, parts.middleName, parts.suffix);
  }

  getFirstName(): string {
    return this.firstName;
  }

  getMiddleName(): string | null {
    return this.middleName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getSuffix(): string | null {
    return this.suffix;
  }

  toString(): string {
    return [this.firstName, this.middleName, this.lastName, this.suffix].filter(Boolean).join(' ');
  }

  equals(other: FullName): boolean {
    return (
      this.firstName === other.firstName &&
      this.middleName === other.middleName &&
      this.lastName === other.lastName &&
      this.suffix === other.suffix
    );
  }
}
