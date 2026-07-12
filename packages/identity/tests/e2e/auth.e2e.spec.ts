import request from 'supertest';
import { createTestApp, TEST_PASSWORD } from '../helpers/test-module.factory';

describe('Auth API (e2e)', () => {
  it('registers, verifies, logs in, refreshes, and logs out', async () => {
    const { app, adapters } = await createTestApp();

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: TEST_PASSWORD,
      })
      .expect(201);

    expect(registerRes.body.identity.primaryEmail).toBe('jane@example.com');

    const verifyToken = adapters.emailAdapter.getLastVerificationToken('jane@example.com');
    await request(app.getHttpServer())
      .post('/auth/verify-email')
      .send({ token: verifyToken })
      .expect(200);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'jane@example.com', password: TEST_PASSWORD })
      .expect(200);

    expect(loginRes.body.tokens.accessToken).toBeTruthy();
    expect(loginRes.body.tokens.refreshToken).toBeTruthy();

    const refreshRes = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: loginRes.body.tokens.refreshToken })
      .expect(200);

    expect(refreshRes.body.accessToken).toBeTruthy();

    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${refreshRes.body.accessToken}`)
      .expect(204);

    await app.close();
  });

  it('returns validation error for weak password', async () => {
    const { app } = await createTestApp();

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'weak',
      })
      .expect(400);

    expect(res.body).toBeDefined();
    await app.close();
  });

  it('returns 401 for invalid login credentials', async () => {
    const { app } = await createTestApp();

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'missing@example.com', password: TEST_PASSWORD })
      .expect(401);

    await app.close();
  });

  it('handles forgot and reset password', async () => {
    const { app, adapters } = await createTestApp();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'reset@example.com',
        password: TEST_PASSWORD,
      })
      .expect(201);

    const verifyToken = adapters.emailAdapter.getLastVerificationToken('reset@example.com');
    await request(app.getHttpServer())
      .post('/auth/verify-email')
      .send({ token: verifyToken })
      .expect(200);

    await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'reset@example.com' })
      .expect(200);

    const resetToken = adapters.emailAdapter.getLastPasswordResetToken('reset@example.com');
    await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({ token: resetToken, newPassword: 'NewSecureP@ss2' })
      .expect(200);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'reset@example.com', password: 'NewSecureP@ss2' })
      .expect(200);

    await app.close();
  });
});
