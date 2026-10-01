# Project Decisions

Append-only log of key architectural, UX, and workflow decisions with rationale.

## Format

- Date: YYYY-MM-DD
- Decision: what was decided
- Rationale: why this choice was made
- Consequences: trade-offs or follow-up actions

## Entries

<!-- Add new decisions below this line -->

- Date: 2026-09-29
- Decision: Default changeset bump level for new changesets is `patch`, not `minor` or `major`.
- Rationale: User preference stated explicitly during the Inter font change. Keeps the published template's version history conservative.
- Consequences: Only escalate to `minor`/`major` when the user asks for it in that change. Applies to any new `.changeset/*.md` file added in this repo.
