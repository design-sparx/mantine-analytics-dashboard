---
paths:
  - '**/*.ts'
  - '**/*.tsx'
  - '**/*.js'
  - '**/*.jsx'
---

# TypeScript/JavaScript Security

> This file extends [common/security.md](../common/security.md) with TypeScript/JavaScript specific content.

## Secret Management

NEVER: Hardcoded secrets
ALWAYS: Environment variables
Validate that required secrets are present at startup

## Agent Support

- Use security-reviewer skill for comprehensive security audits
