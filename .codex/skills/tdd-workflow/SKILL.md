---
name: tdd-workflow
description: Enforce test-driven development with 80%+ coverage target. Use when implementing features, bug fixes, or refactors.
---

# TDD Workflow

Follow ECC-inspired test-driven development for this project.

## When to Use

- New features
- Bug fixes
- Refactors that change behavior
- Any change that needs verification

## Workflow

1. Write the test first (RED)
2. Run it and confirm it fails for the right reason
3. Write minimal implementation (GREEN)
4. Run it and confirm it passes
5. Refactor while keeping tests green
6. Verify coverage

## Test Structure

Use Arrange-Act-Assert with descriptive names that explain the behavior under test.
