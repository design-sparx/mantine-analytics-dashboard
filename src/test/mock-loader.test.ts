import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

import { loadMock, readMock } from '@/lib/api/mock-route';

const SRC = path.join(process.cwd(), 'src');

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx)$/.test(entry.name) && !entry.name.includes('.test.')
      ? [full]
      : [];
  });
}

describe('mock loader', () => {
  it('reads a fixture straight from disk without any network or env', async () => {
    const rows = await readMock<unknown[]>('Projects.json');
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('rejects a fixture path that escapes the mocks root', async () => {
    await expect(readMock('../../package.json')).rejects.toThrow(/outside/);
  });

  it('loadMock returns an error result instead of throwing for a missing fixture', async () => {
    const result = await loadMock('does-not-exist.json');
    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
  });

  it('server pages never depend on NEXT_PUBLIC_API_URL', () => {
    const offenders = sourceFiles(SRC).filter((file) =>
      fs.readFileSync(file, 'utf8').includes('NEXT_PUBLIC_API_URL'),
    );
    expect(offenders).toEqual([]);
  });
});

describe('server pages', () => {
  it('do not use compound statics like Grid.Col, which are undefined across the RSC boundary', () => {
    const offenders = sourceFiles(path.join(SRC, 'app'))
      .filter((file) => /^(page|layout)\.tsx$/.test(path.basename(file)))
      .filter((file) => {
        const source = fs.readFileSync(file, 'utf8');
        return !source.includes("'use client'") && /<Grid\.Col\b/.test(source);
      });
    expect(offenders).toEqual([]);
  });
});

describe('server pages (function props)', () => {
  it('do not pass a component function such as component={Link} to a client component', () => {
    const offenders = sourceFiles(path.join(SRC, 'app'))
      .filter((file) => /^(page|layout)\.tsx$/.test(path.basename(file)))
      .filter((file) => {
        const source = fs.readFileSync(file, 'utf8');
        return (
          !source.includes("'use client'") && /component=\{\w+\}/.test(source)
        );
      });
    expect(offenders).toEqual([]);
  });
});
