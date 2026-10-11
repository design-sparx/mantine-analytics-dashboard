---
'mantine-analytics-dashboard': patch
---

fix: make the error screen's refresh button reload the app and add a global error boundary

- Call `window.location.reload()` from the "Refresh Page" button; it referenced the function without calling it, so the button did nothing
- Add `src/app/global-error.tsx` so a crash in the root layout renders the branded error screen instead of the framework default
- Add regression tests for both boundaries' recovery UI and actions
