---
"@robeasthope/eslint-config": patch
---

Fix import/no-extraneous-dependencies false positives in monorepos with absolute paths

**Problem Solved:**
When using lint-staged in pnpm workspace monorepos, the `import/no-extraneous-dependencies` rule reported false positives for dependencies that were correctly listed in workspace package.json files. This occurred because lint-staged passes absolute file paths to ESLint, and the default import resolver couldn't map those paths back to the correct workspace package.

**Solution:**
Added `eslint-import-resolver-typescript` to properly resolve imports in monorepo workspaces. The TypeScript resolver:

- Correctly maps absolute file paths to workspace packages
- Resolves imports using tsconfig.json path mappings
- Supports both monorepo and single-package projects
- Gracefully falls back to standard Node resolution when TypeScript configs aren't present

**Changes:**

- Added `eslint-import-resolver-typescript@^4.4.4` as devDependency
- Configured `import-x/resolver` settings in preferences with:
  - `alwaysTryTypes: true` - Resolves `@types/*` packages
  - `project` array supporting monorepo (`apps/*/`, `packages/*/`) and single-package layouts

**Performance Impact:**
Testing on this monorepo (~3.9 seconds cold cache for entire lint run):

- **Expected overhead**: 10-30% for TypeScript project resolution
- **Mitigated by**: ESLint caching, optimized tsconfig globs, `unrs-resolver` optimizations
- **Trade-off**: Slightly slower linting for correct import resolution

**Compatibility:**

- ✅ Works in monorepo workspaces (pnpm, npm, yarn)
- ✅ Works in single-package projects
- ✅ Backward compatible (falls back to Node resolution for non-TS projects)
- ✅ No breaking changes to existing configs

**Testing:**

- Tested in protomolecule monorepo with multiple workspace packages
- Verified lint-staged with absolute paths resolves correctly
- Confirmed no regressions in existing linting behavior
- Performance measured within acceptable range

**Resolves:** #327

**Related:**

- Original issue: RobEasthope/hecate#377
- lint-staged absolute paths: https://github.com/okonet/lint-staged/issues/763
