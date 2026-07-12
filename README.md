# JK Identity

A reusable, enterprise-grade Identity & Authentication package for NestJS applications using Clean Architecture and Hexagonal Architecture (Ports & Adapters).

**Package:** `@jk/identity`

---

## Vision

Build authentication once and reuse it across every future application.

The package provides:

- Identity Management
- Authentication
- Sessions
- JWT
- OAuth
- Password Management
- Email Verification
- Password Reset
- Security
- Account Linking

The package does **not** contain business modules.

---

## Goals

- Database Agnostic
- ORM Agnostic
- Email Provider Agnostic
- Storage Agnostic
- Notification Agnostic
- Framework Friendly
- Modular
- Extensible
- Production Ready

---

## Architecture

This package follows:

- **Domain-Driven Design (DDD)** — rich domain models, value objects, and domain events
- **Clean Architecture** — strict dependency rules between layers
- **Hexagonal Architecture (Ports & Adapters)** — infrastructure is pluggable via ports
- **Dependency Injection** — NestJS module system for composition and testability

### Layers

| Layer | Responsibility |
|-------|----------------|
| **Domain** | Entities, value objects, events, and port interfaces (no framework dependencies) |
| **Application** | Use cases and application services |
| **Infrastructure** | Adapters for JWT, OAuth, hashing, and Passport strategies |
| **Presentation** | REST controllers, DTOs, guards, and decorators |

---

## Status

| | |
|---|---|
| **Current Version** | v0.1.0 (Development) |
| **Status** | 🚧 Under Active Development |

---

## Install

```bash
npm install @jk/identity
```

---

## Usage

```typescript
import { IdentityModule } from '@jk/identity';

@Module({
  imports: [
    IdentityModule.register({
      adapters: {
        identityRepository: new MyIdentityRepository(),
        sessionRepository: new MySessionRepository(),
        emailAdapter: new ResendEmailAdapter(),
        auditAdapter: new AuditAdapter(),
        storageAdapter: new SupabaseStorageAdapter(),
      },
      auth: {
        jwtSecret: process.env.JWT_SECRET!,
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
        accessTokenExpiration: '15m',
        refreshTokenExpiration: '30d',
      },
      oauth: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      },
    }),
  ],
})
export class AppModule {}
```

---

## Development

```bash
npm install
npm run build
npm run lint
```

---

## License

[MIT](LICENSE)
