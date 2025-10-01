---
"@robeasthope/eslint-config": patch
---

Use typescript-eslint's disableTypeChecked config for Storybook files instead of disabling TypeScript parser entirely. This disables only type-aware linting rules (that require tsconfig project references) while keeping all syntax-based TypeScript rules active, providing better linting coverage for Storybook files that are excluded from tsconfig.json.
