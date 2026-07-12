# @jk/identity Documentation

Developer documentation for integrating `@jk/identity` into NestJS applications.

## Contents

- [Getting Started](./getting-started.md) — Installation, quick start, playground
- [Architecture](./architecture.md) — Layers, dependency rules, domain model
- [Adapters](./adapters.md) — Building custom repository and adapter implementations
- [Events](./events.md) — Domain events and EventBus
- [Sessions](./sessions.md) — Tokens, rotation, revocation
- [Security](./security.md) — Hashing, JWT, rate limiting, verification

## Repository Layout

```
jk-identity/
├── packages/identity/     # @jk/identity package
├── apps/playground/       # Runnable demo app
├── examples/memory/       # In-memory reference adapters
└── docs/                  # This documentation
```

## Version

Current development target: **v0.3.0** (Developer Experience phase).
