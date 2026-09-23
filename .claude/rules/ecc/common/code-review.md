# Code Review Standards

## Purpose

Code review ensures quality, security, and maintainability before code is merged.

## When to Review

**MANDATORY review triggers:**

- After writing or modifying code
- Before any commit to shared branches
- When security-sensitive code is changed
- When architectural changes are made
- Before merging pull requests

## Review Checklist

Before marking code complete:

- [ ] Code is readable and well-named
- [ ] Functions are focused (<50 lines)
- [ ] Source files are cohesive (under the 800-line soft maintainability ceiling)
- [ ] No deep nesting (>4 levels)
- [ ] Errors are handled explicitly
- [ ] No hardcoded secrets or credentials
- [ ] No console.log or debug statements
- [ ] Tests exist for new functionality

## Security Review Triggers

**STOP and use security-reviewer agent when:**

- Authentication or authorization code
- User input handling
- Database queries
- File system operations
- External API calls
- Cryptographic operations
- Payment or financial code

## Review Severity Levels

| Level    | Meaning                                  | Action                         |
| -------- | ---------------------------------------- | ------------------------------ |
| CRITICAL | Security vulnerability or data loss risk | BLOCK - Must fix before merge  |
| HIGH     | Bug or significant quality issue         | WARN - Should fix before merge |
| MEDIUM   | Maintainability concern                  | INFO - Consider fixing         |
| LOW      | Style or minor suggestion                | NOTE - Optional                |

## Review Workflow

1. Run git diff to understand changes
2. Check security checklist first
3. Review code quality checklist
4. Run relevant tests
5. Verify coverage

## Approval Criteria

- Approve: No CRITICAL or HIGH issues
- Warning: Only HIGH issues (merge with caution)
- Block: CRITICAL issues found
