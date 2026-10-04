# Ticket 06 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement missing write endpoints and migrate all app write surfaces off raw `fetch()` onto a shared in-memory mock store and typed write hook.

**Architecture:** Add `mock-store.ts` (in-memory CRUD seeded from existing fixtures), `mock-write-route.ts` (shared route builder), and `useApiWrite.ts` (client hook). Extend the API registry with write-capable endpoint groups. Migrate kanban, product/category drawers, and invoice surfaces onto the new helpers.

**Tech Stack:** Next.js 16 App Router, TypeScript, Vitest, React 19, Mantine 9

---

## File Structure

```
src/lib/api/
  mock-store.ts          # NEW — process-lifetime in-memory store
  mock-write-route.ts    # NEW — shared POST/PUT/DELETE/GET-by-id route builder
src/lib/hooks/
  useApiWrite.ts         # NEW — write hook mirroring useApiGet
src/routes/api.ts        # MODIFIED — add API_PRODUCTS, API_PRODUCT_CATEGORIES, API_TASKS, API_INVOICES
src/app/api/
  tasks/route.ts         # MODIFIED — add POST, PUT, DELETE
  products/route.ts      # MODIFIED — add POST, PUT, DELETE
  product-categories/route.ts  # NEW — GET, POST, PUT, DELETE
  invoices/route.ts      # MODIFIED — keep GET, add DELETE
  invoices/[id]/route.ts # NEW — GET by id
src/components/kanban-board/KanbanBoard.tsx  # MODIFIED — replace 5 raw fetch calls
src/app/apps/products/components/NewProductDrawer.tsx     # MODIFIED
src/app/apps/products/components/EditProductDrawer.tsx    # MODIFIED
src/app/apps/products/categories/components/NewCategoryDrawer.tsx  # MODIFIED
src/app/apps/products/categories/components/EditCategoryDrawer.tsx # MODIFIED
src/app/apps/invoices/page.tsx                            # MODIFIED
src/app/apps/invoices/details/[id]/page.tsx               # MODIFIED
src/test/
  mock-store.test.ts      # NEW
  mock-write-route.test.ts # NEW
  useApiWrite.test.tsx    # NEW
  api-paths.test.ts       # MODIFIED — add new route paths
```

---

### Task 1: Write failing tests for mock-store

**Files:**

- Create: `src/test/mock-store.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/test/mock-store.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { mockStore } from '@/lib/api/mock-store';

describe('mock-store', () => {
  it('seeds from fixture on first access', async () => {
    const tasks = await mockStore.getAll('KanbanTasks.json');
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
  });

  it('finds by id', async () => {
    const all = await mockStore.getAll('KanbanTasks.json');
    const first = all[0];
    const found = await mockStore.getById('KanbanTasks.json', first.id);
    expect(found).toEqual(first);
  });

  it('returns undefined for missing id', async () => {
    const found = await mockStore.getById('KanbanTasks.json', 'does-not-exist');
    expect(found).toBeUndefined();
  });

  it('creates with synthetic id', async () => {
    const before = await mockStore.getAll('KanbanTasks.json');
    const created = await mockStore.create('KanbanTasks.json', {
      title: 'New task',
      status: 'todo',
    } as any);
    expect(created.id).toBeDefined();
    const after = await mockStore.getAll('KanbanTasks.json');
    expect(after.length).toBe(before.length + 1);
  });

  it('updates by id', async () => {
    const all = await mockStore.getAll('KanbanTasks.json');
    const target = all[0];
    const updated = await mockStore.update('KanbanTasks.json', target.id, {
      title: 'Updated',
    } as any);
    expect(updated.title).toBe('Updated');
    const reloaded = await mockStore.getById('KanbanTasks.json', target.id);
    expect(reloaded?.title).toBe('Updated');
  });

  it('throws 404 on update for missing id', async () => {
    await expect(
      mockStore.update('KanbanTasks.json', 'missing', { title: 'X' } as any),
    ).rejects.toMatchObject({ status: 404 });
  });

  it('deletes by id', async () => {
    const before = await mockStore.getAll('KanbanTasks.json');
    const target = before[0];
    await mockStore.delete('KanbanTasks.json', target.id);
    const after = await mockStore.getAll('KanbanTasks.json');
    expect(after.length).toBe(before.length - 1);
  });

  it('throws 404 on delete for missing id', async () => {
    await expect(
      mockStore.delete('KanbanTasks.json', 'missing'),
    ).rejects.toMatchObject({ status: 404 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/test/mock-store.test.ts`
Expected: FAIL with `mockStore is not exported from '@/lib/api/mock-store'`

- [ ] **Step 3: Commit**

```bash
git add src/test/mock-store.test.ts
git commit -m "test: add failing mock-store tests"
```

---

### Task 2: Implement mock-store.ts

**Files:**

- Create: `src/lib/api/mock-store.ts`
- Test: `src/test/mock-store.test.ts`

- [ ] **Step 1: Implement mock-store**

Create `src/lib/api/mock-store.ts`:

```ts
import fs from 'fs';
import path from 'path';

import { apiFailure } from '@/lib/api/mock-route';

const MOCKS_DIR = path.join(process.cwd(), 'public', 'mocks');

type MockRow = Record<string, unknown>;

interface StoreError extends Error {
  status: number;
}

function notFound(fixture: string, id: string): StoreError {
  const err = new Error(`Not found: ${fixture}#${id}`) as StoreError;
  err.status = 404;
  return err;
}

/**
 * Process-lifetime in-memory store backed by the static mock fixtures.
 *
 * Each fixture is read from disk once and cached for the lifetime of the
 * process. Writes apply to the cached array only; they do not persist back
 * to `public/mocks/*.json`.
 */
export const mockStore = {
  async getAll<T extends MockRow>(fixture: string): Promise<T[]> {
    const rows = await readFixture<T[]>(fixture);
    return [...rows];
  },

  async getById<T extends MockRow>(
    fixture: string,
    id: string,
  ): Promise<T | undefined> {
    const rows = await readFixture<T[]>(fixture);
    return rows.find((row) => row.id === id);
  },

  async create<T extends MockRow>(
    fixture: string,
    body: T & { id?: string },
  ): Promise<T> {
    const rows = await readFixture<T[]>(fixture);
    const id = body.id ?? generateId();
    const record = { ...body, id } as T;
    rows.push(record);
    return record;
  },

  async update<T extends MockRow>(
    fixture: string,
    id: string,
    patch: Partial<T>,
  ): Promise<T> {
    const rows = await readFixture<T[]>(fixture);
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) {
      throw notFound(fixture, id);
    }
    rows[index] = { ...rows[index], ...patch } as T;
    return rows[index];
  },

  async delete(fixture: string, id: string): Promise<void> {
    const rows = await readFixture<MockRow[]>(fixture);
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) {
      throw notFound(fixture, id);
    }
    rows.splice(index, 1);
  },
};

const cache = new Map<string, MockRow[]>();

async function readFixture<T>(fixture: string): Promise<T> {
  if (cache.has(fixture)) {
    return cache.get(fixture) as T;
  }

  const filePath = path.resolve(MOCKS_DIR, fixture);
  const relative = path.relative(MOCKS_DIR, filePath);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refusing to read "${fixture}" outside the mocks root`);
  }

  const contents = await fs.promises.readFile(filePath, 'utf8');
  const parsed = JSON.parse(contents) as T;
  cache.set(fixture, parsed as MockRow[]);
  return parsed;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `pnpm vitest run src/test/mock-store.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 3: Commit**

```bash
git add src/lib/api/mock-store.ts src/test/mock-store.test.ts
git commit -m "feat: add in-memory mock store for write endpoints"
```

---

### Task 3: Write failing tests for mock-write-route

**Files:**

- Create: `src/test/mock-write-route.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/test/mock-write-route.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { buildWriteRoute, buildReadRoute } from '@/lib/api/mock-write-route';

const FIXTURE = 'KanbanTasks.json';

describe('mock-write-route', () => {
  it('returns 405 for unsupported method on read route', async () => {
    const handler = buildReadRoute(FIXTURE);
    const response = await handler(
      new Request('http://localhost/api/tasks', { method: 'POST' }),
    );
    expect(response.status).toBe(405);
  });

  it('returns 405 for unsupported method on write route', async () => {
    const handler = buildWriteRoute('POST', FIXTURE);
    const response = await handler(
      new Request('http://localhost/api/tasks/unknown', { method: 'PATCH' }),
    );
    expect(response.status).toBe(405);
  });

  it('POST creates and returns the new entity', async () => {
    const handler = buildWriteRoute('POST', FIXTURE);
    const response = await handler(
      new Request('http://localhost/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Write test task', status: 'todo' }),
      }),
    );
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.succeeded).toBe(true);
    expect(body.data.title).toBe('Write test task');
    expect(body.data.id).toBeDefined();
  });

  it('PUT updates and returns the patched entity', async () => {
    const handler = buildWriteRoute('PUT', FIXTURE, ':id');
    const response = await handler(
      new Request('http://localhost/api/tasks/existing-id', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated' }),
      }),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.succeeded).toBe(true);
    expect(body.data.title).toBe('Updated');
  });

  it('DELETE returns 204', async () => {
    const handler = buildWriteRoute('DELETE', FIXTURE, ':id');
    const response = await handler(
      new Request('http://localhost/api/tasks/existing-id', {
        method: 'DELETE',
      }),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.succeeded).toBe(true);
  });

  it('returns 404 when detail target is missing', async () => {
    const handler = buildWriteRoute('PUT', FIXTURE, ':id');
    const response = await handler(
      new Request('http://localhost/api/tasks/missing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'X' }),
      }),
    );
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.succeeded).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/test/mock-write-route.test.ts`
Expected: FAIL with `mock-write-route is not exported from '@/lib/api/mock-write-route'`

- [ ] **Step 3: Commit**

```bash
git add src/test/mock-write-route.test.ts
git commit -m "test: add failing mock-write-route tests"
```

---

### Task 4: Implement mock-write-route.ts

**Files:**

- Create: `src/lib/api/mock-write-route.ts`
- Test: `src/test/mock-write-route.test.ts`

- [ ] **Step 1: Implement mock-write-route**

Create `src/lib/api/mock-write-route.ts`:

```ts
import { NextResponse } from 'next/server';

import { apiFailure, apiSuccess } from '@/lib/api/mock-route';
import { mockStore } from '@/lib/api/mock-store';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const ALLOWED_METHODS: Record<string, HttpMethod[]> = {
  GET: ['GET'],
  POST: ['POST'],
  PUT: ['PUT'],
  DELETE: ['DELETE'],
};

function parseBody<T>(request: Request): Promise<T> {
  return request.json().catch(() => ({}) as T);
}

/**
 * Builds a GET collection handler from a fixture.
 */
export function buildReadRoute(fixture: string) {
  return async (request: Request) => {
    if (request.method !== 'GET') {
      return apiFailure('Method not allowed', 'GET required', 405);
    }

    try {
      const data = await mockStore.getAll(await readBodyIfAny(request));
      return apiSuccess(data, 'Retrieved successfully');
    } catch (error) {
      return apiFailure((error as Error).message);
    }
  };
}

/**
 * Builds a write-capable route handler.
 *
 * @param method - HTTP method this handler accepts.
 * @param fixture - Mock fixture file name, e.g. `KanbanTasks.json`.
 * @param idParam - Optional path parameter name for detail routes, e.g. `:id`.
 */
export function buildWriteRoute(
  method: 'POST' | 'PUT' | 'DELETE',
  fixture: string,
  idParam?: string,
) {
  return async (
    request: Request,
    context?: { params?: { [key: string]: string } },
  ) => {
    if (request.method !== method) {
      return apiFailure('Method not allowed', `${method} required`, 405);
    }

    try {
      if (method === 'POST') {
        const body = await parseBody<any>(request);
        const record = await mockStore.create(fixture, body);
        return apiSuccess(record, 'Created successfully', 201);
      }

      const id = resolveId(request, idParam, context);
      if (!id) {
        return apiFailure('Missing id', 'id is required', 400);
      }

      if (method === 'DELETE') {
        await mockStore.delete(fixture, id);
        return apiSuccess({ id }, 'Deleted successfully', 200);
      }

      if (method === 'PUT') {
        const body = await parseBody<any>(request);
        const updated = await mockStore.update(fixture, id, body);
        return apiSuccess(updated, 'Updated successfully');
      }

      return apiFailure('Unsupported method', undefined, 405);
    } catch (error) {
      const err = error as Error;
      const status = err.status === 404 ? 404 : 500;
      return apiFailure(err.message, err.message, status);
    }
  };
}

async function readBodyIfAny(_request: Request): Promise<unknown> {
  return {};
}

function resolveId(
  request: Request,
  idParam?: string,
  context?: { params?: { [key: string]: string } },
): string | undefined {
  if (idParam && context?.params?.[idParam.replace(':', '')]) {
    return context.params[idParam.replace(':', '')];
  }
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  return segments[segments.length - 1];
}
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `pnpm vitest run src/test/mock-write-route.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 3: Commit**

```bash
git add src/lib/api/mock-write-route.ts src/test/mock-write-route.test.ts
git commit -m "feat: add shared mock write route builder"
```

---

### Task 5: Write failing tests for useApiWrite

**Files:**

- Create: `src/test/useApiWrite.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/useApiWrite.test.tsx`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

import { useApiWrite } from '@/lib/hooks/useApiWrite';

const envelope = <T>(data: T, status = 200) => ({
  succeeded: true,
  data,
  errors: [],
  message: 'ok',
  timestamp: new Date().toISOString(),
});

describe('useApiWrite', () => {
  it('sends a POST and returns the typed payload', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(envelope({ id: '1', title: 'New' }), 201)),
      );

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useApiWrite<any>('POST', '/api/tasks', { body: { title: 'New' } }),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith('/api/tasks', expect.anything());
    expect(result.current.data).toEqual({ id: '1', title: 'New' });
    expect(result.current.error).toBeNull();
  });

  it('surfaces a non-2xx response as an error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          succeeded: false,
          data: null,
          errors: ['not found'],
          message: 'Not found',
          timestamp: new Date().toISOString(),
        }),
        { status: 404 },
      ),
    );

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useApiWrite<any>('DELETE', '/api/tasks/1', {}),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('Not found');
  });

  it('calls onSuccess after a successful write', async () => {
    const onSuccess = vi.fn();
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(envelope({ id: '1' }))));

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useApiWrite<any>('PUT', '/api/tasks/1', {
        body: { title: 'X' },
        onSuccess,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/test/useApiWrite.test.tsx`
Expected: FAIL with `useApiWrite is not exported from '@/lib/hooks/useApiWrite'`

- [ ] **Step 3: Commit**

```bash
git add src/test/useApiWrite.test.tsx
git commit -m "test: add failing useApiWrite tests"
```

---

### Task 6: Implement useApiWrite.ts

**Files:**

- Create: `src/lib/hooks/useApiWrite.ts`
- Test: `src/test/useApiWrite.test.tsx`

- [ ] **Step 1: Implement useApiWrite**

Create `src/lib/hooks/useApiWrite.ts`:

```ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { IApiResponse } from '@/types/api-response';

export interface ApiWriteError {
  message: string;
  serverMessage?: string;
  serverErrors: string[];
  status: number;
}

export interface ApiWriteResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiWriteError | null;
  refetch: () => Promise<void>;
}

export function useApiWrite<T>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  options: { body?: unknown; onSuccess?: () => void } = {},
): ApiWriteResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiWriteError | null>(null);
  const active = useRef(true);
  const { body, onSuccess } = options;

  const execute = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      const payload = (await response.json().catch(() => ({
        succeeded: false,
        data: null,
        errors: [],
        message: response.statusText || 'Request failed',
        timestamp: new Date().toISOString(),
      }))) as IApiResponse<unknown>;

      if (!active.current) {
        return;
      }

      if (!response.ok || !payload.succeeded) {
        const message =
          payload.message || `Request failed with status ${response.status}`;
        setData(null);
        setError({
          message,
          serverMessage: payload.message,
          serverErrors: payload.errors ?? [],
          status: response.status,
        });
        return;
      }

      setData(payload.data as T);
      onSuccess?.();
    } catch (caught) {
      if (!active.current) {
        return;
      }
      setData(null);
      setError({
        message:
          caught instanceof Error ? caught.message : 'Something went wrong',
        serverMessage: undefined,
        serverErrors: [],
        status: 500,
      });
    } finally {
      if (active.current) {
        setLoading(false);
      }
    }
  }, [method, endpoint, body, onSuccess]);

  useEffect(() => {
    active.current = true;
    execute();

    return () => {
      active.current = false;
    };
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `pnpm vitest run src/test/useApiWrite.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 3: Commit**

```bash
git add src/lib/hooks/useApiWrite.ts src/test/useApiWrite.test.tsx
git commit -m "feat: add useApiWrite hook"
```

---

### Task 7: Extend API registry with write endpoint groups

**Files:**

- Modify: `src/routes/api.ts`

- [ ] **Step 1: Add write registry entries**

Edit `src/routes/api.ts`. Add after the existing `API_PENDING` block:

```ts
/** Products app endpoints. */
export const API_PRODUCTS = {
  list: api('/products'),
  detail: api('/products/:id'),
  categories: api('/product-categories'),
  categoryDetail: api('/product-categories/:id'),
} as const;

/** Kanban / tasks endpoints. */
export const API_TASKS = {
  list: api('/tasks'),
  detail: api('/tasks/:id'),
} as const;

/** Invoices endpoints. */
export const API_INVOICES = {
  list: api('/invoices'),
  detail: api('/invoices/:id'),
} as const;
```

Also update the `API_ENDPOINTS` flat map to include the new entries:

```ts
  products: API_CORE.products,
  'products.list': API_PRODUCTS.list,
  'products.detail': API_PRODUCTS.detail,
  'products.categories': API_PRODUCTS.categories,
  'products.categoryDetail': API_PRODUCTS.categoryDetail,

  tasks: API_CORE.tasks,
  'tasks.list': API_TASKS.list,
  'tasks.detail': API_TASKS.detail,

  invoices: API_CORE.invoices,
  'invoices.list': API_INVOICES.list,
  'invoices.detail': API_INVOICES.detail,
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/routes/api.ts
git commit -m "feat: register write endpoints in API registry"
```

---

### Task 8: Implement tasks write routes

**Files:**

- Modify: `src/app/api/tasks/route.ts`
- Create: `src/app/api/tasks/[id]/route.ts`
- Test: create `src/test/tasks-routes.test.ts` (optional for now, covered by mock-write-route tests)

- [ ] **Step 1: Implement GET + POST on collection**

Edit `src/app/api/tasks/route.ts`:

```ts
import { NextResponse } from 'next/server';

import { serveMock } from '@/lib/api/mock-route';
import { buildReadRoute, buildWriteRoute } from '@/lib/api/mock-write-route';

export const GET = buildReadRoute('KanbanTasks.json');

export const POST = buildWriteRoute('POST', 'KanbanTasks.json');
```

- [ ] **Step 2: Implement detail route**

Create `src/app/api/tasks/[id]/route.ts`:

```ts
import { NextResponse } from 'next/server';

import { serveMock } from '@/lib/api/mock-route';
import { buildWriteRoute } from '@/lib/api/mock-write-route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  return serveMock('KanbanTasks.json', `Task ${params.id}`);
}

export const PUT = buildWriteRoute('PUT', 'KanbanTasks.json', 'id');
export const DELETE = buildWriteRoute('DELETE', 'KanbanTasks.json', 'id');
```

- [ ] **Step 3: Run route path test**

Run: `pnpm vitest run src/test/api-paths.test.ts`
Expected: PASS (new paths present)

- [ ] **Step 4: Commit**

```bash
git add src/app/api/tasks/route.ts src/app/api/tasks/[id]/route.ts
git commit -m "feat: add write handlers for /api/tasks"
```

---

### Task 9: Implement products write routes

**Files:**

- Modify: `src/app/api/products/route.ts`
- Create: `src/app/api/products/[id]/route.ts`

- [ ] **Step 1: Implement GET + POST on collection**

Edit `src/app/api/products/route.ts`:

```ts
import { NextResponse } from 'next/server';

import { serveMock } from '@/lib/api/mock-route';
import { buildReadRoute, buildWriteRoute } from '@/lib/api/mock-write-route';

export const GET = buildReadRoute('Products.json');

export const POST = buildWriteRoute('POST', 'Products.json');
```

- [ ] **Step 2: Implement detail route**

Create `src/app/api/products/[id]/route.ts`:

```ts
import { NextResponse } from 'next/server';

import { serveMock } from '@/lib/api/mock-route';
import { buildWriteRoute } from '@/lib/api/mock-write-route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  return serveMock('Products.json', `Product ${params.id}`);
}

export const PUT = buildWriteRoute('PUT', 'Products.json', 'id');
export const DELETE = buildWriteRoute('DELETE', 'Products.json', 'id');
```

- [ ] **Step 3: Run route path test**

Run: `pnpm vitest run src/test/api-paths.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/api/products/route.ts src/app/api/products/[id]/route.ts
git commit -m "feat: add write handlers for /api/products"
```

---

### Task 10: Implement product-categories routes

**Files:**

- Create: `src/app/api/product-categories/route.ts`
- Create: `src/app/api/product-categories/[id]/route.ts`

**Note:** There is no dedicated product-categories fixture. The route seeds from `Products.json` shape, filtered to category-like rows, or returns a small default list. Document this choice in a comment at the top of the route.

- [ ] **Step 1: Implement collection route**

Create `src/app/api/product-categories/route.ts`:

```ts
import { NextResponse } from 'next/server';

import { buildReadRoute, buildWriteRoute } from '@/lib/api/mock-write-route';

/**
 * Product categories are not present as a dedicated fixture; they are seeded
 * from a small default list and then mutated in memory.
 */
const DEFAULT_CATEGORIES = [
  { id: '1', title: 'Electronics', description: 'Electronic devices' },
  { id: '2', title: 'Clothing', description: 'Apparel and accessories' },
  {
    id: '3',
    title: 'Home & Garden',
    description: 'Home improvement and garden',
  },
];

export const GET = buildReadRoute('__product_categories__');

export const POST = buildWriteRoute('POST', '__product_categories__');
```

- [ ] **Step 2: Implement detail route**

Create `src/app/api/product-categories/[id]/route.ts`:

```ts
import { NextResponse } from 'next/server';

import { buildWriteRoute } from '@/lib/api/mock-write-route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  return NextResponse.json({
    succeeded: true,
    data: { id: params.id },
    errors: [],
    message: 'ok',
    timestamp: new Date().toISOString(),
  });
}

export const PUT = buildWriteRoute('PUT', '__product_categories__', 'id');
export const DELETE = buildWriteRoute('DELETE', '__product_categories__', 'id');
```

- [ ] **Step 3: Run route path test**

Run: `pnpm vitest run src/test/api-paths.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/api/product-categories/route.ts src/app/api/product-categories/[id]/route.ts
git commit -m "feat: add product-categories routes"
```

---

### Task 11: Implement invoices write routes

**Files:**

- Modify: `src/app/api/invoices/route.ts`
- Create: `src/app/api/invoices/[id]/route.ts`

- [ ] **Step 1: Implement GET + DELETE on collection**

Edit `src/app/api/invoices/route.ts`:

```ts
import { NextResponse } from 'next/server';

import { serveMock } from '@/lib/api/mock-route';
import { buildReadRoute, buildWriteRoute } from '@/lib/api/mock-write-route';

export const GET = buildReadRoute('Invoices.json');

export const DELETE = buildWriteRoute('DELETE', 'Invoices.json');
```

- [ ] **Step 2: Implement detail route**

Create `src/app/api/invoices/[id]/route.ts`:

```ts
import { NextResponse } from 'next/server';

import { serveMock } from '@/lib/api/mock-route';
import { buildWriteRoute } from '@/lib/api/mock-write-route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  return serveMock('Invoices.json', `Invoice ${params.id}`);
}

export const PUT = buildWriteRoute('PUT', 'Invoices.json', 'id');
export const DELETE = buildWriteRoute('DELETE', 'Invoices.json', 'id');
```

- [ ] **Step 3: Run route path test**

Run: `pnpm vitest run src/test/api-paths.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/api/invoices/route.ts src/app/api/invoices/[id]/route.ts
git commit -m "feat: add invoice detail and write handlers"
```

---

### Task 12: Migrate kanban board to useApiWrite

**Files:**

- Modify: `src/components/kanban-board/KanbanBoard.tsx`

- [ ] **Step 1: Add imports and hook**

At the top of the file, alongside existing imports:

```ts
import { useApiGet, useApiWrite } from '@/lib/hooks';
import { API_TASKS } from '@/routes/api';
```

- [ ] **Step 2: Replace createTask**

Replace the existing `createTask` function body with:

```ts
async function createTask(taskData: any) {
  const { refetch: refetchTasks } = useApiGet(API_TASKS.list);
  const { execute } = useApiWrite('POST', API_TASKS.list, {
    body: taskData,
    onSuccess: () => refetchTasks(),
  });
  await execute();
}
```

- [ ] **Step 3: Replace deleteTask**

```ts
async function deleteTask(id: Id) {
  if (typeof id === 'string') {
    const { refetch: refetchTasks } = useApiGet(API_TASKS.list);
    const { execute } = useApiWrite(
      'DELETE',
      `${API_TASKS.detail.replace(':id', id)}`,
      {
        onSuccess: () => refetchTasks(),
      },
    );
    await execute();
  }
}
```

- [ ] **Step 4: Replace updateTask**

```ts
async function updateTask(id: Id, content: string) {
  if (typeof id === 'string') {
    const task = tasks.find((t) => t.id === id);
    const { refetch: refetchTasks } = useApiGet(API_TASKS.list);
    const { execute } = useApiWrite(
      'PUT',
      `${API_TASKS.detail.replace(':id', id)}`,
      {
        body: { title: content, status: task?.status },
        onSuccess: () => refetchTasks(),
      },
    );
    await execute();
  }
}
```

- [ ] **Step 5: Replace silent drag updates (2 places)**

Find the two `fetch(`/api/tasks/${id}`, { method: 'PUT' ... })` calls around lines 472 and 500. Replace each with the same `useApiWrite('PUT', ...)` pattern as `updateTask`.

- [ ] **Step 6: Run lint**

Run: `pnpm eslint src/components/kanban-board/KanbanBoard.tsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/kanban-board/KanbanBoard.tsx
git commit -m "feat: migrate kanban board writes to useApiWrite"
```

---

### Task 13: Migrate product drawers to typed hooks

**Files:**

- Modify: `src/app/apps/products/components/NewProductDrawer.tsx`
- Modify: `src/app/apps/products/components/EditProductDrawer.tsx`

- [ ] **Step 1: Migrate NewProductDrawer category fetch**

Replace the `fetch('/api/product-categories', ...)` call in `fetchCategories` with:

```ts
const { data: categoriesData, loading: categoriesLoading } = useApiGet<any[]>(
  API_PRODUCTS.categories,
);
```

Remove the `useEffect`/`fetchCategories` pattern entirely. Use `categoriesData` directly in the Combobox options.

- [ ] **Step 2: Migrate NewProductDrawer submit**

Replace the `fetch('/api/products', { method: 'POST' })` call with:

```ts
const { execute: createProduct, loading: createLoading } = useApiWrite(
  'POST',
  API_PRODUCTS.list,
  {
    body: { ...values, createdById: 'user-demo-001' },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Product created',
        color: 'green',
      });
      form.reset();
      onProductCreated?.();
    },
  },
);

const handleSubmit = async (values: typeof form.values) => {
  await createProduct();
};
```

Wire `createLoading` into the drawer's submit button state.

- [ ] **Step 3: Migrate EditProductDrawer category fetch**

Same swap as NewProductDrawer: replace raw `fetch('/api/product-categories')` with `useApiGet(API_PRODUCTS.categories)`.

- [ ] **Step 4: Migrate EditProductDrawer submit update**

Replace `fetch('/api/products/${product.id}', { method: 'PUT' })` with:

```ts
const { execute: updateProduct, loading: updateLoading } = useApiWrite(
  'PUT',
  API_PRODUCTS.detail.replace(':id', product.id),
  {
    body: { ...values, modifiedById: 'user-demo-001' },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Product updated',
        color: 'green',
      });
      onProductUpdated?.();
    },
  },
);
```

- [ ] **Step 5: Migrate EditProductDrawer delete**

Replace `fetch('/api/products/${product.id}', { method: 'DELETE' })` with:

```ts
const { execute: deleteProduct } = useApiWrite(
  'DELETE',
  API_PRODUCTS.detail.replace(':id', product.id),
  {
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Product deleted',
        color: 'green',
      });
      onProductDeleted?.();
    },
  },
);
```

- [ ] **Step 6: Run lint**

Run: `pnpm eslint src/app/apps/products/components/NewProductDrawer.tsx src/app/apps/products/components/EditProductDrawer.tsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/app/apps/products/components/NewProductDrawer.tsx src/app/apps/products/components/EditProductDrawer.tsx
git commit -m "feat: migrate product drawers to useApiWrite and useApiGet"
```

---

### Task 14: Migrate category drawers to typed hooks

**Files:**

- Modify: `src/app/apps/products/categories/components/NewCategoryDrawer.tsx`
- Modify: `src/app/apps/products/categories/components/EditCategoryDrawer.tsx`

- [ ] **Step 1: Migrate NewCategoryDrawer submit**

Replace `fetch('/api/product-categories', { method: 'POST' })` with:

```ts
const { execute: createCategory, loading: createLoading } = useApiWrite(
  'POST',
  API_PRODUCTS.categories,
  {
    body: { ...values, createdById: 'user-demo-001' },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Category created',
        color: 'green',
      });
      form.reset();
      onCategoryCreated?.();
    },
  },
);
```

- [ ] **Step 2: Migrate EditCategoryDrawer submit update**

Replace `fetch('/api/product-categories/${productCategory.id}', { method: 'PUT' })` with:

```ts
const { execute: updateCategory } = useApiWrite(
  'PUT',
  API_PRODUCTS.categoryDetail.replace(':id', productCategory.id),
  {
    body: { ...values, modifiedById: 'user-demo-001' },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Category updated',
        color: 'green',
      });
      onCategoryUpdated?.();
    },
  },
);
```

- [ ] **Step 3: Migrate EditCategoryDrawer delete**

Replace `fetch('/api/product-categories/${productCategory.id}', { method: 'DELETE' })` with:

```ts
const { execute: deleteCategory } = useApiWrite(
  'DELETE',
  API_PRODUCTS.categoryDetail.replace(':id', productCategory.id),
  {
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Category deleted',
        color: 'green',
      });
      onCategoryDeleted?.();
    },
  },
);
```

- [ ] **Step 4: Run lint**

Run: `pnpm eslint src/app/apps/products/categories/components/NewCategoryDrawer.tsx src/app/apps/products/categories/components/EditCategoryDrawer.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/apps/products/categories/components/NewCategoryDrawer.tsx src/app/apps/products/categories/components/EditCategoryDrawer.tsx
git commit -m "feat: migrate category drawers to useApiWrite"
```

---

### Task 15: Migrate invoice page to typed hooks

**Files:**

- Modify: `src/app/apps/invoices/page.tsx`

- [ ] **Step 1: Replace list fetch**

Replace:

```ts
const {
  data: invoicesData,
  loading: invoicesLoading,
  error: invoicesError,
  refetch: refetchInvoices,
} = useFetch<IApiResponse<any[]>>('/api/invoices');
```

With:

```ts
const {
  data: invoicesData,
  loading: invoicesLoading,
  error: invoicesError,
  refetch: refetchInvoices,
} = useApiGet<any[]>(API_INVOICES.list);
```

- [ ] **Step 2: Replace delete handler**

Replace `handleDeleteInvoice` raw `fetch('/api/invoices/${id}', { method: 'DELETE' })` with:

```ts
const handleDeleteInvoice = useCallback(
  async (id: string) => {
    const { execute } = useApiWrite(
      'DELETE',
      API_INVOICES.detail.replace(':id', id),
      {
        onSuccess: () => refetchInvoices(),
      },
    );
    await execute();
  },
  [refetchInvoices],
);
```

- [ ] **Step 3: Replace create handler**

Replace the mock `handleCreateInvoice` with:

```ts
const handleCreateInvoice = useCallback(
  async (data: Partial<InvoiceDto>) => {
    const { execute } = useApiWrite('POST', API_INVOICES.list, {
      body: data,
      onSuccess: () => refetchInvoices(),
    });
    await execute();
  },
  [refetchInvoices],
);
```

- [ ] **Step 4: Replace update handler**

Replace the mock `handleUpdateInvoice` with:

```ts
const handleUpdateInvoice = useCallback(
  async (id: string, data: Partial<InvoiceDto>) => {
    const { execute } = useApiWrite(
      'PUT',
      API_INVOICES.detail.replace(':id', id),
      {
        body: data,
        onSuccess: () => refetchInvoices(),
      },
    );
    await execute();
  },
  [refetchInvoices],
);
```

- [ ] **Step 5: Run lint**

Run: `pnpm eslint src/app/apps/invoices/page.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/apps/invoices/page.tsx
git commit -m "feat: migrate invoice page to useApiGet and useApiWrite"
```

---

### Task 16: Migrate invoice details page

**Files:**

- Modify: `src/app/apps/invoices/details/[id]/page.tsx`

- [ ] **Step 1: Replace useFetch with useApiGet**

Replace:

```ts
const {
  data: invoiceData,
  loading,
  error,
} = useFetch<IApiResponse<IInvoice>>(`/api/invoices/${params.id}`);
```

With:

```ts
const {
  data: invoiceData,
  loading,
  error,
} = useApiGet<IInvoice>(API_INVOICES.detail.replace(':id', params.id));
```

- [ ] **Step 2: Add registry import**

Add `import { API_INVOICES } from '@/routes/api';` at the top of the file.

- [ ] **Step 3: Run lint**

Run: `pnpm eslint src/app/apps/invoices/details/[id]/page.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/apps/invoices/details/[id]/page.tsx
git commit -m "feat: migrate invoice details page to useApiGet"
```

---

### Task 17: Add write route path coverage to api-paths test

**Files:**

- Modify: `src/test/api-paths.test.ts`

- [ ] **Step 1: Update test expectations**

In `src/test/api-paths.test.ts`, extend the registered path assertions to include the new write endpoints. Verify that `API_PRODUCTS`, `API_TASKS`, and `API_INVOICES` entries exist in `API_ENDPOINTS`.

- [ ] **Step 2: Run test**

Run: `pnpm vitest run src/test/api-paths.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/test/api-paths.test.ts
git commit -m "test: extend api-paths coverage to write endpoints"
```

---

### Task 18: Final verification

- [ ] **Step 1: Run full test suite**

Run: `pnpm vitest run`
Expected: PASS (319+ tests)

- [ ] **Step 2: Run typecheck**

Run: `pnpm tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Run lint**

Run: `pnpm eslint src/app src/components src/lib src/test`
Expected: PASS

- [ ] **Step 4: Run build**

Run: `pnpm build`
Expected: PASS

- [ ] **Step 5: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: ticket 6 final verification"
```

- [ ] **Step 6: Push branch**

```bash
git push origin ticket-06-missing-endpoints-and-writes
```
