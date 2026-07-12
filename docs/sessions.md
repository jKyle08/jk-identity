# Sessions

## Access Tokens

- Short-lived JWT signed with `auth.jwtSecret`
- Payload: `identityId`, `sessionId`, `email`
- Expiration: `auth.accessTokenExpiration` (e.g. `15m`)
- Sent as `Authorization: Bearer <token>`

## Refresh Tokens

- Opaque random token (not a JWT)
- Stored as SHA-256 hash in `SessionRepository`
- Expiration: `auth.refreshTokenExpiration` (e.g. `30d`)
- Used via `POST /auth/refresh`

## Rotation

On each refresh:

1. Validate refresh token hash and session status
2. Revoke the old refresh token
3. Issue new access + refresh tokens
4. Link new refresh token to the same session

This detects token reuse — if a revoked refresh token is presented, treat it as a potential compromise.

## Session Revocation

| Action | Endpoint | Effect |
|--------|----------|--------|
| Logout | `POST /auth/logout` | Revokes current session |
| Logout all | `POST /auth/logout-all` | Revokes all sessions for identity |
| Revoke session | `DELETE /sessions/:sessionId` | Revokes a specific session |
| Password reset | `POST /auth/reset-password` | Revokes all sessions after reset |

Revoked sessions fail JWT validation on subsequent requests.

## Session Metadata

On login, optional metadata is stored with the session:

- `deviceName`, `browser`, `operatingSystem`
- `ipAddress`, `country`, `userAgent`

List sessions: `GET /sessions`

## Implementation Notes

Your `SessionRepository` must:

- Create sessions and refresh tokens atomically
- Enforce expiration checks in `findRefreshTokenByHash`
- Mark sessions revoked (soft delete) rather than hard delete for audit trails

See `MemorySessionRepository` in `examples/memory/` for a complete reference implementation.
