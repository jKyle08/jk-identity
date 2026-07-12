import { LoginUseCase } from '../../src/application/use-cases/login.use-case';
import { RegisterUseCase } from '../../src/application/use-cases/register.use-case';
import { EmailVerificationService } from '../../src/application/services/email-verification.service';
import { SessionService } from '../../src/application/services/session.service';
import { createTestApp, TEST_PASSWORD } from '../helpers/test-module.factory';

describe('Session revocation flow', () => {
  it('revokes a specific session', async () => {
    const { app, adapters, module } = await createTestApp();
    const registerUseCase = module.get(RegisterUseCase);
    const emailVerificationService = module.get(EmailVerificationService);
    const loginUseCase = module.get(LoginUseCase);
    const sessionService = module.get(SessionService);

    const identity = await registerUseCase.execute({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: TEST_PASSWORD,
    });

    const verifyToken = adapters.emailAdapter.getLastVerificationToken('jane@example.com')!;
    await emailVerificationService.verifyEmail(verifyToken);

    const login1 = await loginUseCase.execute({
      email: 'jane@example.com',
      password: TEST_PASSWORD,
    });
    await loginUseCase.execute({
      email: 'jane@example.com',
      password: TEST_PASSWORD,
    });

    await sessionService.revokeSession(identity.id, login1.session.id);

    const sessions = await sessionService.getSessions(identity.id);
    const revoked = sessions.find((s) => s.id === login1.session.id);
    const active = sessions.filter((s) => s.isActive());

    expect(revoked?.isRevoked()).toBe(true);
    expect(active.length).toBe(1);

    await app.close();
  });
});
