---
"@protomolecule/ui": patch
"@protomolecule/eslint-config": patch
"@protomolecule/colours": patch
---

fix(ci): use RELEASE_PAT for GitHub Packages publishing to fix 403 errors

- Use RELEASE_PAT (which has package write permissions) instead of GITHUB_TOKEN
- Falls back to GITHUB_TOKEN if RELEASE_PAT is not available
- Should resolve 403 permission errors when publishing to GitHub Packages
