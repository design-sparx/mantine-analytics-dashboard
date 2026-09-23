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

# Web Coding Style

> This file extends [common/coding-style.md](../common/coding-style.md) with web-specific content.

## CSS Organization

- One stylesheet per component when practical
- Use CSS Modules or scoped styles to avoid leakage
- Prefer utility classes for one-off values; use component classes for shared design tokens

## Selectors

- Avoid overly specific selectors
- Avoid ID selectors for styling
- Do not rely on source order for cascade resolution when a clearer architecture is available

## Responsive Design

- Mobile-first CSS
- Use relative units (rem, %, vw) instead of fixed px where possible
- Test at common breakpoints: 320, 375, 768, 1024, 1440
