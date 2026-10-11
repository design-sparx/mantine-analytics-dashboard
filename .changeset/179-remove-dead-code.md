---
'mantine-analytics-dashboard': patch
---

Remove dead code and dev statements

- Delete unused Pages Router component: `src/components/router-transition/` (uses `next/router` in App Router project)
- Remove export from `src/components/index.ts`
- Delete legacy ESLint config `.eslintrc.json` (project uses flat config `eslint.config.mjs`)
- Remove `console.log`/`console.warn` statements from client components:
  - `src/components/kanban-column/KanbanColumn.tsx`
  - `src/components/kanban-card/KanbanCard.tsx`
  - `src/app/apps/notifications/page.tsx`
  - `src/app/apps/file-manager/page.tsx`
  - `src/app/apps/email/page.tsx`
- Kept `console.error` in API routes (server-side) and error boundary
