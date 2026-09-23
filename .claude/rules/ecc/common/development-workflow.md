# Development Workflow

> This file extends [common/git-workflow.md](./git-workflow.md) with the full feature development process that happens before git operations.

## Feature Implementation Workflow

0. Research & Reuse (mandatory before any new implementation)

   - Search for existing implementations, templates, and patterns before writing anything new.
   - Use primary vendor docs to confirm API behavior, package usage, and version-specific details before implementing.
   - Check package registries before writing utility code. Prefer battle-tested libraries over hand-rolled solutions.
   - Prefer adopting or porting a proven approach over writing net-new code when it meets the requirement.

1. Plan First

   - Break the work into small, testable steps
   - Identify dependencies and risks
   - Prefer the simplest approach that meets the requirement

2. TDD Approach

   - Write tests first (RED)
   - Implement to pass tests (GREEN)
   - Refactor (IMPROVE)
   - Verify coverage

3. Code Review

   - Review code immediately after writing it
   - Address CRITICAL and HIGH issues before continuing
   - Fix MEDIUM issues when possible

4. Commit & Push

   - Detailed commit messages
   - Follow conventional commits format

5. Pre-Review Checks
   - Verify all automated checks (CI/CD) are passing
   - Resolve any merge conflicts
   - Ensure branch is up to date with target branch
