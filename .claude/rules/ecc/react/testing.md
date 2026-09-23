---
paths:
  - '**/*.tsx'
  - '**/*.jsx'
  - '**/components/**/*.test.ts'
  - '**/components/**/*.test.tsx'
---

# React Testing

> This file extends [typescript/testing.md](../typescript/testing.md) and [common/testing.md](../common/testing.md) with React-specific testing content.

## Testing Library

- Use React Testing Library for component tests
- Query by role, label, or text — avoid querying by implementation details like class names or test IDs
- Use userEvent over fireEvent for interactions

## Component Testing Shape

- Test user behavior, not implementation details
- Include accessibility assertions in component tests
- Test keyboard navigation where feasible

## Mocking

- Mock API calls at the network layer or service boundary
- Avoid mocking internal implementation details
- Use MSW (Mock Service Worker) for realistic API mocking in tests
