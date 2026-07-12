import { LoginUseCase } from '../../src/application/use-cases/login.use-case';
import { LogoutUseCase } from '../../src/application/use-cases/logout.use-case';
import { RegisterUseCase } from '../../src/application/use-cases/register.use-case';
import { EmailVerificationService } from '../../src/application/services/email-verification.service';
import { SessionService } from '../../src/application/services/session.service';
import { createTestApp, TEST_PASSWORD } from '../helpers/test-module.factory';

async function loginUser(module: Awaited<ReturnType<typeof createTestApp>>['module'], adapters: Awaited<ReturnType<typeof createTestApp>>['adapters']) {
  const registerUseCase = module.get(RegisterUseCase);
  const emailVerificationService = module.get(EmailVerificationService);
  const loginUseCase = module.get(LoginUseCase);

  const identity = await registerUseCase.execute({
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

  return { identity, login };
}

describe('Logout flows', () => {
  it('logs out a single session', async () => {
    const { app, adapters, module } = await createTestApp();
    const logoutUseCase = module.get(LogoutUseCase);
    const sessionService = module.get(SessionService);

    const { identity, login } = await loginUser(module, adapters);
    await logoutUseCase.execute({
      identityId: identity.id,
      sessionId: login.session.id,
    });

    const sessions = await sessionService.getSessions(identity.id);
    expect(sessions.every((s) => s.isRevoked())).toBe(true);

    await app.close();
  });

  it('logs out all sessions', async () => {
    const { app, adapters, module } = await createTestApp();
    const logoutUseCase = module.get(LogoutUseCase);
    const loginUseCase = module.get(LoginUseCase);
    const sessionService = module.get(SessionService);

    const { identity, login } = await loginUser(module, adapters);
    await loginUseCase.execute({
      email: 'jane@example.com',
      password: TEST_PASSWORD,
    });

    await logoutUseCase.execute({ identityId: identity.id, allSessions: true });

    const sessions = await sessionService.getSessions(identity.id);
    expect(sessions.length).toBeGreaterThanOrEqual(2);
    expect(sessions.every((s) => s.isRevoked())).toBe(true);
    expect(login.session.id).toBeDefined();

    await app.close();
  });
});
