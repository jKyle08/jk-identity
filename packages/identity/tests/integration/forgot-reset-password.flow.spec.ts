import { RegisterUseCase } from '../../src/application/use-cases/register.use-case';
import { EmailVerificationService } from '../../src/application/services/email-verification.service';
import { PasswordResetService } from '../../src/application/services/password-reset.service';
import { LoginUseCase } from '../../src/application/use-cases/login.use-case';
import { createTestApp, TEST_PASSWORD } from '../helpers/test-module.factory';

describe('Forgot Password → Reset Password flow', () => {
  it('resets password and allows login with new password', async () => {
    const { app, adapters, module } = await createTestApp();
    const registerUseCase = module.get(RegisterUseCase);
    const emailVerificationService = module.get(EmailVerificationService);
    const passwordResetService = module.get(PasswordResetService);
    const loginUseCase = module.get(LoginUseCase);

    await registerUseCase.execute({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: TEST_PASSWORD,
    });

    const verifyToken = adapters.emailAdapter.getLastVerificationToken('jane@example.com')!;
    await emailVerificationService.verifyEmail(verifyToken);

    await passwordResetService.requestPasswordReset('jane@example.com');
    const resetToken = adapters.emailAdapter.getLastPasswordResetToken('jane@example.com');
    expect(resetToken).toBeDefined();

    const newPassword = 'NewSecureP@ss2';
    await passwordResetService.resetPassword(resetToken!, newPassword);

    const login = await loginUseCase.execute({
      email: 'jane@example.com',
      password: newPassword,
    });

    expect(login.accessToken).toBeTruthy();
    await app.close();
  });
});
