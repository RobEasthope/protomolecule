---
"@protomolecule/eslint-config": patch
---

Fix NPM authentication using changesets/action with enhanced reliability

- Replace custom version/publish logic with official changesets/action@v1.4.8 (pinned version)
- Action handles NPM authentication automatically via NPM_TOKEN
- Enhanced build verification:
  - Comprehensive build output validation before publish
  - File size checks to detect empty/corrupt builds
  - Clear error reporting in GitHub Step Summary
- Improved error handling:
  - NPM retry configuration for transient network failures
  - Post-publish verification to confirm packages are available
  - Non-brittle error handling that doesn't mask real issues
- Restored useful custom functionality:
  - Concurrency control (queues releases instead of cancelling)
  - Pre-publish validation and changeset status checking
  - Enhanced release summaries with clear success/failure indicators
  - Better error messages and action items on failure
- Simplifies workflow while keeping important safeguards
- Reduces 105 lines of custom code
