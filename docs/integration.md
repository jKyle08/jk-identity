# Integration Guide (Clone-First)

`@apxon-jk/identity` is distributed **from this GitHub repository**. Clone or install from git — npm registry publish is optional and planned later.

Repository: [github.com/jKyle08/jk-identity](https://github.com/jKyle08/jk-identity)

---

## Quick paths

| Goal | Approach |
|------|----------|
| Try the API locally | Clone repo → `npm run playground` |
| See how an external app wires it up | [examples/consumer-nest-app](../examples/consumer-nest-app/) |
| Use in your own NestJS app (local) | `file:` dependency (recommended) |
| Install from GitHub | `github:jKyle08/jk-identity#main:packages/identity` |
| Active development on both repos | `npm link` |
| Share without npm registry | `npm run pack:identity` |

---

## 1. Inside the monorepo (playground)

For exploring the package within this repository:

```bash
git clone https://github.com/jKyle08/jk-identity.git
cd jk-identity
npm install
npm run build
npm run playground
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

Copy `.env.example` to `.env` at the repo root (or use playground's `.env.example`).

See [apps/playground/README.md](../apps/playground/README.md).

---

## 2. Sibling app via `file:` (recommended)

Use this when your NestJS app lives **next to** a cloned copy of this repo:

```
projects/
├── jk-identity/          # cloned repo
└── my-api/               # your NestJS app
```

In **my-api/package.json**:

```json
{
  "dependencies": {
    "@apxon-jk/identity": "file:../jk-identity/packages/identity",
    "@apxon-jk/identity-memory": "file:../jk-identity/examples/memory",
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/passport": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "passport": "^0.7.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  }
}
```

Then in your app:

```bash
npm install
```

Wire the module (memory adapters for dev):

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

**Build note:** `@apxon-jk/identity` runs `npm run build` automatically on install via its `prepare` script. If you skip install or clone without `dist/`, build manually:

```bash
cd ../jk-identity/packages/identity
npm run build
```

Full reference implementation: [examples/consumer-nest-app](../examples/consumer-nest-app/).

---

## 3. Install from GitHub

Install a subdirectory of the monorepo directly:

```json
{
  "dependencies": {
    "@apxon-jk/identity": "github:jKyle08/jk-identity#main:packages/identity",
    "@apxon-jk/identity-memory": "github:jKyle08/jk-identity#main:examples/memory"
  }
}
```

```bash
npm install
```

The `prepare` script on `@apxon-jk/identity` compiles TypeScript after install. You still need peer dependencies in your host app (see below).

Pin to a tag for stability:

```json
"@apxon-jk/identity": "github:jKyle08/jk-identity#v0.3.0:packages/identity"
```

---

## 4. `npm link` (active development)

When you change `@apxon-jk/identity` frequently and want instant feedback in your app:

```bash
# In the cloned jk-identity repo
cd packages/identity
npm run build
npm link

cd ../../examples/memory
npm run build
npm link

# In your NestJS app
npm link @apxon-jk/identity @apxon-jk/identity-memory
```

Rebuild the identity package after source changes:

```bash
cd jk-identity/packages/identity
npm run build
```

---

## 5. Tarball (share without npm)

From the cloned repository root:

```bash
npm run pack:identity
```

Creates `packages/identity/apxon-jk-identity-0.3.0.tgz`. Install elsewhere:

```bash
npm install /path/to/apxon-jk-identity-0.3.0.tgz
```

---

## Peer dependencies (host app)

Your NestJS application must provide:

```bash
npm install @nestjs/common @nestjs/core @nestjs/jwt @nestjs/passport passport reflect-metadata rxjs
```

Optional (Swagger decorators on DTOs):

```bash
npm install @nestjs/swagger
```

Validation (used by REST DTOs):

```bash
npm install class-validator class-transformer
```

---

## Required adapters

| Adapter | Port | Required |
|---------|------|----------|
| `identityRepository` | `IdentityRepository` | Yes |
| `sessionRepository` | `SessionRepository` | Yes |
| `emailAdapter` | `EmailAdapter` | Yes |
| `auditAdapter` | `AuditAdapter` | Yes |
| `storageAdapter` | `StorageAdapter` | No |
| `smsAdapter` | `SmsAdapter` | No |

For local development, use `createMemoryAdapters()` from `@apxon-jk/identity-memory`. For production, implement your own — see [Adapters](./adapters.md).

---

## npm registry (optional, later)

When published:

```bash
npm install @apxon-jk/identity
```

Until then, use clone + `file:`, GitHub install, or tarball.

---

## Next steps

- [Getting Started](./getting-started.md)
- [Adapters](./adapters.md) — build production persistence
- [Security](./security.md) — JWT secrets, rate limiting
