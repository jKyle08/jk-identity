# Identity Playground

A minimal NestJS application that consumes `@apxon-jk/identity` exactly like an external application would — **only through public package exports**.

## Quick Start

```bash
# From repository root
npm install
npm run build
npm run playground
```

The API starts at `http://localhost:3000`. Swagger UI is at `http://localhost:3000/api`.

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port |
| `JWT_SECRET` | dev default | Access token signing secret |
| `JWT_REFRESH_SECRET` | dev default | Refresh token signing secret |
| `ACCESS_TOKEN_EXPIRATION` | `15m` | Access token TTL |
| `REFRESH_TOKEN_EXPIRATION` | `30d` | Refresh token TTL |
| `GOOGLE_CLIENT_ID` | — | Enable Google OAuth when set |
| `GOOGLE_CLIENT_SECRET` | — | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | `http://localhost:3000/auth/google/callback` | OAuth callback |
| `SEND_LOGIN_NOTIFICATION` | `false` | Send login notification emails |
| `MAX_LOGIN_ATTEMPTS` | `5` | Rate limit before lockout |
| `LOCKOUT_DURATION_MINUTES` | `15` | Lockout duration |

## API Endpoints

All endpoints are provided by `@apxon-jk/identity` controllers:

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/logout-all
POST   /auth/verify-email
POST   /auth/resend-verification
POST   /auth/forgot-password
POST   /auth/reset-password
POST   /auth/change-password
POST   /auth/refresh
GET    /auth/google
GET    /auth/google/callback
GET    /sessions/me
GET    /sessions
DELETE /sessions/:sessionId
```

## Example Flow

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Doe","email":"jane@example.com","password":"SecureP@ss1"}'

# Check memory adapter for verification token (in tests) or use resend-verification
# Verify email
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"<verification-token>"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"SecureP@ss1"}'
```

## Architecture Note

This app imports only from:

- `@apxon-jk/identity` — the identity package public API
- `@apxon-jk/identity-memory` — reference in-memory adapters

It never imports internal source files from `packages/identity/src`.
