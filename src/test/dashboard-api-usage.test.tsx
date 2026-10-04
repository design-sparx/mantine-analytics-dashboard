import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const DASHBOARD = path.join(ROOT, 'src', 'app', 'dashboard');

const forbidden = [
  /useFetch<\s*IApiResponse/,
  /['"]\/api\/(?!changelog\/manifest)[^'"]+['"]/,
  /\buseStats\(\)/,
  /\buseProjects\(\)/,
  /\buseLanguages\(\)/,
  /\buseTraffic\(\)/,
];

describe('dashboard API usage', () => {
  it('has no inline useFetch, legacy hooks, or hardcoded API strings', () => {
    const pages = walk(DASHBOARD).filter((p) => p.endsWith('page.tsx'));

    expect(pages.length).toBeGreaterThan(0);

    const violations: string[] = [];

    for (const page of pages) {
      const s = fs.readFileSync(page, 'utf8');
      for (const re of forbidden) {
        if (re.test(s)) {
          violations.push(`${relative(page)} matches ${re}`);
        }
      }
    }

    expect(violations, violations.join('\n')).toHaveLength(0);
  });

  it('uses the registry-backed resource hook', () => {
    const pages = walk(DASHBOARD).filter((p) => p.endsWith('page.tsx'));

    for (const page of pages) {
      const s = fs.readFileSync(page, 'utf8');
      // llm uses the generated endpoint hooks which are still "registry-backed" but
      // exported by name; the other dashboard pages use useDashboardResource.
      if (page.includes('llm')) {
        expect(s).toMatch(/useLlm/);
        continue;
      }
      expect(s).toMatch(/useDashboardResource\(/);
    }
  });
});

function walk(dir: string, acc: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(p, acc);
    } else {
      acc.push(p);
    }
  }
  return acc.sort();
}

function relative(p: string): string {
  return path.relative(ROOT, p).replace(/\\/g, '/');
}
