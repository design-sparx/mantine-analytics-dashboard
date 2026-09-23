---
paths:
  - '**/*.ts'
  - '**/*.tsx'
  - '**/*.js'
  - '**/*.jsx'
---

# TypeScript Testing

> This file extends [common/testing.md](../common/testing.md) with TypeScript-specific testing content.

## Test Organization

- Place tests next to the code they test (_.test.ts beside _.ts)
- Or group in a **tests** directory when the test file would otherwise be too large

## Mocking

- Prefer dependency injection over deep module mocking
- Use vi.fn() or jest.fn() for spies and mocks
- Reset mocks between tests

## Type Safety in Tests

- Test edge cases that type systems catch (null, undefined, wrong shapes)
- Use type assertions sparingly; prefer testing real runtime behavior
