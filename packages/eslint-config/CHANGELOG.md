# @protomolecule/eslint-config

## 2.0.1

### Patch Changes

- dd05159: Add ESLint auto-fix to pre-commit hooks

  - Added lint:fix-staged scripts to packages that run ESLint with --fix
  - Configured lint-staged to run ESLint fix on JS/TS files before prettier
  - ESLint will auto-fix issues but won't block commits for unfixable problems

- fda5cad: Fix release workflow for continuous deployment

  - Replace Version Packages PR approach with immediate publishing
  - Packages now publish to NPM immediately when changesets merge to main
  - Aligns with SPEC.md continuous deployment strategy

- a14a0fc: Update @types/node to version 22 to match Node version used in CI
- a6cbb14: Fix NPM authentication using changesets/action with enhanced reliability

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

- 5def063: Fix release workflow by disabling Husky hooks in CI to prevent prettier errors during changeset commits
- a14a0fc: Fix critical GitHub Actions workflow syntax error that prevented workflow from running

  - Fixed invalid token fallback syntax that caused workflow parse errors
  - Now properly uses RELEASE_PAT secret for checkout (required for protected branches)
  - GITHUB_TOKEN is still used for GitHub release creation (doesn't need push permissions)

- a232f46: Fix critical workflow YAML parsing errors and add workflow linting

  - Fixed info emoji character (ℹ️) that caused YAML parsing errors on line 220
  - Fixed multiline string with "---" that was interpreted as YAML document separator
  - Added yaml-lint package for workflow validation
  - Added lint:workflows and lint:workflows:fix scripts
  - Integrated workflow linting into pre-commit hooks via lint-staged
  - Prettier already handles YAML formatting, yaml-lint validates syntax

- 33c4dd1: Add .claude directory to ESLint ignore list to prevent linting of Claude AI-generated files
