# AGENTS.md — Mantine Analytics Dashboard

## Package manager

- Lockfile is `pnpm-lock.yaml`. Use `pnpm`, not npm/yarn, even though README and CI workflows reference npm/yarn.

## Commands

```bash
pnpm dev             # localhost:3000, React Compiler enabled
pnpm build           # next build
pnpm start           # next start
pnpm lint            # next lint
pnpm prettier        # prettier . --write
pnpm storybook       # port 6006
pnpm build-storybook
pnpm changeset:add   # add a changeset before PRs
pnpm generate:component Foo [basic|interactive|table|card]
```

- There is no test runner. `"test": ""` in package.json and `.husky/pre-commit` runs `npm test` (no-op).
- `lint-staged` is configured in package.json but NOT wired to husky — Prettier does not run on staged files automatically.
- `pnpm generate:component` is buggy: it writes to `./components/` instead of `./src/components/`. Verify paths and move files manually.

## Architecture

- Single Next.js 16 app (not a monorepo). App Router in `src/app/`.
- Mock API routes in `src/app/api/*/route.ts` read JSON from `public/mocks/*.json` and return:
  `{ succeeded, data, errors: string[], message }` (no `timestamp`; `errors` is `string[]`, not the `IApiError[]` in `src/types/api-response.ts`).
- `middleware.ts` is at the project root (not `src/app/`). It is a no-op — all routes are public.
- Provider nesting: `SystemNotificationsProvider` → `ThemeCustomizerProvider` → `ThemeProvider`.
- `SystemNotificationsProvider` loads the latest announcement from `public/system-announcements.json` and persists dismissed IDs in `localStorage` (`system-notifications`). If every loaded announcement is already dismissed, it clears old dismissals and retries so genuinely new announcements surface.
- Theme config persists in `localStorage` via `ThemeCustomizerContext`; layout vars are injected as CSS custom properties on `documentElement` (`--sidebar-width`, `--header-height`, `--theme-primary-color`, etc.).

## Paths & imports

- `@/` → `src/`
- `@public/*` → `public/*`
- Never hardcode route strings; import from `src/routes/index.ts` (e.g. `PATH_APPS.invoices.invoice_details(id)`).

## Component conventions

- One component per directory under `src/components/<kebab-case>/` with an `index.ts` re-export.
- Register new components in `src/components/index.ts`.
- Shared bases: `BaseTable` (`mantine-datatable` wrapper) and `BaseCard` (`Paper` wrapper).
- Client components must have `'use client'` at the top.

## Style & formatting

- Prettier: `semi: true`, `singleQuote: true`, 2-space indent (`.editorconfig` matches).
- PostCSS: `postcss-preset-mantine` + `postcss-simple-vars` with custom breakpoint overrides.
- `next.config.js`: `reactCompiler: true`, `trailingSlash: false`.

## Auth

- Auth pages exist but middleware does not enforce auth. Demo credentials: `demo@example.com` / `demo123`.

## CI / release

- `pnpm changeset:add` is required for PRs; release PR is created automatically on push to `main`.
- Chromatic deploys Storybook on PR/push to `main`.

## Known inconsistencies to avoid

- README description claims Mantine 7 / React 18; actual deps are Mantine 9.6.x and React 19.2.
- README file tree lists `yarn.lock`; actual file is `pnpm-lock.yaml`.
- `IApiResponse<T>` type includes `timestamp` and typed `errors`; mock API routes omit `timestamp` and return `errors: string[]`. Use the actual response shape when typing fetches.
