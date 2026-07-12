# @apxon-jk/identity Documentation

Developer documentation for integrating `@apxon-jk/identity` into NestJS applications.

## Contents

- [Getting Started](./getting-started.md) — Clone, quick start, playground
- [Integration](./integration.md) — Clone-first: `file:`, GitHub, link, tarball
- [Architecture](./architecture.md) — Layers, dependency rules, domain model
- [Adapters](./adapters.md) — Building custom repository and adapter implementations
- [Events](./events.md) — Domain events and EventBus
- [Sessions](./sessions.md) — Tokens, rotation, revocation
- [Security](./security.md) — Hashing, JWT, rate limiting, verification

## Repository Layout

```
jk-identity/
├── packages/identity/     # @apxon-jk/identity package
├── apps/playground/       # Runnable demo app (monorepo workspace)
├── examples/memory/       # In-memory reference adapters
├── examples/consumer-nest-app/  # External app via file: deps
└── docs/                  # This documentation
```

## Version

Current development target: **v0.3.0** (Developer Experience phase).
