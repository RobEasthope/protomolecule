---
"@protomolecule/infrastructure": patch
---

Optimize E2E testing workflow to run only when necessary

**Changes:**

- Remove push trigger - workflow now only runs on pull requests
- Add path filtering to skip when UI package is unchanged
- Prevents unnecessary CI runs on release automation commits

**Benefits:**

- Reduces GitHub Actions minutes usage
- Faster PR feedback (no queuing for irrelevant changes)
- Matches pattern used in linting-and-testing workflow

Closes #308
