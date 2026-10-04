# 02: API envelope contract — make the response type match reality, add a shared route builder

**Group:** (1) API Contracts

**What to build:** There is exactly one definition of the API response envelope, and it describes what the mock routes actually return. A new route author imports a helper, gets a correctly shaped success and failure response for free, and the type checker catches the mismatch instead of a page blowing up at runtime on `data?.data`.

**Blocked by:** 01 (needs a test runner to prove the contract).

**Status:** ready-for-agent

**Problem:**

- `IApiResponse<T>` in `src/types/api-response.ts` declares a required `timestamp: string` and `errors?: IApiError[]`. No mock route returns a `timestamp`, and every route returns `errors: string[]`, not `IApiError[]`. The type is fiction.
- The type has an `ApiResponse<T>` alias "for compatibility", and `src/lib/hooks/useApi.ts` re-declares a third `ApiResponse<T>` alias over it. Three names for one concept.
- All 70 mock routes hand-roll the same envelope: a `fs.readFileSync` of a mock JSON file, `JSON.parse`, a `NextResponse.json` success body, and a near-identical `catch` block returning `succeeded: false, data: null, errors: [...], message: ...` with a 500. Some routes log, some don't; the messages and error strings vary arbitrarily. Any change to the envelope means 70 edits.
- Routes take a `NextRequest` argument that most of them never use, which also forces the request to be a dynamic route.

**Solution sketch:**

- Decide the canonical shape and rewrite `IApiResponse<T>` to match the mock routes: `succeeded`, `data`, `errors` (string array), `message`. Either add `timestamp` to the routes or drop it from the type — pick one and make routes and type agree. Keep `IApiError` only if something consumes it; otherwise delete it rather than leave a dead export.
- Collapse the duplicate `ApiResponse` aliases into a single exported name from the types module and update importers.
- Add a small server-side helper that wraps the mock read: it takes the mock file name (or a resolved absolute path), returns the parsed JSON on success, and returns a consistent 500 envelope with a caller-supplied message and error string on failure. Include the request-scoped concerns it should absorb: no caching surprises, and no `console.error` of raw paths in production responses.
- Adopt the helper in one route as the reference implementation and leave the other 69 alone (that's ticket 03).

**Acceptance criteria:**

- [ ] `IApiResponse<T>` describes the response the mock routes actually return: no required field the routes omit, and `errors` is typed to match what is produced.
- [ ] Exactly one alias for the envelope type is exported from the types module; no other module re-declares it.
- [ ] A shared helper exists that, given a mock file name, returns either the parsed data or a 500 response with the standard failure envelope; both success and failure bodies are typed against `IApiResponse`.
- [ ] The helper does not leak filesystem paths in the error message or response body.
- [ ] At least one mock route uses the helper end to end and returns a body that type-checks as `IApiResponse<T>` with no casts.
- [ ] `pnpm test` covers the helper's success path, its failure path (missing or malformed mock file), and the envelope shape it produces.
- [ ] `pnpm lint` and `pnpm typecheck` are clean.

**Tests:**

- Helper returns parsed mock data with `succeeded: true`, `errors: []`, and a 200 status.
- Helper returns `succeeded: false`, `data: null`, a non-empty `errors` array, and a 500 status when the mock file is absent.
- Helper returns the failure envelope (not a thrown error) when the mock file contains invalid JSON.
- A type-level assertion that the reference route's return value satisfies `IApiResponse<T>`.

**Dependencies / blocks:**

- Blocked by: 01 (test runner).
- Blocks: 03 (bulk route migration), 04 (the standard fetch hook is typed against the same envelope), 07 (docs describe the same contract).
- Widens later: 06 adds routes, and those must use the helper from day one.

**Out of scope:**

- Migrating the remaining routes (ticket 03).
- Adding authentication, authorization, validation, or a real backend.
- Converting routes to fetch mock data over HTTP instead of reading from disk.
- Changing the mock JSON files themselves.
