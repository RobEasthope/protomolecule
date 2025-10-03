# Issue #226: Solution - Fix .npmrc While Keeping Dual Publishing

**Issue**: #226 - ESLint config npm publishing
**Root Cause**: `.npmrc` scope override causing packages to resolve from GitHub Packages instead of npm
**Goal**: Keep dual publishing strategy, fix consumption to use npm by default

---

## Executive Summary

**The dual publishing strategy is sound** - npm as primary, GitHub Packages as backup. The problem is the **initial publish script creates a persistent `.npmrc` configuration** that makes consumers use GitHub Packages instead of npm.

**Solution**: Fix the scripts to never modify `.npmrc`, ensure all consumers use npm by default, while keeping GitHub Packages as a working backup for those who explicitly want it.

---

## The Real Problem

### What's Working ✅

- Packages publish to npm successfully
- Packages publish to GitHub Packages successfully
- Workflow automation works correctly
- Dual publishing provides backup redundancy

### What's Broken ❌

The `scripts/initial-github-packages-publish.ts` script adds this to `~/.npmrc`:

```ini
@robeasthope:registry=https://npm.pkg.github.com
```

This causes:

1. **All consumers** resolve `@robeasthope/*` from GitHub Packages (requires auth)
2. **Lockfiles record** GitHub Packages URLs, propagating the issue
3. **CI/CD breaks** in other repos (hecate #197)
4. **npm appears broken** when it's actually working fine

### What Should Happen ✅

- Consumers install from npm by default (no auth required)
- GitHub Packages available as explicit opt-in
- Initial publish doesn't modify user's `.npmrc`
- Workflow continues dual publishing seamlessly

---

## Solution: Fix the Scripts, Keep Dual Publishing

### Core Principle

**Never modify `~/.npmrc`** - Use temporary configurations or environment variables instead.

---

## Implementation Plan

### Phase 1: Fix Initial Publish Script (Immediate)

**File**: `scripts/initial-github-packages-publish.ts`

**Current Problem** (lines 122-158):

```typescript
function configureNpmForGitHub(token: string) {
  const npmrcPath = join(os.homedir(), ".npmrc"); // ❌ Global config

  const githubConfig = `
@robeasthope:registry=https://npm.pkg.github.com  // ❌ Persistent scope override
`;

  writeFileSync(npmrcPath, npmrcContent + githubConfig); // ❌ Permanent modification
}
```

**Fixed Solution**:

```typescript
/**
 * Configures npm for GitHub Packages using temporary configuration
 * Does NOT modify user's global ~/.npmrc file
 */
function configureNpmForGitHub(token: string) {
  // Use project-local temporary .npmrc
  const tempNpmrcPath = join(process.cwd(), ".npmrc.github-packages-temp");

  // Only include auth token, NOT scope override
  const githubConfig = `//npm.pkg.github.com/:_authToken=${token}`;

  writeFileSync(tempNpmrcPath, githubConfig);

  console.log("✅ Created temporary .npmrc for GitHub Packages");
  console.log("⚠️  This does NOT modify your global ~/.npmrc");

  return tempNpmrcPath;
}
```

**Updated Publish Function**:

```typescript
function publishPackage(
  pkg: { name: string; path: string },
  npmrcPath: string,
) {
  const packagePath = join(process.cwd(), pkg.path);

  // ... existing code ...

  try {
    // Publish using temporary .npmrc and explicit registry
    execSync("npm publish --registry=https://npm.pkg.github.com/", {
      cwd: packagePath,
      stdio: "inherit",
      env: {
        ...process.env,
        NPM_CONFIG_USERCONFIG: npmrcPath, // Use temp .npmrc
      },
    });
    console.log("   ✅ Published successfully");
  } catch (error) {
    // ... error handling ...
  }
}

function main() {
  // ... existing code ...

  const tempNpmrcPath = configureNpmForGitHub(token);

  try {
    for (const pkg of PACKAGES) {
      publishPackage(pkg, tempNpmrcPath);
    }
  } finally {
    // Clean up temporary .npmrc
    if (existsSync(tempNpmrcPath)) {
      unlinkSync(tempNpmrcPath);
      console.log("🧹 Cleaned up temporary configuration");
    }
  }
}
```

**Benefits**:

- ✅ No global `.npmrc` modification
- ✅ Temporary config cleaned up automatically
- ✅ Works the same way for initial publish
- ✅ No impact on user's environment

---

### Phase 2: Verify Workflow Doesn't Need Changes

**File**: `.github/workflows/release.yml` (lines 197-218)

**Current Implementation**:

```yaml
- name: 📦 Publish to GitHub Packages
  run: |
    echo "//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}" >> ~/.npmrc
    echo "@robeasthope:registry=https://npm.pkg.github.com" >> ~/.npmrc
    pnpm tsx scripts/publish-github-packages.ts
```

**Analysis**:

- This runs in CI environment (ephemeral)
- `~/.npmrc` modifications don't persist beyond the job
- **No changes needed** - this is fine for CI

**Optional Improvement** (for consistency):

```yaml
- name: 📦 Publish to GitHub Packages
  run: pnpm tsx scripts/publish-github-packages.ts
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NPM_CONFIG_REGISTRY: https://npm.pkg.github.com/
    NPM_CONFIG__AUTH: ${{ secrets.GITHUB_TOKEN }}
```

But current approach works fine for CI. **No changes required.**

---

### Phase 3: Create Cleanup Script for Affected Users

**File**: `scripts/cleanup-npmrc.ts`

```typescript
#!/usr/bin/env tsx
/**
 * Cleanup script to remove GitHub Packages scope override from .npmrc
 *
 * This fixes the issue where packages were resolving from GitHub Packages
 * instead of npm, causing authentication errors.
 *
 * Usage: pnpm tsx scripts/cleanup-npmrc.ts
 */

import { existsSync, readFileSync, writeFileSync, copyFileSync } from "fs";
import { join } from "path";
import os from "os";

function main() {
  const npmrcPath = join(os.homedir(), ".npmrc");

  if (!existsSync(npmrcPath)) {
    console.log("✅ No ~/.npmrc file found - nothing to clean up");
    return;
  }

  console.log("🔍 Checking ~/.npmrc for GitHub Packages configuration...");

  const content = readFileSync(npmrcPath, "utf8");
  const lines = content.split("\n");

  // Check if scope override exists
  const hasScopeOverride = lines.some((line) =>
    line.includes("@robeasthope:registry=https://npm.pkg.github.com"),
  );

  if (!hasScopeOverride) {
    console.log("✅ No GitHub Packages scope override found - already clean!");
    return;
  }

  // Create backup
  const backupPath = `${npmrcPath}.backup-${Date.now()}`;
  copyFileSync(npmrcPath, backupPath);
  console.log(`📄 Created backup at: ${backupPath}`);

  // Remove problematic lines
  const cleanedLines = lines.filter(
    (line) =>
      !line.includes("@robeasthope:registry=https://npm.pkg.github.com") &&
      !line.includes("# GitHub Packages configuration") &&
      !line.trim().startsWith("//npm.pkg.github.com/:_authToken"),
  );

  writeFileSync(npmrcPath, cleanedLines.join("\n"));

  console.log("✅ Removed GitHub Packages scope override from ~/.npmrc");
  console.log("");
  console.log("Next steps:");
  console.log("1. Verify packages now resolve from npm:");
  console.log("   npm view @robeasthope/eslint-config dist.tarball");
  console.log("   (should show: https://registry.npmjs.org/...)");
  console.log("");
  console.log("2. In affected projects, regenerate lockfiles:");
  console.log("   rm pnpm-lock.yaml && pnpm install");
}

main();
```

---

### Phase 4: Update Documentation

**File**: `.env.example`

Add clear warning about NOT running initial publish script unless needed:

```diff
# GitHub Personal Access Token (for initial GitHub Packages publish)
# -------------------------------------------------------------------
+# ⚠️  WARNING: Only needed ONCE for initial GitHub Packages setup
+# ⚠️  Normal package installation uses npm registry (no token needed)
+# ⚠️  This script should only be run by package maintainers
+#
# Used for: Initial manual publish to GitHub Packages (one-time setup)
# Script: scripts/initial-github-packages-publish.ts
```

**File**: `README.md`

Update installation section to be crystal clear:

```markdown
## Installation

### From npm (Recommended - No Authentication Required)

All packages are published to npm and can be installed normally:

\`\`\`bash
npm install @robeasthope/eslint-config
npm install @robeasthope/ui
npm install @robeasthope/colours
\`\`\`

**No configuration needed** - packages install from npm by default.

### From GitHub Packages (Optional - Requires Authentication)

Packages are also available on GitHub Packages as a backup registry.
To use GitHub Packages, you must configure authentication:

1. Create a GitHub Personal Access Token with `read:packages` scope
2. Configure npm to use GitHub Packages for this scope:
   \`\`\`bash
   echo "@robeasthope:registry=https://npm.pkg.github.com" >> .npmrc
   echo "//npm.pkg.github.com/:\_authToken=YOUR_TOKEN" >> .npmrc
   \`\`\`

**Note**: Most users should use npm installation. GitHub Packages is provided as a backup option.
```

**File**: `scripts/initial-github-packages-publish.ts` header

Update documentation to make it clear this is for maintainers only:

```typescript
/**
 * Initial manual publish to GitHub Packages
 *
 * ⚠️  MAINTAINERS ONLY - For initial GitHub Packages setup
 * ⚠️  Normal package installation uses npm (no authentication required)
 * ⚠️  This script does NOT modify your global ~/.npmrc file
 *
 * This script performs the first-time publish of packages to GitHub Packages.
 * After this initial publish, the automated workflow handles subsequent releases.
 *
 * Environment variables required:
 * - GITHUB_TOKEN: GitHub personal access token with packages:write scope
 */
```

---

### Phase 5: Add Verification to Scripts

**File**: `scripts/publish-github-packages.ts`

Add verification that we're not accidentally setting scope overrides:

```typescript
function main() {
  // ... existing code ...

  // Verify we're not setting scope-level registry overrides
  const homeNpmrc = join(os.homedir(), ".npmrc");
  if (existsSync(homeNpmrc)) {
    const content = readFileSync(homeNpmrc, "utf8");
    if (content.includes("@robeasthope:registry=")) {
      console.warn("⚠️  WARNING: Found @robeasthope:registry in ~/.npmrc");
      console.warn(
        "⚠️  This may cause packages to resolve from GitHub Packages",
      );
      console.warn("⚠️  Run: pnpm tsx scripts/cleanup-npmrc.ts");
    }
  }

  // ... rest of main() ...
}
```

---

## Rollout Plan

### Day 1: Immediate Fixes

**1. Create and run cleanup script locally:**

```bash
# Create the cleanup script (using the code above)
pnpm tsx scripts/cleanup-npmrc.ts

# Verify npm is now used
npm view @robeasthope/eslint-config dist.tarball
# Should show: https://registry.npmjs.org/...
```

**2. Fix hecate repository:**

```bash
# In hecate repo
cd ~/Code/hecate

# Check for .npmrc with scope override
cat .npmrc | grep @robeasthope

# If found, remove it
npm config delete @robeasthope:registry

# Or manually edit .npmrc to remove the line

# Regenerate lockfile
rm pnpm-lock.yaml
pnpm install

# Verify CI passes
git add pnpm-lock.yaml
git commit -m "fix: remove GitHub Packages scope override, use npm registry"
git push
```

**3. Update initial publish script:**

- Implement the fixes to use temporary `.npmrc`
- Add cleanup in finally block
- Update documentation in comments

### Day 2: Testing and Verification

**1. Test the fixed initial publish script:**

```bash
# Dry run to verify behavior (don't actually publish)
# Check that it doesn't modify ~/.npmrc
ls -la ~/.npmrc.* # Should show no new files

# Verify temp file is created and cleaned up
# Check script logs for cleanup message
```

**2. Create changeset:**

```bash
pnpm changeset
```

```markdown
---
"@robeasthope/eslint-config": patch
"@robeasthope/ui": patch
"@robeasthope/colours": patch
---

Fix initial GitHub Packages publish script to not modify global .npmrc

- Initial publish now uses temporary .npmrc (automatically cleaned up)
- Packages continue to publish to both npm and GitHub Packages
- Consumers use npm by default (no authentication required)
- Added cleanup script for affected users: scripts/cleanup-npmrc.ts

**Migration**: If you previously ran the initial publish script, run:
`pnpm tsx scripts/cleanup-npmrc.ts`
```

**3. Update documentation:**

- Update README.md installation section
- Update .env.example with warnings
- Update script documentation

### Day 3: Rollout and Communication

**1. Commit and push changes:**

```bash
git add scripts/initial-github-packages-publish.ts
git add scripts/cleanup-npmrc.ts
git add .changeset/*.md
git add README.md
git add .env.example

git commit -m "fix(ci): prevent initial publish script from modifying global .npmrc

- Use temporary .npmrc for GitHub Packages initial publish
- Add cleanup script for users affected by previous behavior
- Update documentation to clarify npm is primary registry
- GitHub Packages remains available as backup (opt-in)

Fixes #226"

git push
```

**2. Create PR for the fixes:**

```bash
gh pr create \
  --title "fix(ci): prevent initial publish script from modifying global .npmrc" \
  --body "Fixes #226

## Problem
The initial GitHub Packages publish script was modifying \`~/.npmrc\` with a scope-level registry override, causing all \`@robeasthope/*\` packages to resolve from GitHub Packages instead of npm. This required authentication and broke CI in other repositories.

## Solution
- Initial publish now uses temporary \`.npmrc\` (auto-cleaned up)
- No modification of user's global \`~/.npmrc\`
- Dual publishing continues to work (npm + GitHub Packages)
- Added cleanup script for affected users

## Testing
- [x] Initial publish works without modifying ~/.npmrc
- [x] Packages still publish to both registries
- [x] Cleanup script removes scope override
- [x] Packages resolve from npm by default
- [x] hecate repo CI fixed

## Migration
Users who previously ran the initial publish script should run:
\`\`\`bash
pnpm tsx scripts/cleanup-npmrc.ts
\`\`\`"
```

**3. Update issue #226:**

```bash
gh issue comment 226 --body "## Solution Implemented

The issue was that the initial GitHub Packages publish script was modifying \`~/.npmrc\` with a scope-level registry override. This has been fixed in PR #XXX.

### What Changed
- Initial publish script now uses temporary configuration
- No modification of global \`~/.npmrc\`
- Dual publishing (npm + GitHub Packages) continues to work
- npm is primary registry (no auth required)

### For Affected Users
If you previously ran \`scripts/initial-github-packages-publish.ts\`, run the cleanup script:
\`\`\`bash
pnpm tsx scripts/cleanup-npmrc.ts
\`\`\`

This will remove the scope override and restore normal npm behavior.

### For Other Repos (like hecate)
Check for \`@robeasthope:registry=https://npm.pkg.github.com\` in \`.npmrc\` and remove it:
\`\`\`bash
npm config delete @robeasthope:registry
rm pnpm-lock.yaml
pnpm install
\`\`\`"
```

---

## Testing Checklist

### Before Changes

- [ ] Verify current behavior: `npm view @robeasthope/eslint-config dist.tarball`
- [ ] Should show GitHub Packages URL (the problem)
- [ ] Backup current `~/.npmrc`: `cp ~/.npmrc ~/.npmrc.before-fix`

### After Changes

- [ ] Run cleanup script: `pnpm tsx scripts/cleanup-npmrc.ts`
- [ ] Verify npm is used: `npm view @robeasthope/eslint-config dist.tarball`
- [ ] Should show npm registry URL: `https://registry.npmjs.org/...`
- [ ] Test installation: `npm install @robeasthope/eslint-config`
- [ ] Should work without authentication
- [ ] Check hecate repo CI passes

### Initial Publish Script

- [ ] Run modified script (test mode if possible)
- [ ] Verify `~/.npmrc` not modified: `diff ~/.npmrc ~/.npmrc.before-fix`
- [ ] Verify temp file cleaned up: `ls .npmrc.github-packages-temp`
- [ ] Should not exist after script completes

### Workflow (CI)

- [ ] Trigger release workflow
- [ ] Verify publishes to npm
- [ ] Verify publishes to GitHub Packages
- [ ] Both should succeed

---

## Benefits of This Approach

### Keeps What Works ✅

- ✅ Dual publishing strategy intact
- ✅ npm as primary registry
- ✅ GitHub Packages as backup
- ✅ Workflow automation unchanged
- ✅ All the work from PR #192 preserved

### Fixes What's Broken ✅

- ✅ No `.npmrc` modifications
- ✅ Packages resolve from npm by default
- ✅ No authentication required for consumers
- ✅ CI/CD works in all repos
- ✅ Clear migration path for affected users

### Improves Developer Experience ✅

- ✅ Simple installation (`npm install` just works)
- ✅ Clear documentation
- ✅ Explicit opt-in for GitHub Packages
- ✅ Cleanup script for recovery

---

## Success Metrics

### Immediate (Day 1-2)

- [ ] Cleanup script successfully removes scope override
- [ ] `npm view` shows npm registry URLs
- [ ] hecate repository CI passes
- [ ] No authentication errors in local development

### Short-term (Week 1)

- [ ] PR merged with fixes
- [ ] Patch release published
- [ ] All affected repositories cleaned up
- [ ] Zero support issues related to authentication

### Long-term (Month 1+)

- [ ] Dual publishing continues to work
- [ ] No regression in package availability
- [ ] Improved developer onboarding experience
- [ ] GitHub Packages available for users who want it

---

## Why This Solution is Better

### Compared to "Remove GitHub Packages"

- ✅ Preserves backup registry redundancy
- ✅ Keeps the work from PR #192
- ✅ Maintains flexibility for future use cases
- ✅ Simple fix vs major architectural change

### Compared to "Do Nothing"

- ✅ Fixes actual breakage (hecate CI)
- ✅ Removes authentication friction
- ✅ Aligns behavior with documentation
- ✅ Prevents future issues

### Compared to "Package-level Override"

- ✅ Simpler - no `.npmrc` modification at all
- ✅ Cleaner - consumers use standard npm behavior
- ✅ Scalable - works for all packages automatically
- ✅ Maintainable - less configuration to manage

---

## Edge Cases and Considerations

### What if someone wants to use GitHub Packages?

**Documented opt-in process:**

```bash
# In project .npmrc or ~/.npmrc
echo "@robeasthope:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=TOKEN" >> .npmrc
```

This is explicit and intentional, not accidental.

### What about future initial publishes?

The fixed script works the same way, just cleaner:

1. Creates temp `.npmrc`
2. Publishes with explicit registry flag
3. Cleans up automatically
4. No user environment pollution

### What if GitHub Packages becomes primary in future?

The architecture supports it:

- Change workflow to use GitHub Packages registry
- Update package.json publishConfig
- Update documentation
- Dual publishing still works in reverse

---

## Conclusion

The dual publishing strategy is sound and provides valuable redundancy. The issue was a **tactical implementation detail** (persistent `.npmrc` modification), not a **strategic architectural problem**.

By fixing the scripts to use temporary configuration and providing a cleanup path for affected users, we:

- Maintain all the benefits of dual publishing
- Fix all the authentication and CI issues
- Improve developer experience
- Preserve the work done in PR #192

This is a **surgical fix** that solves the problem without throwing away working infrastructure.

---

**Document Version**: 1.0
**Last Updated**: 2025-10-03
**Author**: Claude Code
**Status**: READY FOR IMPLEMENTATION
