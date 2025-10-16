---
"@robeasthope/github-rulesets": patch
---

Allow GitHub Actions to bypass Protect production ruleset and simplify rules

**Changes:**

- Add `bypass_actors` with GitHub Actions integration (actor_id: 15368)
- Remove `required_linear_history` rule for flexibility with merge strategies
- Maintain all core protection rules

**What this enables:**

- GitHub Actions can push version bump commits during releases
- Automated release workflow (`changesets/action`) functions properly
- Supports both merge commits and squash/rebase strategies
- Human developers still blocked from direct pushes

**Why this is needed:**

The `update` rule blocks ALL direct pushes to main, including automated CI/CD workflows. This change allows the release workflow to push version bump commits while maintaining protection against manual developer pushes.

**Security:**

- Only workflows running from repository branches can bypass
- External forks cannot trigger bypass-enabled workflows
- `RELEASE_PAT` token still requires proper permissions
- Core protections remain: creation, update, deletion, non_fast_forward, pull_request
