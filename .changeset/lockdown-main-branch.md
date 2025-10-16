---
"@robeasthope/github-rulesets": patch
---

Simplify main branch protection rules

- Add `creation` rule: Blocks branch creation (prevents recreating main)
- Add `update` rule: Blocks all direct pushes from local machines
- Remove required status checks (Lint, Build, Test, Changeset Check)
- Keep PR review requirement (1 approving review)

All changes to main must now go through pull requests with review approval.
