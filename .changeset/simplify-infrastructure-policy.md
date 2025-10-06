---
"@protomolecule/infrastructure": minor
---

Simplify infrastructure changeset policy to "all root files except pnpm-lock.yaml"

**New Policy:**
All tracked files in the repository root (excluding `pnpm-lock.yaml`) are infrastructure files that require changesets.

**Rationale:**

- `pnpm-lock.yaml` is the ONLY root file that changes automatically as a side-effect
- Everything else requires intentional human edits and affects monorepo infrastructure
- This eliminates the maintenance burden of explicit file lists

**Benefits:**

- ✅ Maintainable - No need to update the hook when adding new root config files
- ✅ Complete - Automatically covers all infrastructure files including docs
- ✅ Clear - Simple principle that's easy to understand and remember
- ✅ Future-proof - Works with any new root files added to the monorepo

**Changes:**

- Updated `.husky/pre-push` to use pattern-based detection: `^[^/]+$` (root files) excluding `pnpm-lock.yaml`
- Updated `CLAUDE.md` with simplified policy documentation
- Removed explicit file list from pre-push hook (was 12+ patterns, now 2 simple rules)

Closes #249
