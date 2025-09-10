---
"@protomolecule/eslint-config": patch
---

Fix critical GitHub Actions workflow syntax error that prevented workflow from running

- Fixed invalid token fallback syntax that caused workflow parse errors
- Now properly uses RELEASE_PAT secret for checkout (required for protected branches)
- GITHUB_TOKEN is still used for GitHub release creation (doesn't need push permissions)
