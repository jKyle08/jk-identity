# Changelog

All notable changes to `@apxon-jk/identity` are documented in this file.

## v0.3.0

### Added

- Playground NestJS app (`apps/playground`) with Swagger
- In-memory reference adapters (`examples/memory`) for local dev and testing
- Comprehensive test suite: unit, integration, and e2e (38 tests)
- GitHub Actions CI pipeline (lint, build, test, coverage)
- Developer documentation (`docs/`)
- Startup validation for missing adapters and auth configuration
- `@ApiProperty` decorators on DTOs for Swagger schema generation
- Playground dev endpoint `GET /dev/emails` for retrieving verification tokens

### Changed

- `@nestjs/swagger` added as optional peer dependency
- Improved configuration error messages in `IdentityModule.register()`

## v0.2.0

### Added

- `Identity` / `IdentityProfile` split (aggregate root with 1:1 profile)
- Core auth flows: register, login, logout, refresh, email verification, password reset
- Google OAuth login
- Session management endpoints
- Domain events and in-memory event bus
- REST controllers, guards, DTOs, and exception filter

### Changed

- Public API expanded with domain entities, ports, use cases, and services

## v0.1.0

### Added

- Initial project structure
- Clean Architecture foundation
- Hexagonal Architecture foundation
- Identity package scaffold
