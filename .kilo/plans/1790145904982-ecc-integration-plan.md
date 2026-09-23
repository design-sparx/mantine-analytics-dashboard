# Plan: ECC-Inspired Improvements for `mantine-analytics-dashboard`

## Goal

Adopt the most useful parts of ECC into this repo so AI-assisted development is more consistent, secure, and test-aware across **Claude Code, OpenCode, Codex, and Kilo** — without breaking the existing contributor experience or shipping unnecessary harness-specific runtime code.

## Current State

- Next.js 16 + React 19 + Mantine 9.6 + TypeScript
- `AGENTS.md` exists with project conventions
- No test runner configured (`"test": ""`)
- Prettier + ESLint + Husky present, but `lint-staged` is not wired to Husky
- No existing `.claude/`, `.opencode/`, or `.codex/` directories
- `.kilo/` exists with minimal config
- Public open-source repo with external contributors likely

## Recommendation: Yes, Adopt Selectively for All Agents

ECC is a good fit here, but the full plugin/hook/runtime install is **not** recommended for this project because:

1. This is a template repo; contributors may use different editors/agents.
2. The runtime hooks and plugin paths are harness-specific and add maintenance burden.
3. The highest-value parts of ECC are the **rules** and **workflow principles**, not the plugin plumbing.

The universal entry point is `AGENTS.md`: Claude Code, OpenCode, Codex, and Kilo all read it. Use that as the single source of truth, then add lightweight agent-specific adapters where each harness has a native rules/skills system.

## What to Add

### 1. Universal standards in `AGENTS.md`

Update `AGENTS.md` to include the ECC-inspired standards directly:

- Immutability, small focused files, error handling
- Security checklist
- TDD intent and 80% coverage target
- Code review checklist
- Agent orchestration guidance

This ensures **all four agents** see the same standards without needing separate copies.

### 2. Claude Code rules (`.claude/rules/ecc/`)

Claude Code natively loads `.claude/rules/**/*.md` as always-loaded context. Add:

- `common/` — baseline standards (immutability, file size, security checklist, TDD intent, code review checklist)
- `typescript/` — TS-specific typing, immutability, error handling
- `react/` — React 19 rules (RSC boundary, hooks, forms, composition)
- `web/` — frontend performance, design quality, accessibility, responsive testing

Do NOT add ECC's `hooks/` runtime or plugin manifests. Those require specific agent harnesses and are out of scope for an open-source template.

### 3. Kilo skills (`.kilo/skills/`)

Kilo discovers skills under `.kilo/skills/<name>/SKILL.md`. Add lightweight skill stubs:

- `tdd-workflow`
- `security-review`
- `react-testing`
- `react-performance`
- `frontend-patterns`
- `react-patterns`
- `design-system`

These are discovery aids for Kilo; they do not execute code.

### 4. OpenCode rules (`.opencode/rules/ecc/`)

OpenCode reads `AGENTS.md`, but also supports project-local rule directories. Add a lightweight adapter so OpenCode can pick up the standards without depending entirely on `AGENTS.md` parsing:

- Mirror the most important rules from `.claude/rules/ecc/` into `.opencode/rules/ecc/`
- Keep these files concise; they are copies, not separate standards

### 5. Codex rules (`.codex/rules/ecc/`)

Codex reads `AGENTS.md`, but also supports project-local configuration. Add a lightweight adapter so Codex can pick up the standards without depending entirely on `AGENTS.md` parsing:

- Mirror the most important rules from `.claude/rules/ecc/` into `.codex/rules/ecc/`
- Keep these files concise; they are copies, not separate standards

## What NOT to Add

- ECC plugin installs (`npx ecc-universal setup`, `/plugin install ecc@ecc`)
- Claude Code runtime `hooks/` configuration
- ECC `agents/`, `commands/`, or `mcp-configs/` — these belong in developer-local config, not the repo
- Separate rule copies for every agent unless a specific agent demonstrably cannot read `AGENTS.md`

## Memory Strategy

The static rule files above are not enough for true cross-session learning. Add lightweight memory/context artifacts per agent so prior work can influence future sessions.

### Claude Code memory (`.claude/memory/`)

Claude Code does not have a built-in repo-local memory file format that survives across sessions, but project-local markdown can be used as injected context if referenced from `AGENTS.md` or rules. Add:

- `.claude/memory/learnings.md` — reusable project lessons, repeated fixes, and conventions discovered during work
- `.claude/memory/decisions.md` — key architectural/UX decisions with rationale
- Update `AGENTS.md` to instruct Claude Code sessions to read and append to these files when relevant

Do not add ECC runtime hooks for memory unless the user explicitly opts into the plugin path; these files are sufficient for documentation-based memory.

### Kilo memory (`.kilo/memory/`)

Kilo has native memory tools (`kilo_memory_save`, `kilo_memory_recall`). Complement that with repo-local memory docs:

- `.kilo/memory/learnings.md` — project-specific lessons
- `.kilo/memory/decisions.md` — decisions with rationale
- `.kilo/memory/patterns.md` — patterns that worked or should be avoided

These are plain-text fallbacks Kilo can read even if tool memory is unavailable.

### OpenCode memory (`.opencode/memory/`)

OpenCode should use repo-local markdown memory similar to Claude Code:

- `.opencode/memory/learnings.md`
- `.opencode/memory/decisions.md`

### Codex memory (`.codex/memory/`)

Codex should use repo-local markdown memory:

- `.codex/memory/learnings.md`
- `.codex/memory/decisions.md`

Treat `.claude/memory/` as the source of truth and sync lightweight summaries into the other agent memory directories when needed.

## Concrete Implementation Steps

1. Update `AGENTS.md` with an **ECC Integration** section containing the universal standards and memory instructions
2. Create `.claude/rules/ecc/{common,typescript,react,web}/` directories with curated rule files
3. Create `.kilo/skills/{tdd-workflow,security-review,react-testing,react-performance,frontend-patterns,react-patterns,design-system}/SKILL.md` stubs
4. Create `.opencode/rules/ecc/` with lightweight copies of the most important rules
5. Create `.codex/rules/ecc/` with lightweight copies of the most important rules
6. Create `.claude/memory/{learnings.md,decisions.md}` as the source of truth memory files
7. Create `.kilo/memory/{learnings.md,decisions.md,patterns.md}` as Kilo memory fallbacks
8. Create `.opencode/memory/{learnings.md,decisions.md}` as lightweight mirrors
9. Create `.codex/memory/{learnings.md,decisions.md}` as lightweight mirrors
10. Run `pnpm prettier` and `pnpm lint` to confirm formatting/ESLint still pass
11. Document the new structure in `README.md` or `CONTRIBUTING.md` so contributors know the rules exist

## Validation

- Verify `.claude/rules/ecc/**/*.md` files are valid Markdown
- Verify `.kilo/skills/**/SKILL.md` files are valid Markdown
- Verify `.opencode/rules/ecc/**/*.md` files are valid Markdown
- Verify `.codex/rules/ecc/**/*.md` files are valid Markdown
- Verify `.claude/memory/**/*.md` files are valid Markdown
- Verify `.kilo/memory/**/*.md` files are valid Markdown
- Verify `.opencode/memory/**/*.md` files are valid Markdown
- Verify `.codex/memory/**/*.md` files are valid Markdown
- Verify `AGENTS.md` still renders correctly
- Verify no build/lint errors after adding the new files

## Open Questions / Decisions

None. This plan is low-risk and reversible: the new files are additive markdown/docs only.

## Risks

- **Low risk.** The changes are documentation-only from the app's perspective.
- The main risk is **noise**: if the rules are too generic, contributors ignore them. Mitigate by keeping rules concise and repo-specific where possible.
- **Duplication risk**: `.opencode/rules/ecc/` and `.codex/rules/ecc/` are copies of `.claude/rules/ecc/`. Keep them synchronized by documenting that `.claude/rules/ecc/` is the source of truth and the others are mirrors.
- **Memory drift risk**: memory files can become stale. Mitigate by treating them as append-only logs and reviewing them during major refactors.
- **Agent coverage gap**: if OpenCode or Codex do not surface `AGENTS.md` content in practice, those agents will miss the standards. This is acceptable for a first pass; add adapter directories only if needed.

## File

`D:\works\design-sparx\mantine-analytics-dashboard\.kilo\plans\1790145904982-ecc-integration-plan.md`
