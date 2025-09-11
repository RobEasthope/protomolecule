---
"protomolecule": minor
---

feat: add markdown linting to lint-staged checks

- Added markdownlint-cli2 for markdown file linting
- Configured markdown linting rules in .markdownlint.json
- Added .markdownlintignore to exclude node_modules and build directories
- Integrated markdown linting into lint-staged for automatic checks on commit
- Added npm scripts for manual markdown linting (lint:md and lint:md:fix)
