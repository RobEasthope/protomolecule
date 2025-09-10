---
"@protomolecule/eslint-config": patch
---

Fix NPM authentication with explicit .npmrc and enhanced safeguards (Option 1)

- Added explicit .npmrc file creation with NPM_TOKEN before publishing
- Added npm whoami verification to ensure auth is working
- Enhanced with important safeguards:
  - Concurrency control (queues releases instead of cancelling)
  - Pre-publish validation and changeset status checking
  - Enhanced release summaries with clear success/failure indicators
  - Better error messages with actionable next steps
- Maintains all existing custom logic and control
