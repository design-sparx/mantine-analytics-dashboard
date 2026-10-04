# 06: Implement the missing endpoints and standardise mutating requests

**Group:** (2) Data Fetch Standardization (with (1) contract work)

**What to build:** The write actions the UI already offers — creating and editing a product, creating and editing a product category, deleting a product or category, dragging a kanban card, deleting an invoice — actually work. Today those buttons call endpoints that do not exist, so they fail silently at runtime.

**Blocked by:** 03 (route helper is universal), 05 (dashboard idiom settled).

**Status:** ready-for-agent

**Problem:**

- Several UI surfaces call endpoints that were never implemented. Product drawers post to `/api/product-categories` and patch `/api/products/{id}`; the category drawers post and patch `/api/product-categories/{id}`; there is no `product-categories` route at all. The kanban board posts to `/api/tasks`, and deletes and patches `/api/tasks/{id}` — the tasks route only exports `GET`. Invoice delete calls `/api/invoices/{id}` with `DELETE`, and the invoice details page fetches `/api/invoices/{id}`, neither of which exists.
- There is a naming collision worth resolving: an `/api/ecommerce/categories` route exists, and product-category code separately reaches for a `/api/product-categories` route. One of these is the intended endpoint.
- The write calls are raw `fetch` with hand-built request bodies, no shared error handling, and no consistent response parsing. Several ignore the response entirely, so a failure is invisible.
- Write calls are not added to the API path registry (from ticket 04), so these endpoint strings are invisible to the registry that is supposed to be the single source of truth.
- Because writes target JSON files under `public/mocks`, any implementation must decide whether a write is in-memory, persisted back to disk, or simulated. The app currently assumes read-only mocks.

**Solution sketch:**

- Resolve the category endpoint collision first: pick one canonical path for product categories, implement it, and point the drawers at it. Record the decision in the ticket rather than keeping both routes.
- Implement the missing routes using the shared helper from ticket 03, extending it only as far as writes require. For a mock-first app the pragmatic shape is: read the mock file, apply the mutation, persist back, and return the standard envelope with the updated entity as `data`. If disk persistence is judged too invasive for a demo template, the alternative is an in-memory store seeded from the mock file per process, and that choice must be written down explicitly so the behavior is not a surprise.
- Add write helpers (POST/PUT/DELETE) that mirror the standard GET hook: unwrapped envelope, typed payloads, real error surfacing, and registry-based paths.
- Migrate the six surfaces (product new/edit drawers, category new/edit drawers, kanban board, invoice list and details) onto those helpers. Each call site must handle a failed write visibly.
- Add the missing invoice detail route and the tasks-by-id route, since pages already request them.

**Acceptance criteria:**

- [ ] Every endpoint the UI calls exists and responds; a script or test walks the registry and confirms each registered path resolves to a route module.
- [ ] The product-category path collision is resolved to a single canonical endpoint, and no code references the rejected one.
- [ ] Create, edit, and delete work for products and product categories, and the list reflects the change after the write.
- [ ] Kanban card create, move, and delete persist for the session, and a page reload behaves as documented.
- [ ] Invoice delete removes the invoice and the list updates; the invoice details page renders for a valid id and shows an error state for an unknown one.
- [ ] All write calls go through the shared write helpers and the path registry; no raw `fetch` remains in the migrated surfaces, and no write call ignores its response.
- [ ] A failed write shows a visible error to the user and does not silently revert or hang.
- [ ] The mock-write persistence decision (disk vs in-memory) is documented in the repo docs.
- [ ] `pnpm test`, `pnpm lint`, and `pnpm typecheck` are clean.

**Tests:**

- Registry walk test: every registered path has a matching route module (catches the class of bug this ticket exists to fix).
- Route tests for create, update, and delete on product categories and tasks: 200 with `succeeded: true` and the updated entity in `data`; 400 on a malformed body; 404 on an unknown id.
- Component test: submitting the new-product drawer calls the write helper and refreshes the list.
- Component test: a rejected write renders an error notification.
- Manual: exercise the kanban drag flow and the invoice delete flow end to end.

**Dependencies / blocks:**

- Blocked by: 03 (shared route helper), 05 (fetch idiom settled).
- Blocks: 08 (mock-file cleanup depends on knowing which mock files are now written to).
- Relates to: 04 (write helpers extend the registry and hook conventions established there).

**Out of scope:**

- A real database, ORM, or persistence layer.
- Authentication, authorization, or per-user ownership on writes.
- Form validation redesign, optimistic-update polish, or undo.
- Optimizing or restructuring the mock JSON payloads.
- Adding write endpoints for any resource the UI does not already offer a write action for.
