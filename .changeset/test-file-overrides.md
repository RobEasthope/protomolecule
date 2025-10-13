---
"@robeasthope/eslint-config": minor
---

Add relaxed TypeScript rules for test files

Created new test file overrides that downgrade strict TypeScript rules from error to warning in test files:

- `@typescript-eslint/no-explicit-any` → warning (allows testing type validation)
- `@typescript-eslint/no-non-null-assertion` → warning (allows assertions after preconditions)

Test files are matched by:

- `**/*.test.{ts,tsx,js,jsx}`
- `**/*.spec.{ts,tsx,js,jsx}`
- `**/__tests__/**/*.{ts,tsx,js,jsx}`

These rules remain warnings (not disabled) to maintain visibility during code review, while allowing idiomatic test patterns without blocking CI/CD.
