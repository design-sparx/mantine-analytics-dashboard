---
paths:
  - '**/*.tsx'
  - '**/*.jsx'
  - '**/components/**/*.ts'
  - '**/components/**/*.js'
  - '**/app/**/*.tsx'
  - '**/pages/**/*.tsx'
---

# React Coding Style

> This file extends [typescript/coding-style.md](../typescript/coding-style.md) and [common/coding-style.md](../common/coding-style.md) with React-specific content.

## Component Structure

- One component per file
- Co-locate styles, tests, and types with the component
- Use named exports for components
- Use default exports for pages and routes

## Props

- Define component props with a named interface or type
- Destructure props in the function signature
- Use optional chaining and nullish coalescing for optional props

## Conditional Rendering

- Use early returns for loading and error states
- Keep JSX clean and readable
- Avoid deeply nested ternaries

## Lists

- Always provide a stable key prop
- Never use array index as key for dynamic lists
- Extract list items into separate components
