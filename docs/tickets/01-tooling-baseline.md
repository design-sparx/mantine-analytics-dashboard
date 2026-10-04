# 01: Tooling baseline — real test runner, working component generator, wired lint-staged

**Group:** (3) Tooling + Endpoints + Docs Consistency

**What to build:** A developer can run `pnpm test` and get a real result (today the script is empty, so there is no way to verify any of the other tickets). `pnpm generate:component Foo table` writes into `src/components/foo/` instead of a stray root `components/` directory, and staged files get Prettier formatting because `lint-staged` is actually invoked from the pre-commit hook instead of only being declared in `package.json`.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

**Problem:**

- `package.json` declares `"test": ""`, and `.husky/pre-commit` runs `npm test` (a no-op). Nothing in the repo can be verified automatically.
- `scripts/generate-component.js` joins `process.cwd()` with `components`, so the generator writes outside `src/`. Its success message and "next steps" output also reference the wrong paths, and the `table` template imports `@/types/table` and `@/components/shared/BaseTable` — paths that must resolve inside `src/`.
- `lint-staged` is configured in `package.json` but no husky hook calls it, so formatting is skipped on commit.
- `lint-staged` matches `**/*` and runs `prettier --write`; `.husky/pre-commit` uses npm, not pnpm.

**Solution sketch:**

- Add a test runner (Vitest with a jsdom environment, plus React Testing Library and `@testing-library/jest-dom` for component tests) and wire `"test": "vitest run"` plus `"test:watch": "vitest"`. Add a minimal `vitest.config.ts` with the `@` → `src` alias so tests import through the same specifier as app code. Provide one smoke test so `pnpm test` is green from day one.
- Point the generator at `src/components`, and make its console output print the real paths. Verify each of the four templates (basic, interactive, table, card) actually compiles under the project tsconfig alias before considering it done.
- Change `.husky/pre-commit` to run `pnpm exec lint-staged` (or drop the redundant `npm test` line) so the existing config takes effect.

**Acceptance criteria:**

- [ ] `pnpm test` runs a real suite and exits 0 on a clean tree; `pnpm test` exits non-zero when an intentionally failing test is added.
- [ ] `pnpm generate:component SampleWidget table` creates files under `src/components/sample-widget/` (component, `index.ts`, story) and nothing under a root `components/` directory; the printed next-steps text matches the real paths.
- [ ] All four generator templates produce files that type-check against the project tsconfig and pass lint.
- [ ] `lint-staged` runs on commit: staging an unformatted file rewrites it during the pre-commit hook.
- [ ] The pre-commit hook uses pnpm, not npm.
- [ ] Test and generator changes are covered by a changeset, per the repo's PR requirement.

**Tests:**

- Vitest config resolves the `@/` alias (a test that imports a component from `@/components/...` runs green).
- One smoke test asserting `pnpm test` has a non-zero assertion count.
- Manual: run the generator for each of the four types, confirm output paths, then delete the generated directories.

**Dependencies / blocks:**

- Blocks: 02, 03, 04, 05, 06, 08 — every later ticket's acceptance criteria are verified with `pnpm test`.
- Blocked by: none.

**Out of scope:**

- End-to-end/browser test harness (Playwright), CI workflow changes, coverage thresholds, Storybook interaction test migration.
- Renaming the `.husky` directory to the `_` convention husky 9 expects, or upgrading husky itself.
