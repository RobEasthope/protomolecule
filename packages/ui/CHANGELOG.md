# @protomolecule/ui

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
