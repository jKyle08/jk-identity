import { Gender } from '../value-objects/gender';
import { DisplayName } from '../value-objects/display-name';
import { PhoneNumber } from '../value-objects/phone-number';
import { Country } from '../value-objects/country';
import { Timezone } from '../value-objects/timezone';
import { FullName } from '../value-objects/full-name';

export interface IdentityProfileProps {
  identityId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  suffix?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  mobileNumber?: string | null;
  telephoneNumber?: string | null;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  preferredLanguage?: string | null;
  timezone?: string | null;
  country?: string | null;
}

export class IdentityProfile {
  private constructor(private readonly props: IdentityProfileProps) {}

  static create(
    props: IdentityProfileProps,
  ): IdentityProfile {
    FullName.create(props.firstName, props.lastName, props.middleName, props.suffix);
    DisplayName.createOptional(props.displayName);
    if (props.mobileNumber) {
      PhoneNumber.create(props.mobileNumber);
    }
    if (props.telephoneNumber) {
      PhoneNumber.create(props.telephoneNumber);
    }
    Country.createOptional(props.country);
    Timezone.createOptional(props.timezone);

    return new IdentityProfile(props);
  }

  static reconstitute(props: IdentityProfileProps): IdentityProfile {
    return new IdentityProfile(props);
  }

  get identityId(): string {
    return this.props.identityId;
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

  get avatarUrl(): string | null | undefined {
    return this.props.avatarUrl;
  }

  get mobileNumber(): string | null | undefined {
    return this.props.mobileNumber;
  }

  get telephoneNumber(): string | null | undefined {
    return this.props.telephoneNumber;
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

  get fullName(): string {
    return FullName.fromParts({
      firstName: this.props.firstName,
      middleName: this.props.middleName,
      lastName: this.props.lastName,
      suffix: this.props.suffix,
    }).toString();
  }

  toProps(): IdentityProfileProps {
    return { ...this.props };
  }

  withUpdates(updates: Partial<IdentityProfileProps>): IdentityProfile {
    return IdentityProfile.reconstitute({
      ...this.props,
      ...updates,
    });
  }
}
