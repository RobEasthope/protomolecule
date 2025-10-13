# @protomolecule/eslint-config

## 5.0.0

### Major Changes

- [`fc6d2ec`](https://github.com/RobEasthope/protomolecule/commit/fc6d2ec22d3e84f6e5d9af7fbabfcb75f3f8ad68) [#293](https://github.com/RobEasthope/protomolecule/pull/293) - Move ESLint plugins from peerDependencies to dependencies for flat config

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

## 4.2.0

### Minor Changes

- [`3a186e2`](https://github.com/RobEasthope/protomolecule/commit/3a186e2201b62bef4952905d5b612b5f7c98c679) [#286](https://github.com/RobEasthope/protomolecule/pull/286) - Allow console.log() in no-console ESLint rule

  The no-console rule now allows console.log() alongside error, debug, and warn methods. This change enables legitimate use of console.log() in:
  - GitHub Actions scripts for CI output visibility
  - CLI tools for normal operation
  - Utility scripts for progress reporting

  The rule remains configured as a warning (not error), maintaining visibility while allowing practical usage.

- [`bfe99a3`](https://github.com/RobEasthope/protomolecule/commit/bfe99a3b5814441d9e5b08b2baf3afdf31c82c1c) [#288](https://github.com/RobEasthope/protomolecule/pull/288) - Add CommonJS support for .cjs files

  The ESLint config now properly handles `.cjs` files, treating them as CommonJS scripts with appropriate Node.js environment globals.

  **Features:**
  - Automatically matches `**/*.cjs` files
  - Sets `sourceType: "script"` for proper CommonJS parsing
  - Provides Node.js globals (`require`, `module`, `exports`, `console`, `process`, etc.)
  - Provides ES2021 globals

  **Use case:**

  This enables `.cjs` files (CommonJS by convention) to use `require()` and `module.exports` without ESLint parsing errors. Note that `.js` files are treated as ES modules by default, matching modern Node.js behavior.

  **Dependencies:**

  Added `globals` package (v15.18.0) for Node.js and ES global definitions.

- [`6cb7b3c`](https://github.com/RobEasthope/protomolecule/commit/6cb7b3cb9cc08f3e926b76c57b3b6ba0e715b55d) [#290](https://github.com/RobEasthope/protomolecule/pull/290) - Configure import/no-extraneous-dependencies for monorepos

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

- [`fa8f8d0`](https://github.com/RobEasthope/protomolecule/commit/fa8f8d06a0c708c7e5c472f35057ef82bec40bf6) [#287](https://github.com/RobEasthope/protomolecule/pull/287) - Add relaxed TypeScript rules for test files

  Created new test file overrides that downgrade strict TypeScript rules from error to warning in test files:
  - `@typescript-eslint/no-explicit-any` → warning (allows testing type validation)
  - `@typescript-eslint/no-non-null-assertion` → warning (allows assertions after preconditions)

  Test files are matched by:
  - `**/*.test.{ts,tsx,js,jsx}`
  - `**/*.spec.{ts,tsx,js,jsx}`
  - `**/__tests__/**/*.{ts,tsx,js,jsx}`

  These rules remain warnings (not disabled) to maintain visibility during code review, while allowing idiomatic test patterns without blocking CI/CD.

## 4.1.0

### Minor Changes

- [`7d563c1`](https://github.com/RobEasthope/protomolecule/commit/7d563c186fe901b2cb90c0c54dbaebda6ce65c87) [#266](https://github.com/RobEasthope/protomolecule/pull/266) - Add common import ignore patterns to Astro rules

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
            "^@/", // Had to add manually
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

## 4.0.2

### Patch Changes

- [`c81d167`](https://github.com/RobEasthope/protomolecule/commit/c81d167b0cef75a3955816aca17998d7202ff571) [#263](https://github.com/RobEasthope/protomolecule/pull/263) - Fix Astro parser resolution by making astro-eslint-parser a peerDependency

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

## 4.0.1

### Patch Changes

- [`5c09ae1`](https://github.com/RobEasthope/protomolecule/commit/5c09ae18d2e4b5d4906821da3a621fdc399ac677) [#260](https://github.com/RobEasthope/protomolecule/pull/260) - Add plugin aliasing to map eslint-plugin-import-x as "import"

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

## 4.0.0

### Major Changes

- [`cf5f831`](https://github.com/RobEasthope/protomolecule/commit/cf5f8314d6ad8721cdc6edb51b1797ba5a2d0d97) [#257](https://github.com/RobEasthope/protomolecule/pull/257) - Fix ESLint plugin resolution in flat config for workspace consumers

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

## 3.0.3

### Patch Changes

- [`5d113b1`](https://github.com/RobEasthope/protomolecule/commit/5d113b1517ccd9c7af8ac54bdf0cd1141d954446) [#227](https://github.com/RobEasthope/protomolecule/pull/227) - Fix initial GitHub Packages publish script to not modify global .npmrc

  **Problem:** The initial publish script was modifying `~/.npmrc` with a scope-level registry override (`@robeasthope:registry=https://npm.pkg.github.com`), causing all `@robeasthope/*` packages to resolve from GitHub Packages instead of npm. This required authentication and broke CI in other repositories.

  **Solution:**
  - Initial publish now uses temporary `.npmrc` (automatically cleaned up)
  - No modification of user's global `~/.npmrc`
  - Dual publishing continues to work (npm + GitHub Packages)
  - Added cleanup script for affected users: `scripts/cleanup-npmrc.ts`
  - Added verification check to warn about existing scope overrides

  **Migration:** If you previously ran the initial publish script, run the cleanup script to restore normal npm behavior:

  ```bash
  pnpm tsx scripts/cleanup-npmrc.ts
  ```

  **Impact:** Packages now install from npm by default (no authentication required). GitHub Packages remains available as an explicit opt-in backup registry.

  Fixes #226

## 3.0.2

### Patch Changes

- [`e1913ab`](https://github.com/RobEasthope/protomolecule/commit/e1913ab0fba40c755194b6e80ff320112c14859b) [#192](https://github.com/RobEasthope/protomolecule/pull/192) - Add dual publishing to GitHub Packages registry. Packages are now published to both npm (primary) and GitHub Packages (backup) registries.

  **Changes:**
  - Added automatic publishing to GitHub Packages after npm publish
  - Non-fatal error handling for GitHub Packages (npm remains primary)
  - Updated documentation with GitHub Packages installation info

  **For users:**
  - No action required - packages still install from npm by default
  - GitHub Packages available as backup registry (requires authentication)
  - See README for GitHub Packages setup instructions

  See issue #191 for implementation details.

- [`1226985`](https://github.com/RobEasthope/protomolecule/commit/12269850a3be2d526795e978db4cc658f4e428af) [#192](https://github.com/RobEasthope/protomolecule/pull/192) - Improve GitHub Packages publishing script robustness
  - Add error handling for JSON parsing
  - Add package name and path validation
  - Track success/failure counts for better error reporting
  - Add comprehensive JSDoc comments
  - Document environment variables and exit codes

## 3.0.1

### Patch Changes

- [`1f51ac7`](https://github.com/RobEasthope/protomolecule/commit/1f51ac7e248214935ddd7b34efdd75a9486d4200) [#182](https://github.com/RobEasthope/protomolecule/pull/182) - Improve Astro support by ignoring virtual imports (astro:\*) instead of disabling import resolution entirely. The import/no-unresolved rule now uses a targeted regex pattern to allow Astro's virtual modules (astro:content, astro:assets, etc.) while still validating other imports in .astro files.

- [`5144c13`](https://github.com/RobEasthope/protomolecule/commit/5144c13be191b1f43ae7943697e28db48ff6ab65) [#184](https://github.com/RobEasthope/protomolecule/pull/184) - Use typescript-eslint's disableTypeChecked config for Storybook files instead of disabling TypeScript parser entirely. This disables only type-aware linting rules (that require tsconfig project references) while keeping all syntax-based TypeScript rules active, providing better linting coverage for Storybook files that are excluded from tsconfig.json.

## 3.0.0

### Major Changes

- [`0ff0bdc`](https://github.com/RobEasthope/protomolecule/commit/0ff0bdc8db20c1b34459d0e0ed7ffca37915f3ff) [#171](https://github.com/RobEasthope/protomolecule/pull/171) - BREAKING CHANGE: Migrate package namespace from @protomolecule to @robeasthope

  All packages have been renamed to use the @robeasthope namespace for GitHub Packages compatibility:
  - @protomolecule/ui → @robeasthope/ui
  - @protomolecule/eslint-config → @robeasthope/eslint-config
  - @protomolecule/colours → @robeasthope/colours

  Migration guide:
  1. Update package.json dependencies from @protomolecule/_to @robeasthope/_
  2. Update any imports from @protomolecule/_to @robeasthope/_
  3. Clear node_modules and reinstall dependencies

### Patch Changes

- [`f57cad4`](https://github.com/RobEasthope/protomolecule/commit/f57cad4a06614d53b514748d3e3cbb4fb642ccc1) [#165](https://github.com/RobEasthope/protomolecule/pull/165) - Add package metadata fields for improved npm discoverability. Added keywords, author, homepage, and bugs fields to all published packages to improve search ranking and provide clear support channels.

- [`6923886`](https://github.com/RobEasthope/protomolecule/commit/69238864d656aab4d28f323f5a63995816598d13) [#153](https://github.com/RobEasthope/protomolecule/pull/153) - fix: update ESLint rules for better compatibility
  - Changed no-console from error to warning to allow debugging
  - Added avoidEscape option to quotes rule to prevent circular fixes
  - Disabled canonical/filename-match-regex rule for more flexible naming

- [`799150b`](https://github.com/RobEasthope/protomolecule/commit/799150b9d60c2f7633ca732ebe6069620326e018) [#166](https://github.com/RobEasthope/protomolecule/pull/166) - Move test scripts to .github/scripts/ for better organization and convention alignment

- [`31aa4c4`](https://github.com/RobEasthope/protomolecule/commit/31aa4c4ce03f28b9c85c02abaa0c5324e2368c0d) [#160](https://github.com/RobEasthope/protomolecule/pull/160) - Update markdown linting to use markdownlint-cli2 configuration format. Migrated from separate .markdownlint.json and .markdownlintignore files to unified .markdownlint-cli2.jsonc files. Simplified lint:md scripts to use config file exclusively, adding MDX file support.

## 2.1.7

### Patch Changes

- [`a6b4929`](https://github.com/RobEasthope/protomolecule/commit/a6b4929e83b64dab2c519dbeb73f83bd16659462) [#156](https://github.com/RobEasthope/protomolecule/pull/156) - chore: remove GitHub packages publishing functionality

  Simplified the release process by removing dual-registry publishing to GitHub packages. Packages are now only published to NPM, reducing complexity and maintenance overhead.

## 2.1.6

### Patch Changes

- [`e94ad2f`](https://github.com/RobEasthope/protomolecule/commit/e94ad2f00e049f13bc0aca64e443da3451958446) [#144](https://github.com/RobEasthope/protomolecule/pull/144) - feat(ci): add descriptive PR titles for version releases

  Improved the release workflow to generate more descriptive PR titles based on the packages being released and the types of changes included. PR titles now indicate:
  - Which packages are being released
  - The nature of changes (features, fixes, breaking changes)
  - The number of packages when releasing many at once

  This makes it easier to understand at a glance what each release PR contains without having to open it.

## 2.1.5

### Patch Changes

- 31f216f: Improve shell script error handling by adding pipefail option

## 2.1.4

### Patch Changes

- e6a328b: docs: add comprehensive GitHub Packages manual publishing documentation
  - Created detailed manual publishing guide with step-by-step instructions
  - Added automated script for manual GitHub Packages publishing
  - Created documentation index (docs/README.md) for easier navigation
  - Added cross-references between all release-related documentation
  - Updated release process docs with troubleshooting section
  - Linked all documentation for better discoverability

- 8a3048f: Configure GitHub Packages with personal namespace and add individual publish scripts
  - Updated all GitHub Packages configuration to use personal namespace (RobEasthope) instead of organization
  - Fixed manual publish script hanging issue by redirecting stdin from /dev/null
  - Added individual publish scripts for each package for more granular control
  - Improved error detection and reporting in publish scripts
  - Scripts now automatically load .env file for convenience
  - Enhanced .env file error handling to catch and report syntax errors
  - Updated documentation to explain personal namespace setup

## 2.1.3

### Patch Changes

- 353c05f: fix(ci): use RELEASE_PAT for GitHub Packages publishing to fix 403 errors
  - Use RELEASE_PAT (which has package write permissions) instead of GITHUB_TOKEN
  - Falls back to GITHUB_TOKEN if RELEASE_PAT is not available
  - Should resolve 403 permission errors when publishing to GitHub Packages

## 2.1.2

### Patch Changes

- 2a1d81d: fix(ci): comprehensive fix for GitHub Packages publishing failures
  - Fixed workspace directory reference issue that caused cd command failures
  - Added retry mechanism with exponential backoff for transient failures
  - Implemented package existence check before attempting to publish
  - Improved error handling with specific error detection patterns
  - Added detailed logging and debugging output for troubleshooting
  - Created separate npmrc configuration to avoid conflicts with NPM registry
  - Used file-based result tracking to work around bash array limitations in pipelines
  - Added comprehensive summary reporting with success/skip/failure counts
  - Created test script for local validation of publishing logic

## 2.1.1

### Patch Changes

- a15c2ac: feat: add GitHub Packages publishing support

  Added dual publishing to both NPM and GitHub Packages registries. All public packages will now be automatically published to GitHub Packages alongside NPM during the release process.
  - Updated release workflow to publish to GitHub Packages after NPM publishing
  - Added repository field to all publishable packages for proper GitHub Packages metadata
  - Configured authentication for GitHub Packages using GITHUB_TOKEN

## 2.1.0

### Minor Changes

- 6baaf4b: Add Astro file linting support to eslint-config package

## 2.0.2

### Patch Changes

- d9e3dac: feat: add markdown linting with turbo support
  - Added markdownlint-cli2 for markdown file linting
  - Configured markdown linting rules in .markdownlint.json
  - Added .markdownlintignore to exclude node_modules and build directories
  - Integrated markdown linting into lint-staged for automatic checks on commit
  - Added npm scripts for manual markdown linting (lint:md and lint:md:fix)
  - Added turbo tasks for running markdown linting across all packages
  - Added lint:md scripts to each package for package-level linting

## 2.0.1

### Patch Changes

- dd05159: Add ESLint auto-fix to pre-commit hooks
  - Added lint:fix-staged scripts to packages that run ESLint with --fix
  - Configured lint-staged to run ESLint fix on JS/TS files before prettier
  - ESLint will auto-fix issues but won't block commits for unfixable problems

- fda5cad: Fix release workflow for continuous deployment
  - Replace Version Packages PR approach with immediate publishing
  - Packages now publish to NPM immediately when changesets merge to main
  - Aligns with SPEC.md continuous deployment strategy

- a14a0fc: Update @types/node to version 22 to match Node version used in CI
- a6cbb14: Fix NPM authentication using changesets/action with enhanced reliability
  - Replace custom version/publish logic with official changesets/action@v1.4.8 (pinned version)
  - Action handles NPM authentication automatically via NPM_TOKEN
  - Enhanced build verification:
    - Comprehensive build output validation before publish
    - File size checks to detect empty/corrupt builds
    - Clear error reporting in GitHub Step Summary
  - Improved error handling:
    - NPM retry configuration for transient network failures
    - Post-publish verification to confirm packages are available
    - Non-brittle error handling that doesn't mask real issues
  - Restored useful custom functionality:
    - Concurrency control (queues releases instead of cancelling)
    - Pre-publish validation and changeset status checking
    - Enhanced release summaries with clear success/failure indicators
    - Better error messages and action items on failure
  - Simplifies workflow while keeping important safeguards
  - Reduces 105 lines of custom code

- 5def063: Fix release workflow by disabling Husky hooks in CI to prevent prettier errors during changeset commits
- a14a0fc: Fix critical GitHub Actions workflow syntax error that prevented workflow from running
  - Fixed invalid token fallback syntax that caused workflow parse errors
  - Now properly uses RELEASE_PAT secret for checkout (required for protected branches)
  - GITHUB_TOKEN is still used for GitHub release creation (doesn't need push permissions)

- a232f46: Fix critical workflow YAML parsing errors and add workflow linting
  - Fixed info emoji character (ℹ️) that caused YAML parsing errors on line 220
  - Fixed multiline string with "---" that was interpreted as YAML document separator
  - Added yaml-lint package for workflow validation
  - Added lint:workflows and lint:workflows:fix scripts
  - Integrated workflow linting into pre-commit hooks via lint-staged
  - Prettier already handles YAML formatting, yaml-lint validates syntax

- 33c4dd1: Add .claude directory to ESLint ignore list to prevent linting of Claude AI-generated files
