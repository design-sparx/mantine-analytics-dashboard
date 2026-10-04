# 04: Standard data-fetch hook plus an API path registry

**Group:** (2) Data Fetch Standardization

**What to build:** There is one way for a component to read data from a mock endpoint, and one place that lists every endpoint path. A page author imports a hook, gets typed data with loading and error state, and never writes a `useFetch` call or a hardcoded `/api/...` string by hand.

**Blocked by:** 02 (the hook is typed against the corrected envelope).

**Status:** ready-for-agent

**Problem:**

- Two competing fetch styles coexist. Most dashboard pages call `useFetch<IApiResponse<any[]>>('/api/...')` inline, roughly 40 times, and reach into `data.data` with no type safety and no error handling. Meanwhile `src/lib/hooks/useApi.ts` exports a `useApiGet<T>` wrapper plus 16 hand-written resource hooks — and only three of them are used anywhere.
- The payload type is `any[]` in nearly every call site, so nothing catches a shape mismatch between the mock file and the chart props that consume it.
- Endpoint strings are hardcoded in 20+ places, so a route rename is a search-and-replace with no compiler help. The repo already has a route-constant module for page routes, so the convention exists — it just isn't applied to API endpoints.
- The unused hooks in `useApi.ts` are stale: `useProducts` and `useOrders` shadow richer implementations elsewhere, and `useSales`/`useStats`/`useTraffic`/`useProfile`/`useLanguages` are all `any`-typed.
- The inline call sites handle loading and error inconsistently: some render a loader, some pass the error into a component, some ignore both.

**Solution sketch:**

- Add an API path registry alongside the existing page-route constants, holding every endpoint path as a named constant. Point the constants at the real route set rather than a subset.
- Build one standard GET hook on top of the corrected envelope. It should expose data already unwrapped from the envelope (no `data.data` at the call site), plus loading and error state, and it should surface a failed `succeeded: false` response as a real error rather than as silently empty data.
- Per-endpoint hooks are generated from the registry rather than hand-written, so adding an endpoint is a one-line change.
- Keep a typed DTO for at least one domain (the LLM dashboard's six endpoints) and use it to prove the type actually flows through to the components rather than collapsing to `any`.
- Leave the existing `useApi.ts` hooks in place for now; retiring them is ticket 08. Do not migrate page call sites in this ticket — that's ticket 05.

**Acceptance criteria:**

- [ ] Every mock endpoint path used by the app has a named constant in an API path registry; no new hardcoded `/api/...` string is introduced.
- [ ] One standard GET hook returns unwrapped typed data plus loading and error state; call sites do not reach into a nested `data.data`.
- [ ] A response with `succeeded: false` and a 200 status is surfaced as an error, not as empty data.
- [ ] Per-endpoint hooks are derived from the registry, so a new endpoint requires only a registry entry to get a hook.
- [ ] At least one domain's endpoints are fully typed with a DTO, and the consuming component compiles without `any` or casts.
- [ ] The registry and hook are unit tested: unwrapping on success, error surfacing on `succeeded: false`, and error surfacing on a non-2xx response.
- [ ] The three existing hooks in `useApi.ts` that are actually still in use keep working, unchanged.
- [ ] `pnpm test`, `pnpm lint`, and `pnpm typecheck` are clean.

**Tests:**

- Standard hook: success response unwraps to the payload and reports `loading: false`, no error.
- Standard hook: `succeeded: false` with HTTP 200 produces an error and no data.
- Standard hook: HTTP 500 produces an error and no data.
- Standard hook: loading is `true` before the response resolves.
- A typed DTO test that a mock file's JSON is assignable to the DTO, so a mock change that breaks the contract fails the suite.

**Dependencies / blocks:**

- Blocked by: 02 (envelope contract).
- Blocks: 05 (page migration), 06 (mutating components use the same registry and hook conventions), 07 (docs reference the registry and hook), 08 (retiring the old hooks).

**Out of scope:**

- Migrating page and component call sites (ticket 05).
- Adding POST/PUT/DELETE helpers and mutation hooks (ticket 06).
- Deleting the stale hooks in `useApi.ts` (ticket 08).
- Introducing a server-state library (React Query, SWR) or moving to server components.
- Adding request caching, deduplication, polling, or pagination to the hook.
