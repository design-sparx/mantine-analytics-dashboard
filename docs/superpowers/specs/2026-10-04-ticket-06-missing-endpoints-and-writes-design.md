# Ticket 06 Design: Implement the missing endpoints and standardise mutating requests

**Date:** 2026-10-04  
**Status:** approved  
**Blocked by:** 03 (route helper), 05 (dashboard fetch idiom) — both merged

---

## 1. Problem

The UI offers write actions that do not work today:

- Product drawers POST/PUT/DELETE `/api/products` and `/api/products/:id` — products route is GET only.
- Category drawers POST/PUT/DELETE `/api/product-categories` and `/api/product-categories/:id` — route does not exist.
- Kanban board POST/PUT/DELETE `/api/tasks` and `/api/tasks/:id` — tasks route is GET only.
- Invoice page DELETE `/api/invoices/:id` — invoices route does not exist at all.
- Invoice details page GET `/api/invoices/:id` — also missing.
- Product and category drawers GET `/api/product-categories` for their select options — missing route.

Every one of these calls is a raw `fetch()` with inline method, body, and headers. There is no shared write helper, no typed payload, and no consistent error surfacing. A failed write is often invisible to the user.

There is also a naming collision: `/api/ecommerce/categories` already exists for revenue analytics. Product categories must live at `/api/product-categories`.

---

## 2. Persistence strategy (documented decision)

Writes are **process-lifetime only**. Routes seed an in-memory array from the mock fixture on first access. Mutations apply to that array and return the updated entity. No disk writes to `public/mocks/*.json`. Changes reset when the dev server restarts. This is documented here so the behavior is not a surprise.

---

## 3. New infrastructure

### 3.1 `src/lib/api/mock-store.ts`

Process-lifetime in-memory store keyed by endpoint path.

- `getAll<T>(fixture: string): T[]` — reads `public/mocks/<fixture>` once, caches the array, returns it.
- `getById<T>(fixture: string, id: string): T | undefined` — linear scan by `id`.
- `create<T>(fixture: string, body: T & { id?: string }): T` — assigns a synthetic string id if missing, pushes into the cached array, returns the new entity.
- `update<T>(fixture: string, id: string, patch: Partial<T>): T` — finds by id, applies patch, returns updated entity. Throws 404 if missing.
- `delete(fixture: string, id: string): void` — removes by id. Throws 404 if missing.

Seeding is lazy and per-fixture. The store never mutates files on disk.

### 3.2 `src/lib/api/mock-write-route.ts`

Shared write-route builder used by all new route files.

Exports:

- `buildWriteRoute(method: 'POST' | 'PUT' | 'DELETE' | 'GET', fixture: string, idParam?: string)` — returns a Next.js `RouteHandler` that:
  - validates method, returns 405 if not allowed
  - delegates to `mock-store` for CRUD
  - wraps result in `apiSuccess()` or `apiFailure()` from `mock-route.ts`
- `buildReadRoute(fixture: string)` — GET collection handler, delegates to `serveMock`

### 3.3 `src/lib/hooks/useApiWrite.ts`

Write hook mirroring `useApiGet`'s return shape.

```ts
type ApiWriteResult<T> = {
  data: T | null;
  loading: boolean;
  error: ApiRequestError | null;
  refetch: () => Promise<void>;
};
```

Signature:

```ts
function useApiWrite<T>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  options?: { body?: unknown; onSuccess?: () => void },
): ApiWriteResult<T>;
```

Behavior:

- Sends `fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(options.body) })`
- Unwraps the standard envelope (`data` on success, `error` on failure)
- Calls `onSuccess` after a successful write so callers can invalidate or refetch
- `refetch` repeats the same write (used by retry flows)

---

## 4. Registry additions (`src/routes/api.ts`)

Add four new registry objects:

```ts
export const API_PRODUCTS = {
  list: api('/products'),
  detail: api('/products/:id'),
  categories: api('/product-categories'),
  categoryDetail: api('/product-categories/:id'),
} as const;

export const API_TASKS = {
  list: api('/tasks'),
  detail: api('/tasks/:id'),
} as const;

export const API_INVOICES = {
  list: api('/invoices'),
  detail: api('/invoices/:id'),
} as const;
```

Keep `API_ECOMMERCE.categories` for revenue analytics — do not rename or repurpose it.

---

## 5. Write endpoints to implement

### 5.1 `/api/tasks`

| Method        | Behavior                                                       | Fixture            |
| ------------- | -------------------------------------------------------------- | ------------------ |
| GET           | All tasks                                                      | `KanbanTasks.json` |
| POST          | Create task with `{ title, status, ... }`, assign synthetic id | `KanbanTasks.json` |
| PUT `/:id`    | Update task fields                                             | `KanbanTasks.json` |
| DELETE `/:id` | Remove task                                                    | `KanbanTasks.json` |

### 5.2 `/api/products`

| Method        | Behavior       | Fixture         |
| ------------- | -------------- | --------------- |
| GET           | All products   | `Products.json` |
| POST          | Create product | `Products.json` |
| PUT `/:id`    | Update product | `Products.json` |
| DELETE `/:id` | Remove product | `Products.json` |

### 5.3 `/api/product-categories`

| Method        | Behavior        | Fixture                                                                                   |
| ------------- | --------------- | ----------------------------------------------------------------------------------------- |
| GET           | All categories  | existing product categories fixture, or seed from products if no dedicated fixture exists |
| POST          | Create category | same                                                                                      |
| PUT `/:id`    | Update category | same                                                                                      |
| DELETE `/:id` | Remove category | same                                                                                      |

If no dedicated fixture exists, the route seeds an in-memory default list. Document the choice.

### 5.4 `/api/invoices`

| Method        | Behavior       | Fixture         |
| ------------- | -------------- | --------------- |
| GET           | All invoices   | `Invoices.json` |
| DELETE `/:id` | Remove invoice | `Invoices.json` |

Also add `GET /api/invoices/:id` for the details page.

---

## 6. UI surface migrations

### 6.1 Kanban board (`src/components/kanban-board/KanbanBoard.tsx`)

Replace raw `fetch()` in 5 places with `useApiWrite`:

- `createTask` → `useApiWrite('POST', API_TASKS.list, { body })`
- `deleteTask` → `useApiWrite('DELETE', API_TASKS.detail(id), {})`
- `updateTask` → `useApiWrite('PUT', API_TASKS.detail(id), { body })`
- silent drag updates (2 places) → same `useApiWrite('PUT', ...)` pattern

After each successful write, refetch the task list from `API_TASKS.list` via `useApiGet` or the hook's `refetch`.

### 6.2 Product drawers

**NewProductDrawer.tsx:**

- Category select: replace `fetch('/api/product-categories')` with `useApiGet(API_PRODUCTS.categories)`
- Submit: replace `fetch('/api/products', { method: 'POST' })` with `useApiWrite('POST', API_PRODUCTS.list, { body, onSuccess })`

**EditProductDrawer.tsx:**

- Category select: same `useApiGet` swap
- Submit update: replace `fetch('/api/products/${id}', { method: 'PUT' })` with `useApiWrite('PUT', API_PRODUCTS.detail(id), { body, onSuccess })`
- Delete button: replace `fetch('/api/products/${id}', { method: 'DELETE' })` with `useApiWrite('DELETE', API_PRODUCTS.detail(id), { onSuccess })`

### 6.3 Category drawers

**NewCategoryDrawer.tsx:**

- Submit: `useApiWrite('POST', API_PRODUCTS.categories, { body, onSuccess })`

**EditCategoryDrawer.tsx:**

- Submit update: `useApiWrite('PUT', API_PRODUCTS.categoryDetail(id), { body, onSuccess })`
- Delete button: `useApiWrite('DELETE', API_PRODUCTS.categoryDetail(id), { onSuccess })`

### 6.4 Invoice page (`src/app/apps/invoices/page.tsx`)

- Delete handler: replace raw `fetch('/api/invoices/${id}', { method: 'DELETE' })` with `useApiWrite('DELETE', API_INVOICES.detail(id), { onSuccess })`
- Create and update handlers: replace mock-success returns with real `useApiWrite('POST'/'PUT', API_INVOICES.list, { body, onSuccess })`

### 6.5 Invoice details page (`src/app/apps/invoices/details/[id]/page.tsx`)

- Replace `useFetch<IApiResponse<IInvoice>>('/api/invoices/${params.id}')` with `useApiGet<InvoiceDto>(API_INVOICES.detail(params.id))`

---

## 7. Error handling

All write routes return standard envelope:

- **200/201** — `apiSuccess({ succeeded: true, data: updatedEntity, errors: [], message: 'ok' })`
- **400** — `apiFailure({ succeeded: false, data: null, errors: ['validation error'], message: 'Bad request' })`
- **404** — `apiFailure({ succeeded: false, data: null, errors: ['not found'], message: 'Not found' })`
- **405** — `apiFailure({ succeeded: false, data: null, errors: ['method not allowed'], message: 'Method not allowed' })`

`useApiWrite` maps envelope `errors[0]` to its `error.message`. UI surfaces display errors via existing `ErrorAlert` or Mantine `Notification`.

Required-field validation is minimal: POST/PUT bodies must be non-null objects with a valid id shape. The ticket does not require form-validation redesign.

---

## 8. Tests

### Route tests

Each write route gets tests for:

- **200 with success envelope** — POST creates, PUT updates, DELETE removes, GET-by-id returns the entity.
- **400 on malformed body** — null body, missing id on PUT.
- **404 on unknown id** — PUT/DELETE/GET-by-id with a non-existent id returns 404.
- **405 on wrong method** — e.g., POST to a read-only detail route.

### Store test

- `mock-store.test.ts` — CRUD lifecycle for tasks, products, product-categories, invoices. Assert seeded data matches fixture, create appends, update patches, delete removes, findAll reflects mutations.

### UI tests

- Product new/edit drawer: submitting calls `useApiWrite` and `onSuccess` refetches the list.
- Category new/edit drawer: same.
- Kanban board: create, drag-update, and delete all call `useApiWrite` and refresh the task list.
- Invoice page: delete calls `useApiWrite` and removes the invoice from the list; create and update submit real requests.
- Rejected write renders an error notification.

### Integration / registry tests

- Registry walk: every registered path has a route module.
- `dashboard-api-usage.test.ts` is not affected — this ticket covers apps pages and shared components, not dashboards.
- Add a test that asserts no raw `fetch('/api/...')` with POST/PUT/DELETE remains in `src/app/apps/` and `src/components/`.

---

## 9. Out of scope

- Disk persistence for writes. The in-memory decision is documented and intentional.
- Authentication, authorization, or per-user ownership on writes.
- Form validation redesign, optimistic updates, or undo.
- Kanban drag-and-drop UX polish beyond making the write calls work.
- Renaming fixture files or restructuring `public/mocks/` (left to ticket 08).
- Any write endpoints for resources the UI does not already call.
