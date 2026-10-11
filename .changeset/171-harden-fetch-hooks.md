---
'mantine-analytics-dashboard': patch
---

Harden fetch hooks with AbortController, request deduplication, and generation counters

- `useApiGet` and `useApiWrite` now cancel in-flight requests on unmount using `AbortController`
- Request deduplication: concurrent hook instances for the same endpoint share a single in-flight request
- Rapid refetch supersedes previous requests via generation counter (old responses ignored)
- `useApiWrite` no longer auto-executes on mount (default `autoExecute: false`); callers opt in explicitly
- Added test coverage for abort, deduplication, and superseded-response scenarios
