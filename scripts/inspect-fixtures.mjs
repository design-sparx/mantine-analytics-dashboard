/**
 * Prints the shape of every mock fixture, so DTOs for a domain can be written
 * from the data rather than guessed.
 *
 * Usage:  node scripts/inspect-fixtures.mjs [substring-filter]
 */
import fs from 'fs';
import path from 'path';

const MOCKS_DIR = path.join(process.cwd(), 'public', 'mocks');
const filter = process.argv[2] ?? '';

/** Union of key -> observed primitive types across all rows. */
const shapeOf = (rows) => {
  const keys = new Map();

  for (const row of rows) {
    for (const [key, value] of Object.entries(row)) {
      const type = Array.isArray(value)
        ? 'array'
        : value === null
          ? 'null'
          : typeof value;
      if (!keys.has(key)) {
        keys.set(key, type);
      } else if (keys.get(key) !== type) {
        keys.set(key, `${keys.get(key)}|${type}`);
      }
    }
  }

  return [...keys.entries()];
};

const files = fs.readdirSync(MOCKS_DIR).filter((f) => f.endsWith('.json'));

for (const file of files.sort()) {
  if (filter && !file.includes(filter)) {
    continue;
  }

  const raw = JSON.parse(fs.readFileSync(path.join(MOCKS_DIR, file), 'utf8'));

  if (!Array.isArray(raw)) {
    console.log(`${file}: NOT AN ARRAY (${typeof raw})`);
    continue;
  }

  const first = raw[0];

  if (first === null || typeof first !== 'object' || Array.isArray(first)) {
    console.log(`${file}: array of ${typeof first} (len ${raw.length})`);
    continue;
  }

  const fields = shapeOf(raw)
    .map(([key, type]) => `${key}: ${type}`)
    .join(', ');

  console.log(`${file} [${raw.length}] -> { ${fields} }`);
}
