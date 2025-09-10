# @protomolecule/eslint-config

## 2.0.1

### Patch Changes

- dd05159: Add ESLint auto-fix to pre-commit hooks

  - Added lint:fix-staged scripts to packages that run ESLint with --fix
  - Configured lint-staged to run ESLint fix on JS/TS files before prettier
  - ESLint will auto-fix issues but won't block commits for unfixable problems

- 5def063: Fix release workflow by disabling Husky hooks in CI to prevent prettier errors during changeset commits
- 33c4dd1: Add .claude directory to ESLint ignore list to prevent linting of Claude AI-generated files
