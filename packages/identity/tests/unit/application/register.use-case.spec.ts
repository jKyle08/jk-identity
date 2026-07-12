import { Test } from '@nestjs/testing';
import { createMemoryAdapters } from '@apxon-jk/identity-memory';
import { RegisterUseCase } from '../../../src/application/use-cases/register.use-case';
import { PasswordService } from '../../../src/application/services/password.service';
import { EmailVerificationService } from '../../../src/application/services/email-verification.service';
import { Argon2PasswordHasher } from '../../../src/infrastructure/hashing/argon2-password-hasher';
import {
  IDENTITY_REPOSITORY,
  EVENT_PUBLISHER,
  PASSWORD_HASHER,
} from '../../../src/domain/ports';
import { InMemoryEventPublisher } from '../../../src/infrastructure/events/in-memory-event-bus';
import { ProviderType } from '../../../src';
import { TEST_PASSWORD } from '../../helpers/test-module.factory';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  const adapters = createMemoryAdapters();

  beforeEach(async () => {
    adapters.identityRepository.clear();
    adapters.sessionRepository.clear();
    adapters.emailAdapter.clear();

    const module = await Test.createTestingModule({
      providers: [
        RegisterUseCase,
        PasswordService,
        { provide: IDENTITY_REPOSITORY, useValue: adapters.identityRepository },
        { provide: EVENT_PUBLISHER, useClass: InMemoryEventPublisher },
        { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasher },
        {
          provide: EmailVerificationService,
          useValue: {
            sendVerificationEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    registerUseCase = module.get(RegisterUseCase);
  });

  it('registers a new identity with email provider', async () => {
    const identity = await registerUseCase.execute({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: TEST_PASSWORD,
    });

    expect(identity.primaryEmail).toBe('jane@example.com');
    expect(identity.emailVerified).toBe(false);

    const provider = await adapters.identityRepository.findProviderByType(
      identity.id,
      ProviderType.EMAIL,
    );
    expect(provider).not.toBeNull();

    const credentials = await adapters.identityRepository.findPasswordHashByEmail(
      'jane@example.com',
    );
    expect(credentials?.identityId).toBe(identity.id);
  });
});
