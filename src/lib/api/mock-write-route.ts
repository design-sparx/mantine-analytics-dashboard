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
      const data = await mockStore.getAll(fixture);
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
    context?: {
      params?: Promise<{ [key: string]: string }> | { [key: string]: string };
    },
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

      const id = await resolveId(idParam, context);
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
      const err = error as Error & { status?: number };
      const status = err.status === 404 ? 404 : 500;
      return apiFailure(err.message, err.message, status);
    }
  };
}

/**
 * Resolves the record id for a write from the route params only.
 *
 * It deliberately does not fall back to the last URL segment: a write that
 * arrives at a collection route has no id, and guessing one from the path
 * (which yields the collection name, e.g. "products") turns a client bug into
 * a confusing 404 instead of a clear 400.
 */
function resolveId(
  idParam?: string,
  context?: {
    params?: Promise<{ [key: string]: string }> | { [key: string]: string };
  },
): Promise<string | undefined> {
  return (async () => {
    const params = context?.params
      ? typeof (context.params as Promise<unknown>).then === 'function'
        ? await context.params
        : context.params
      : undefined;

    const record = params as Record<string, string> | undefined;

    if (idParam) {
      const key = idParam.replace(':', '');
      if (record?.[key]) {
        return record[key];
      }
    }

    return undefined;
  })();
}
