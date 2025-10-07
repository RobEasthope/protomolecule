---
"@protomolecule/infrastructure": patch
---

Fix markdownlint processing all files during lint-staged runs

**Problem:** When committing files with lint-staged, markdownlint was processing ALL markdown files in the repo, not just the staged ones. This caused unrelated markdown files to be auto-fixed and left unstaged.

**Root Cause:** The `globs` array in `.markdownlint-cli2.jsonc` was overriding the specific file paths that lint-staged passes to markdownlint.

**Solution:** Moved glob patterns from config file to package.json scripts:

- Removed `globs` from `.markdownlint-cli2.jsonc`
- Added globs to all `lint:md` and `lint:md:fix` scripts in root and package.json files

**Benefits:**

- ✅ `pnpm lint:md` still works (uses globs from scripts)
- ✅ lint-staged only processes staged files (file args take precedence)
- ✅ No more surprise modifications to unstaged markdown files
- ✅ Clear separation: config = rules, scripts/args = file selection

**Files Modified:**

- `.markdownlint-cli2.jsonc` - Removed globs array
- `package.json` - Added globs to root lint:md scripts
- All package `package.json` files - Added globs to lint:md scripts
