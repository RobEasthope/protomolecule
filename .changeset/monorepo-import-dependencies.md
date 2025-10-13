---
"@robeasthope/eslint-config": minor
---

Configure import/no-extraneous-dependencies for monorepos

The `import/no-extraneous-dependencies` rule now understands monorepo structures, allows devDependencies in appropriate file types, and recognizes peerDependencies.

**Features:**

**Monorepo support:**

- `packageDir: ["./", "../", "../../"]` - checks parent directories for `package.json`
- Resolves dependencies declared in workspace root, not just local package

**PeerDependencies support:**

- `peerDependencies: true` - allows imports from peerDependencies
- Essential for shared configs (ESLint configs, etc.) that re-export plugins

**DevDependencies allowed in:**

- Test files: `**/*.test.{ts,tsx,js,jsx}`, `**/*.spec.{ts,tsx,js,jsx}`, `**/__tests__/**/*`
- Config files: `**/*.config.{ts,js,mjs,cjs}`
- Utility directories: `.changeset/**`, `.github/scripts/**`, `scripts/**`

**Problems solved:**

Before this change:

1. Utility directories without local `package.json` would error when importing workspace root dependencies
2. ESLint configs couldn't import plugins from peerDependencies

```javascript
// .changeset/changelogFunctions.test.js
import { describe, expect, it } from "vitest";
// ❌ Error: 'vitest' should be listed in dependencies
// (even though it's in root package.json)
```

After this change, the rule correctly finds dependencies in ancestor `package.json` files and recognizes peerDependencies.
