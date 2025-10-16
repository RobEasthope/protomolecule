---
"@robeasthope/github-rulesets": major
---

Simplify Protect production ruleset to minimal essential rules

**Breaking Change:** Significantly reduced branch protection rules to bare minimum.

**Removed rules:**

- `creation` - No longer blocks branch creation/recreation
- `update` - No longer blocks direct pushes to main
- Removed all `bypass_actors` configuration

**Remaining rules:**

- `deletion` - Prevents branch deletion
- `non_fast_forward` - Prevents force pushes
- `pull_request` - Requires PR workflow (no review required)

**Impact:**

- ✅ Developers can now push directly to main
- ✅ Release workflows work without bypass configuration
- ✅ CI checks still run on PRs and show results
- ⚠️ No enforcement of PR-only workflow
- ⚠️ Developers must use discipline to avoid direct pushes

**Why this change:**
After testing, the simplified ruleset provides essential protections (no force push, no deletion) while removing workflow friction. The `pull_request` rule encourages PR workflow but doesn't enforce it strictly.
