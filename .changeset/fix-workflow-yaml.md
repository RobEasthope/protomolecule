---
"@protomolecule/eslint-config": patch
---

Fix critical workflow YAML parsing errors and add workflow linting

- Fixed info emoji character (ℹ️) that caused YAML parsing errors on line 220
- Fixed multiline string with "---" that was interpreted as YAML document separator
- Added yaml-lint package for workflow validation
- Added lint:workflows and lint:workflows:fix scripts
- Integrated workflow linting into pre-commit hooks via lint-staged
- Prettier already handles YAML formatting, yaml-lint validates syntax
