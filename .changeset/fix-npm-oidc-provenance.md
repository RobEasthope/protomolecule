---
"@protomolecule/infrastructure": patch
---

Fix npm OIDC publishing by upgrading npm CLI and configuring provenance

**Problem:**
Publishing to npm with OIDC trusted publishers was failing with `ENEEDAUTH` errors, despite having `id-token: write` permission configured.

**Root Causes:**

1. **npm version too old**: Node.js 22 ships with npm 10.9.3, but npm trusted publishing requires **npm CLI v11.5.1+**
2. **Missing provenance config**: Packages didn't have `provenance: true` in `publishConfig`

**Solution:**

1. **Upgrade npm CLI** in the workflow to v11+ (latest) to enable OIDC support
2. **Configure provenance per-package** following changesets issue #1152 guidance:

```json
{
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

With npm 11.5.1+, this configuration enables the npm CLI to:

1. Automatically detect `id-token: write` permission in GitHub Actions
2. Request OIDC tokens from GitHub
3. Authenticate with npm using trusted publishers
4. Generate cryptographic provenance attestations

**Changes:**

- ✅ Added `npm install -g npm@latest` step to upgrade npm CLI to v11+
- ✅ Added `provenance: true` to all published packages (ui, eslint-config, colours, markdownlint-config)
- ✅ Removed `.npmrc` configuration step from workflow (npm CLI handles it automatically)
- ✅ Removed `--provenance` flag from publish command (now configured per-package)

**Benefits:**

- Packages will publish with cryptographic provenance attestations
- Supply chain security improved with verifiable build provenance
- npm package pages will show green checkmarks for verified builds

Related to #291 (npm OIDC migration)
