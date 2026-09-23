---
name: security-review
description: Security review checklist for commits and PRs. Use before merging security-sensitive changes.
---

# Security Review

Security-first review workflow for this repository.

## When to Use

- Before any commit touching auth, payments, user data
- Before merging PRs
- When reviewing external API calls or form submissions
- During security audits

## Pre-Commit Checklist

- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitized HTML)
- [ ] CSRF protection enabled
- [ ] Authentication/authorization verified
- [ ] Rate limiting on endpoints
- [ ] Error messages don't leak sensitive data

## React/Next.js Specific

- [ ] No dangerouslySetInnerHTML with unsanitized input
- [ ] No javascript: or unsafe data: URLs
- [ ] External links use rel='noopener noreferrer'
- [ ] Server Actions validate all inputs
- [ ] No secrets in NEXT*PUBLIC*\* env vars
- [ ] Source maps disabled or uploaded to error tracker in production

## Response Protocol

If a critical issue is found:

1. STOP immediately
2. Document the issue
3. Fix before continuing
4. Rotate any exposed secrets
5. Review entire codebase for similar issues
