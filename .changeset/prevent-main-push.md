---
"@protomolecule/infrastructure": minor
---

Add pre-push hook to prevent direct pushes to main branch

**New protection:**
Adds branch protection check to `.husky/pre-push` hook that blocks direct pushes to `main` branch locally.

**What this adds:**

- Checks if current branch is `main` or if pushing to `main` remote branch
- Displays clear error message with PR creation instructions
- Automatically skips in CI environments (`CI` or `GITHUB_ACTIONS` env vars)
- Works alongside existing changeset validation

**Error message includes:**

- Clear explanation of why push was blocked
- Step-by-step instructions to create a feature branch and PR
- Command to bypass (with NOT RECOMMENDED warning)

**Why this is needed:**
After simplifying the GitHub ruleset to allow automated releases (PR #318), the ruleset no longer enforces PR-only workflow. This local hook provides a safety net to prevent accidental direct pushes while allowing CI/CD workflows to function.

**Impact:**

- ✅ Developers get immediate feedback when attempting to push to main
- ✅ CI workflows bypass automatically (no configuration needed)
- ✅ Can still bypass with `--no-verify` for emergencies
- ✅ Works alongside existing changeset enforcement

Closes #316
