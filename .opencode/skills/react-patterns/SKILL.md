---
name: react-patterns
description: React-specific patterns including Server Components, hooks, forms, and data fetching.
---

# React Patterns

React 19 and Next.js App Router patterns.

## When to Use

- Implementing React components
- Reviewing React code
- Planning data fetching strategies

## Guidelines

- Server Components are the default
- Client Components opt in with 'use client'
- Use TanStack Query for client-side cache, mutations, and optimistic updates
- Prefer uncontrolled inputs with form actions for simple forms
- Use React Hook Form for complex forms
- Keep client boundaries narrow
