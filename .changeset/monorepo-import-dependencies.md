---
"@robeasthope/eslint-config": minor
---

Configure import/no-extraneous-dependencies for monorepos

The `import/no-extraneous-dependencies` rule now understands monorepo structures and allows devDependencies in appropriate file types.

**Features:**

**Monorepo support:**

- `packageDir: ["./", "../", "../../"]` - checks parent directories for `package.json`
- Resolves dependencies declared in workspace root, not just local package

**DevDependencies allowed in:**

- Test files: `**/*.test.{ts,tsx,js,jsx}`, `**/*.spec.{ts,tsx,js,jsx}`, `**/__tests__/**/*`
- Config files: `**/*.config.{ts,js,mjs,cjs}`
- Utility directories: `.changeset/**`, `.github/scripts/**`, `scripts/**`

**Problem solved:**

Before this change, utility directories without local `package.json` would error when importing workspace root dependencies:

```javascript
// .changeset/changelogFunctions.test.js
import { describe, expect, it } from "vitest";
// ❌ Error: 'vitest' should be listed in dependencies
// (even though it's in root package.json)
```

After this change, the rule correctly finds dependencies in ancestor `package.json` files.
