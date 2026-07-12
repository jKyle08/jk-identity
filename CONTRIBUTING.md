# Contributing to JK Identity

Thank you for your interest in contributing to `@apxon-jk/identity`.

## Getting Started

1. Fork the repository and clone it locally.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the package:

   ```bash
   npm run build
   ```

## Development Workflow

- Follow the existing Clean Architecture and Hexagonal Architecture patterns.
- Keep domain logic free of framework dependencies.
- Write clear, focused commits using [Conventional Commits](https://www.conventionalcommits.org/).
- Run linting before submitting changes:

  ```bash
  npm run lint
  ```

## Pull Requests

1. Create a feature branch from `main`.
2. Make your changes with tests where applicable.
3. Update `CHANGELOG.md` under an `Unreleased` section if your change is user-facing.
4. Open a pull request with a clear description of the change and motivation.

## Code Style

- TypeScript with strict mode enabled
- 2-space indentation
- Single quotes
- Prettier for formatting
- ESLint for linting

## Questions

Open an issue on [GitHub](https://github.com/jKyle08/jk-identity) for questions or discussion.
