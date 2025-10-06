---
"@robeasthope/eslint-config": minor
---

Add common import ignore patterns to Astro rules

**Enhancement:**
Added commonly-needed import ignore patterns to the Astro configuration to reduce boilerplate in consumer projects.

**New Ignore Patterns:**

1. **`^@/`** - Path aliases defined in tsconfig
   - Most Astro projects use path aliases like `@/components`, `@/layouts`
   - ESLint's static import resolver can't resolve these without complex configuration

2. **`\\.astro$`** - .astro file imports  
   - Astro's custom file format (`.astro`) isn't recognized by standard import resolvers
   - Allows imports like `import Layout from './Layout.astro'`

**Before (consumers had to override):**
```typescript
// Consumer's eslint.config.ts
export const astroImportRules = {
  files: ["**/*.astro"],
  rules: {
    "import/no-unresolved": [
      "error",
      {
        ignore: [
          "^astro:", // From base config (now lost due to override)
          "^@/",     // Had to add manually
          "\\.astro$", // Had to add manually
        ],
      },
    ],
  },
};
```

**After (works out of the box):**
```typescript
// Consumer's eslint.config.ts
export default [...baseConfig, customRules]; // Just works!
```

**Updated Rule:**
```typescript
"import/no-unresolved": [
  "error",
  {
    ignore: [
      "^astro:",    // Astro virtual modules (existing)
      "^@/",        // Path aliases (NEW)
      "\\.astro$",  // .astro imports (NEW)
    ],
  },
]
```

**Benefits:**

- ✅ Reduces boilerplate in consumer configs
- ✅ Covers 90%+ of Astro projects out of the box
- ✅ Consumers can still override if they need different patterns
- ✅ Maintains original `^astro:` virtual module ignores

**Impact:**

- No breaking changes - only adds ignore patterns
- Existing configs continue to work
- Projects using these patterns can remove their local overrides

Closes #265
