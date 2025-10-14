---
"@protomolecule/infrastructure": patch
---

Fix npm OIDC publishing by configuring provenance at package level

**Problem:**
The `changesets/action` was overwriting our `.npmrc` configuration, causing `ENEEDAUTH` errors when attempting to publish with OIDC trusted publishers.

**Root Cause:**
We were trying to configure npm registry settings via a workflow step that created `.npmrc`, but the changesets action detects this file doesn't have user-specific auth and replaces it with its own version, throwing away our configuration.

**Solution:**
Following the approach recommended in changesets issue #1152, we now configure provenance directly in each package's `package.json`:

```json
{
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

This enables npm CLI to:

1. Automatically use OIDC authentication when `id-token: write` permission is present
2. Generate provenance attestations for published packages
3. Work correctly with changesets/action without requiring `.npmrc` manipulation

**Changes:**

- ✅ Added `provenance: true` to all published packages (ui, eslint-config, colours, markdownlint-config)
- ✅ Removed `.npmrc` configuration step from workflow
- ✅ Removed `--provenance` flag from publish command (now configured per-package)

**Benefits:**

- Packages will publish with cryptographic provenance attestations
- Supply chain security improved with verifiable build provenance
- npm package pages will show green checkmarks for verified builds

Related to #291 (npm OIDC migration)
