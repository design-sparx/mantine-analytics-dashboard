/**
 * Codegen for ticket 05: one DTO per mock fixture behind a dashboard endpoint.
 *
 * Usage:  node scripts/generate-dto.mjs
 *
 * The DTO set is derived, not hand-listed. Two facts decide it:
 *
 *   1. `src/app/dashboard/**\/page.tsx` names the endpoints the pages fetch.
 *   2. `src/app/api/**\/route.ts` says which fixture each endpoint serves.
 *
 * Joining them means the generated types cannot drift from what the API
 * actually returns â€” notably `/api/marketing/campaigns`, which serves
 * `campaign-performance.json` rather than the similarly named `campaigns.json`.
 * A fixture nobody serves (`campaigns.json`, `social-media.json`) is skipped,
 * because generating a type for dead data would be dead code too.
 *
 * `src/test/generated-dto.test.ts` fails if a dashboard endpoint has no DTO.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const MOCKS_DIR = path.join(ROOT, 'public', 'mocks');
// A flat file, not a `generated/` directory: `tsconfig.json` lists
// `./src/types` in `typeRoots`, so any subdirectory there is treated as an
// implicit type library and fails to compile. The rest of `src/types` is flat.
const OUT_FILE = path.join(ROOT, 'src', 'types', 'generated-fixtures.ts');

/** Endpoints reached through the legacy `useApi` hooks, not an inline literal. */
const LEGACY_ENDPOINTS = ['/api/languages', '/api/traffic'];

/**
 * Object payloads are hand-written in `src/types/dashboard.ts`, so the codegen
 * cannot infer them from a row of the fixture. They are still part of the
 * payload map, otherwise a page could not fetch them through a typed hook.
 */
const OBJECT_PAYLOADS = { '/api/stats': 'CoreStatsDto' };

const read = (file) => fs.readFileSync(file, 'utf8');

const walk = (dir, match, acc = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, match, acc);
    } else if (match(entry.name)) {
      acc.push(full);
    }
  }

  return acc;
};

/** kebab / snake filename -> PascalCase. */
const toPascal = (file) =>
  file
    .replace(/\.json$/, '')
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

/**
 * `API_X.key` -> `/api/path`, read from the registry itself.
 *
 * Pages reference endpoints through the registry rather than string literals,
 * so the registry has to be parsed to recover the paths.
 */
const registryEndpoints = () => {
  const source = read(path.join(ROOT, 'src', 'routes', 'api.ts'));
  const groups = {};

  for (const [, group, body] of source.matchAll(
    /export const (API_[A-Z0-9_]+) = \{([\s\S]*?)\} as const;/g,
  )) {
    const members = {};

    for (const [, key, url] of body.matchAll(/(\w+):\s*api\('([^']+)'\)/g)) {
      members[key] = `/api${url}`;
    }

    groups[group] = members;
  }

  return groups;
};

/**
 * Every `/api/...` endpoint a dashboard page fetches.
 *
 * Resolution runs through the registry so this keeps working after migration,
 * when no page holds an endpoint string literal any more — scanning only for
 * literals would silently drop the whole dashboard to the legacy two.
 * Literals are still collected as a fallback for pages not yet migrated.
 */
const dashboardEndpoints = () => {
  const found = new Set(LEGACY_ENDPOINTS);
  const groups = registryEndpoints();

  for (const file of walk(
    path.join(ROOT, 'src', 'app', 'dashboard'),
    (n) => n === 'page.tsx',
  )) {
    const source = read(file);

    for (const [, group, key] of source.matchAll(
      /\b(API_[A-Z0-9_]+)\.(\w+)/g,
    )) {
      const endpoint = groups[group]?.[key];

      if (!endpoint) {
        throw new Error(
          `${path.relative(ROOT, file)} references unknown ${group}.${key}`,
        );
      }

      found.add(endpoint);
    }

    for (const [, url] of source.matchAll(/'(\/api\/[^']+)'/g)) {
      found.add(url);
    }
  }

  return [...found].sort();
};

/** Endpoint -> fixture file, from the routes that call `serveMock`. */
const routeFixtures = () => {
  const map = new Map();

  for (const file of walk(
    path.join(ROOT, 'src', 'app', 'api'),
    (n) => n === 'route.ts',
  )) {
    const source = read(file);
    const [, fixture] = source.match(/serveMock\(\s*'([^']+)'/) ?? [];

    if (!fixture) {
      continue;
    }

    const endpoint = `/${path
      .relative(path.join(ROOT, 'src', 'app'), path.dirname(file))
      .split(path.sep)
      .join('/')}`;

    map.set(endpoint, fixture);
  }

  return map;
};

/**
 * Declared type for one field: the union of the types seen across all rows.
 *
 * A field absent from at least one row is optional, which keeps every row of
 * the fixture assignable to the type.
 */
const fieldType = (rows, key) => {
  const seen = new Set();

  for (const row of rows) {
    const value = row[key];

    if (value === null) {
      seen.add('null');
    } else if (Array.isArray(value)) {
      seen.add('unknown[]');
    } else {
      seen.add(typeof value);
    }
  }

  if (seen.size === 0) {
    return { type: 'unknown', optional: true };
  }

  const types = [...seen];
  const optional = rows.some((row) => !(key in row));

  return { type: types.length === 1 ? types[0] : types.join(' | '), optional };
};

const rowsOf = (fixture) => {
  const rows = JSON.parse(read(path.join(MOCKS_DIR, fixture)));

  return Array.isArray(rows) &&
    rows.length > 0 &&
    typeof rows[0] === 'object' &&
    !Array.isArray(rows[0])
    ? rows
    : null;
};

const routes = routeFixtures();
const endpoints = dashboardEndpoints();

const interfaces = [];
const endpointTypes = [];
const fixtureEntries = [];
const skipped = [];
let dtoCount = 0;

for (const endpoint of endpoints) {
  const fixture = routes.get(endpoint);
  const objectPayload = OBJECT_PAYLOADS[endpoint];

  if (!fixture) {
    skipped.push(`${endpoint} -> no serveMock route`);
    continue;
  }

  if (objectPayload) {
    // Hand-written interface in `src/types/dashboard.ts`; imported below.
    endpointTypes.push(`  ${JSON.stringify(endpoint)}: ${objectPayload};`);
    skipped.push(`${endpoint} -> ${fixture} (hand-written ${objectPayload})`);
    continue;
  }

  const rows = rowsOf(fixture);

  if (!rows) {
    skipped.push(`${endpoint} -> ${fixture} (not an array payload)`);
    continue;
  }

  const name = `${toPascal(fixture)}Dto`;
  const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))];

  interfaces.push(`/** \`${fixture}\` - served by \`${endpoint}\`. */`);
  interfaces.push(`export interface ${name} {`);

  for (const key of keys) {
    const { type, optional } = fieldType(rows, key);

    interfaces.push(`  ${JSON.stringify(key)}${optional ? '?' : ''}: ${type};`);
  }

  interfaces.push('}');
  interfaces.push('');
  dtoCount += 1;

  endpointTypes.push(`  ${JSON.stringify(endpoint)}: ${name}[];`);
  fixtureEntries.push(
    `  ${JSON.stringify(endpoint)}: ${JSON.stringify(fixture)},`,
  );
}

const header = `/**
 * Code generated by \`scripts/generate-dto.mjs\`. Do not edit by hand.
 *
 * One interface per mock fixture behind a dashboard endpoint, inferred from the
 * fixture itself. \`src/test/generated-dto.test.ts\` asserts every row of every
 * fixture is assignable to the matching type and that every dashboard endpoint
 * has one, so a mock edit that changes shape fails the suite rather than
 * diverging from the code.
 *
 * Regenerate with: node scripts/generate-dto.mjs
 */
`;

const objectPayloadImports = Object.values(OBJECT_PAYLOADS)
  .map((name) => `import type { ${name} } from './dashboard';`)
  .join('\n');

const body = [
  header,
  objectPayloadImports,
  '',
  interfaces.join('\n'),
  '/** Payload type per dashboard endpoint, for the page-level fetch hooks. */',
  'export interface DashboardEndpointPayloads {',
  endpointTypes.join('\n'),
  '}',
  '',
  '/** Every fixture-backed dashboard endpoint path. */',
  'export type DashboardEndpoint = keyof DashboardEndpointPayloads;',
  '',
  '/**',
  ' * The mock fixture each dashboard endpoint serves, at runtime.',
  ' *',
  ' * `src/test/generated-dto.test.ts` reads this to check every generated type',
  ' * against the rows it describes, which is what stops the two drifting apart.',
  ' */',
  'export const DASHBOARD_ENDPOINT_FIXTURES = {',
  fixtureEntries.join('\n'),
  '} as const satisfies Record<DashboardEndpoint, string>;',
  '',
].join('\n');

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, body, 'utf8');

console.log(`wrote ${dtoCount} DTOs for ${endpointTypes.length} endpoints`);
console.log(`  -> ${path.relative(ROOT, OUT_FILE)}`);

if (skipped.length > 0) {
  console.log('\nnot generated here (covered elsewhere or unmapped):');
  skipped.forEach((line) => console.log(`  - ${line}`));
}
