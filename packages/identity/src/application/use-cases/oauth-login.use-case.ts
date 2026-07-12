import { Inject, Injectable } from '@nestjs/common';
import { ProviderType } from '../../domain/value-objects/provider-type';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../domain/ports/identity.repository';
import {
  AUDIT_ADAPTER,
  AuditAdapter,
  LoginAuditMetadata,
} from '../../domain/ports/audit.adapter';
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from '../../domain/ports/event-publisher.port';
import { IdentityCreatedEvent } from '../../domain/events/identity-created.event';
import { IdentityLoggedInEvent } from '../../domain/events/identity-logged-in.event';
import { ProviderLinkedEvent } from '../../domain/events/provider-linked.event';
import { AuthProviderProfile } from '../../domain/ports/auth-provider.port';
import { ProviderAlreadyLinkedException } from '../../utils/exceptions';
import { SessionService } from '../services/session.service';

export interface OAuthLoginInput {
  profile: AuthProviderProfile;
  provider: ProviderType;
  metadata?: LoginAuditMetadata;
}

@Injectable()
export class OAuthLoginUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(AUDIT_ADAPTER)
    private readonly auditAdapter: AuditAdapter,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
    private readonly sessionService: SessionService,
  ) {}

  async execute(input: OAuthLoginInput) {
    const existingProvider = await this.identityRepository.findProviderByProviderUserId(
      input.provider,
      input.profile.providerUserId,
    );

    let identityId: string;
    let email: string;

    if (existingProvider) {
      const identity = await this.identityRepository.findById(existingProvider.identityId);
      if (!identity || !identity.canAuthenticate()) {
        throw new Error('Account not active');
      }
      identityId = identity.id;
      email = identity.primaryEmail;
    } else if (input.profile.email) {
      const existingIdentity = await this.identityRepository.findByEmail(input.profile.email);

      if (existingIdentity) {
        const linkedElsewhere = await this.identityRepository.findProviderByProviderUserId(
          input.provider,
          input.profile.providerUserId,
        );
        if (linkedElsewhere && linkedElsewhere.identityId !== existingIdentity.id) {
          throw new ProviderAlreadyLinkedException();
        }

        await this.identityRepository.linkProvider({
          identityId: existingIdentity.id,
          provider: input.provider,
          providerUserId: input.profile.providerUserId,
          email: input.profile.email,
          metadata: input.profile.metadata,
        });

        await this.eventPublisher.publish(
          new ProviderLinkedEvent(existingIdentity.id, input.provider),
        );

        identityId = existingIdentity.id;
        email = existingIdentity.primaryEmail;
      } else {
        const identity = await this.identityRepository.create({
          firstName: input.profile.firstName ?? 'User',
          lastName: input.profile.lastName ?? '',
          displayName: input.profile.displayName,
          primaryEmail: input.profile.email,
        });

        await this.identityRepository.linkProvider({
          identityId: identity.id,
          provider: input.provider,
          providerUserId: input.profile.providerUserId,
          email: input.profile.email,
          metadata: input.profile.metadata,
        });

        await this.identityRepository.verifyEmail(identity.id);

        if (input.profile.avatarUrl) {
          await this.identityRepository.update(identity.id, {
            avatarUrl: input.profile.avatarUrl,
          });
        }

        await this.eventPublisher.publish(
          new IdentityCreatedEvent(identity.id, input.profile.email),
        );
        await this.eventPublisher.publish(new ProviderLinkedEvent(identity.id, input.provider));

        identityId = identity.id;
        email = input.profile.email;
      }
    } else {
      throw new Error('OAuth profile must include an email address');
    }

    const session = await this.sessionService.createSession(identityId, email, input.metadata);

    await this.auditAdapter.recordLogin(identityId, input.metadata);
    await this.eventPublisher.publish(
      new IdentityLoggedInEvent(identityId, session.session.id, input.metadata?.ipAddress),
    );

    const identity = await this.identityRepository.findById(identityId);

    return {
      identity,
      ...session,
    };
  }
}
