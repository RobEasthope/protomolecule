---
"@protomolecule/ui": patch
"@protomolecule/eslint-config": patch
---

Add ESLint auto-fix to pre-commit hooks

- Added lint:fix-staged scripts to packages that run ESLint with --fix
- Configured lint-staged to run ESLint fix on JS/TS files before prettier
- ESLint will auto-fix issues but won't block commits for unfixable problems
