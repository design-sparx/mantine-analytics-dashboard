/**
 * One-time migration script for ticket 03: rewrite the hand-rolled mock route
 * bodies as calls to `serveMock`.
 *
 * Run from the repo root:  node scripts/migrate-routes-to-helper.mjs
 *
 * It reads each route, recovers the mock file name and the resource label from
 * the message the route already sends, and emits the new body. Routes that do
 * not read a mock file, or that already use the helper, are left alone.
 */
import fs from 'fs';
import path from 'path';

const APP_DIR = path.join(process.cwd(), 'src', 'app');
const MOCKS_DIR = path.join(process.cwd(), 'public', 'mocks');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const routes = walk(path.join(APP_DIR, 'api')).filter((f) =>
  f.endsWith('route.ts'),
);

const result = { migrated: [], skipped: [], missingFixtures: [] };

for (const file of routes) {
  const source = fs.readFileSync(file, 'utf8');
  const routePath = '/' + path.relative(APP_DIR, file).replace(/\\/g, '/').replace(/\/route\.ts$/, '');

  if (source.includes('serveMock')) {
    result.skipped.push({ routePath, reason: 'already migrated' });
    continue;
  }

  const fixture =
    source.match(/public',\s*'mocks',\s*'([^']+)'/)?.[1] ??
    source.match(/'mocks',\s*'([^']+)'/)?.[1];

  if (!fixture) {
    result.skipped.push({ routePath, reason: 'does not read a mock file' });
    continue;
  }

  if (!fs.existsSync(path.join(MOCKS_DIR, fixture))) {
    result.missingFixtures.push({ routePath, fixture });
    continue;
  }

  const label = source.match(/message:\s*'([^']+) retrieved successfully'/)?.[1];

  if (!label) {
    result.skipped.push({ routePath, reason: 'no resource label in message' });
    continue;
  }

  // Does the GET body actually read `request`?
  const getBody = source.match(
    /export async function GET\([^)]*\)\s*\{([\s\S]*?)\n\}/,
  )?.[1] ?? '';
  const usesRequest = /\brequest\s*\./.test(getBody);

  const mutator = ['POST', 'PUT', 'PATCH', 'DELETE'].find((verb) =>
    new RegExp(`export async function ${verb}\\(`).test(source),
  );

  const mutatorSource = mutator
    ? source.match(
        new RegExp(
          `export async function ${mutator}\\([\\s\\S]*?\\n\\}(?!\\n\\nexport|\\n$)`,
        ),
      )?.[0]
    : null;

  const header = `import { serveMock } from '@/lib/api/mock-route';\n\n`;
  const get = `export async function GET() {\n  return serveMock('${fixture}', '${label}');\n}\n`;
  const tail = mutatorSource ? `\n${mutatorSource.trim()}\n` : '';

  fs.writeFileSync(file, header + get + tail, 'utf8');

  result.migrated.push({ routePath, fixture, label, keptMutator: mutator ?? null });
}

console.log(JSON.stringify(result, null, 2));