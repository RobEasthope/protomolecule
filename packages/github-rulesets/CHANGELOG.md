# @protomolecule/github-rulesets

## 1.2.0

### Minor Changes

- [`b030232`](https://github.com/RobEasthope/protomolecule/commit/b0302320251b5ea5269dd6fbb04e485c95a0347d) [#312](https://github.com/RobEasthope/protomolecule/pull/312) - Split and simplify main branch protection into two rulesets

  **Protect production ruleset** (minimal enforcement):
  - Add `creation` rule: Blocks branch creation (prevents recreating main)
  - Add `update` rule: Blocks all direct pushes from local machines
  - Remove required status checks (Lint, Build, Test, Changeset Check)
  - Remove review requirements - only requires PR creation
  - CI checks will run and surface failures without blocking merges

  **Require PR review ruleset** (optional, for stricter enforcement):
  - New standalone ruleset for teams wanting review requirements
  - Requires 1 approving review before merge
  - Dismisses stale reviews on push
  - Requires review thread resolution

  This split allows teams to choose their enforcement level: basic PR workflow (shows CI results) or full review requirement.

## 1.1.1

### Patch Changes

- [`418e04c`](https://github.com/RobEasthope/protomolecule/commit/418e04c49943b4fc3ce0994c1a13c8ac59236b8d) [#199](https://github.com/RobEasthope/protomolecule/pull/199) - Improve error diagnostics in ruleset scripts

  Enhanced error handling in apply-rulesets.sh and update-rulesets.sh to provide better diagnostic information:
  - Capture and display actual error messages from GitHub API failures
  - Differentiate between "already exists" errors and other failures
  - Show specific error details for JSON parsing errors, API errors, and network failures
  - Maintain graceful handling of the "already exists" case with helpful suggestions

- [`083b0d7`](https://github.com/RobEasthope/protomolecule/commit/083b0d7992930b1128edfcbba59f38d9c4a5880e) [#198](https://github.com/RobEasthope/protomolecule/pull/198) - Add warning about customizing status check names before applying rulesets

  Added prominent warning section to README explaining that hardcoded status check names (Lint, Build, Test, Changeset Check) must match GitHub Actions workflow job names exactly. Includes instructions for both updating the ruleset JSON and updating workflows to match.

## 1.1.0

### Minor Changes

- [`bb51e10`](https://github.com/RobEasthope/protomolecule/commit/bb51e109191ebf7ee81d06e16545f946c425fe2d) [#194](https://github.com/RobEasthope/protomolecule/pull/194) - Add comprehensive branch protection rules and automation scripts
  - Enhanced production ruleset with pull request reviews, status checks, and linear history enforcement
  - Added apply-rulesets.sh script to create rulesets in repositories via GitHub CLI
  - Added update-rulesets.sh script to update existing rulesets by name matching
  - Updated README with script usage examples and multi-repo sync strategies
  - Removed repo-specific fields from ruleset JSON for true portability across repositories

## 1.0.2

### Patch Changes

- [`31aa4c4`](https://github.com/RobEasthope/protomolecule/commit/31aa4c4ce03f28b9c85c02abaa0c5324e2368c0d) [#160](https://github.com/RobEasthope/protomolecule/pull/160) - Update markdown linting to use markdownlint-cli2 configuration format. Migrated from separate .markdownlint.json and .markdownlintignore files to unified .markdownlint-cli2.jsonc files. Simplified lint:md scripts to use config file exclusively, adding MDX file support.

## 1.0.1

### Patch Changes

- d9e3dac: feat: add markdown linting with turbo support
  - Added markdownlint-cli2 for markdown file linting
  - Configured markdown linting rules in .markdownlint.json
  - Added .markdownlintignore to exclude node_modules and build directories
  - Integrated markdown linting into lint-staged for automatic checks on commit
  - Added npm scripts for manual markdown linting (lint:md and lint:md:fix)
  - Added turbo tasks for running markdown linting across all packages
  - Added lint:md scripts to each package for package-level linting
