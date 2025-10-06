# @protomolecule/eslint-config

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
