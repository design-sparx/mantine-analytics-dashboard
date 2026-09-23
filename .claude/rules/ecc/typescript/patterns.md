---
paths:
  - '**/*.ts'
  - '**/*.tsx'
  - '**/*.js'
  - '**/*.jsx'
---

# TypeScript Patterns

> This file extends [common/patterns.md](../common/patterns.md) with TypeScript-specific patterns.

## Type Inference

- Let TypeScript infer types for local variables when the type is obvious
- Explicitly type function parameters and return values
- Use satisfies for validating object shapes without widening

## Generics

- Use generics when behavior is parameterized by type
- Prefer readable generic names in simple cases
- Constrain generics with extends when the type must support specific operations

## Utility Types

- Use built-in utility types: Partial, Required, Pick, Omit, Record, ReturnType, Parameters
- Build custom utility types with mapped types when needed

## Module Organization

- Use barrel exports (index.ts) sparingly
- Prefer direct imports for deep trees to improve tree-shaking
- Keep related types close to their usage
