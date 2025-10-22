---
"@protomolecule/infrastructure": minor
---

Simplify Dependabot configuration to single weekly PR strategy

**Problem:** Multiple concurrent Dependabot PRs caused constant merge conflicts in `package.json` files and `pnpm-lock.yaml` across the monorepo, requiring manual intervention to resolve.

**Solution:** Consolidated all dependency updates into a single weekly PR:

- Combined 4 separate groups (dev minor/patch, prod minor/patch, dev major, prod major) into one "all-dependencies" group
- Reduced `open-pull-requests-limit` from 10 to 1 for npm dependencies
- Reduced `open-pull-requests-limit` from 5 to 1 for GitHub Actions
- All update types (minor, patch, major) now included in single PR

**Benefits:**

- ✅ Zero merge conflicts between Dependabot PRs
- ✅ Single batch to review and test per week
- ✅ Reduced CI/CD overhead (one workflow run instead of 10+)
- ✅ Easier to create single changeset for all updates
- ✅ Aligns with monorepo best practices
