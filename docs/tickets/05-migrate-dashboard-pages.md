# 05: Migrate dashboard pages to the standard fetch hook

**Group:** (2) Data Fetch Standardization

**What to build:** All eleven analytics dashboard pages fetch their data through the standard hook and the API path registry. No dashboard page calls `useFetch` inline or names an endpoint as a string literal, and every dashboard renders a real loading state and a real error state instead of an empty chart.

**Blocked by:** 04 (the standard hook and path registry must exist first).

**Status:** ready-for-agent

**Problem:**

- Eleven dashboard pages (`default`, `crm`, `finance`, `education`, `ecommerce`, `llm`, `real-estate`, `marketing`, `hr`, `healthcare`, `logistics`) each call `useFetch<IApiResponse<any[]>>('/api/...')` inline, six times per page. That is roughly 40 inline call sites, all payload-typed `any[]`, all with hardcoded endpoint strings.
- Each page repeats the same shape: destructure `data`, `error`, `loading`; pass `data?.data || []` into a component along with `error` and `loading`. The fallback `|| []` masks a failed response as "no data" — a page whose route is broken looks identical to a page with an empty dataset.
- The pages are also near-duplicates of each other structurally: same header, same grid, same per-widget layout. That duplication is what makes the fetch pattern hard to change in one place.
- The two odd ones out are `saas` and `analytics`, which use the old `useApi.ts` hooks, so the app currently demonstrates three different fetch idioms.

**Solution sketch:**

- Migrate the eleven pages to the standard hook and the path registry. Each endpoint gets its registry constant and, where the payload shape is known, a real type instead of `any[]`.
- Make the empty-vs-error distinction visible: when a request fails, the page shows an error affordance rather than rendering an empty chart. Reuse whatever error presentation the shared components already accept rather than inventing a new one.
- Leave the structural duplication between pages alone. If a shared page shell is clearly warranted, note it for ticket 08 instead of refactoring the layout here — this ticket is about the fetch path, and a layout refactor would multiply the diff and the risk.
- Migrate `saas` and `analytics` in this ticket too, so the whole dashboard surface ends up on one idiom. Do not delete the old hooks; ticket 08 does that once no caller remains.

**Acceptance criteria:**

- [ ] No dashboard page calls `useFetch` directly, and no dashboard page contains a hardcoded `/api/...` string literal.
- [ ] Zero `any` payload types remain in the migrated dashboard pages; each fetch is typed against the mock file's real shape or a DTO.
- [ ] A failed request (non-2xx, or `succeeded: false`) renders a visible error state on every dashboard page rather than an empty chart.
- [ ] The `saas` and `analytics` pages use the same hook and registry as the other eleven, so the app has exactly one fetch idiom in the dashboard surface.
- [ ] The shared components receiving `data` / `error` / `loading` are unchanged in signature, so no downstream component had to be rewritten to accommodate the migration.
- [ ] `pnpm test`, `pnpm lint`, and `pnpm typecheck` are clean, and all thirteen dashboard pages render their data.
- [ ] A grep for `useFetch<IApiResponse` in `src/app/dashboard` returns nothing.

**Tests:**

- A smoke render per dashboard page with a stubbed fetch returning a valid envelope, asserting the widgets receive the unwrapped array.
- A smoke render per dashboard page with a failing response, asserting an error state is present and no empty-chart-only render occurs.
- The grep assertion above, run in CI or documented as a manual check.

**Dependencies / blocks:**

- Blocked by: 04.
- Blocks: 06 (mutating components should follow the same pattern), 08 (only after this lands can the old `useApi.ts` hooks be retired).

**Out of scope:**

- Component-level call sites outside `src/app/dashboard` (apps pages, shared components such as the kanban board and sales chart) — ticket 06 and ticket 08 cover those.
- Extracting a shared dashboard page shell to remove the structural duplication between the eleven pages.
- Redesigning dashboard layouts, adding widgets, or changing any chart's appearance.
- Adding per-widget filters, date ranges, or drill-down.
