---
'mantine-analytics-dashboard': patch
---

fix: prevent infinite announcement retry loop in SystemNotificationsProvider

- Add useRef to track latest dismissedIds (avoids stale closure in async retry logic)
- Add retryAttemptedRef to bound retries to exactly one
- Add active flag for proper cleanup on unmount
- Fix condition to use ref instead of stale config.dismissedIds
- Add regression tests for bounded retry, no-clear-when-new, and unmount cleanup
