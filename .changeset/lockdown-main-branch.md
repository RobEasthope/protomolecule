---
"@robeasthope/github-rulesets": minor
---

Split and simplify main branch protection into two rulesets

**Protect production ruleset** (minimal enforcement):

- Add `creation` rule: Blocks branch creation (prevents recreating main)
- Add `update` rule: Blocks all direct pushes from local machines
- Remove required status checks (Lint, Build, Test, Changeset Check)
- Remove review requirements - only requires PR creation
- CI checks will run and surface failures without blocking merges

**Require PR review ruleset** (optional, for stricter enforcement):

- New standalone ruleset for teams wanting review requirements
- Requires 1 approving review before merge
- Dismisses stale reviews on push
- Requires review thread resolution

This split allows teams to choose their enforcement level: basic PR workflow (shows CI results) or full review requirement.
