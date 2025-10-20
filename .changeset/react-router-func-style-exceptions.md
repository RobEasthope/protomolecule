---
"@robeasthope/eslint-config": patch
---

Add React Router 7 exceptions for func-style rule

**Changes:**

- Created `reactRouterExceptions` config for React Router 7 files (`root.tsx`, `*.route.tsx`)
- These files now allow arrow functions via `allowArrowFunctions` option
- Exceptions properly override the strict func-style enforcement from base config

**React Router 7 Patterns Now Allowed:**
```typescript
// ✅ Allowed in root.tsx and *.route.tsx files
export const links: Route.LinksFunction = () => [...];
export const meta: Route.MetaFunction = () => ({ ... });
export const loader: Route.LoaderFunction = async () => { ... };
```

**Why This Exception Is Needed:**
React Router 7 uses typed exports that require arrow functions or function expressions because:

1. They need type annotations (`Route.LinksFunction`, etc.)
2. TypeScript doesn't allow type annotations on function declarations
3. The framework expects these specific export patterns

**Implementation Details:**

- Created `rules/reactRouterExceptions.ts` with framework-specific overrides
- Added to config array AFTER `preferences` (order matters for override behavior)
- Uses `allowArrowFunctions: true` option to permit arrow functions in variable declarations

**Resolves:** #323
