---
'mantine-analytics-dashboard': patch
---

Retire legacy fetch hook and migrate call sites to the single GET idiom

- Delete `src/hooks/useFetchData.ts` and `src/hooks/index.ts` (legacy hook that read mock JSON directly, had stale-URL closure, and lacked unmount guard)
- Add API routes for file-manager: `/api/file-manager/files`, `/api/file-manager/folders`, `/api/file-manager/file-activities`
- Register new endpoints in `src/routes/api.ts` (`API_CORE.files`, `API_CORE.folders`, `API_CORE.fileActivities`)
- Migrate call sites in `file-manager/layout.tsx`, `file-manager/page.tsx`, `profile/page.tsx` to use `useApiGet` with endpoint registry
- Update tests for new route count (api-paths.test.ts, mock-routes.test.ts)

All call sites now read through the standard `useApiGet` hook with proper abort, dedup, and race guards from #171.
