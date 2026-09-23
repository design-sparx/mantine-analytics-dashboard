---
paths:
  - '**/*.css'
  - '**/*.scss'
  - '**/*.sass'
  - '**/*.less'
  - '**/*.html'
  - '**/*.tsx'
  - '**/*.jsx'
  - '**/*.vue'
  - '**/*.svelte'
---

# Web Hooks

> This file covers web-specific Claude Code hooks and conventions. It is separate from the React hooks rules in react/hooks.md.

## Web Hook Patterns

- Use hooks for cross-cutting concerns: logging, metrics, error tracking
- Keep hook payloads small and structured
- Avoid side effects in hook processing
