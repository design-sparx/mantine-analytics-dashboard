const fs = require('fs');
const path = require('path');

const root = 'src/app/dashboard';

/**
 * `useApiGet` models "no data yet" as `null`, while the dashboard widgets take
 * an optional `data?: T[]`. `?? undefined` bridges the two without inventing an
 * empty array, so a widget still sees `undefined` until a request succeeds. It
 * is safe to apply unconditionally because every widget gates on `error` and
 * `loading` before it reads `data`.
 */
const OBJECT_DATA_PROPS = new Set(['/api/stats']);

const pages = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(root, entry.name, 'page.tsx'))
  .filter((file) => fs.existsSync(file));

for (const file of pages) {
  let source = fs.readFileSync(file, 'utf8');

  /** Variable name -> endpoint it was fetched from. */
  const bindings = new Map();

  for (const [, name, endpoint] of source.matchAll(
    /data:\s*(\w+),\s*error:\s*\w+,\s*loading:\s*\w+\s*\}\s*=\s*useDashboardResource\(\s*([^)]+)\)/g,
  )) {
    bindings.set(name, endpoint.trim());
  }

  if (bindings.size === 0) {
    continue;
  }

  let changed = 0;

  source = source.replace(/data=\{(\w+)\}/g, (match, name) => {
    if (!bindings.has(name)) {
      return match;
    }

    changed += 1;

    return OBJECT_DATA_PROPS.has(bindings.get(name))
      ? `data={${name}?.data ?? undefined}`
      : `data={${name} ?? undefined}`;
  });

  if (changed > 0) {
    fs.writeFileSync(file, source);
    console.log(`${file}: ${changed} data prop(s)`);
  }
}
