---
"@robeasthope/eslint-config": patch
---

Fix TypeScript type portability error in Astro config export

**Problem:** TypeScript compiler error `TS2742` when building the package after dependency updates. The inferred type of the `astro` export could not be named without referencing internal `@eslint/core` types, making it non-portable for declaration files.

**Root Cause:** The spread operator `...configs["flat/recommended"]` from `eslint-plugin-astro` created a type dependency on internal ESLint Core types that cannot be represented in `.d.ts` files.

**Solution:** Added explicit `Linter.Config[]` type annotation to the `astro` export, making the type portable and independent of internal plugin type inference.

**Impact:** This is a build-time only fix with no runtime behavior changes. Consumers of the package will see no functional differences.
