---
paths:
  - '**/*.tsx'
  - '**/*.jsx'
  - '**/components/**/*.ts'
  - '**/components/**/*.js'
  - '**/app/**/*.tsx'
  - '**/pages/**/*.tsx'
---

# React Patterns

> This file extends [typescript/patterns.md](../typescript/patterns.md) and [common/patterns.md](../common/patterns.md) with React specific content. For hook-specific rules see [hooks.md](./hooks.md).

## Container / Presentational Split

Container components own data fetching, state, and side effects. Presentational components receive props and render — no service calls, no hooks beyond local UI state.

## State Location Decision Tree

1. Used by one component -> useState inside it
2. Used by parent + a few children -> lift to nearest common ancestor, pass via props
3. Used across distant branches -> React Context for low-frequency reads only (theme, auth, locale)
4. High-frequency updates shared across the tree -> external store (Zustand, Jotai, Redux Toolkit)
5. Server-derived data -> server-state library (TanStack Query, SWR, RSC fetch) — not application state

Context misused for frequently changing values causes every consumer to re-render on every update.

## Server / Client Component Boundary (RSC, Next.js App Router)

- Server Components are the default — they run on the server, do not ship to the client, and can await directly
- Client Components opt in with 'use client' at the top of the file
- Data flows down: a Server Component can render a Client Component and pass serializable props
- A Client Component cannot import a Server Component, but it can receive one via children or named slots
- Never import 'server-only' packages (DB clients, secrets) from a Client Component file
- Mark sensitive modules with import 'server-only' so the bundler errors if a client file imports them

## Suspense + Error Boundaries

Every Suspense boundary needs an Error Boundary above it. The pair handles both states.

- Place Suspense boundaries close to where data is needed, not at the route root
- Multiple narrower boundaries reveal loaded content progressively
- Error Boundary must be a Class Component OR use a library wrapper such as react-error-boundary

## Forms

### Uncontrolled (React 19 + form actions)

Prefer uncontrolled inputs with form actions when the form has a clear submit step.

### Controlled

Use controlled inputs when the value drives other UI, requires real-time validation, or formatting.

### Form Libraries

For complex forms (multi-step, dynamic field arrays, cross-field validation), use a library:

- React Hook Form — minimal re-renders, uncontrolled-first
- TanStack Form — typed, framework-agnostic
- Final Form — when subscription-based re-renders matter

## Data Fetching

| Strategy                              | When                                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| RSC fetch (await in Server Component) | Per-request data in Next.js App Router, no client-side cache needed                      |
| TanStack Query                        | Client-side cache, mutations, optimistic updates, polling                                |
| SWR                                   | Lightweight cache + revalidation, simpler than TanStack Query                            |
| fetch in useEffect                    | Avoid — race conditions, no cache, no retry. Only acceptable for one-off fire-and-forget |

Never fetch in a useEffect when a real cache library is available.

## Lists and Keys

- key must be stable across renders — never index for any list that can reorder, insert, or delete
- key must be unique among siblings, not globally
- A reordered list with index keys causes state in child components to attach to the wrong row

## Composition over Inheritance

- Pass children for slot-style composition
- Pass render-prop functions for parameterized rendering
- Pass component types for plug-in points: renderItem={UserRow}
- Never extend a component class to specialize behavior

## Compound Components

For related controls (Tabs, Accordion, Menu), use compound components sharing state via Context.

## Portals

Use createPortal for modals, tooltips, toast containers — anything that must escape the parent's overflow: hidden or z-index stacking context. Render to a stable DOM node mounted in index.html.

## Refs and Forwarding (React 19+)

React 19 lets function components accept ref as a regular prop — forwardRef is no longer required.
