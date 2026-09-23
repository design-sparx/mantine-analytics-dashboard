---
paths:
  - '**/*.tsx'
  - '**/*.jsx'
  - '**/components/**/*.ts'
  - '**/app/**/*.ts'
  - '**/pages/**/*.ts'
---

# React Security

> This file extends [typescript/security.md](../typescript/security.md) and [common/security.md](../common/security.md) with React specific content.

## XSS via dangerouslySetInnerHTML

CRITICAL. The prop name is deliberately scary — treat every usage as a code review halt.

- Is the input always under our control? Document the source.
- If user-derived: is it sanitized at the same call site?
- Is the sanitizer config allowlisting tags, not denylisting?

## Unsafe URL Schemes

javascript: and data: URLs in href, src, and xlink:href execute arbitrary code.

## target=\_blank Without rel

<a target=_blank> without rel='noopener noreferrer' lets the target page access window.opener and run navigation hijacks.

## Server Action Input Validation

Server Actions ('use server') run with the same trust level as a public API endpoint. Validate every input.

- Authenticate inside the action — do not trust the client-side route gate
- Authorize: confirm the current user has permission for the specific record they are mutating
- Rate limit sensitive actions

## Secret Exposure via Env Vars

Prefixed env vars are bundled into the client. Treat them as public.

| Framework | Public prefix  | Private    |
| --------- | -------------- | ---------- |
| Next.js   | NEXT*PUBLIC*\* | All others |

## Authentication / Authorization

- Never store sessions in localStorage — accessible to any XSS. Use httpOnly secure cookies.
- Never trust client-set state to gate sensitive UI. Render-gating in JSX prevents display, not access — the API must enforce.
- CSRF: cookie-based auth requires CSRF tokens or SameSite=Strict/Lax cookies

## Prototype Pollution via Object Spread

Always parse external JSON with a schema before spreading into state.

## Third-Party Components

- Audit npm audit before adding any UI library
- Check that the library does not internally use dangerouslySetInnerHTML on its input
- Pin versions, review changelogs before major upgrades

## Agent Support

- Use security-reviewer agent for comprehensive security audits across the codebase
- Use react-reviewer agent for React-specific patterns and the above rules in active code review
