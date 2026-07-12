# Getting Started

## Clone the repository

```bash
git clone https://github.com/jKyle08/jk-identity.git
cd jk-identity
npm install
npm run build
```

Copy `.env.example` to `.env` and set strong JWT secrets before running locally.

## Try the playground

```bash
npm run playground
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

See [apps/playground/README.md](../apps/playground/README.md) for environment variables and curl examples.

## Use in your own NestJS app

This package is **clone-first**. Install from npm only when published.

**Sibling project** (recommended):

```json
{
  "dependencies": {
    "@apxon-jk/identity": "file:../jk-identity/packages/identity",
    "@apxon-jk/identity-memory": "file:../jk-identity/examples/memory"
  }
}
```

**From GitHub:**

```json
{
  "dependencies": {
    "@apxon-jk/identity": "github:jKyle08/jk-identity#main:packages/identity",
    "@apxon-jk/identity-memory": "github:jKyle08/jk-identity#main:examples/memory"
  }
}
```

Full options (`npm link`, tarball, peer deps): [Integration Guide](./integration.md).

Reference external consumer: [examples/consumer-nest-app](../examples/consumer-nest-app/).

## Peer dependencies

Install in your NestJS host app:

```bash
npm install @nestjs/common @nestjs/core @nestjs/jwt @nestjs/passport passport reflect-metadata rxjs
npm install class-validator class-transformer
```

Optional Swagger support:

```bash
npm install @nestjs/swagger
```

## Quick Start

1. Add `@apxon-jk/identity` via clone/`file:`/GitHub (see [integration.md](./integration.md)).
2. Implement required adapter ports (or use `createMemoryAdapters()` from `@apxon-jk/identity-memory` for dev).
3. Register `IdentityModule` in your `AppModule`.
4. Use the built-in REST controllers or inject use cases/services directly.

```typescript
import { Module } from '@nestjs/common';
import { IdentityModule } from '@apxon-jk/identity';
import { createMemoryAdapters } from '@apxon-jk/identity-memory';

const adapters = createMemoryAdapters();

@Module({
  imports: [
    IdentityModule.register({
      adapters,
      auth: {
        jwtSecret: process.env.JWT_SECRET!,
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
        accessTokenExpiration: '15m',
        refreshTokenExpiration: '30d',
      },
    }),
  ],
})
export class AppModule {}
```

## Required Adapters

| Adapter | Port | Purpose |
|---------|------|---------|
| `identityRepository` | `IdentityRepository` | Identities, profiles, passwords, providers |
| `sessionRepository` | `SessionRepository` | Sessions, refresh tokens, verification/reset tokens |
| `emailAdapter` | `EmailAdapter` | Verification, password reset, login notifications |
| `auditAdapter` | `AuditAdapter` | Login/logout/security audit trail |

Optional: `storageAdapter`, `smsAdapter` (ports defined; not yet used by core flows).

## Next Steps

- [Integration](./integration.md) — clone, `file:`, GitHub, link, tarball
- [Architecture](./architecture.md)
- [Adapters](./adapters.md)
- [Events](./events.md)
- [Sessions](./sessions.md)
- [Security](./security.md)
