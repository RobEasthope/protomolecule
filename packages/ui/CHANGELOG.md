# @protomolecule/ui

## 3.1.0

### Minor Changes

- [`c15304d`](https://github.com/RobEasthope/protomolecule/commit/c15304d10b5b23ddffa3e9e56bf251b01dc08446) [#148](https://github.com/RobEasthope/protomolecule/pull/148) - feat(ui): add Prose component from hecate repo

  Added a new Prose component that provides typography styling for text content. The component includes:
  - Support for polymorphic rendering with `as` prop
  - Support for Radix UI Slot pattern with `asChild` prop
  - Basic CSS styles for first/last child margin handling
  - TypeScript support with proper prop types

### Patch Changes

- [`e94ad2f`](https://github.com/RobEasthope/protomolecule/commit/e94ad2f00e049f13bc0aca64e443da3451958446) [#144](https://github.com/RobEasthope/protomolecule/pull/144) - feat(ci): add descriptive PR titles for version releases

  Improved the release workflow to generate more descriptive PR titles based on the packages being released and the types of changes included. PR titles now indicate:
  - Which packages are being released
  - The nature of changes (features, fixes, breaking changes)
  - The number of packages when releasing many at once

  This makes it easier to understand at a glance what each release PR contains without having to open it.

## 3.0.4

### Patch Changes

- 31f216f: Improve shell script error handling by adding pipefail option

## 3.0.3

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

## 3.0.2

### Patch Changes

- 353c05f: fix(ci): use RELEASE_PAT for GitHub Packages publishing to fix 403 errors
  - Use RELEASE_PAT (which has package write permissions) instead of GITHUB_TOKEN
  - Falls back to GITHUB_TOKEN if RELEASE_PAT is not available
  - Should resolve 403 permission errors when publishing to GitHub Packages

## 3.0.1

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

## 3.0.0

### Major Changes

- 6e5085d: BREAKING CHANGE: Rename Prose component to SanityProse to avoid conflicts with future work
  - `Prose` component is now `SanityProse`
  - `ProseProps` type is now `SanityProseProps`
  - All imports need to be updated from `Prose` to `SanityProse`

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

- Updated dependencies [d9e3dac]
  - @protomolecule/colours@2.0.1

## 2.0.0

### Major Changes

- e6fdc43: feat!: rename @protomolecule/radix-colors to @protomolecule/colours

  BREAKING CHANGE: Package renamed from @protomolecule/radix-colors to @protomolecule/colours. Update all imports accordingly.

### Patch Changes

- Updated dependencies [e6fdc43]
  - @protomolecule/colours@2.0.0

## 1.1.2

### Patch Changes

- dd05159: Add ESLint auto-fix to pre-commit hooks
  - Added lint:fix-staged scripts to packages that run ESLint with --fix
  - Configured lint-staged to run ESLint fix on JS/TS files before prettier
  - ESLint will auto-fix issues but won't block commits for unfixable problems

- 210933a: Configure versioning and publishing infrastructure
  - Set UI package version to 1.1.1
  - Prepare for NPM publishing of eslint-config package
