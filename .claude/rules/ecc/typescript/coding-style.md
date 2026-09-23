---
paths:
  - '**/*.ts'
  - '**/*.tsx'
  - '**/*.js'
  - '**/*.jsx'
---

# TypeScript/JavaScript Coding Style

> This file extends [common/coding-style.md](../common/coding-style.md) with TypeScript/JavaScript specific content.

## Types and Interfaces

Use types to make public APIs, shared models, and component props explicit, readable, and reusable.

### Public APIs

- Add parameter and return types to exported functions, shared utilities, and public class methods
- Let TypeScript infer obvious local variable types
- Extract repeated inline object shapes into named types or interfaces

### Interfaces vs. Type Aliases

- Use interface for object shapes that may be extended or implemented
- Use type for unions, intersections, tuples, mapped types, and utility types
- Prefer string literal unions over enum unless an enum is required for interoperability

### Avoid any

- Avoid any in application code
- Use unknown for external or untrusted input, then narrow it safely
- Use generics when a value's type depends on the caller

### React Props

- Define component props with a named interface or type
- Type callback props explicitly
- Do not use React.FC unless there is a specific reason to do so

### JavaScript Files

- In .js and .jsx files, use JSDoc when types improve clarity and a TypeScript migration is not practical
- Keep JSDoc aligned with runtime behavior

## Immutability

Use spread operator for immutable updates.

## Error Handling

Use async/await with try-catch and narrow unknown errors safely.

## Input Validation

Use Zod for schema-based validation and infer types from the schema.

## Console.log

- No console.log statements in production code
- Use proper logging libraries instead
