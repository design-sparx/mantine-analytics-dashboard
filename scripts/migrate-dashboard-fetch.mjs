/**
 * One-time codemod for ticket 05: move the dashboard pages off inline
 * `useFetch<IApiResponse<any[]>>('/api/...')` and onto `useDashboardResource`
 * with a registry constant.
 *
 * Usage:  node scripts/migrate-dashboard-fetch.mjs
 *
 * This is a mechanical rewrite of a repeated pattern, so it is scripted rather
 * than hand-edited across eleven pages. It is deliberately narrow: each rewrite
 * is refused unless the endpoint is present in the registry map, and it prints
 * every page it touched. Review the diff afterwards.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DASHBOARD = path.join(ROOT, 'src', 'app', 'dashboard');
const REGISTRY_FILE = path.join(ROOT, 'src', 'routes', 'api.ts');

/** Endpoint path -> `API_GROUP.key`, read from the registry source. */
const registryMap = () => {
  const source = fs.readFileSync(REGISTRY_FILE, 'utf8');
  const map = new Map();

  const blockRe = /export const (API_[A-Z_]+) = \{([\s\S]*?)\} as const;/g;

  for (const [, group, body] of source.matchAll(blockRe)) {
    for (const [, key, path] of body.matchAll(/(\w+): api\('([^']+)'\)/g)) {
      map.set(`/api${path}`, `${group}.${key}`);
    }
  }

  return map;
};

// These files are CRLF on Windows, so every whitespace class in these patterns
// must include \r or the multi-line block never matches.
const WS = String.raw`[\s\r]*`;

/** `const { data: xData, error: xError, loading: xLoading } = useFetch<...>('/api/y');` */
const FETCH_BLOCK = new RegExp(
  [
    String.raw`const${WS}\{${WS}data:${WS}(\w+),${WS}`,
    String.raw`error:${WS}(\w+),${WS}loading:${WS}(\w+),?${WS}`,
    String.raw`\}${WS}=${WS}useFetch<${WS}IApiResponse<[^>]*>+${WS}`,
    String.raw`\(${WS}'\/api\/([^']+)'${WS},?${WS}\);`,
  ].join(''),
  'g',
);

const registry = registryMap();
const report = [];
const failures = [];

for (const dir of fs.readdirSync(DASHBOARD).sort()) {
  const file = path.join(DASHBOARD, dir, 'page.tsx');

  if (!fs.existsSync(file)) {
    continue;
  }

  let source = fs.readFileSync(file, 'utf8');
  const original = source;
  const seen = [];

  source = source.replace(
    FETCH_BLOCK,
    (_match, data, error, loading, endpoint) => {
      // The pattern captures the path without the `/api` prefix the registry map
      // is keyed by.
      const constant = registry.get(`/api/${endpoint}`);

      if (!constant) {
        failures.push(`${dir}: /api/${endpoint} is not in the registry`);
        return _match;
      }

      seen.push(`/api/${endpoint} -> ${constant}`);

      return `const { data: ${data}, error: ${error}, loading: ${loading} } =\n    useDashboardResource(${constant});`;
    },
  );

  if (source === original) {
    continue;
  }

  // `data` is already unwrapped, so `xData?.data || []` becomes just `xData`.
  // The slice variants keep their bounds.
  source = source.replace(
    /(\w+)Data\?\.data\?\.(slice\([^)]*\))\s*\|\|\s*\[\]/g,
    '$1Data?.$2',
  );
  source = source.replace(/(\w+)Data\?\.data\s*\|\|\s*\[\]/g, '$1Data');

  // Swap the imports: the hook replaces Mantine's, and the registry constant
  // replaces the envelope type.
  source = source
    .replace(/import \{ useFetch \} from '@mantine\/hooks';\n\n?/, '')
    .replace(/import \{ IApiResponse \} from '@\/types\/api-response';\n/, '');

  const needsRegistry = seen.map((entry) => {
    const [, constant] = entry.split(' -> ');

    return constant.split('.')[0];
  });

  const uniqueGroups = [...new Set(needsRegistry)];

  if (uniqueGroups.length > 0) {
    const imports = uniqueGroups
      .map((group) => `import { ${group} } from '@/routes/api';`)
      .join('\n');

    // Place the registry import after the component import block.
    source = source.replace(
      /(import \{[\s\S]*?\} from '@\/components';\n)/,
      `$1import { useDashboardResource } from '@/lib/api/useDashboardResource';\n${imports}\n`,
    );
  }

  fs.writeFileSync(file, source, 'utf8');
  report.push({ dir, seen });
}

console.log(`rewrote ${report.length} pages\n`);

for (const { dir, seen } of report) {
  console.log(`${dir}:`);
  seen.forEach((entry) => console.log(`  ${entry}`));
}

if (failures.length > 0) {
  console.log('\nNOT MIGRATED:');
  failures.forEach((line) => console.log(`  ${line}`));
  process.exitCode = 1;
}
