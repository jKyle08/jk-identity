# Consumer NestJS Example

Minimal **external** NestJS application that consumes `@apxon-jk/identity` the same way a sibling project would — using **`file:`** dependencies instead of workspace links.

This demonstrates the clone-first integration path documented in [docs/integration.md](../../docs/integration.md).

## Layout

```
jk-identity/
├── packages/identity/          ← file:../../packages/identity
├── examples/
│   ├── memory/                 ← file:../memory
│   └── consumer-nest-app/      ← this app
```

In a real project, your app would sit **beside** a cloned `jk-identity` repo:

```
projects/
├── jk-identity/
└── my-api/                     ← file:../jk-identity/packages/identity
```

## Run from monorepo root

```bash
npm install
npm run build
npm run consumer
```

- API: `http://localhost:3001`
- Swagger: `http://localhost:3001/api`

Copy `.env.example` to `.env` to override JWT secrets.

## Run standalone (simulating external app)

```bash
cd examples/consumer-nest-app
npm install
npm run start:dev
```

## What this imports

Only public package exports — never internal source paths:

- `@apxon-jk/identity` — `IdentityModule`, controllers, guards
- `@apxon-jk/identity-memory` — `createMemoryAdapters()` for local dev

Replace memory adapters with your own database and email implementations for production. See [docs/adapters.md](../../docs/adapters.md).
