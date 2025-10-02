# @protomolecule/github-rulesets

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
