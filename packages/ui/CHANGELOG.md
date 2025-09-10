# @protomolecule/ui

## 1.1.2

### Patch Changes

- dd05159: Add ESLint auto-fix to pre-commit hooks

  - Added lint:fix-staged scripts to packages that run ESLint with --fix
  - Configured lint-staged to run ESLint fix on JS/TS files before prettier
  - ESLint will auto-fix issues but won't block commits for unfixable problems

- 210933a: Configure versioning and publishing infrastructure

  - Set UI package version to 1.1.1
  - Prepare for NPM publishing of eslint-config package
