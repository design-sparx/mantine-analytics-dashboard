# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Source of Truth

Project-specific conventions, commands, architecture notes, and agent instructions are maintained in [`AGENTS.md`](./AGENTS.md). Treat that file as the canonical source of truth.

## Key Points

- Next.js app using App Router in `src/app/`.
- Package manager: `pnpm` with `pnpm-lock.yaml`.
- Auth pages exist but middleware does not enforce auth. Demo credentials: `demo@example.com` / `demo123`.
- Mock API routes live under `src/app/api/` and return `{ succeeded, data, errors: [], message }`.
- Provider tree: `SystemNotificationsProvider` → `ThemeCustomizerProvider` → `ThemeProvider`.
- Route paths are defined in `src/routes/index.ts`; never hardcode route strings.

## When to Update AGENTS.md

If you change project behavior, commands, conventions, or architecture, update `AGENTS.md` first. Do not duplicate those rules here.
