# 07: Documentation matches the code

**Group:** (3) Tooling + Endpoints + Docs Consistency

**What to build:** A developer who reads the docs and then writes code does not get contradicted by the codebase. The API guide describes the envelope and hooks that actually exist, the README states the dependency versions the project actually pins, and every command in the docs works when pasted.

**Blocked by:** 03 (final route shape), 04 (final hook and registry API).

**Status:** ready-for-agent

**Problem:**

- `docs/API_INTEGRATION.md` documents a system that does not exist. It describes an `lib/api.d.ts` OpenAPI-generated type file, an `api-client.ts` auth wrapper, `lib/api/hooks/{auth,projects,invoices}.ts`, and a full RBAC system with `PermissionGate`, `useHasPermission`, and `AdminOnly`. None of those files are in the repo. The actual implementation is a single `src/lib/hooks/useApi.ts`. The doc also gives commands (`npm run generate:types:dev`, `API_URL=...`) whose scripts are not in `package.json`, and points at `app/apps/...` paths that have moved under `src/`.
- The RBAC doc `docs/RBAC_SYSTEM.md` is likely in the same position and should be checked against reality in the same pass.
- The README's version claims are wrong against `package.json`: the description says Mantine 8 while dependencies pin Mantine 9.6.x, and the historical-version section describes the previous release as Next 14 / Mantine 7 / React 18 while the current release is Next 16 / React 19.2. The README file tree lists `yarn.lock`; the actual lockfile is `pnpm-lock.yaml`.
- `AGENTS.md` already records several of these inconsistencies as known issues, which is a signal they should be fixed rather than documented as known.
- Docs use `npm` throughout while the repo mandates pnpm.

**Solution sketch:**

- Rewrite `docs/API_INTEGRATION.md` to describe the system as it is after tickets 02 through 06: the response envelope, the shared route helper, the API path registry, the standard GET and write hooks, and how to add a new endpoint end to end. Delete the OpenAPI and RBAC sections, or move any genuinely aspirational material into a clearly labelled "planned / not implemented" note. Do not leave aspirational code samples that a reader would expect to work.
- Reconcile `docs/RBAC_SYSTEM.md` the same way: if RBAC is not implemented, say so plainly and remove the copy-paste-ready snippets that imply it is.
- Correct the README: package description version, the historical-release version list, the file tree's lockfile, and package-manager commands (`pnpm` everywhere).
- Sweep all docs for `npm run` / `yarn` and switch to pnpm. Verify each documented command actually appears in `package.json` scripts.
- Add a short "verify the docs" step to the contributor notes so the next drift is caught early: a check that every script name mentioned in docs exists in `package.json`.

**Acceptance criteria:**

- [ ] Every file, path, hook, and command named in `docs/API_INTEGRATION.md` exists in the repo, and every code sample compiles or is clearly marked as illustrative.
- [ ] `docs/RBAC_SYSTEM.md` matches reality: implemented behaviour is documented, unimplemented behaviour is labelled as such, and no snippet implies a component exists when it does not.
- [ ] The README's stated Mantine, Next, and React versions match `package.json`.
- [ ] The README file tree lists `pnpm-lock.yaml` and matches the actual top-level layout.
- [ ] No doc instructs the reader to use `npm` or `yarn`; all commands are pnpm.
- [ ] Every script referenced in any doc exists in `package.json`.
- [ ] `AGENTS.md`'s "Known inconsistencies to avoid" list is updated to drop the entries this ticket resolves, and any entry that is still true stays.
- [ ] `pnpm lint` and `pnpm typecheck` are clean; doc changes are Prettier-formatted.

**Tests:**

- A script (or documented manual check) that extracts script names from the docs and asserts each exists in `package.json`; add it to the test suite so drift fails loudly.
- A check that greps the docs for `npm run` and `yarn ` and returns nothing.
- Manual: follow the "add a new endpoint" walkthrough in `API_INTEGRATION.md` from a clean checkout and confirm each step works as written.

**Dependencies / blocks:**

- Blocked by: 03, 04 (the docs must describe the final contract and hook API).
- Blocks: 08 (the cleanup ticket should be the last word on the repo's conventions, and it can rely on the docs being accurate).

**Out of scope:**

- Writing a real OpenAPI pipeline or actually implementing RBAC.
- Rewriting `docs/COMPONENT_STANDARDS.md` beyond what is needed to keep it consistent with the conventions this ticket documents.
- Adding a docs site, search, or automated publishing.
- Marketing copy, screenshots, or badge changes in the README.
- Retroactive edits to `CHANGELOG.md` history.
