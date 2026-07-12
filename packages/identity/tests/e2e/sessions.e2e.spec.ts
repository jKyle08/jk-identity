import request from 'supertest';
import { createTestApp, TEST_PASSWORD } from '../helpers/test-module.factory';

async function registerAndLogin(app: Awaited<ReturnType<typeof createTestApp>>) {
  const { app: nestApp, adapters } = app;

  await request(nestApp.getHttpServer())
    .post('/auth/register')
    .send({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'sessions@example.com',
      password: TEST_PASSWORD,
    })
    .expect(201);

  const verifyToken = adapters.emailAdapter.getLastVerificationToken('sessions@example.com');
  await request(nestApp.getHttpServer())
    .post('/auth/verify-email')
    .send({ token: verifyToken })
    .expect(200);

  const loginRes = await request(nestApp.getHttpServer())
    .post('/auth/login')
    .send({ email: 'sessions@example.com', password: TEST_PASSWORD })
    .expect(200);

  return loginRes.body.tokens.accessToken as string;
}

describe('Sessions API (e2e)', () => {
  it('lists sessions and revokes a session', async () => {
    const ctx = await createTestApp();
    const accessToken = await registerAndLogin(ctx);

    const meRes = await request(ctx.app.getHttpServer())
      .get('/sessions/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(meRes.body.identity.id).toBeDefined();

    const sessionsRes = await request(ctx.app.getHttpServer())
      .get('/sessions')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(sessionsRes.body.sessions)).toBe(true);
    expect(sessionsRes.body.sessions.length).toBeGreaterThanOrEqual(1);

    const sessionId = sessionsRes.body.sessions[0].id;
    await request(ctx.app.getHttpServer())
      .delete(`/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await ctx.app.close();
  });

  it('rejects unauthenticated session requests', async () => {
    const { app } = await createTestApp();

    await request(app.getHttpServer()).get('/sessions').expect(401);

    await app.close();
  });
});
