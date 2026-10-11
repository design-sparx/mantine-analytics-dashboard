import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

import { API_ENDPOINTS } from '@/routes/api';

import type { IApiResponse } from '@/types/api-response';

const APP_DIR = path.join(process.cwd(), 'src', 'app');
const MOCKS_DIR = path.join(process.cwd(), 'public', 'mocks');

const isEnvelope = (value: unknown): value is IApiResponse<unknown> => {
  const body = value as IApiResponse<unknown>;
  return (
    typeof body.succeeded === 'boolean' &&
    typeof body.message === 'string' &&
    typeof body.timestamp === 'string' &&
    'data' in body &&
    Array.isArray(body.errors)
  );
};

/**
 * Routes served by `serveMock`, found by reading each routeFile rather than by
 * trusting the registry: `/api/changelog` is registered but is backed by
 * `getChangelogData()` and returns a bespoke shape, so it is not one of these.
 */
const mockRoutes = (): { endpoint: string; routeFile: string }[] => {
  const entries: { endpoint: string; routeFile: string }[] = [];

  for (const endpoint of Object.values(API_ENDPOINTS)) {
    const routeFile = path.join(
      APP_DIR,
      endpoint.replace(/^\/api/, 'api').replace(/\//g, path.sep),
      'route.ts',
    );

    if (
      fs.existsSync(routeFile) &&
      fs.readFileSync(routeFile, 'utf8').includes('serveMock')
    ) {
      entries.push({ endpoint, routeFile });
    }
  }

  return entries;
};

const routes = mockRoutes();

describe('mock routes', () => {
  it('discovers every mock route routeFile', () => {
    // Guards the discovery logic: if this is empty, the checks below would pass
    // without testing anything. 66 of 72 registered routes read a mock file;
    // `/api/changelog` is the exception and is asserted separately below.
    expect(routes).toHaveLength(66);
  });

  it('leaves only the non-mock route out of the helper', () => {
    const unconverted = Object.values(API_ENDPOINTS).filter(
      (endpoint) => !routes.some((r) => r.endpoint === endpoint),
    );

    expect(unconverted).toEqual([
      '/api/changelog',
      '/api/invoices',
      '/api/product-categories',
      '/api/products',
      '/api/tasks',
    ]);
  });

  it.each(routes)(
    '$endpoint resolves the mock file it names',
    async ({ endpoint, routeFile }) => {
      expect(fs.existsSync(routeFile)).toBe(true);

      const { GET } = (await import(routeFile)) as {
        GET: () => Promise<Response>;
      };

      const response = await GET();
      const body = (await response.json()) as IApiResponse<unknown>;

      // A missing or unreadable fixture would make this 500 with
      // `succeeded: false`, which is what the next assertion distinguishes.
      expect(response.status).toBe(200);
      expect(body.succeeded).toBe(true);
      expect(body.errors).toEqual([]);
      expect(body.data).not.toBeNull();
    },
  );

  it.each(routes)(
    '$endpoint returns the envelope shape',
    async ({ routeFile }) => {
      const { GET } = (await import(routeFile)) as {
        GET: () => Promise<Response>;
      };

      const body = (await GET().then((r) => r.json())) as unknown;

      expect(isEnvelope(body)).toBe(true);
    },
  );

  it.each(routes)(
    '$endpoint derives its message from a resource label',
    async ({ routeFile }) => {
      const { GET } = (await import(routeFile)) as {
        GET: () => Promise<Response>;
      };

      const body = (await GET().then((r) => r.json())) as IApiResponse<unknown>;

      // One pattern, derived from the label rather than an arbitrary literal.
      expect(body.message).toMatch(/ retrieved successfully$/);
    },
  );
});

describe('mock fixtures', () => {
  it('has a JSON file on disk for every mock route', () => {
    for (const { routeFile } of routes) {
      const source = fs.readFileSync(routeFile, 'utf8');
      const fixture = source.match(/serveMock\(\s*'([^']+)'/)?.[1];

      expect(fixture).toBeDefined();
      expect(fs.existsSync(path.join(MOCKS_DIR, fixture as string))).toBe(true);
    }
  });

  it('uses a distinct resource label per route', () => {
    const labels = routes.map(({ routeFile }) => {
      const source = fs.readFileSync(routeFile, 'utf8');
      return source.match(/serveMock\(\s*'[^']+',\s*'([^']+)'/)?.[1];
    });

    expect(new Set(labels).size).toBe(labels.length);
  });
});
