import { AccountStatus } from '../value-objects/account-status';
import { Email } from '../value-objects/email';
import { IdentityProfile, IdentityProfileProps } from './identity-profile';

export interface IdentityAuthProps {
  id: string;
  primaryEmail: string;
  secondaryEmail?: string | null;
  accountStatus: AccountStatus;
  emailVerified: boolean;
  mobileVerified: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

/** Combined props for repository adapters and backward compatibility. */
export interface IdentityProps extends IdentityAuthProps, IdentityProfileProps {}

/**
 * Identity aggregate root — authentication state with a one-to-one profile.
 * Owns providers, credentials, and sessions at the persistence boundary.
 */
export class Identity {
  private constructor(
    private readonly authProps: IdentityAuthProps,
    private readonly profileEntity: IdentityProfile,
  ) {}

  static create(
    auth: Omit<IdentityAuthProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
    profile: Omit<IdentityProfileProps, 'identityId'>,
  ): Identity {
    const now = new Date();
    Email.create(auth.primaryEmail);

    const authProps: IdentityAuthProps = {
      ...auth,
      createdAt: auth.createdAt ?? now,
      updatedAt: auth.updatedAt ?? now,
    };

    const profileEntity = IdentityProfile.create({
      identityId: auth.id,
      ...profile,
    });

    return new Identity(authProps, profileEntity);
  }

  static reconstitute(auth: IdentityAuthProps, profile: IdentityProfileProps): Identity {
    return new Identity(auth, IdentityProfile.reconstitute(profile));
  }

  static fromCombinedProps(props: IdentityProps): Identity {
    const {
      id,
      primaryEmail,
      secondaryEmail,
      accountStatus,
      emailVerified,
      mobileVerified,
      lastLoginAt,
      createdAt,
      updatedAt,
      deletedAt,
      identityId: _identityId,
      ...profileRest
    } = props;

    return Identity.reconstitute(
      {
        id,
        primaryEmail,
        secondaryEmail,
        accountStatus,
        emailVerified,
        mobileVerified,
        lastLoginAt,
        createdAt,
        updatedAt,
        deletedAt,
      },
      {
        identityId: id,
        ...profileRest,
      },
    );
  }

  get id(): string {
    return this.authProps.id;
  }

  get primaryEmail(): string {
    return this.authProps.primaryEmail;
  }

  get secondaryEmail(): string | null | undefined {
    return this.authProps.secondaryEmail;
  }

  get accountStatus(): AccountStatus {
    return this.authProps.accountStatus;
  }

  /** Alias for accountStatus — matches domain terminology. */
  get status(): AccountStatus {
    return this.authProps.accountStatus;
  }

  get emailVerified(): boolean {
    return this.authProps.emailVerified;
  }

  get mobileVerified(): boolean {
    return this.authProps.mobileVerified;
  }

  get lastLoginAt(): Date | null | undefined {
    return this.authProps.lastLoginAt;
  }

  get createdAt(): Date {
    return this.authProps.createdAt;
  }

  get updatedAt(): Date {
    return this.authProps.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.authProps.deletedAt;
  }

  get profile(): IdentityProfile {
    return this.profileEntity;
  }

  get firstName(): string {
    return this.profileEntity.firstName;
  }

  get middleName(): string | null | undefined {
    return this.profileEntity.middleName;
  }

  get lastName(): string {
    return this.profileEntity.lastName;
  }

  get suffix(): string | null | undefined {
    return this.profileEntity.suffix;
  }

  get displayName(): string | null | undefined {
    return this.profileEntity.displayName;
  }

  get avatarUrl(): string | null | undefined {
    return this.profileEntity.avatarUrl;
  }

  get mobileNumber(): string | null | undefined {
    return this.profileEntity.mobileNumber;
  }

  get telephoneNumber(): string | null | undefined {
    return this.profileEntity.telephoneNumber;
  }

  get dateOfBirth(): Date | null | undefined {
    return this.profileEntity.dateOfBirth;
  }

  get gender() {
    return this.profileEntity.gender;
  }

  get preferredLanguage(): string | null | undefined {
    return this.profileEntity.preferredLanguage;
  }

  get timezone(): string | null | undefined {
    return this.profileEntity.timezone;
  }

  get country(): string | null | undefined {
    return this.profileEntity.country;
  }

  get fullName(): string {
    return this.profileEntity.fullName;
  }

  isActive(): boolean {
    return this.authProps.accountStatus === AccountStatus.ACTIVE && !this.authProps.deletedAt;
  }

  canAuthenticate(): boolean {
    return (
      !this.authProps.deletedAt &&
      this.authProps.accountStatus !== AccountStatus.SUSPENDED &&
      this.authProps.accountStatus !== AccountStatus.LOCKED &&
      this.authProps.accountStatus !== AccountStatus.DEACTIVATED
    );
  }

  toAuthProps(): IdentityAuthProps {
    return { ...this.authProps };
  }

  toProfileProps(): IdentityProfileProps {
    return this.profileEntity.toProps();
  }

  toProps(): IdentityProps {
    return {
      ...this.authProps,
      ...this.profileEntity.toProps(),
    };
  }

  withAuthUpdates(updates: Partial<IdentityAuthProps>): Identity {
    return Identity.reconstitute(
      {
        ...this.authProps,
        ...updates,
        updatedAt: new Date(),
      },
      this.profileEntity.toProps(),
    );
  }

  withProfileUpdates(updates: Partial<IdentityProfileProps>): Identity {
    return Identity.reconstitute(
      this.authProps,
      this.profileEntity.withUpdates(updates).toProps(),
    );
  }

  /** @deprecated Use withAuthUpdates or withProfileUpdates instead. */
  withUpdates(updates: Partial<IdentityProps>): Identity {
    const {
      id: _id,
      identityId: _identityId,
      firstName,
      middleName,
      lastName,
      suffix,
      displayName,
      avatarUrl,
      mobileNumber,
      telephoneNumber,
      dateOfBirth,
      gender,
      preferredLanguage,
      timezone,
      country,
      ...authUpdates
    } = updates;

    const profileUpdates: Partial<IdentityProfileProps> = {};
    if (firstName !== undefined) profileUpdates.firstName = firstName;
    if (middleName !== undefined) profileUpdates.middleName = middleName;
    if (lastName !== undefined) profileUpdates.lastName = lastName;
    if (suffix !== undefined) profileUpdates.suffix = suffix;
    if (displayName !== undefined) profileUpdates.displayName = displayName;
    if (avatarUrl !== undefined) profileUpdates.avatarUrl = avatarUrl;
    if (mobileNumber !== undefined) profileUpdates.mobileNumber = mobileNumber;
    if (telephoneNumber !== undefined) profileUpdates.telephoneNumber = telephoneNumber;
    if (dateOfBirth !== undefined) profileUpdates.dateOfBirth = dateOfBirth;
    if (gender !== undefined) profileUpdates.gender = gender;
    if (preferredLanguage !== undefined) profileUpdates.preferredLanguage = preferredLanguage;
    if (timezone !== undefined) profileUpdates.timezone = timezone;
    if (country !== undefined) profileUpdates.country = country;

    let result = this.withAuthUpdates(authUpdates);
    if (Object.keys(profileUpdates).length > 0) {
      result = result.withProfileUpdates(profileUpdates);
    }
    return result;
  }
}
