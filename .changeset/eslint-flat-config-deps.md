---
"@robeasthope/eslint-config": major
---

Move ESLint plugins from peerDependencies to dependencies for flat config

**BREAKING CHANGE**: ESLint plugins are now regular dependencies instead of peerDependencies. This aligns with ESLint flat config best practices.

**What Changed:**
- All 13 ESLint plugins moved from `peerDependencies` to `dependencies`
- `astro-eslint-parser` and `typescript-eslint` moved to `dependencies`
- Only `eslint` remains as a `peerDependency`
- Removed `peerDependenciesMeta` section
- Removed unused plugin re-exports from `index.ts`

**Benefits:**
- ✅ Simpler installation (2 packages instead of 14)
- ✅ No peer dependency warnings
- ✅ Config package controls exact plugin versions
- ✅ Automatic compatible plugin updates
- ✅ Follows ESLint flat config documentation

**Migration Guide for Consumers:**

After upgrading to v5.0.0, you can remove plugin dependencies from your `package.json`:

```bash
# Remove plugins (now bundled with config)
pnpm remove astro-eslint-parser eslint-plugin-import-x \
  eslint-plugin-jsdoc eslint-plugin-jsx-a11y eslint-plugin-n \
  eslint-plugin-prettier eslint-plugin-promise eslint-plugin-react \
  eslint-plugin-react-hooks eslint-plugin-regexp eslint-plugin-unicorn \
  typescript-eslint

# Keep only if you import them directly in your eslint.config files
# (e.g., eslint-plugin-astro for Astro-specific config)
```

**Before (v4.x):**
```bash
pnpm add -D @robeasthope/eslint-config eslint [+ 13 plugins]
```

**After (v5.0.0):**
```bash
pnpm add -D @robeasthope/eslint-config eslint
```

Your ESLint configuration will continue to work without changes. The config package now handles all plugin dependencies automatically.

Closes #292
