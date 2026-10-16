import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

const PROFILE_PAGE = path.join(
  process.cwd(),
  'src',
  'app',
  'apps',
  'profile',
  'page.tsx',
);

/**
 * `page.tsx` is a Server Component, so it cannot pass icon components (functions)
 * into a Client Component such as ProfileStatsCard. Icons must be wired up inside
 * a 'use client' module instead.
 */
const ICON_FUNCTION_PROP = /\bicon=\{\s*Icon[A-Za-z]+\s*\}/;

describe('apps/profile server page', () => {
  it('does not pass icon components across the RSC boundary', () => {
    const source = fs.readFileSync(PROFILE_PAGE, 'utf8');

    expect(source).not.toMatch(ICON_FUNCTION_PROP);
  });
});
