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
