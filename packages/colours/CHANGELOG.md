# @protomolecule/colours

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
