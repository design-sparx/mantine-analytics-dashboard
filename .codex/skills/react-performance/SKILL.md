---
name: react-performance
description: React and Next.js performance optimization guidance.
---

# React Performance

Performance rules for React 19 and Next.js 16.

## When to Use

- Performance audits
- Bundle size optimization
- Rendering performance issues
- Before merging performance-sensitive changes

## Core Guidelines

- Server Components are the default in Next.js App Router
- Use useMemo/useCallback only when profiling shows benefit
- Avoid useEffect for derived state — compute during render
- Prefer RSC fetch over client-side useEffect fetches
- Keep client component boundaries narrow
- Use next/dynamic for heavy client components

## Checklist

- No unnecessary client-side fetching
- No prop drilling through multiple client boundaries
- Images use next/image with explicit sizes
- Heavy components are dynamically imported
- Bundle size reviewed for new dependencies
