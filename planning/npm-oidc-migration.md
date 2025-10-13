# npm OIDC/Trusted Publishers Migration Plan

## Executive Summary

npm is transitioning to OIDC-based authentication ("trusted publishers") for enhanced security. This document outlines the migration plan for the protomolecule monorepo, including requirements, costs, and implementation steps.

**Timeline**: Classic npm authentication tokens will be **revoked on March 24, 2025**. Migration should be completed before this date.

**Cost**: **$0** - Trusted publishers are free for public packages. No paid npm account required.

---

## What Are Trusted Publishers?

Trusted publishers use OpenID Connect (OIDC) to authenticate GitHub Actions workflows directly with npm, eliminating the need for long-lived authentication tokens stored as secrets.

### How It Works

1. **Traditional Flow** (current):

   ```text
   Developer → Creates npm token → Stores in GitHub secrets → Workflow uses token → Publishes
   ```

2. **OIDC Flow** (new):
   ```text
   Workflow → Requests OIDC token from GitHub → npm validates token → Publishes
   ```

### Benefits

- ✅ **No stored secrets**: No long-lived npm tokens to manage or rotate
- ✅ **Improved security**: Short-lived tokens (minutes, not months/years)
- ✅ **Automatic rotation**: New token per workflow run
- ✅ **Audit trail**: npm knows exactly which workflow published which package
- ✅ **Reduced attack surface**: Compromised token expires quickly
- ✅ **Free**: No cost for public packages

### Limitations

- ⚠️ **GitHub-only**: Currently only supports GitHub Actions (no GitLab, CircleCI, etc.)
- ⚠️ **Public packages only**: Private packages require npm Pro ($7/month) or Teams ($7/user/month)
- ⚠️ **npm CLI 10.8.3+**: Older versions don't support OIDC
- ⚠️ **No local publishing**: Cannot publish from developer machines (CI/CD only)

---

## Cost Analysis

### Current Costs

- **npm Account**: Free (public packages)
- **GitHub Actions**: Free for public repositories
- **Total**: **$0/month**

### Post-Migration Costs

- **npm Account**: Free (public packages, trusted publishers included)
- **GitHub Actions**: Free for public repositories
- **Total**: **$0/month**

### Answer: Do You Need to Pay for npm?

**No.** Trusted publishers are available on the **free npm tier** for public packages. The protomolecule monorepo publishes public packages (`@robeasthope/ui`, `@robeasthope/eslint-config`, etc.), so no paid account is needed.

**Note**: If you ever publish **private** npm packages, you would need npm Pro ($7/month) or Teams ($7/user/month) to use trusted publishers.

---

## Timeline of npm Authentication Changes

### March 24, 2025: Classic Tokens Revoked

- All "classic" automation tokens (created before September 2024) will be **revoked**
- Workflows using classic tokens will **fail** after this date
- **Action Required**: Migrate to trusted publishers or create granular access tokens before March 24, 2025

### Ongoing: Token Lifetime Limits

- New automation tokens limited to **1 year** maximum lifetime
- Tokens must be rotated annually
- Trusted publishers eliminate this maintenance burden

---

## Current Protomolecule Publishing Workflow

### Current Setup (`.github/workflows/release.yml`)

```yaml
- name: Publish to npm
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
  run: |
    echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc
    pnpm publish -r --access public --no-git-checks
```

### How It Works

1. Developer creates changeset
2. PR merged to main
3. Release workflow runs
4. Reads `NPM_TOKEN` from GitHub secrets
5. Writes token to `.npmrc`
6. `pnpm publish` uses token to authenticate

### Security Concerns

- Long-lived token stored in GitHub secrets
- Token has full publish access to all packages
- If leaked, attacker can publish malicious packages
- Must be manually rotated

---

## Migration Requirements

### Prerequisites

1. **npm CLI 10.8.3 or later** (protomolecule uses 10.15.0 ✅)
2. **GitHub Actions workflow** (protomolecule has `.github/workflows/release.yml` ✅)
3. **npm account ownership** (must own `@robeasthope` scope ✅)
4. **Public packages** (protomolecule packages are public ✅)

### Packages to Configure

The following packages are published to npm and require trusted publisher setup:

- `@robeasthope/ui`
- `@robeasthope/eslint-config`
- `@robeasthope/colours`

**Note**: Private packages (`@robeasthope/tsconfig`, `@robeasthope/github-rulesets`) do not require setup as they are not published to npm.

---

## Migration Steps

### Phase 1: Configure Trusted Publishers on npm

For **each published package** (`@robeasthope/ui`, `@robeasthope/eslint-config`, `@robeasthope/colours`):

1. **Go to npm package settings**:

   ```text
   https://www.npmjs.com/package/@robeasthope/ui/access
   ```

2. **Navigate to "Publishing Access" → "Trusted Publishers"**

3. **Click "Add Trusted Publisher"**

4. **Select "GitHub Actions"**

5. **Fill in workflow details**:
   - **Repository owner**: `RobEasthope`
   - **Repository name**: `protomolecule`
   - **Workflow filename**: `release.yml`
   - **Environment** (optional): Leave blank (no environment used)

6. **Click "Add"**

7. **Repeat for remaining packages**

### Phase 2: Update GitHub Actions Workflow

Modify `.github/workflows/release.yml`:

```yaml
# BEFORE (current)
- name: Publish to npm
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
  run: |
    echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc
    pnpm publish -r --access public --no-git-checks

# AFTER (OIDC)
- name: Publish to npm
  run: |
    pnpm publish -r --access public --no-git-checks --provenance
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Key Changes**:

1. **Remove `NPM_TOKEN` reference**: No longer needed
2. **Add `--provenance` flag**: Enables supply chain attestations
3. **Use `GITHUB_TOKEN`**: Built-in GitHub token (automatically provided)
4. **Remove `.npmrc` creation**: npm CLI handles authentication automatically

**Optional**: Add `id-token: write` permission for provenance (recommended):

```yaml
permissions:
  contents: write
  pull-requests: write
  id-token: write # Add this for provenance
```

### Phase 3: Test the Migration

1. **Create test branch**: `test/npm-oidc`
2. **Update workflow with OIDC changes**
3. **Create dummy changeset**: Patch version bump for testing
4. **Push to test branch**
5. **Manually trigger workflow** (or merge to main if confident)
6. **Verify publish succeeds**
7. **Check npm package page** for provenance badges

### Phase 4: Remove Classic Token

After successful publish with OIDC:

1. **Go to GitHub repository settings**:

   ```text
   https://github.com/RobEasthope/protomolecule/settings/secrets/actions
   ```

2. **Delete `NPM_TOKEN` secret**

3. **Go to npm account tokens**:

   ```text
   https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   ```

4. **Revoke the classic automation token**

---

## Rollback Plan

If OIDC migration fails:

1. **Revert workflow changes**: Restore `NPM_TOKEN` usage
2. **Create new granular access token** on npm:
   - Go to: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token" → "Granular Access Token"
   - Set expiration: 1 year (maximum)
   - Select packages: `@robeasthope/ui`, `@robeasthope/eslint-config`, `@robeasthope/colours`
   - Copy token
3. **Update GitHub secret**: Replace `NPM_TOKEN` with new token
4. **Push workflow changes**: Restore classic authentication

**Note**: This is a temporary fallback. Classic tokens will be revoked on March 24, 2025.

---

## Recommended Timeline

| Date                      | Task                                                   |
| ------------------------- | ------------------------------------------------------ |
| **Now**                   | Review this planning document                          |
| **Week 1**                | Configure trusted publishers on npm for all 3 packages |
| **Week 1**                | Update GitHub Actions workflow with OIDC changes       |
| **Week 1**                | Test with dummy changeset on test branch               |
| **Week 2**                | Monitor first real publish with OIDC                   |
| **Week 2**                | Remove classic token from GitHub secrets and npm       |
| **Before March 24, 2025** | Ensure migration complete                              |

---

## Additional Considerations

### Provenance Attestations

The `--provenance` flag enables npm to generate signed attestations linking published packages to their source code and build environment. This:

- Proves the package was built by your specific GitHub Actions workflow
- Links the package to a specific commit SHA
- Appears as a green checkmark on the npm package page
- Improves supply chain security

**Recommendation**: Enable provenance by:

1. Adding `--provenance` flag to publish command
2. Adding `id-token: write` permission to workflow

### Monorepo Considerations

The protomolecule monorepo publishes **multiple packages** from a **single workflow**. This is fully supported:

- Configure trusted publisher **once per package** on npm
- **All packages** use the **same workflow** (`release.yml`)
- `pnpm publish -r` publishes all changed packages in one step

### Local Publishing

After migration, you **cannot publish from your local machine** using `pnpm publish`. All publishes must go through GitHub Actions.

If you need to publish locally:

1. Create a **granular access token** on npm (1 year lifetime)
2. Use `npm login` locally with the token
3. Publish with `pnpm publish`

**Recommendation**: Stick to CI/CD publishing for security and consistency.

---

## References

- [npm Trusted Publishers Documentation](https://docs.npmjs.com/trusted-publishers)
- [GitHub Blog: npm Authentication Changes](https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/)
- [npm CLI Provenance Documentation](https://docs.npmjs.com/generating-provenance-statements)
- [OpenID Connect in GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

---

## Questions?

If you have questions or need clarification on any step, consult the npm documentation or open an issue in the protomolecule repository.

---

**Document created**: 2025-01-13
**Last updated**: 2025-01-13
**Branch**: `docs/npm-oidc-migration-plan`
