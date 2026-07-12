# Getting Started

## Installation

```bash
npm install @jk/identity
```

Peer dependencies (install in your NestJS app):

```bash
npm install @nestjs/common @nestjs/core @nestjs/jwt @nestjs/passport passport reflect-metadata rxjs
```

For local development without a database, also install the memory adapters from this repository:

```bash
# When using the monorepo
npm install @jk/identity-memory
```

## Quick Start

1. Implement the required adapter ports (or use `createMemoryAdapters()` from `@jk/identity-memory`).
2. Register `IdentityModule` in your `AppModule`.
3. Use the built-in REST controllers or inject use cases/services directly.

```typescript
import { Module } from '@nestjs/common';
import { IdentityModule } from '@jk/identity';
import { createMemoryAdapters } from '@jk/identity-memory';

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

## Running the Playground

From the repository root:

```bash
npm install
npm run build
npm run playground
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

See [apps/playground/README.md](../apps/playground/README.md) for environment variables and example curl commands.

## Required Adapters

| Adapter | Port | Purpose |
|---------|------|---------|
| `identityRepository` | `IdentityRepository` | Identities, profiles, passwords, providers |
| `sessionRepository` | `SessionRepository` | Sessions, refresh tokens, verification/reset tokens |
| `emailAdapter` | `EmailAdapter` | Verification, password reset, login notifications |
| `auditAdapter` | `AuditAdapter` | Login/logout/security audit trail |

Optional: `storageAdapter`, `smsAdapter` (ports defined; not yet used by core flows).

## Next Steps

- [Architecture](./architecture.md)
- [Adapters](./adapters.md)
- [Events](./events.md)
- [Sessions](./sessions.md)
- [Security](./security.md)
