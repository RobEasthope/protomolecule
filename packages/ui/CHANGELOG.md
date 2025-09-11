# @protomolecule/ui

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
