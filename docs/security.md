# Security

## Password Hashing

Passwords are hashed with **Argon2id** before storage:

- Algorithm: Argon2id
- Memory: 64 MB, Time: 3, Parallelism: 4

Consumers never store plain-text passwords. `IdentityRepository.updatePasswordHash` receives the hash only.

### Password Policy

Enforced by the `Password` value object:

- Minimum 8 characters
- Uppercase, lowercase, number, and special character required

## JWT

| Token | Secret | Purpose |
|-------|--------|---------|
| Access | `auth.jwtSecret` | API authentication |
| Refresh | Stored as hash | Session renewal (opaque token) |

**Never** use the same secret for access and refresh tokens. Set strong, unique values in production.

## Rate Limiting

`LoginUseCase` includes in-memory rate limiting:

```typescript
IdentityModule.register({
  // ...
  rateLimit: {
    maxLoginAttempts: 5,        // default
    lockoutDurationMinutes: 15, // default
  },
});
```

After `maxLoginAttempts` failed logins, the account is locked for `lockoutDurationMinutes`. Failed attempts are recorded via `AuditAdapter`.

> **Note:** Rate limiting is per-process (in-memory). Use a distributed store for multi-instance deployments.

## Email Verification

- New registrations start with `accountStatus: pending_verification`
- Login is blocked until email is verified (`EmailNotVerifiedException`)
- Verification tokens are single-use, hashed at rest, and expire (default: 24 hours)

## Password Reset

- Tokens are single-use and expire (default: 1 hour)
- `POST /auth/forgot-password` always returns success (prevents email enumeration)
- Reset revokes all active sessions

## Audit Trail

`AuditAdapter` records:

- Successful logins
- Failed logins (with reason)
- Logouts
- Security events (`LOGIN_FAILED`, etc.)

Implement persistent storage for compliance and incident response.

## Exception Handling

Identity exceptions map to HTTP status codes:

| Exception | Status |
|-----------|--------|
| `InvalidCredentialsException` | 401 |
| `EmailNotVerifiedException` | 403 |
| `IdentityNotFoundException` | 404 |
| `EmailAlreadyExistsException` | 409 |
| `AccountLockedException` | 423 |
| `WeakPasswordException` | 400 |

`GlobalIdentityExceptionFilter` is registered automatically by the module.
