---
"@robeasthope/eslint-config": major
---

**BREAKING CHANGE: Switch to top-level type imports for React Router 7 compatibility**

This change updates the default type import style from inline (`import { type Foo }`) to top-level (`import type { Foo }`). This ensures compatibility with React Router 7's virtual module system and TypeScript's `verbatimModuleSyntax` option.

## What Changed

### Import Style Rules

- **Disabled**: `canonical/prefer-inline-type-import`
- **Changed**: `import/consistent-type-specifier-style` from `"prefer-inline"` to `"prefer-top-level"`
- **Updated**: `import/no-duplicates` with `{ "prefer-inline": false }`

### Before (v5.x - Inline Style)

```typescript
import { useState, type FC } from "react";
```

### After (v6.0.0 - Top-Level Style)

```typescript
import type { FC } from "react";
import { useState } from "react";
```

## Why This Change?

React Router 7 generates virtual type modules (e.g., `./+types/route`) that fail to resolve with inline type imports during production builds. Top-level type imports are:

1. **Compatible with all frameworks** - Works with React Router 7, Remix, Next.js, and others
2. **Safer with verbatimModuleSyntax** - Aligns with TypeScript's strict module resolution
3. **More explicit** - Clear separation between type and value imports
4. **Future-proof** - Less likely to conflict with framework-specific module systems

## Migration Guide

Run `pnpm lint:fix` in your project. Most inline type imports will auto-fix to top-level:

```bash
pnpm lint:fix
```

### Manual Fixes Required

For mixed imports (types + values from same module), you'll need to split them manually:

```typescript
// Before
import { useState, type FC, type ReactNode } from "react";

// After
import type { FC, ReactNode } from "react";
import { useState } from "react";
```

### Projects Using React Router 7

If you previously overrode these rules for React Router compatibility, you can now **remove the overrides**:

```typescript
// eslint.config.ts - Remove this override
{
  files: ["app/**/*.{ts,tsx}"],
  rules: {
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"], // ❌ Remove
    "canonical/prefer-inline-type-import": "off", // ❌ Remove
    "import/no-duplicates": ["error", { "prefer-inline": false }], // ❌ Remove
  },
}
```

## Breaking Changes

### Style Enforcement

- Projects using inline type imports will see lint errors
- `lint:fix` will convert inline imports to top-level
- Separate import statements for types and values are now the standard

### No Impact On

- Runtime behavior (type imports are erased at compile time)
- Type safety
- Import functionality

## Affected Projects

This change specifically addresses issues in:

- Waterleaf monorepo (#91)
- Hecate monorepo (#302)
- Any project using React Router 7 with virtual type modules

## References

- Issue: https://github.com/RobEasthope/protomolecule/issues/333
- React Router Issue: https://github.com/remix-run/react-router/issues/12503
- TypeScript verbatimModuleSyntax: https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax
