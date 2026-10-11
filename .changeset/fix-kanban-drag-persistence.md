---
'mantine-analytics-dashboard': patch
---

fix: kanban drag persistence uses write hook and registry endpoint

- Move persistence write from inside setState updater to onDragEnd event handler
- Use useApiWrite hook with API_WRITE.taskDetail(id) from shared registry
- Update task array immutably in onDragOver (no API calls during drag)
- Add error handling with local state rollback on write failure
- Add regression tests for no write on render, correct endpoint usage
- Fix import order to pass lint
