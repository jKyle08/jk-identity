import { EmailVerificationService } from '../../src/application/services/email-verification.service';
import { LoginUseCase } from '../../src/application/use-cases/login.use-case';
import { RegisterUseCase } from '../../src/application/use-cases/register.use-case';
import {
  createTestApp,
  TEST_PASSWORD,
} from '../helpers/test-module.factory';

describe('Register → Login flow', () => {
  it('registers, verifies email, and logs in', async () => {
    const { app, adapters, module } = await createTestApp();
    const registerUseCase = module.get(RegisterUseCase);
    const emailVerificationService = module.get(EmailVerificationService);
    const loginUseCase = module.get(LoginUseCase);

    const identity = await registerUseCase.execute({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: TEST_PASSWORD,
    });

    const token = adapters.emailAdapter.getLastVerificationToken('jane@example.com');
    expect(token).toBeDefined();
    await emailVerificationService.verifyEmail(token!);

    const loginResult = await loginUseCase.execute({
      email: 'jane@example.com',
      password: TEST_PASSWORD,
    });

    expect(loginResult.accessToken).toBeTruthy();
    expect(loginResult.refreshToken).toBeTruthy();
    expect(loginResult.identity.id).toBe(identity.id);

    await app.close();
  });
});
