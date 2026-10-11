const fs = require('fs');
const path = require('path');

const root = 'src/app/dashboard';

/** Derives the registry group name from the `API_*` identifiers a page uses. */
function collectRequiredModules(source) {
  const groups = new Set();
  for (const match of source.matchAll(/\bAPI_[A-Z0-9_]+\b/g)) {
    groups.add(match[0]);
  }
  return [...groups].sort();
}

/**
 * Inserts imports after the final existing import statement. Anchoring on the
 * end of the import block (rather than matching a specific module specifier
 * with `\n`) keeps this correct for CRLF files.
 */
function addImports(source, modulePath, namedImports) {
  const importLine = `import { ${namedImports.join(
    ', ',
  )} } from '${modulePath}';`;

  const matches = [...source.matchAll(/^import[\s\S]*?from\s+'[^']+';$/gm)];
  if (matches.length === 0) {
    throw new Error(`no import block found in ${modulePath}`);
  }

  const last = matches[matches.length - 1];
  const end = last.index + last[0].length;
  const eol = source.includes('\r\n') ? '\r\n' : '\n';

  return `${source.slice(0, end)}${eol}${importLine}${source.slice(end)}`;
}

const pages = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(root, entry.name, 'page.tsx'))
  .filter((file) => fs.existsSync(file));

for (const file of pages) {
  let source = fs.readFileSync(file, 'utf8');
  const changes = [];

  if (
    source.includes('useDashboardResource(') &&
    !source.includes("from '@/lib/api/useDashboardResource'")
  ) {
    source = addImports(source, '@/lib/api/useDashboardResource', [
      'useDashboardResource',
    ]);
    changes.push('useDashboardResource');
  }

  const groups = collectRequiredModules(source).filter((group) => {
    return !new RegExp(
      `import[^;]*\\b${group}\\b[^;]*from\\s+'@/routes/api'`,
    ).test(source);
  });

  if (groups.length > 0) {
    source = addImports(source, '@/routes/api', groups);
    changes.push(groups.join(', '));
  }

  if (changes.length > 0) {
    fs.writeFileSync(file, source);
    console.log(`${file}: + ${changes.join(' | ')}`);
  } else {
    console.log(`${file}: ok`);
  }
}
