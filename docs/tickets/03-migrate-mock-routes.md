# 03: Migrate all mock API routes to the shared route builder

**Group:** (1) API Contracts

**What to build:** Every mock route in the app returns the same response envelope, built the same way, with consistent status codes and messages. A developer can add a new route by calling the shared helper, and no route carries a bespoke copy of the read-parse-respond-catch sequence.

**Blocked by:** 02 (the envelope contract and helper must land first).

**Status:** ready-for-agent

**Problem:**

- 70 route handlers duplicate the same logic: resolve a path into `public/mocks`, `readFileSync`, `JSON.parse`, `NextResponse.json` success, and a `catch` that returns a hand-written failure body. The duplication is the reason the envelope drifted in the first place.
- Error handling is inconsistent: some routes `console.error`, some swallow the error entirely; messages vary between `"Error retrieving data"` and `"Failed to fetch <thing>"`; the mock file names embedded in messages do not always match the file actually read.
- Some routes read a mock file that no other route or page references, and some mock files are read by more than one route. There is no single obvious owner per mock file.
- A handful of routes declare a `NextRequest` parameter they never use; a few declare `request` and then ignore it, which needlessly forces dynamic rendering.

**Solution sketch:**

- Replace the body of each route with a call to the shared helper, passing the mock file name and a human-readable resource label used for the success and failure messages. Keep the exported `GET` handler signature that Next.js requires.
- Derive the message text from the resource label so the message and the mock file can't drift apart again.
- Drop the unused `request` parameter from handlers that don't use it.
- Sort the routes into two groups while doing this: routes that are actually fetched by a page or component, and routes nothing references. Migrate the first group now. For the second group, do not delete anything in this ticket — record the unreferenced list and leave a note for ticket 08.
- Where two routes read the same mock file, leave both routes in place (they may serve different pages) but make the shared file name obvious from the call site.

**Acceptance criteria:**

- [ ] All 70 mock routes return their response through the shared helper; no route contains a hand-rolled `readFileSync` + `NextResponse.json` + `catch` sequence.
- [ ] Every route's success and failure messages follow one pattern and are derived from the resource the route serves, not from arbitrary literals.
- [ ] Routes that do not use their request parameter no longer declare it.
- [ ] Every route's returned body satisfies `IApiResponse<T>` without casts or `any`.
- [ ] Every route in the migrated set returns 200 with `succeeded: true` for an existing mock file and 500 with `succeeded: false` for a missing one.
- [ ] A written list of mock routes that no page or component fetches is captured for ticket 08.
- [ ] `pnpm test`, `pnpm lint`, and `pnpm typecheck` are clean, and `pnpm dev` renders the dashboard sections that depend on the migrated routes.

**Tests:**

- A parameterized test that walks the route modules and asserts each exported `GET` resolves the mock file it names (mock file exists on disk).
- A test that every migrated route's response body passes the envelope shape check.
- Manual smoke: load the default, CRM, finance, HR, LLM, logistics, marketing, healthcare, education, ecommerce, and real-estate dashboards and confirm data still renders.

**Dependencies / blocks:**

- Blocked by: 02.
- Blocks: 06 (new routes must be born using the helper), 07 (docs describe the final uniform shape), 08 (removing unreferenced routes).

**Out of scope:**

- Deleting routes or mock JSON files (ticket 08).
- Adding POST/PUT/DELETE handlers (ticket 06 covers only the endpoints already called by the UI but never implemented).
- Restructuring the `src/app/api` directory layout, or grouping routes by domain into subfolders.
- Any change to the data inside the mock files.
