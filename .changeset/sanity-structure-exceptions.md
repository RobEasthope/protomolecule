---
"@robeasthope/eslint-config": minor
---

Add ESLint rule exceptions for Sanity structure files

Sanity Studio structure files (`structure.ts`, `deskStructure.ts`) use specific conventions that conflict with standard ESLint rules:

- **`func-style`**: Arrow functions assigned to constants are the standard Sanity pattern
- **`id-length`**: The single-letter `S` parameter is a standard Sanity convention for the StructureBuilder

Both rules are now disabled for these files to support the standard Sanity patterns:

```typescript
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([...]);
```

Also renamed `sanitySchema.ts` to `sanity.ts` to better reflect that the file now contains multiple Sanity-related ESLint configurations.

Closes #365
