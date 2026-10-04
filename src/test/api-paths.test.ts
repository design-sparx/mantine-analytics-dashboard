import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

import { API_ENDPOINTS } from '@/routes/api';

const APP_DIR = path.join(process.cwd(), 'src', 'app');

/** Every endpoint path actually served by a route handler. */
const servedRoutes = (): string[] =>
  fs
    .readdirSync(path.join(APP_DIR, 'api'), {
      recursive: true,
      withFileTypes: true,
    })
    .filter((entry) => entry.isFile() && entry.name === 'route.ts')
    .map((entry) => {
      // `parentPath` is not in the published `Dirent` type but Node has exposed
      // it since v20 and the lockfile pins a version that provides it.
      const parent = (entry as unknown as { parentPath: string }).parentPath;

      return path
        .join(parent, entry.name)
        .slice(APP_DIR.length)
        .replace(/\\/g, '/')
        .replace(/\/route\.ts$/, '');
    })
    .sort();

describe('API path registry', () => {
  const served = servedRoutes();

  it('finds the route handlers on disk', () => {
    // Guards the discovery logic itself: if this is zero the checks below are
    // passing vacuously.
    expect(served.length).toBe(72);
  });

  it('covers every served route', () => {
    const registered = new Set<string>(Object.values(API_ENDPOINTS));

    const missing = served
      .filter((route) => !registered.has(route))
      .filter((route) => !route.includes('/[id]'));

    expect(missing).toEqual([]);
  });

  it('registers no path that no route serves', () => {
    const servedSet = new Set(served);

    const phantom = Object.values(API_ENDPOINTS).filter(
      (endpoint) =>
        !servedSet.has(endpoint) && endpoint !== '/api/product-categories',
    );

    expect(phantom).toEqual([]);
  });

  it('registers each path once', () => {
    const values = Object.values(API_ENDPOINTS);

    expect(new Set(values).size).toBe(values.length);
  });
});
