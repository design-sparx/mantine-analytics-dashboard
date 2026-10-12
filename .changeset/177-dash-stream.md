---
'mantine-analytics-dashboard': patch
---

fix: deduplicated requests now share their settled result with every consumer

- Rewrite useApiGet dedup to resolve a shared promise to { data | error | aborted }
  instead of void, so the second consumer no longer stays stuck with null data
- Track multiple consumers via owners: Set<symbol>; abort only when the set empties
- Add DashboardSection error boundary so one crashing widget doesn't take down the page
- Wrap each RealEstateDashboard section in DashboardSection
- Add loading.tsx and error.tsx to the real-estate segment
- Add regression tests for dedup data/error sharing and unmount safety
