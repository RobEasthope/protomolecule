---
"@robeasthope/github-rulesets": patch
---

Lock down main branch with creation and update blocks

Prevents all direct pushes and commits to main branch by adding:

- `creation` rule: Blocks branch creation (prevents recreating main)
- `update` rule: Blocks all direct pushes from local machines

All changes to main must now go through pull requests.
