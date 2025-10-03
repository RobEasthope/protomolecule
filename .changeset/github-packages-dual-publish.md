---
"@robeasthope/ui": patch
"@robeasthope/eslint-config": patch
"@robeasthope/colours": patch
---

Add dual publishing to GitHub Packages registry. Packages are now published to both npm (primary) and GitHub Packages (backup) registries.

**Changes:**

- Added automatic publishing to GitHub Packages after npm publish
- Non-fatal error handling for GitHub Packages (npm remains primary)
- Updated documentation with GitHub Packages installation info

**For users:**

- No action required - packages still install from npm by default
- GitHub Packages available as backup registry (requires authentication)
- See README for GitHub Packages setup instructions

See issue #191 for implementation details.
