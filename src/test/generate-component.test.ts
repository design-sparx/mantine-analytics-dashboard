import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const repoRoot = resolve(__dirname, '..', '..');
const generator = resolve(repoRoot, 'scripts', 'generate-component.js');
const componentsDir = resolve(repoRoot, 'src', 'components');

const generated: string[] = [];

function generate(name: string, type: string): string {
  return execFileSync('node', [generator, name, type], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

afterEach(() => {
  while (generated.length) {
    rmSync(generated.pop()!, { recursive: true, force: true });
  }
});

describe('generate-component script', () => {
  it.each(['basic', 'interactive', 'table', 'card'])(
    'creates the %s template under src/components',
    (type) => {
      const name = `Sample${type[0].toUpperCase()}${type.slice(1)}Widget`;
      const output = generate(name, type);
      const dir = resolve(componentsDir, `sample-${type}-widget`);

      generated.push(dir);

      expect(existsSync(resolve(dir, `${name}.tsx`))).toBe(true);
      expect(existsSync(resolve(dir, 'index.ts'))).toBe(true);
      expect(existsSync(resolve(dir, `${name}.stories.tsx`))).toBe(true);
      expect(output).toContain(`src/components/sample-${type}-widget/`);
    },
  );

  it('never writes to a root-level components directory', () => {
    generate('RootLeakWidget', 'basic');
    const dir = resolve(componentsDir, 'root-leak-widget');

    generated.push(dir);

    expect(existsSync(dir)).toBe(true);
    expect(existsSync(resolve(repoRoot, 'components'))).toBe(false);
  });

  it('emits resolvable imports for the table template', () => {
    const name = 'SampleTableWidget';
    const dir = resolve(componentsDir, 'sample-table-widget');

    generated.push(dir);
    generate(name, 'table');

    const source = readFileSync(resolve(dir, `${name}.tsx`), 'utf8');

    expect(source).toContain("from '@/components'");
    expect(source).toContain("from '@/types'");
    expect(source).not.toContain('@/components/shared/BaseTable');
    expect(source).not.toContain('@/components/shared/BaseCard');
  });

  it('rejects a non-PascalCase name', () => {
    expect(() => generate('not-pascal', 'basic')).toThrow();
  });
});
