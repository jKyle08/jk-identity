import { RegisterUseCase } from '../../src/application/use-cases/register.use-case';
import { EmailVerificationService } from '../../src/application/services/email-verification.service';
import { createTestApp, TEST_PASSWORD } from '../helpers/test-module.factory';
import { AccountStatus } from '../../src';

describe('Verify Email flow', () => {
  it('verifies email and activates account', async () => {
    const { app, adapters, module } = await createTestApp();
    const registerUseCase = module.get(RegisterUseCase);
    const emailVerificationService = module.get(EmailVerificationService);

    const identity = await registerUseCase.execute({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: TEST_PASSWORD,
    });

    expect(identity.emailVerified).toBe(false);
    expect(identity.accountStatus).toBe(AccountStatus.PENDING_VERIFICATION);

    const token = adapters.emailAdapter.getLastVerificationToken('jane@example.com')!;
    await emailVerificationService.verifyEmail(token);

    const updated = await adapters.identityRepository.findById(identity.id);
    expect(updated?.emailVerified).toBe(true);
    expect(updated?.accountStatus).toBe(AccountStatus.ACTIVE);

    await app.close();
  });
});
