---
paths:
  - '**/*.tsx'
  - '**/*.jsx'
  - '**/hooks/**/*.ts'
  - '**/hooks/**/*.js'
  - '**/use-*.ts'
  - '**/use-*.tsx'
---

# React Hooks

> This file covers React hooks (useState, useEffect, useMemo, useCallback, custom hooks). Extends [typescript/patterns.md](../typescript/patterns.md) and [common/patterns.md](../common/patterns.md).

## Rules of Hooks

Enforce eslint-plugin-react-hooks with react-hooks/rules-of-hooks set to error.

1. Hooks only at the top level of a function component or another hook
2. Never in loops, conditionals, nested functions, or after early returns
3. Always called in the same order on every render
4. Only inside React function components or custom hooks (functions starting with use)

## useEffect — When NOT to Use

useEffect is for synchronizing with external systems. It is not the right tool for:

- Derived state — compute it during render
- Transforming data for rendering — compute it during render
- Resetting state when a prop changes — use a key on the parent or derive from props
- Notifying parents of state changes — call the callback in the event handler
- Initializing app-level singletons — call the function module-side or in main.tsx

## Dependency Arrays

- Always include every reactive value referenced inside the effect/callback
- Enable react-hooks/exhaustive-deps lint rule — never silence it without a comment explaining why
- If the dep array grows unwieldy, the effect is doing too much — split it

## Cleanup

Every subscription, interval, listener, or in-flight request must clean up.

## useMemo and useCallback — When Worth It

Default position: do not memoize. Add useMemo / useCallback only when:

1. The value is passed to a React.memo-wrapped child as a prop, and identity matters
2. The value is a dependency of another useEffect / useMemo / useCallback
3. The computation is measurably expensive (profile before assuming)

## Custom Hooks

Extract a custom hook when:

- The same hook sequence appears in 2+ components
- The logic has a clear, nameable purpose
- You want to test the logic independently of any component

## useState Patterns

- Initial state from prop only at mount: pass a function useState(() => computeInitial(prop)) when computation is expensive
- Functional updater when the new state depends on the old: setCount(c => c + 1)
- Group related state into one object only when they always change together; otherwise split into multiple useState calls
- Use useReducer once state transitions are conditional on the previous state or there are 3+ related values

## React 19 Additions

- use() — unwrap promises and contexts inline
- useFormStatus() / useFormState() — form submission state without prop drilling
- useOptimistic() — optimistic UI updates while a server action is pending
- useTransition() — mark non-urgent state updates so urgent ones stay responsive

## Lint Configuration

Required rules:

- react-hooks/rules-of-hooks: error
- react-hooks/exhaustive-deps: warn

Treat exhaustive-deps warnings as errors in CI for new code.
