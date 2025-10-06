---
"@robeasthope/eslint-config": patch
---

Add plugin aliasing to map eslint-plugin-import-x as "import"

**Problem:**
`eslint-config-canonical` references rules using plugin name `"import"`, but the actual installed package is `eslint-plugin-import-x`. This caused ESLint flat config to fail with:

```text
A configuration object specifies rule "import/no-unresolved", but could not find plugin "import".
```

**Solution:**
Added plugin aliasing to register `eslint-plugin-import-x` as both `"import"` and `"import-x"`:

- `"import"` - Alias for backward compatibility with canonical config
- `"import-x"` - Standard modern name

**Changes:**

- Imported `pluginImportX` explicitly in index.ts
- Added plugin registration config object before canonical config
- Registered plugin under both names for compatibility

**Benefits:**

- ✅ Backward compatibility with canonical config's "import" references
- ✅ No consumer changes needed - workarounds can be removed
- ✅ Future-proof - works when canonical eventually updates
- ✅ Clean migration path - can remove "import" alias later

**Impact:**
Consumers can now remove workarounds like:
```typescript
export const astroImportFix = {
  files: ["**/*.astro"],
  rules: {
    "import/no-unresolved": "off",
  },
};
```

**Note on Astro compatibility:**
This fix is essential for Astro files. The `rules/astro.ts` configuration uses `"import/no-unresolved"` rule to ignore Astro virtual imports. Without the plugin aliasing, this rule reference would fail because ESLint couldn't find the "import" plugin.

Closes #259
Related to #261
