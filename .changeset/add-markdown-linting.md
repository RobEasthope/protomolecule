---
"protomolecule": minor
"@protomolecule/ui": patch
"@protomolecule/eslint-config": patch
"@protomolecule/tsconfig": patch
"@protomolecule/radix-colors": patch
"@protomolecule/github-rulesets": patch
---

feat: add markdown linting with turbo support

- Added markdownlint-cli2 for markdown file linting
- Configured markdown linting rules in .markdownlint.json
- Added .markdownlintignore to exclude node_modules and build directories
- Integrated markdown linting into lint-staged for automatic checks on commit
- Added npm scripts for manual markdown linting (lint:md and lint:md:fix)
- Added turbo tasks for running markdown linting across all packages
- Added lint:md scripts to each package for package-level linting
