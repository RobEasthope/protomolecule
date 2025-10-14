---
"@protomolecule/infrastructure": patch
---

Upgrade npm CLI to v11+ for OIDC trusted publisher support

**Problem:**
npm OIDC publishing requires npm CLI v11.5.1+ but Node.js 22 ships with npm 10.9.3.

**Solution:**
Added npm upgrade step in setup-monorepo action to install latest npm globally.

This enables npm CLI to automatically:

- Detect id-token: write permission in GitHub Actions
- Request OIDC tokens from GitHub
- Authenticate with npm using trusted publishers
- Generate cryptographic provenance attestations

Works with provenance: true configuration already added to packages in previous PR.
