---
"@protomolecule/infrastructure": minor
---

Migrate to npm OIDC trusted publishers for secure package publishing

**BREAKING CHANGE**: npm publishing now uses OIDC authentication instead of classic NPM_TOKEN

Implements the npm OIDC migration plan documented in `planning/npm-oidc-migration.md`. This change eliminates the need for long-lived npm authentication tokens stored as GitHub secrets.

**Changes to `.github/workflows/release.yml`:**

1. **Added `id-token: write` permission** - Required for npm provenance attestations
2. **Removed NPM_TOKEN validation** - No longer needed with OIDC
3. **Removed NPM_TOKEN from env** - Authentication happens automatically via OIDC
4. **Added `--provenance` flag** - Enables supply chain attestations

**Security Benefits:**

- ✅ No long-lived tokens stored in GitHub secrets
- ✅ Short-lived OIDC tokens (minutes instead of months/years)
- ✅ Automatic token rotation per workflow run
- ✅ Reduced attack surface
- ✅ Provenance attestations link packages to source code

**Before (Classic Token):**
```yaml
env:
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**After (OIDC):**
```yaml
permissions:
  id-token: write
# No NPM_TOKEN needed
publish: pnpm changeset publish --provenance
```

**Prerequisites:**
Trusted publishers must be configured on npm for each package:

- `@robeasthope/ui`
- `@robeasthope/eslint-config`
- `@robeasthope/colours`

See `planning/npm-oidc-migration.md` for configuration instructions.

**Post-Deployment:**
After verifying the first successful publish with OIDC:

1. Delete `NPM_TOKEN` from GitHub repository secrets
2. Revoke the classic npm token at https://www.npmjs.com/settings/YOUR_USERNAME/tokens

**Note**: Classic npm tokens will be automatically revoked on March 24, 2025
