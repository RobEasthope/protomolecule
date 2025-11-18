---
"@robeasthope/eslint-config": patch
---

Fix TypeScript compilation error with astro rule type inference

Added explicit type annotation `Linter.Config[]` to the astro export to resolve TypeScript error TS2742. The compiler was unable to infer the type without an explicit reference, causing build failures.
