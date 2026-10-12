---
'mantine-analytics-dashboard': patch
---

Refactor the root layout to a Server Component and adopt the metadata API

The app now renders a real HTML shell on the server: per-route titles and
descriptions come from the framework's metadata API instead of ~20 duplicated
hand-rolled `<title>`/`<meta>` blocks, and the client boundary starts below the
providers rather than at the root layout.

Root layout (`src/app/layout.tsx`)

- Removed `'use client'`; the layout is now a Server Component.
- Replaced the inline `<head>` tags with `export const metadata`, using a
  `title.template` so each route only sets its own title.
- Moved the `viewport` declaration to `export const viewport`.
- Moved the site description to a single definition in `src/constants/site.ts`,
  shared by the pages that still need it.
- Added `suppressHydrationWarning` to `<html>`, required because
  `ColorSchemeScript` writes the color scheme attribute to `documentElement`
  client-side.
- Moved `GoogleAnalytics` inside `<body>`; it was previously rendered outside
  the root element, where React could not hoist it.

Routes

- Every route now exports `metadata` (static, or `generateMetadata` for
  `apps/invoices/details/[id]`, which reads the invoice number server-side so
  the title names the document instead of a raw id). `/announcements` and
  `/changelog` previously rendered the root layout's hand-rolled `<title>` and
  are now split the same way so they get their own.
- Client-only pages were moved to a co-located body component (e.g.
  `CrmDashboard.tsx`) next to the thin server `page.tsx`, which is the pattern
  the metadata API requires: it is only available in Server Components.
- `not-found.tsx` now exports its own metadata; it renders within the root
  layout, so it no longer needs a hand-rolled `<title>`.
- `error.tsx` keeps a React `<title>`, the documented way to title an error
  boundary, since metadata exports are not available in Client Components.

Tooling

- Add `.kilo/**` to the ESLint ignores. It is already git-ignored, but a stale
  worktree under it was being linted and failed the gate for files that are not
  part of any branch.
- Fix pre-existing import-order errors in `src/app/api/changelog/route.ts` and
  `src/app/(public)/changelog/page.tsx`.
- Update `src/test/dashboard-api-usage.test.tsx`. It read only `page.tsx` to
  assert registry-backed fetching, but the split moved the hook call into the
  co-located body component, so the test now inspects each route directory and
  accepts either the client hook or the server-side `fetchData(API_*)` helper.

Also fixes an unrelated build failure: `src/components/kanban-board/KanbanBoard.tsx`
declared `dropTargetRef` twice, which failed `next build`. The duplicate
declaration was removed.
