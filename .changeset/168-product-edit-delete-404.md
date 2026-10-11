---
'mantine-analytics-dashboard': patch
---

Fix product edit and delete failing with 404: the drawer now addresses the per-product endpoint from the registry, and write routes reject a missing id with 400 instead of guessing it from the URL
