# 08: Remove duplication and dead code, normalise naming and page metadata

**Group:** (4) Cleanup / Naming / Duplication / Metadata

**What to build:** The repo has one way to do each thing it does repeatedly. There is no dead fetch layer left over from an earlier approach, no orphaned mock files, no inconsistently named fixture set, and no page whose `<title>` disagrees with its own name.

**Blocked by:** 05, 06, 07.

**Status:** ready-for-agent

**Problem:**

- Dead fetch code. After ticket 05, `src/lib/hooks/useApi.ts` has almost no callers; after ticket 06 nothing should call its `useProducts` / `useOrders` variants. The file also re-declares a third `ApiResponse` alias. Leaving it invites the next developer to pick the wrong idiom.
- Unreferenced routes. Ticket 03 produces a list of routes nothing fetches, and several mock files are read by a route that no page uses. `Projects2.json` looks like a leftover with no obvious owner.
- Inconsistent mock-file naming. The fixture set mixes PascalCase (`KanbanTasks.json`, `Invoices.json`, `ChatItems.json`), camelCase (`llm-stats.json`, `bed-occupancy.json`), and domain-prefixed names (`invoices-finance.json` vs `finance/invoices` route, `patient-appointments.json` for the `healthcare/appointments` route). The route-to-file mapping is not discoverable from either name.
- Page metadata. The saas dashboard renders `<title>Sass Dashboard | DesignSparx</title>` — a misspelling, and a raw `<title>`/`<meta>` pair inside a client component's body rather than through whatever metadata mechanism the rest of the app uses. Other pages likely have their own drift.
- Hardcoded endpoint strings survive outside the dashboard: apps pages and shared components such as the kanban board and sales chart still call `useFetch` inline, and the changelog page does a bare `fetch('/api/changelog')`.
- The `API_INTEGRATION.md` rewrite in ticket 07 needs this ticket to have already settled the conventions, or it will document the wrong thing.

**Solution sketch:**

- Delete `src/lib/hooks/useApi.ts` and confirm zero remaining importers. Fix any straggler call site to use the standard hook and registry.
- Migrate the remaining non-dashboard call sites (apps pages, kanban board, sales chart, changelog page) onto the standard hook and registry, then remove the last `useFetch<IApiResponse` and hardcoded `/api/...` occurrences from the app.
- Delete the unreferenced routes identified in ticket 03, and delete the mock files that become orphaned. Keep any mock file that is read by a surviving route. For fixtures used only by the file manager, kanban, or chat features, verify the owner before deleting.
- Renaming the mock fixture set is a wide, mechanical change whose blast radius is every route: follow expand-contract rather than doing it in one commit. Expand: land a mapping from old name to new name alongside the old files. Migrate route by route in batches, keeping CI green. Contract: delete the old files once no route references them. Choose a single convention (kebab-case domain-prefixed) and apply it.
- Fix the saas dashboard title and audit every page's title and meta description for spelling, casing, and consistency. Route metadata through the app's existing mechanism rather than inline JSX in a client component.
- Do not extract a shared dashboard page shell here. That refactor is real but belongs in its own ticket; folding it in would make this one unreviewable.

**Acceptance criteria:**

- [ ] `src/lib/hooks/useApi.ts` is gone and the app has exactly one fetch idiom.
- [ ] No page or component in `src/app` or `src/components` calls `useFetch` inline or contains a hardcoded `/api/...` string literal.
- [ ] Every mock file in `public/mocks` is read by a surviving route, and every surviving route reads a file that exists. Both directions are verified by a test.
- [ ] Mock file names follow one documented convention, migrated via expand-contract with the repo green at every batch.
- [ ] The saas dashboard title is spelled correctly, and no page embeds `<title>`/`<meta>` in a client component's body when the app has a metadata mechanism for it.
- [ ] `pnpm test`, `pnpm lint`, and `pnpm typecheck` are clean, and a full pass over the app shows no broken panel.
- [ ] `AGENTS.md` is updated so its architecture notes describe the post-cleanup state (single fetch idiom, fixture naming convention, no dead hook file).

**Tests:**

- Fixture integrity test: every mock file name is referenced by exactly one route, and every route's referenced file exists.
- A grep check asserting no `useFetch<IApiResponse` and no `'/api/` literal remains in `src/app` or `src/components`.
- Metadata test: assert the saas page exports the expected title through the app's metadata mechanism.
- Manual: walk the full app (all dashboards, all apps pages, public pages) and confirm each panel renders data.

**Dependencies / blocks:**

- Blocked by: 05 (dashboard migration), 06 (write endpoints settle which mock files are live), 07 (docs describe the final conventions).
- Blocks: nothing. This is the last ticket.
- Note: the fixture rename is a wide refactor and may need to be split into this ticket plus follow-ups if the batch count grows; if the batches can no longer stay green independently, they share an integration branch and a final verify step.

**Out of scope:**

- Extracting a shared dashboard page shell or deduplicating the structural layout of the eleven dashboard pages.
- Renaming route directories or restructuring `src/app`.
- A broader design-system or component-library refactor, and changes to visual styling.
- Rewriting `docs/COMPONENT_STANDARDS.md`.
- Deleting the file-manager, kanban, or chat features, or any mock data still owned by them.
