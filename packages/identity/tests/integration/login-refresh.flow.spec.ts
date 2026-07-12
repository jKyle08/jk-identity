import { LoginUseCase } from '../../src/application/use-cases/login.use-case';
import { RegisterUseCase } from '../../src/application/use-cases/register.use-case';
import { EmailVerificationService } from '../../src/application/services/email-verification.service';
import { SessionService } from '../../src/application/services/session.service';
import { createTestApp, TEST_PASSWORD } from '../helpers/test-module.factory';

describe('Login → Refresh flow', () => {
  it('refreshes tokens after login', async () => {
    const { app, adapters, module } = await createTestApp();
    const registerUseCase = module.get(RegisterUseCase);
    const emailVerificationService = module.get(EmailVerificationService);
    const loginUseCase = module.get(LoginUseCase);
    const sessionService = module.get(SessionService);

    await registerUseCase.execute({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: TEST_PASSWORD,
    });

    const token = adapters.emailAdapter.getLastVerificationToken('jane@example.com')!;
    await emailVerificationService.verifyEmail(token);

    const login = await loginUseCase.execute({
      email: 'jane@example.com',
      password: TEST_PASSWORD,
    });

    const refreshed = await sessionService.refreshSession(login.refreshToken);
    expect(refreshed.accessToken).toBeTruthy();
    expect(refreshed.refreshToken).not.toBe(login.refreshToken);

    await app.close();
  });
});
