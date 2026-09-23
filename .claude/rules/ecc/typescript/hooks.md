---
paths:
  - '**/*.ts'
  - '**/*.tsx'
  - '**/hooks/**/*.ts'
  - '**/hooks/**/*.js'
  - '**/use-*.ts'
  - '**/use-*.tsx'
---

# TypeScript/JavaScript Hooks

> This file covers Claude Code hooks and custom hook patterns in TypeScript/JavaScript. It is separate from the runtime hooks/ system described in common/hooks.md.

## Custom Hook Patterns

Extract a custom hook when:

- The same logic is reused across components
- The logic has a clear, nameable purpose
- You want to test the logic independently

## ESLint Rules

Required TypeScript rules:

- @typescript-eslint/no-explicit-any: error
- @typescript-eslint/no-unused-vars: error
- @typescript-eslint/explicit-module-boundary-types: warn for public APIs
