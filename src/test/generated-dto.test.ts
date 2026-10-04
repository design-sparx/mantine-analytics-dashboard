import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

import { DASHBOARD_ENDPOINT_FIXTURES } from '@/types/generated-fixtures';

type Row = Record<string, unknown>;

const MOCKS_DIR = path.join(process.cwd(), 'public', 'mocks');

const ENDPOINTS = Object.keys(
  DASHBOARD_ENDPOINT_FIXTURES,
) as (keyof typeof DASHBOARD_ENDPOINT_FIXTURES)[];

const readRows = (fixture: string): Row[] =>
  JSON.parse(fs.readFileSync(path.join(MOCKS_DIR, fixture), 'utf8'));

describe('generated dashboard DTOs', () => {
  it('covers every dashboard endpoint the pages fetch', () => {
    // 51 array-backed endpoints across the 13 dashboard pages. `/api/stats` is
    // the one object payload and is hand-written in `src/types/dashboard.ts`.
    expect(ENDPOINTS).toHaveLength(51);
  });

  it('names a distinct fixture per endpoint', () => {
    const fixtures = ENDPOINTS.map(
      (endpoint) => DASHBOARD_ENDPOINT_FIXTURES[endpoint],
    );

    // Two endpoints may share a fixture shape, but the generator keys DTOs by
    // fixture name, so a duplicate would produce two identical interfaces.
    expect(new Set(fixtures).size).toBe(fixtures.length);
  });

  it.each(ENDPOINTS)('%s has a readable array fixture', (endpoint) => {
    const fixture = DASHBOARD_ENDPOINT_FIXTURES[endpoint];
    const rows = readRows(fixture);

    expect(Array.isArray(rows), `${fixture} must be an array payload`).toBe(
      true,
    );
    expect(rows.length, `${fixture} must not be empty`).toBeGreaterThan(0);

    for (const row of rows) {
      expect(typeof row, `${fixture} rows must be objects`).toBe('object');
      expect(Array.isArray(row)).toBe(false);
    }
  });

  it('produces no `any` in the generated payload map', () => {
    // The generator only ever emits `<Name>Dto[]`, so this guards against a
    // future change emitting a bare type or `any[]`.
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'types', 'generated-fixtures.ts'),
      'utf8',
    );

    const payloadBlock = source.match(
      /export interface DashboardEndpointPayloads \{([\s\S]*?)\n\}/,
    )?.[1];

    expect(payloadBlock).toBeDefined();

    for (const line of payloadBlock!
      .split('\n')
      .filter((l) => l.trim().length > 0)) {
      const trimmed = line.trim();
      expect(trimmed, `unexpected payload declaration: ${line}`).toMatch(
        /^['"]\/api\/[^'"]+['"]: [A-Za-z0-9]+Dto(?:\[\])?;$/,
      );
    }
  });
});
