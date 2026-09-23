# Agent Orchestration

## Available Agents

Use specialized review or repair agents when the work matches their focus. For this repo, the most relevant ones are:

| Agent                | Purpose                 | When to Use                   |
| -------------------- | ----------------------- | ----------------------------- |
| planner              | Implementation planning | Complex features, refactoring |
| architect            | System design           | Architectural decisions       |
| tdd-guide            | Test-driven development | New features, bug fixes       |
| code-reviewer        | Code review             | After writing code            |
| security-reviewer    | Security analysis       | Before commits                |
| build-error-resolver | Fix build errors        | When build fails              |
| e2e-runner           | E2E testing             | Critical user flows           |
| react-reviewer       | React-specific review   | React code changes            |
| typescript-reviewer  | TypeScript review       | Type-heavy changes            |

## Immediate Agent Usage

No user prompt needed:

1. Complex feature requests - Use planner agent
2. Code just written/modified - Use code-reviewer agent
3. Bug fix or new feature - Use tdd-guide agent
4. Architectural decision - Use architect agent

## Parallel Task Execution

Use parallel execution for independent operations.

## Delegation Completion Contract

1. Your final message IS the deliverable. Never end your turn with waiting for background agents.
2. If you delegate, you own collection. Wait for results, integrate them, then return.
3. Decompose only when the work cannot fit in one context.
