---
'mantine-analytics-dashboard': patch
---

Fix runtime errors on the SaaS dashboard, profile and settings pages

- `/dashboard/saas` read the wrapped `/api/stats` payload as an array and crashed. It now unwraps `.data`.
- `/apps/profile` passed icon components from a Server Component into `ProfileStatsCard`. The cards moved into a client component.
- `/apps/settings` registered the Underline extension twice, which tiptap warned about. The duplicate was removed.
