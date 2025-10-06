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

**Solution (Option 1: Re-export Plugins):**

- Added explicit plugin re-exports alongside the config
- Moved key plugins from transitive to direct dependencies
- Consumers can now import plugins if needed for custom configurations

**Changes:**

- Re-exported 12 core plugins: `pluginImportX`, `pluginReact`, `pluginReactHooks`, `pluginJsxA11y`, `pluginUnicorn`, `pluginPrettier`, `pluginPromise`, `pluginRegexp`, `pluginN`, `pluginJsdoc`, `pluginAstro`, `typescriptEslint`
- Moved plugins from transitive (via eslint-config-canonical) to direct dependencies
- Added TypeScript type suppression for plugins without type declarations

**Breaking Changes:**

- Package size will increase due to explicit plugin dependencies
- This is a major version bump due to dependency changes

**Benefits:**

- ✅ Fixes plugin resolution in workspace subdirectories
- ✅ Enables simplified consumer configs
- ✅ Consumers can access plugins for custom rules if needed
- ✅ More explicit dependency management

Closes #255
