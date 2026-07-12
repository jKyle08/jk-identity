import { Inject, Injectable } from '@nestjs/common';
import { ProviderType } from '../../domain/value-objects/provider-type';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../domain/ports/identity.repository';
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from '../../domain/ports/event-publisher.port';
import { IdentityCreatedEvent } from '../../domain/events/identity-created.event';
import { Email } from '../../domain/value-objects/email';
import { Password } from '../../domain/value-objects/password';
import { EmailAlreadyExistsException } from '../../shared/exceptions';
import { PasswordService } from '../services/password.service';
import { EmailVerificationService } from '../services/email-verification.service';

export interface RegisterInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  displayName?: string;
  email: string;
  password: string;
  preferredLanguage?: string;
  timezone?: string;
  country?: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
    private readonly passwordService: PasswordService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async execute(input: RegisterInput) {
    const email = Email.create(input.email).toString();
    const existing = await this.identityRepository.findByEmail(email);

    if (existing) {
      throw new EmailAlreadyExistsException();
    }

    Password.create(input.password);
    const passwordHash = await this.passwordService.hash(input.password);

    const identity = await this.identityRepository.create({
      firstName: input.firstName,
      middleName: input.middleName,
      lastName: input.lastName,
      suffix: input.suffix,
      displayName: input.displayName,
      primaryEmail: email,
      preferredLanguage: input.preferredLanguage,
      timezone: input.timezone,
      country: input.country,
    });

    await this.identityRepository.updatePasswordHash(identity.id, passwordHash);
    await this.identityRepository.linkProvider({
      identityId: identity.id,
      provider: ProviderType.EMAIL,
      providerUserId: email,
      email,
    });

    await this.eventPublisher.publish(new IdentityCreatedEvent(identity.id, email));
    await this.emailVerificationService.sendVerificationEmail(identity.id);

    return identity;
  }
}
