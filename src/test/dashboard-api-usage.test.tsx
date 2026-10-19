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
    const violations: string[] = collectViolations(DASHBOARD);

    expect(violations, violations.join('\n')).toHaveLength(0);
  });

  it('uses the registry-backed resource hook', () => {
    const routes = routeDirs(DASHBOARD);

    expect(routes.length).toBeGreaterThan(0);

    for (const route of routes) {
      const name = path.basename(route);
      // A route's data fetching may live in the page itself or in a co-located
      // body component, since the page is now the metadata boundary and the
      // client component carries the hooks. So the whole route directory is
      // checked, not just `page.tsx`.
      const source = routeFiles(route)
        .map((p) => fs.readFileSync(p, 'utf8'))
        .join('\n');

      if (name === 'llm') {
        expect(source, `${name} should use the generated llm hooks`).toMatch(
          /useLlm/,
        );
        continue;
      }

      // Either the client hook, or a server-side page reading its fixture
      // directly through `loadMock`. Neither hand-writes an API path.
      expect(
        source,
        `${name} should read from the registry, not hand-rolled fetches`,
      ).toMatch(/useDashboardResource\(|loadMock</);
    }
  });
});

/** Immediate route directories directly under `root`. */
function routeDirs(root: string): string[] {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => path.join(root, e.name))
    .sort();
}

/** Source files under a route directory, excluding CSS modules. */
function routeFiles(dir: string): string[] {
  return walk(dir).filter(
    (p) => p.endsWith('.tsx') || (p.endsWith('.ts') && !p.endsWith('.d.ts')),
  );
}

/** Every source file under `dir`, as directory or file paths. */
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

function collectViolations(root: string): string[] {
  const pages = routeDirs(root).flatMap(routeFiles);
  const violations: string[] = [];

  for (const page of pages) {
    const s = fs.readFileSync(page, 'utf8');
    for (const re of forbidden) {
      if (re.test(s)) {
        violations.push(`${relative(page)} matches ${re}`);
      }
    }
  }

  return violations;
}

function relative(p: string): string {
  return path.relative(ROOT, p).replace(/\\/g, '/');
}
