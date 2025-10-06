---
"@robeasthope/eslint-config": patch
---

Fix Astro parser resolution by making astro-eslint-parser a peerDependency

**Problem:**
Even though the Astro parser was configured correctly in the ESLint config, ESLint was still using the JavaScript parser (acorn/espree) for `.astro` files in consumer workspaces. This caused parsing errors like:

```text
error  Parsing error: The keyword 'interface' is reserved
```

**Root Cause:**
The `astro-eslint-parser` was a regular dependency of `@robeasthope/eslint-config`, installed in its `node_modules`. When ESLint ran from a consumer workspace subdirectory, it couldn't resolve the parser module even though the config referenced it correctly.

**Solution:**
Moved `astro-eslint-parser` from dependencies to **optional peerDependencies**:

- Consumers install the parser at workspace root where ESLint can resolve it
- Parser module is accessible from consumer's execution context
- Re-exported parser for explicit imports if needed

**Changes:**

- Moved `astro-eslint-parser` to peerDependencies (optional)
- Added to devDependencies for package's own linting
- Re-exported parser: `export { default as astroParser } from "astro-eslint-parser"`

**Installation (updated):**
```bash
# For projects using Astro
pnpm add -D -w \
  astro-eslint-parser \
  eslint-plugin-astro \
  [... other plugins]
```

**Benefits:**

- ✅ Astro parser now resolves correctly in monorepo workspaces
- ✅ `.astro` files parse without errors
- ✅ No more fallback to JavaScript parser
- ✅ Astro-specific syntax (interfaces, components) works correctly

Related to #261
