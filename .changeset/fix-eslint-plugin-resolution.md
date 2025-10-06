---
"@robeasthope/eslint-config": major
---

Fix ESLint plugin resolution in flat config for workspace consumers

**Problem:**
When using `@robeasthope/eslint-config` in monorepo workspaces, ESLint couldn't resolve plugins when run from subdirectories. This caused errors like:

```text
A configuration object specifies rule "import/no-unresolved", but could not find plugin "import".
```

This prevented consumers from using the simplified config:
```typescript
import robeasthope from "@robeasthope/eslint-config";
export default [...robeasthope];
```

**Solution:**

- Re-exported 12 core plugins alongside the config for proper resolution
- Moved plugins to peerDependencies (consumers must install them)
- Package managers will warn about missing peer dependencies during installation
- Consumers can import re-exported plugins if needed for custom configurations

**Changes:**

- Re-exported plugins: `pluginImportX`, `pluginReact`, `pluginReactHooks`, `pluginJsxA11y`, `pluginUnicorn`, `pluginPrettier`, `pluginPromise`, `pluginRegexp`, `pluginN`, `pluginJsdoc`, `pluginAstro`, `typescriptEslint`
- Converted plugins to peerDependencies (except `eslint-plugin-astro` which is optional)
- Added TypeScript type suppression for plugins without type declarations

**Breaking Changes:**

- Consumers must now install required plugins as peer dependencies
- Package managers will show warnings if plugins are missing
- Installation command provided in package warnings

**Installation:**

```bash
pnpm add -D @robeasthope/eslint-config \
  eslint-plugin-import-x \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  eslint-plugin-unicorn \
  eslint-plugin-prettier \
  eslint-plugin-promise \
  eslint-plugin-regexp \
  eslint-plugin-n \
  eslint-plugin-jsdoc \
  typescript-eslint
```

**Benefits:**

- ✅ Fixes plugin resolution in workspace subdirectories
- ✅ Enables simplified consumer configs
- ✅ Smaller package size (plugins not bundled)
- ✅ Consumers control plugin versions
- ✅ Clear warnings when plugins are missing

Closes #255
