---
"@robeasthope/eslint-config": minor
---

Enforce function declarations with error-level func-style rule

**Breaking Change for Consumers:**
The `func-style` rule now errors (previously warned) when arrow functions or function expressions are used instead of function declarations. This enforces consistent function declaration style across codebases.

**Changes:**

- Changed `func-style` from `"warn"` to `"error"` severity
- Function declarations are now the enforced standard pattern
- Arrow functions and function expressions will cause linting failures

**Migration Guide:**
Convert arrow functions and function expressions to function declarations:

```typescript
// ❌ Before (now errors)
const myFunction = () => {
  // ...
}

// ✅ After
function myFunction() {
  // ...
}
```

**Framework-Specific Exceptions:**
React Router 7 files (`root.tsx`, `*route.tsx`) will need special handling in a future update, as they require arrow functions for typed exports like `export const links: Route.LinksFunction = () => [...]`. See issue #323 for tracking.

**Rationale:**

- Better hoisting behavior
- Clearer stack traces in debugging
- Explicit function names in all contexts
- Consistent codebase style
