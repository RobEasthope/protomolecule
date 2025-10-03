# @protomolecule/colours

## 3.0.1

### Patch Changes

- [`e1913ab`](https://github.com/RobEasthope/protomolecule/commit/e1913ab0fba40c755194b6e80ff320112c14859b) [#192](https://github.com/RobEasthope/protomolecule/pull/192) - Add dual publishing to GitHub Packages registry. Packages are now published to both npm (primary) and GitHub Packages (backup) registries.

  **Changes:**
  - Added automatic publishing to GitHub Packages after npm publish
  - Non-fatal error handling for GitHub Packages (npm remains primary)
  - Updated documentation with GitHub Packages installation info

  **For users:**
  - No action required - packages still install from npm by default
  - GitHub Packages available as backup registry (requires authentication)
  - See README for GitHub Packages setup instructions

  See issue #191 for implementation details.

- [`1226985`](https://github.com/RobEasthope/protomolecule/commit/12269850a3be2d526795e978db4cc658f4e428af) [#192](https://github.com/RobEasthope/protomolecule/pull/192) - Improve GitHub Packages publishing script robustness
  - Add error handling for JSON parsing
  - Add package name and path validation
  - Track success/failure counts for better error reporting
  - Add comprehensive JSDoc comments
  - Document environment variables and exit codes

## 3.0.0

### Major Changes

- [`0ff0bdc`](https://github.com/RobEasthope/protomolecule/commit/0ff0bdc8db20c1b34459d0e0ed7ffca37915f3ff) [#171](https://github.com/RobEasthope/protomolecule/pull/171) - BREAKING CHANGE: Migrate package namespace from @protomolecule to @robeasthope

  All packages have been renamed to use the @robeasthope namespace for GitHub Packages compatibility:
  - @protomolecule/ui → @robeasthope/ui
  - @protomolecule/eslint-config → @robeasthope/eslint-config
  - @protomolecule/colours → @robeasthope/colours

  Migration guide:
  1. Update package.json dependencies from @protomolecule/_to @robeasthope/_
  2. Update any imports from @protomolecule/_to @robeasthope/_
  3. Clear node_modules and reinstall dependencies

### Patch Changes

- [`f57cad4`](https://github.com/RobEasthope/protomolecule/commit/f57cad4a06614d53b514748d3e3cbb4fb642ccc1) [#165](https://github.com/RobEasthope/protomolecule/pull/165) - Add package metadata fields for improved npm discoverability. Added keywords, author, homepage, and bugs fields to all published packages to improve search ranking and provide clear support channels.

- [`799150b`](https://github.com/RobEasthope/protomolecule/commit/799150b9d60c2f7633ca732ebe6069620326e018) [#166](https://github.com/RobEasthope/protomolecule/pull/166) - Move test scripts to .github/scripts/ for better organization and convention alignment

- [`31aa4c4`](https://github.com/RobEasthope/protomolecule/commit/31aa4c4ce03f28b9c85c02abaa0c5324e2368c0d) [#160](https://github.com/RobEasthope/protomolecule/pull/160) - Update markdown linting to use markdownlint-cli2 configuration format. Migrated from separate .markdownlint.json and .markdownlintignore files to unified .markdownlint-cli2.jsonc files. Simplified lint:md scripts to use config file exclusively, adding MDX file support.

## 2.1.8

### Patch Changes

- [`a6b4929`](https://github.com/RobEasthope/protomolecule/commit/a6b4929e83b64dab2c519dbeb73f83bd16659462) [#156](https://github.com/RobEasthope/protomolecule/pull/156) - chore: remove GitHub packages publishing functionality

  Simplified the release process by removing dual-registry publishing to GitHub packages. Packages are now only published to NPM, reducing complexity and maintenance overhead.

## 2.1.7

### Patch Changes

- [`e94ad2f`](https://github.com/RobEasthope/protomolecule/commit/e94ad2f00e049f13bc0aca64e443da3451958446) [#144](https://github.com/RobEasthope/protomolecule/pull/144) - feat(ci): add descriptive PR titles for version releases

  Improved the release workflow to generate more descriptive PR titles based on the packages being released and the types of changes included. PR titles now indicate:
  - Which packages are being released
  - The nature of changes (features, fixes, breaking changes)
  - The number of packages when releasing many at once

  This makes it easier to understand at a glance what each release PR contains without having to open it.

## 2.1.6

### Patch Changes

- 31f216f: Improve shell script error handling by adding pipefail option

## 2.1.5

### Patch Changes

- e6a328b: docs: add comprehensive GitHub Packages manual publishing documentation
  - Created detailed manual publishing guide with step-by-step instructions
  - Added automated script for manual GitHub Packages publishing
  - Created documentation index (docs/README.md) for easier navigation
  - Added cross-references between all release-related documentation
  - Updated release process docs with troubleshooting section
  - Linked all documentation for better discoverability

- 8a3048f: Configure GitHub Packages with personal namespace and add individual publish scripts
  - Updated all GitHub Packages configuration to use personal namespace (RobEasthope) instead of organization
  - Fixed manual publish script hanging issue by redirecting stdin from /dev/null
  - Added individual publish scripts for each package for more granular control
  - Improved error detection and reporting in publish scripts
  - Scripts now automatically load .env file for convenience
  - Enhanced .env file error handling to catch and report syntax errors
  - Updated documentation to explain personal namespace setup

## 2.1.4

### Patch Changes

- 353c05f: fix(ci): use RELEASE_PAT for GitHub Packages publishing to fix 403 errors
  - Use RELEASE_PAT (which has package write permissions) instead of GITHUB_TOKEN
  - Falls back to GITHUB_TOKEN if RELEASE_PAT is not available
  - Should resolve 403 permission errors when publishing to GitHub Packages

## 2.1.3

### Patch Changes

- 2a1d81d: fix(ci): comprehensive fix for GitHub Packages publishing failures
  - Fixed workspace directory reference issue that caused cd command failures
  - Added retry mechanism with exponential backoff for transient failures
  - Implemented package existence check before attempting to publish
  - Improved error handling with specific error detection patterns
  - Added detailed logging and debugging output for troubleshooting
  - Created separate npmrc configuration to avoid conflicts with NPM registry
  - Used file-based result tracking to work around bash array limitations in pipelines
  - Added comprehensive summary reporting with success/skip/failure counts
  - Created test script for local validation of publishing logic

## 2.1.2

### Patch Changes

- a15c2ac: feat: add GitHub Packages publishing support

  Added dual publishing to both NPM and GitHub Packages registries. All public packages will now be automatically published to GitHub Packages alongside NPM during the release process.
  - Updated release workflow to publish to GitHub Packages after NPM publishing
  - Added repository field to all publishable packages for proper GitHub Packages metadata
  - Configured authentication for GitHub Packages using GITHUB_TOKEN

## 2.1.1

### Patch Changes

- 46a58a6: docs: reorganise documentation structure and fix package installation instructions
  - Created comprehensive documentation in new docs/ folder
  - Simplified main README with clear table of contents
  - Fixed installation instructions for published packages
  - Improved documentation organisation for better maintainability

## 2.1.0

### Minor Changes

- db40da8: feat: configure UI and colours packages for NPM publishing
  - Removed private flag from @protomolecule/ui package to enable NPM publishing
  - Removed private flag from @protomolecule/colours package to enable NPM publishing
  - Added publishConfig with public access for both packages
  - Added proper build process for UI package using Vite
  - Configured package.json with correct exports and build outputs
  - Updated release workflow to verify build outputs for new public packages
  - Updated documentation to reflect newly published packages

  Both packages are now available on NPM:
  - @protomolecule/ui - React component library with Storybook
  - @protomolecule/colours - Radix UI color system CSS imports

## 2.0.1

### Patch Changes

- d9e3dac: feat: add markdown linting with turbo support
  - Added markdownlint-cli2 for markdown file linting
  - Configured markdown linting rules in .markdownlint.json
  - Added .markdownlintignore to exclude node_modules and build directories
  - Integrated markdown linting into lint-staged for automatic checks on commit
  - Added npm scripts for manual markdown linting (lint:md and lint:md:fix)
  - Added turbo tasks for running markdown linting across all packages
  - Added lint:md scripts to each package for package-level linting

## 2.0.0

### Major Changes

- e6fdc43: feat!: rename @protomolecule/radix-colors to @protomolecule/colours

  BREAKING CHANGE: Package renamed from @protomolecule/radix-colors to @protomolecule/colours. Update all imports accordingly.
