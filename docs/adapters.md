# Adapters

Consumers implement domain **ports** as adapters. The package never imports your database or email provider directly.

## IdentityRepository

Handles identities, profiles, password hashes, and OAuth provider links.

```typescript
import {
  Identity,
  IdentityProvider,
  IdentityRepository,
  CreateIdentityInput,
  ProviderType,
} from '@jk/identity';

export class PrismaIdentityRepository implements IdentityRepository {
  async findById(id: string): Promise<Identity | null> {
    const row = await prisma.identity.findUnique({ where: { id }, include: { profile: true } });
    return row ? Identity.fromCombinedProps(mapRow(row)) : null;
  }

  async findByEmail(email: string): Promise<Identity | null> {
    const row = await prisma.identity.findUnique({
      where: { primaryEmail: email.toLowerCase() },
      include: { profile: true },
    });
    return row ? Identity.fromCombinedProps(mapRow(row)) : null;
  }

  async create(input: CreateIdentityInput): Promise<Identity> {
    // Insert identity + profile rows, return Identity entity
    throw new Error('Implement with your ORM');
  }

  async updatePasswordHash(identityId: string, passwordHash: string): Promise<void> {
    await prisma.credential.update({
      where: { identityId },
      data: { passwordHash },
    });
  }

  async findPasswordHashByEmail(
    email: string,
  ): Promise<{ identityId: string; passwordHash: string } | null> {
    // Join identity + credential tables
    throw new Error('Implement with your ORM');
  }

  async linkProvider(input: LinkProviderInput): Promise<IdentityProvider> {
    // Insert provider link row
    throw new Error('Implement with your ORM');
  }

  // ... verifyEmail, verifyMobile, update, findProviderByType, etc.
}
```

### Reference: Memory Adapter

Use `@jk/identity-memory` for development and tests:

```typescript
import { createMemoryAdapters } from '@jk/identity-memory';

const adapters = createMemoryAdapters();
// adapters.identityRepository implements IdentityRepository
```

## SessionRepository

Handles sessions, refresh token rotation, and verification/password-reset tokens.

Key methods:

- `createSession` / `refreshSession` / `revokeSession` / `revokeAllSessions`
- `createVerificationToken` / `findVerificationTokenByHash`
- `createPasswordResetToken` / `findPasswordResetTokenByHash`

```typescript
import { SessionRepository, CreateSessionInput } from '@jk/identity';

export class PrismaSessionRepository implements SessionRepository {
  async createSession(input: CreateSessionInput) {
    const sessionId = crypto.randomUUID();
    const refreshTokenId = crypto.randomUUID();
    // Persist session + refresh token in a transaction
    throw new Error('Implement with your ORM');
  }

  async refreshSession(sessionId, oldRefreshTokenId, newHash, newExpiresAt) {
    // Revoke old refresh token, create new one, update session — atomically
    throw new Error('Implement with your ORM');
  }
}
```

## EmailAdapter (NotificationAdapter)

Sends transactional emails. The package calls:

- `sendVerificationEmail(to, token, identityName?)`
- `sendPasswordResetEmail(to, token, identityName?)`
- `sendLoginNotification(to, metadata)` — optional, when `sendLoginNotification: true`

```typescript
import { EmailAdapter } from '@jk/identity';

export class SendGridEmailAdapter implements EmailAdapter {
  async sendVerificationEmail(to: string, token: string, identityName?: string) {
    await sendGrid.send({
      to,
      subject: 'Verify your email',
      html: `<a href="${APP_URL}/verify?token=${token}">Verify</a>`,
    });
  }

  // ... other methods
}
```

## AuditAdapter

Records security-relevant events:

```typescript
import { AuditAdapter, SecurityEventType } from '@jk/identity';

export class PostgresAuditAdapter implements AuditAdapter {
  async recordLogin(identityId: string, metadata?) {
    await db.insert(auditEvents).values({ identityId, type: 'login', ...metadata });
  }

  async recordFailedLogin(email: string, reason: string, metadata?) {
    await db.insert(auditEvents).values({ type: 'failed_login', failureReason: reason, metadata: { email, ...metadata } });
  }

  async recordSecurityEvent(identityId, type: SecurityEventType, metadata?) {
    // Persist security event
  }
}
```

## Wiring Adapters

```typescript
IdentityModule.register({
  adapters: {
    identityRepository: new PrismaIdentityRepository(),
    sessionRepository: new PrismaSessionRepository(),
    emailAdapter: new SendGridEmailAdapter(),
    auditAdapter: new PostgresAuditAdapter(),
    storageAdapter: new S3StorageAdapter(), // optional
  },
  auth: { /* JWT config */ },
});
```

If a required adapter is missing, `IdentityModule.register()` throws a descriptive configuration error at startup.
