# @jk/identity-memory

In-memory reference adapters for [`@jk/identity`](../../packages/identity). Use these to run the package locally without PostgreSQL, Prisma, or external services.

**Not for production.**

## Usage

```ts
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

## Adapters

| Class | Port |
|-------|------|
| `MemoryIdentityRepository` | `IdentityRepository` |
| `MemorySessionRepository` | `SessionRepository` |
| `MemoryNotificationAdapter` | `EmailAdapter` |
| `MemoryAuditAdapter` | `AuditAdapter` |
| `MemoryStorageAdapter` | `StorageAdapter` (optional) |

Helper stores (composed internally):

- `MemoryCredentialRepository` — password hashes
- `MemoryIdentityProviderRepository` — OAuth / email provider links
- `MemoryVerificationRepository` — verification and password-reset tokens

## Testing

`MemoryNotificationAdapter` exposes `sentEmails` and helpers like `getLastVerificationToken()` so integration tests can complete email flows without a real mail server.
