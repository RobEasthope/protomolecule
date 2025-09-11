---
"@protomolecule/ui": patch
"@protomolecule/eslint-config": patch
"@protomolecule/colours": patch
---

feat: add GitHub Packages publishing support

Added dual publishing to both NPM and GitHub Packages registries. All public packages will now be automatically published to GitHub Packages alongside NPM during the release process.

- Updated release workflow to publish to GitHub Packages after NPM publishing
- Added repository field to all publishable packages for proper GitHub Packages metadata
- Configured authentication for GitHub Packages using GITHUB_TOKEN
