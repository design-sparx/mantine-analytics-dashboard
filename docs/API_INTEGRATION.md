# API Integration Guide

This project uses a mock API system built on Next.js App Router route handlers and shared client hooks. All routes return a standard JSON envelope, and every endpoint path is registered in one place so renames stay compile-safe.

## Response envelope

Every API route returns the same shape:

```json
{
  "succeeded": true,
  "data": {},
  "errors": [],
  "message": "Retrieved successfully",
  "timestamp": "2026-10-04T19:00:00.000Z"
}
```

`src/types/api-response.ts` defines `IApiResponse<T>`. The shared helpers in `src/lib/api/mock-route.ts` (`apiSuccess`, `apiFailure`) and `src/lib/api/mock-write-route.ts` build these responses, so routes should not construct the envelope by hand.

## Reading data

### useApiGet

`src/lib/hooks/useApiGet.ts` exports the standard GET hook:

```ts
const { data, loading, error, refetch } = useApiGet<T>('/api/invoices');
```

`data` is already unwrapped from the envelope (`T | null`). `error` is an `ApiRequestError` when the route returns `succeeded: false` or a non-2xx status.

### Convenience hooks

`src/lib/hooks/useApi.ts` re-exports typed shortcuts for the core endpoints:

```ts
const { data, loading, error } = useInvoices();
const { data, loading, error } = useProducts();
const { data, loading, error } = useTasks();
```

### Typed dashboard fetches

`src/lib/api/useDashboardResource.ts` exports `useDashboardResource(endpoint)`. It infers the payload type from the registry constant you pass, so requesting an unregistered endpoint is a compile error:

```ts
import { API_CRM } from '@/routes/api';

const { data, loading, error } = useDashboardResource(API_CRM.stats);
// data is typed from the CRM stats fixture
```

## Writing data

`src/lib/hooks/useApiWrite.ts` exports `useApiWrite<T>(method, endpoint, options)`:

```ts
const { data, loading, error, refetch } = useApiWrite<IProduct>(
  'POST',
  '/api/products',
  { body: { title: 'New product', price: 9.99 } },
);
```

Options:

- `body` — request payload (JSON-stringified automatically).
- `autoExecute` — run on mount (`true` by default). Set to `false` to call `refetch()` manually.
- `onSuccess` — callback fired after a successful write.

For updates and deletes, use a detail path:

```ts
const { refetch: updateProduct } = useApiWrite<Product>(
  'PUT',
  '/api/products/prod-001',
  { body: { price: 19.99 } },
);

const { refetch: deleteProduct } = useApiWrite<{ id: string }>(
  'DELETE',
  '/api/products/prod-001',
);
```

## Route registry

`src/routes/api.ts` is the single source of truth for endpoint paths. Import from here instead of writing `/api/...` strings.

```ts
export const API_CORE = {
  invoices: api('/invoices'),
  products: api('/products'),
  tasks: api('/tasks'),
  // ...
} as const;

export const API_WRITE = {
  products: api('/products'),
  productDetail: (id: string) => apiDetailPath('products', id),
  productCategories: api('/product-categories'),
  productCategoryDetail: (id: string) =>
    apiDetailPath('product-categories', id),
  tasks: api('/tasks'),
  taskDetail: (id: string) => apiDetailPath('tasks', id),
  invoices: api('/invoices'),
  invoiceDetail: (id: string) => apiDetailPath('invoices', id),
} as const;
```

Detail paths are built with `apiDetailPath(collection, id)`. `API_ENDPOINTS` flattens every registered path for lookups.

## Mock data

Fixtures live in `public/mocks/*.json`. The in-memory store in `src/lib/api/mock-store.ts` reads fixtures once per process and caches them; writes apply to the cache only and do not persist to disk.

## Route helpers

`src/lib/api/mock-write-route.ts` exports two factory helpers:

- `buildReadRoute(fixture)` — returns a GET handler for a collection route.
- `buildWriteRoute(method, fixture, idParam?)` — returns a POST/PUT/DELETE handler. Pass `idParam` on `[id]` detail routes so the handler can read the dynamic segment.

Example collection route (`src/app/api/products/route.ts`):

```ts
import { buildReadRoute, buildWriteRoute } from '@/lib/api/mock-write-route';
import { API_WRITE } from '@/routes/api';

const FIXTURE = 'Products.json';

export const GET = buildReadRoute(FIXTURE);
export const POST = buildWriteRoute('POST', FIXTURE);
```

Example detail route (`src/app/api/products/[id]/route.ts`):

```ts
import { buildWriteRoute } from '@/lib/api/mock-write-route';

const FIXTURE = 'Products.json';

export const PUT = buildWriteRoute('PUT', FIXTURE, ':id');
export const DELETE = buildWriteRoute('DELETE', FIXTURE, ':id');
```

## Adding a new endpoint

1. Add a fixture JSON file to `public/mocks/`.
2. Register the path in `src/routes/api.ts` (`API_CORE` for reads, `API_WRITE` if it accepts writes).
3. Create `src/app/api/<path>/route.ts` using `buildReadRoute` / `buildWriteRoute`.
4. If the endpoint is consumed by a dashboard page, add its payload type to `src/types/generated-fixtures.ts` and use `useDashboardResource` with the registry constant.
5. If writes are needed, call `useApiWrite` from the consuming component.

## Commands

```bash
pnpm dev             # localhost:3000, React Compiler enabled
pnpm build           # next build
pnpm start           # next start
pnpm lint            # eslint .
pnpm typecheck       # tsc --noEmit
pnpm test            # vitest run
pnpm prettier        # prettier . --write
pnpm storybook       # port 6006
```
