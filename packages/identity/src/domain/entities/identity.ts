import { AccountStatus } from '../value-objects/account-status';
import { Gender } from '../value-objects/gender';

export interface IdentityProps {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  suffix?: string | null;
  displayName?: string | null;
  primaryEmail: string;
  secondaryEmail?: string | null;
  mobileNumber?: string | null;
  telephoneNumber?: string | null;
  avatarUrl?: string | null;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  preferredLanguage?: string | null;
  timezone?: string | null;
  country?: string | null;
  emailVerified: boolean;
  mobileVerified: boolean;
  accountStatus: AccountStatus;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Identity {
  private constructor(private readonly props: IdentityProps) {}

  static create(
    props: Omit<IdentityProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): Identity {
    const now = new Date();
    return new Identity({
      ...props,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  static reconstitute(props: IdentityProps): Identity {
    return new Identity(props);
  }

  get id(): string {
    return this.props.id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get middleName(): string | null | undefined {
    return this.props.middleName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get suffix(): string | null | undefined {
    return this.props.suffix;
  }

  get displayName(): string | null | undefined {
    return this.props.displayName;
  }

  get primaryEmail(): string {
    return this.props.primaryEmail;
  }

  get secondaryEmail(): string | null | undefined {
    return this.props.secondaryEmail;
  }

  get mobileNumber(): string | null | undefined {
    return this.props.mobileNumber;
  }

  get telephoneNumber(): string | null | undefined {
    return this.props.telephoneNumber;
  }

  get avatarUrl(): string | null | undefined {
    return this.props.avatarUrl;
  }

  get dateOfBirth(): Date | null | undefined {
    return this.props.dateOfBirth;
  }

  get gender(): Gender | null | undefined {
    return this.props.gender;
  }

  get preferredLanguage(): string | null | undefined {
    return this.props.preferredLanguage;
  }

  get timezone(): string | null | undefined {
    return this.props.timezone;
  }

  get country(): string | null | undefined {
    return this.props.country;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get mobileVerified(): boolean {
    return this.props.mobileVerified;
  }

  get accountStatus(): AccountStatus {
    return this.props.accountStatus;
  }

  get lastLoginAt(): Date | null | undefined {
    return this.props.lastLoginAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  get fullName(): string {
    const parts = [this.props.firstName, this.props.middleName, this.props.lastName, this.props.suffix]
      .filter(Boolean)
      .join(' ');
    return parts.trim();
  }

  isActive(): boolean {
    return this.props.accountStatus === AccountStatus.ACTIVE && !this.props.deletedAt;
  }

  canAuthenticate(): boolean {
    return (
      !this.props.deletedAt &&
      this.props.accountStatus !== AccountStatus.SUSPENDED &&
      this.props.accountStatus !== AccountStatus.LOCKED &&
      this.props.accountStatus !== AccountStatus.DEACTIVATED
    );
  }

  toProps(): IdentityProps {
    return { ...this.props };
  }

  withUpdates(updates: Partial<IdentityProps>): Identity {
    return Identity.reconstitute({
      ...this.props,
      ...updates,
      updatedAt: new Date(),
    });
  }
}
