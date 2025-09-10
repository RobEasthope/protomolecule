---
"@protomolecule/eslint-config": patch
---

Fix NPM authentication using changesets/action with restored functionality

- Replace custom version/publish logic with official changesets/action
- Action handles NPM authentication automatically via NPM_TOKEN
- Restored useful custom functionality:
  - Concurrency control (queues releases instead of cancelling)
  - Pre-publish validation and changeset status checking
  - Enhanced release summaries with clear success/failure indicators
  - Better error messages and action items on failure
- Simplifies workflow while keeping important safeguards
- Reduces 105 lines of custom code
