---
"@robeasthope/eslint-config": minor
---

Allow devDependencies in test setup files

Configure `import/no-extraneous-dependencies` rule to allow imports from `devDependencies` in test files and test setup files. This prevents false positives on files like `vitest.setup.ts` that legitimately import testing libraries.

**New file patterns recognized:**

- `vitest.setup.{ts,js}` - Vitest setup files
- `jest.setup.{ts,js}` - Jest setup files
- `playwright.setup.{ts,js}` - Playwright setup files
- `test.setup.{ts,js}` - Generic test setup files
- `**/__tests__/**/*.setup.{ts,js}` - Setup files in `__tests__` directories
- `**/tests/**/*.setup.{ts,js}` - Setup files in `tests` directories

**Before:**
```typescript
// vitest.setup.ts
import "@testing-library/jest-dom";
// ❌ Error: should be in dependencies, not devDependencies
```

**After:**
```typescript
// vitest.setup.ts
import "@testing-library/jest-dom";
// ✅ Allowed - setup files can use devDependencies
```

This uses a hybrid approach with specific framework names and test directory scoping to avoid false positives on non-test setup files like `database.setup.ts` or `server.setup.ts`.

Closes #295
