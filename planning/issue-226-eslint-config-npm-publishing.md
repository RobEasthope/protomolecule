# Issue #226: ESLint Config npm Publishing Analysis

**Issue**: Publish @robeasthope/eslint-config to npm registry
**Created**: 2025-10-03
**Status**: Open
**Related Issue**: RobEasthope/hecate#197

---

## Executive Summary

**Critical Finding**: The `@robeasthope/eslint-config` package **IS successfully published to npm**, but local `.npmrc` configurations are causing npm clients to resolve packages from GitHub Packages instead, leading to authentication failures in CI/CD and other repositories.

**Root Cause**: The `scripts/initial-github-packages-publish.ts` script modifies `~/.npmrc` to add:

```ini
@robeasthope:registry=https://npm.pkg.github.com
```

This scope-level registry override causes all `@robeasthope/*` packages to resolve from GitHub Packages, even though they exist on the public npm registry.

**Impact Severity**: 🔴 **HIGH** - Affects all consumers of `@robeasthope/eslint-config` who have run the initial publish script or have similar `.npmrc` configuration.

---

## Problem Statement

### The Core Issue

The protomolecule monorepo implements **dual publishing** to both npm and GitHub Packages:

1. **Primary**: npm registry (https://registry.npmjs.org) - public, no auth required
2. **Backup**: GitHub Packages (https://npm.pkg.github.com) - requires authentication

However, the **initial publish script creates a persistent `.npmrc` configuration** that redirects the entire `@robeasthope` scope to GitHub Packages, effectively breaking the intended "npm as primary" strategy for anyone who runs the script.

### How It Relates to Protomolecule

#### Timeline of Events

**Phase 1: September 10-12, 2025 - Original npm-only Publishing**

- Package published as `@protomolecule/eslint-config`
- Published exclusively to npm registry
- Versions 2.0.1 through 2.1.7
- No authentication issues

**Phase 2: September 11-12, 2025 - First GitHub Packages Attempt**

- Commit a15c2ac: Added GitHub Packages support
- **Duration**: ~1 day
- **Outcome**: Removed due to "complexity and maintenance overhead"
- Commit a6b4929: Complete removal (1,528 lines removed)

**Phase 3: October 1, 2025 - Namespace Migration (BREAKING CHANGE)**

- Commit 0ff0bdc: Migrated from `@protomolecule` to `@robeasthope`
- **Reason**: GitHub Packages requires scope to match GitHub username
- All packages bumped to 3.0.0
- Old `@protomolecule/*` packages remain on npm but unmaintained

**Phase 4: October 2-3, 2025 - GitHub Packages Return**

- PR #192: Re-implemented dual publishing
- Improved architecture: npm primary, GitHub Packages backup
- Non-fatal error handling for GitHub Packages failures
- **Critical oversight**: Initial publish script modifies `~/.npmrc` globally

**Phase 5: October 3, 2025 (Current) - Issue Discovery**

- Issue #226 opened
- hecate repository CI failing with 403 errors
- Root cause identified: `.npmrc` scope override

#### Architectural Context

The current dual publishing workflow (`.github/workflows/release.yml`):

```yaml
# Step 1: Publish to npm (primary)
- uses: changesets/action@v1.5.3
  with:
    publish: pnpm run release
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

# Step 2: Publish to GitHub Packages (backup, non-fatal)
- name: 📦 Publish to GitHub Packages
  if: steps.changesets.outputs.published == 'true'
  run: |
    echo "//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}" >> ~/.npmrc
    echo "@robeasthope:registry=https://npm.pkg.github.com" >> ~/.npmrc
    tsx scripts/publish-github-packages.ts
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**The Problem**: The workflow appends to `~/.npmrc` in CI (which is ephemeral), but the initial publish script **permanently modifies the user's `~/.npmrc`**.

### Verification of Current State

#### npm Registry Status ✅

```bash
$ curl -s https://registry.npmjs.org/@robeasthope/eslint-config | jq '.versions | keys'
[
  "3.0.0",
  "3.0.1",
  "3.0.2"
]

$ curl -s https://registry.npmjs.org/@robeasthope/eslint-config/3.0.1 | jq '.dist.tarball'
"https://registry.npmjs.org/@robeasthope/eslint-config/-/eslint-config-3.0.1.tgz"
```

**Status**: Package is correctly published to npm and publicly accessible without authentication.

#### GitHub Packages Status ✅

```bash
$ gh api repos/RobEasthope/protomolecule/packages
# Returns packages including @robeasthope/eslint-config
```

**Status**: Package is also published to GitHub Packages (requires authentication).

#### Local npm Configuration ❌

```bash
$ cat ~/.npmrc | grep @robeasthope
@robeasthope:registry=https://npm.pkg.github.com

$ npm view @robeasthope/eslint-config dist.tarball
https://npm.pkg.github.com/download/@robeasthope/eslint-config/3.0.2/...
```

**Status**: Local npm client resolves from GitHub Packages due to scope override in `~/.npmrc`.

#### Impact on Other Repositories ❌

**hecate Repository** (RobEasthope/hecate#197):

- CI failing with `ERR_PNPM_FETCH_403`
- Trying to fetch from `https://npm.pkg.github.com`
- `GITHUB_TOKEN` in CI doesn't have `read:packages` permission for packages from other repos
- Likely has `.npmrc` with `@robeasthope:registry=https://npm.pkg.github.com`

**Other Potential Affected Repos**:

- Any repository that has run the initial publish script
- Any repository with a committed `.npmrc` containing the scope override
- Any developer's local machine that ran the script

---

## Root Cause Analysis

### Primary Root Cause

**File**: `scripts/initial-github-packages-publish.ts`
**Lines**: 126-158 (configureNpmForGitHub function)

```typescript
function configureNpmForGitHub(token: string) {
  const npmrcPath = join(os.homedir(), ".npmrc");

  // Read existing .npmrc if it exists
  let npmrcContent = "";
  try {
    npmrcContent = readFileSync(npmrcPath, "utf8");
  } catch {
    // File doesn't exist, start fresh
  }

  // Add GitHub Packages configuration if not already present
  const githubConfig = `
# GitHub Packages configuration
//npm.pkg.github.com/:_authToken=${token}
@robeasthope:registry=https://npm.pkg.github.com  // ⚠️ THIS LINE
`;

  if (npmrcContent.includes("npm.pkg.github.com")) {
    console.log("✅ .npmrc already configured");
  } else {
    writeFileSync(npmrcPath, npmrcContent + githubConfig);
    console.log("✅ .npmrc configured");
  }
}
```

**The Issue**: This function permanently modifies the user's global `~/.npmrc` file with a scope-level registry override that persists after the script completes.

### Contributing Factors

1. **Lack of Cleanup**: The script doesn't remove the configuration after publishing
2. **Scope vs Package Override**: Uses scope-level (`@robeasthope:registry`) instead of package-level configuration
3. **No Documentation Warning**: Users aren't warned about the persistent configuration change
4. **No Verification**: The script doesn't check if npm publishing is working correctly
5. **Workflow Inconsistency**: The workflow uses ephemeral `.npmrc` (CI environment), but the script modifies persistent `~/.npmrc` (user's machine)

### Secondary Root Cause

**Architectural Decision**: The decision to use GitHub Packages at all creates this complexity. The original removal (commit a6b4929) cited "reducing complexity and maintenance overhead" - this was a valid concern that has now materialized.

---

## Impact Analysis

### Affected Stakeholders

#### 1. **Protomolecule Repository** (This Repo)

- **Severity**: 🟡 MEDIUM
- **Impact**: Local development may be affected if developer ran initial publish script
- **Workaround**: Remove scope override from `~/.npmrc`
- **Risk**: Future developers running the script will face the same issue

#### 2. **hecate Repository**

- **Severity**: 🔴 HIGH
- **Impact**: CI/CD completely broken (RobEasthope/hecate#197)
- **Error**: `ERR_PNPM_FETCH_403 Forbidden - 403`
- **Root Cause**: Attempting to fetch from GitHub Packages without proper authentication
- **Workaround**: Remove `.npmrc` scope override or add PAT with `read:packages`

#### 3. **Other Repositories Using @robeasthope/eslint-config**

- **Severity**: 🔴 HIGH (potential)
- **Impact**: Any repo with the scope override will fail in CI
- **Affected**:
  - Repositories with committed `.npmrc` files
  - Developer machines that ran the initial publish script
  - CI environments with the scope override

#### 4. **External Users/Contributors**

- **Severity**: 🟡 MEDIUM
- **Impact**: Cannot use the package without authentication if they have scope override
- **Expected Behavior**: Should be able to `npm install @robeasthope/eslint-config` without any setup
- **Actual Behavior**: 403 errors if scope override exists

### Business Impact

1. **Adoption Friction**: Makes the package harder to use than necessary
2. **CI/CD Reliability**: Breaks automated workflows across multiple repos
3. **Developer Experience**: Requires manual configuration and troubleshooting
4. **Discoverability**: Package on npm is effectively invisible if scope override exists
5. **Maintenance Burden**: Requires documentation, support, and workarounds

---

## Solution Options

### Option 1: Remove GitHub Packages Entirely (RECOMMENDED)

**Description**: Revert to npm-only publishing, remove GitHub Packages support completely.

**Pros**:

- ✅ Simplest solution - eliminates root cause
- ✅ Aligns with previous decision to remove GitHub Packages (commit a6b4929)
- ✅ No authentication requirements
- ✅ Standard npm ecosystem behavior
- ✅ No `.npmrc` modifications needed
- ✅ Works seamlessly in all CI/CD environments
- ✅ Reduces maintenance burden

**Cons**:

- ❌ Loses "backup registry" redundancy
- ❌ No GitHub-native package discovery
- ❌ Wastes recent work on PR #192

**Implementation Steps**:

1. Update `.github/workflows/release.yml`:
   - Remove GitHub Packages publishing step (lines 197-218)
   - Remove `packages: write` permission (line 21)
   - Remove `scripts/publish-github-packages.ts` script
2. Delete `scripts/initial-github-packages-publish.ts`
3. Remove GitHub Packages documentation from README.md
4. Create script to clean up existing `.npmrc` files
5. Update all repositories to remove scope override
6. Publish a patch version documenting the change
7. Archive/deprecate existing GitHub Packages versions (with notice)

**Effort**: 🟢 LOW (1-2 hours)
**Risk**: 🟢 LOW (reverts to known-good state)
**Alignment**: 🟢 HIGH (matches previous architectural decision)

---

### Option 2: Fix the `.npmrc` Configuration (PARTIAL FIX)

**Description**: Modify the initial publish script to use temporary configuration that doesn't persist.

**Pros**:

- ✅ Maintains dual publishing strategy
- ✅ Keeps GitHub Packages backup
- ✅ Relatively simple fix

**Cons**:

- ❌ Doesn't fix existing affected installations
- ❌ Still requires manual cleanup script
- ❌ Doesn't address fundamental complexity
- ❌ Users who already ran the script still broken

**Implementation Steps**:

1. Update `scripts/initial-github-packages-publish.ts`:

   ```typescript
   // Use project-local .npmrc instead of ~/.npmrc
   const npmrcPath = join(process.cwd(), ".npmrc");

   // OR: Use environment variables instead
   execSync("npm publish --registry=https://npm.pkg.github.com/", {
     env: {
       ...process.env,
       NPM_CONFIG_REGISTRY: "https://npm.pkg.github.com/",
       NODE_AUTH_TOKEN: token,
     },
   });
   ```

2. Create cleanup script: `scripts/cleanup-npmrc.ts`
3. Document the cleanup process
4. Notify users to run cleanup script

**Effort**: 🟡 MEDIUM (3-4 hours including cleanup)
**Risk**: 🟡 MEDIUM (requires user action to fix existing issues)
**Alignment**: 🟡 MEDIUM (maintains dual publishing but adds complexity)

---

### Option 3: Make npm Primary, GitHub Packages Optional (COMPROMISE)

**Description**: Keep dual publishing but make GitHub Packages explicitly opt-in, never modify `.npmrc`.

**Pros**:

- ✅ npm remains primary (no authentication required)
- ✅ GitHub Packages available for those who want it
- ✅ No automatic `.npmrc` modifications
- ✅ Clear separation of concerns

**Cons**:

- ❌ Initial publish still requires manual setup
- ❌ More complex documentation
- ❌ Still maintains two publishing paths

**Implementation Steps**:

1. Remove automatic `.npmrc` modification from `scripts/initial-github-packages-publish.ts`
2. Document manual GitHub Packages setup in `docs/github-packages-setup.md`:
   ```bash
   # Optional: Use GitHub Packages (requires authentication)
   echo "@robeasthope:registry=https://npm.pkg.github.com" >> .npmrc
   echo "//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}" >> .npmrc
   ```
3. Update README.md to emphasize npm as primary registry
4. Add warning in initial publish script output
5. Create cleanup script for affected users
6. Update workflow to use environment variables instead of `.npmrc`

**Effort**: 🟡 MEDIUM (4-5 hours)
**Risk**: 🟡 MEDIUM (requires documentation and user action)
**Alignment**: 🟡 MEDIUM (keeps backup but reduces complexity)

---

### Option 4: Use Package-Level Override Instead of Scope-Level (LEAST RECOMMENDED)

**Description**: Change from scope-level to package-level registry configuration.

**Before**:

```ini
@robeasthope:registry=https://npm.pkg.github.com
```

**After**:

```ini
@robeasthope/eslint-config:registry=https://npm.pkg.github.com
@robeasthope/ui:registry=https://npm.pkg.github.com
@robeasthope/colours:registry=https://npm.pkg.github.com
```

**Pros**:

- ✅ More granular control
- ✅ Doesn't affect entire scope

**Cons**:

- ❌ Still requires `.npmrc` modification
- ❌ Scales poorly (need entry for each package)
- ❌ Still causes authentication issues
- ❌ Doesn't solve the fundamental problem

**Effort**: 🟡 MEDIUM
**Risk**: 🔴 HIGH (doesn't address root cause)
**Alignment**: 🔴 LOW (band-aid solution)

---

## Recommended Solution

### **Primary Recommendation: Option 1 - Remove GitHub Packages**

**Rationale**:

1. **Historical Precedent**: This was already tried and removed once (commit a6b4929) for the exact same reasons - "complexity and maintenance overhead"

2. **Minimal Actual Benefit**: The "backup registry" argument is theoretical. In practice:
   - npm has 99.99%+ uptime
   - GitHub Packages doesn't provide meaningful redundancy (tied to same GitHub infrastructure)
   - No evidence of npm outages affecting package downloads

3. **Real-World Pain**: The authentication issues are causing actual breakage RIGHT NOW (hecate repo, issue #226)

4. **Ecosystem Norms**: The vast majority of public npm packages use npm-only publishing. Dual publishing is unusual and adds complexity without commensurate benefit.

5. **Maintenance Burden**: Every additional publishing target:
   - Doubles failure modes
   - Requires additional documentation
   - Creates authentication complexity
   - Adds support burden

6. **Clean State**: Reverting to npm-only returns the project to a known-good, simple, maintainable state.

### Implementation Plan for Option 1

#### Phase 1: Immediate Remediation (Day 1)

**Priority**: 🔴 **CRITICAL** - Fix broken hecate repository

1. **Create cleanup script** (`scripts/cleanup-npmrc.sh`):

   ```bash
   #!/usr/bin/env bash
   # Remove GitHub Packages configuration from ~/.npmrc

   echo "🧹 Cleaning up GitHub Packages configuration..."

   # Backup current .npmrc
   cp ~/.npmrc ~/.npmrc.backup-$(date +%Y%m%d-%H%M%S)

   # Remove GitHub Packages lines
   grep -v "npm.pkg.github.com\|@robeasthope:registry=https://npm.pkg.github.com" ~/.npmrc > ~/.npmrc.tmp
   mv ~/.npmrc.tmp ~/.npmrc

   echo "✅ Cleanup complete"
   echo "📄 Backup saved to ~/.npmrc.backup-*"
   ```

2. **Run cleanup locally**:

   ```bash
   chmod +x scripts/cleanup-npmrc.sh
   ./scripts/cleanup-npmrc.sh
   ```

3. **Fix hecate repository** (RobEasthope/hecate#197):
   - Check for `.npmrc` in repo with scope override
   - Remove scope override if present
   - Regenerate `pnpm-lock.yaml`
   - Verify CI passes

4. **Document the issue**:
   - Add to protomolecule README.md
   - Create MIGRATION.md guide

#### Phase 2: Remove GitHub Packages (Day 1-2)

1. **Update release workflow**:

   ```diff
   # .github/workflows/release.yml

   permissions:
     contents: write
     pull-requests: write
   - packages: write
     id-token: write

   - - name: 📦 Publish to GitHub Packages
   -   if: steps.changesets.outputs.published == 'true'
   -   run: |
   -     echo "//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}" >> ~/.npmrc
   -     echo "@robeasthope:registry=https://npm.pkg.github.com" >> ~/.npmrc
   -     pnpm tsx scripts/publish-github-packages.ts
   -   env:
   -     NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

2. **Remove scripts**:

   ```bash
   git rm scripts/initial-github-packages-publish.ts
   git rm scripts/publish-github-packages.ts
   git rm scripts/cleanup-npmrc.sh  # After running it
   ```

3. **Update documentation**:
   - README.md: Remove GitHub Packages installation instructions
   - `.env.example`: Remove GITHUB_TOKEN entry for packages
   - `docs/release-process.md`: Update to npm-only
   - Remove `docs/github-packages-setup.md` if exists

4. **Update package.json files** (if needed):
   - Verify `publishConfig` only has `"access": "public"`
   - No GitHub Packages registry references

#### Phase 3: Deprecation Communication (Day 2-3)

1. **Deprecate GitHub Packages versions**:
   - Add notice to GitHub Packages releases
   - Point users to npm registry

2. **Create changeset**:

   ```md
   ---
   "@robeasthope/eslint-config": patch
   "@robeasthope/ui": patch
   "@robeasthope/colours": patch
   ---

   Removed GitHub Packages publishing. All packages now publish exclusively to npm registry.

   **BREAKING**: If you have `@robeasthope:registry=https://npm.pkg.github.com` in your `.npmrc`, remove it.

   **Migration**: Run `npm config delete @robeasthope:registry` or manually remove the line from `~/.npmrc`.
   ```

3. **Publish patch release**:
   - Contains the workflow changes
   - Includes migration documentation

#### Phase 4: Verification (Day 3)

1. **Test npm-only publishing**:
   - Trigger release workflow
   - Verify packages appear on npm
   - Verify no GitHub Packages attempts
   - Check CI passes

2. **Test dependent repositories**:
   - Create test PR in hecate
   - Verify package installs from npm
   - Verify CI passes

3. **Update all affected repos**:
   - Check for `.npmrc` files
   - Remove scope overrides
   - Regenerate lockfiles

### Alternative: Minimal Option 2 Implementation

If there's strong desire to keep GitHub Packages, implement Option 2 with these critical changes:

```typescript
// scripts/initial-github-packages-publish.ts
function configureNpmForGitHub(token: string) {
  // Use project-local .npmrc, not global ~/.npmrc
  const npmrcPath = join(process.cwd(), ".npmrc.github-packages");

  const githubConfig = `//npm.pkg.github.com/:_authToken=${token}`;
  writeFileSync(npmrcPath, githubConfig);

  console.log(
    "⚠️  WARNING: This configures GitHub Packages for initial publish only.",
  );
  console.log("⚠️  It does NOT modify your global ~/.npmrc file.");
  console.log("⚠️  For normal usage, packages will install from npm registry.");
}

// Use the temporary .npmrc
execSync(
  "npm publish --registry=https://npm.pkg.github.com/ --userconfig=.npmrc.github-packages",
  {
    cwd: packagePath,
    stdio: "inherit",
  },
);

// Clean up
unlinkSync(join(process.cwd(), ".npmrc.github-packages"));
```

---

## Technical Deep Dive

### npm Registry Resolution Order

When npm resolves package locations, it follows this hierarchy:

1. **Package-level registry**: `package-name:registry=...`
2. **Scope-level registry**: `@scope:registry=...` ⚠️ **CURRENT ISSUE**
3. **Global registry**: `registry=...`
4. **Default**: `https://registry.npmjs.org/`

The scope-level override (`@robeasthope:registry`) takes precedence over the global registry, causing all `@robeasthope/*` packages to resolve from GitHub Packages regardless of where they're actually published.

### Dual Publishing Architecture

The current dual publishing implementation has these components:

**Component 1: Release Workflow** (`.github/workflows/release.yml`)

```yaml
Step 1: Publish to npm
  ↓
Step 2: If Step 1 succeeds → Publish to GitHub Packages
  ↓
Step 3: Verify packages on both registries
```

**Component 2: Initial Publish Script** (`scripts/initial-github-packages-publish.ts`)

```typescript
1. Check GITHUB_TOKEN exists
2. Configure ~/.npmrc with GitHub Packages ⚠️ PERSISTENT
3. Publish each package manually
4. Restore package.json files
5. ❌ Does NOT clean up .npmrc
```

**Component 3: Automated Publish Script** (`scripts/publish-github-packages.ts`)

```typescript
1. Read PUBLISHED_PACKAGES env var
2. For each package:
   a. Backup package.json
   b. Modify publishConfig.registry
   c. Publish to GitHub Packages
   d. Restore package.json
```

**The Asymmetry**: The workflow uses temporary `.npmrc` modifications (ephemeral CI environment), but the initial script uses permanent modifications (user's home directory).

### Authentication Flow

**npm Registry** (Current - Working):

```text
Developer → npm publish
          ↓
          Uses NPM_TOKEN from secrets
          ↓
          registry.npmjs.org
          ↓
          ✅ Package published
          ↓
Consumer → npm install @robeasthope/eslint-config
         ↓
         No authentication required
         ↓
         ✅ Package installed
```

**GitHub Packages** (Current - Broken for consumers):

```text
Developer → npm publish --registry=https://npm.pkg.github.com
          ↓
          Uses GITHUB_TOKEN
          ↓
          npm.pkg.github.com
          ↓
          ✅ Package published
          ↓
Consumer → npm install @robeasthope/eslint-config
         ↓
         Has @robeasthope:registry=https://npm.pkg.github.com in .npmrc
         ↓
         Attempts to fetch from GitHub Packages
         ↓
         ❌ 403 Forbidden (no authentication)
```

### Lock File Behavior

**pnpm-lock.yaml** stores resolved tarball URLs:

**Expected (npm)**:

```yaml
"@robeasthope/eslint-config@3.0.1":
  resolution:
    integrity: sha512-...
    tarball: https://registry.npmjs.org/@robeasthope/eslint-config/-/eslint-config-3.0.1.tgz
```

**Actual (with scope override)**:

```yaml
"@robeasthope/eslint-config@3.0.1":
  resolution:
    integrity: sha512-...
    tarball: https://npm.pkg.github.com/download/@robeasthope/eslint-config/3.0.1/...
```

This means the lockfile "remembers" which registry was used, and subsequent installs will attempt to use the same registry, propagating the issue to other developers and CI environments.

---

## Risk Assessment

### Risks of Keeping GitHub Packages

| Risk                           | Likelihood | Impact    | Mitigation                        |
| ------------------------------ | ---------- | --------- | --------------------------------- |
| CI failures due to auth issues | 🔴 HIGH    | 🔴 HIGH   | Requires PAT setup in all repos   |
| Developer onboarding friction  | 🟡 MEDIUM  | 🟡 MEDIUM | Documentation and cleanup scripts |
| Lock file inconsistencies      | 🔴 HIGH    | 🟡 MEDIUM | Regenerate all lockfiles          |
| Support burden                 | 🔴 HIGH    | 🟡 MEDIUM | More issues like #226             |
| Future GitHub Packages changes | 🟡 MEDIUM  | 🟡 MEDIUM | Monitor GitHub updates            |
| Maintenance overhead           | 🔴 HIGH    | 🟡 MEDIUM | Double the failure modes          |

### Risks of Removing GitHub Packages

| Risk                            | Likelihood | Impact    | Mitigation                  |
| ------------------------------- | ---------- | --------- | --------------------------- |
| Loss of backup registry         | 🟢 LOW     | 🟢 LOW    | npm has 99.99%+ uptime      |
| Wasted effort on PR #192        | 🔴 HIGH    | 🟢 LOW    | Sunk cost, but learned      |
| Users expecting GitHub Packages | 🟢 LOW     | 🟢 LOW    | Few users, easy migration   |
| Regression in future            | 🟡 MEDIUM  | 🟡 MEDIUM | Document decision rationale |

**Conclusion**: Risks of keeping GitHub Packages significantly outweigh risks of removing it.

---

## Success Metrics

### Immediate Success (Day 1-3)

- [ ] hecate repository CI passing (RobEasthope/hecate#197 resolved)
- [ ] No 403 errors when installing `@robeasthope/eslint-config`
- [ ] `npm view @robeasthope/eslint-config dist.tarball` returns npm URL
- [ ] All repositories have clean `.npmrc` files (no scope override)

### Short-term Success (Week 1-2)

- [ ] Patch release published with documentation
- [ ] All dependent repositories updated
- [ ] Zero GitHub Packages-related support issues
- [ ] Release workflow simplified (GitHub Packages steps removed)

### Long-term Success (Month 1-3)

- [ ] No regression in package publishing
- [ ] Improved developer experience feedback
- [ ] Reduced maintenance burden
- [ ] No authentication-related issues in CI

---

## Questions for Decision Maker

1. **Strategic Direction**: Is GitHub Packages backup registry worth the complexity and maintenance burden?

2. **Historical Context**: The team removed GitHub Packages once before (Sept 12). What's changed to justify keeping it this time?

3. **Usage Metrics**: Are there actual users consuming packages from GitHub Packages vs npm?

4. **Risk Tolerance**: Is the theoretical benefit of redundancy worth the real-world pain of authentication issues?

5. **Resource Allocation**: Is the team willing to maintain documentation, support, and tooling for dual publishing?

6. **Migration Effort**: How many repositories are affected? How much effort to clean them up?

---

## Appendix A: Affected Files

### Files to Modify (Option 1 - Remove GitHub Packages)

**Delete**:

- `scripts/initial-github-packages-publish.ts`
- `scripts/publish-github-packages.ts`

**Modify**:

- `.github/workflows/release.yml` (remove GitHub Packages steps)
- `README.md` (remove GitHub Packages documentation)
- `.env.example` (remove GITHUB_TOKEN for packages)
- `docs/release-process.md` (update to npm-only)

**Verify/Clean**:

- `~/.npmrc` (all developer machines)
- `.npmrc` (any repo with scope override)
- `pnpm-lock.yaml` (regenerate with npm URLs)

### Files to Modify (Option 2 - Fix Configuration)

**Modify**:

- `scripts/initial-github-packages-publish.ts` (use temp .npmrc)
- `scripts/publish-github-packages.ts` (use env vars)
- `.github/workflows/release.yml` (use env vars)

**Create**:

- `scripts/cleanup-npmrc.ts` (cleanup utility)
- `docs/github-packages-cleanup.md` (migration guide)

---

## Appendix B: Commands for Verification

### Check if Affected

```bash
# Check local .npmrc
cat ~/.npmrc | grep @robeasthope

# Check package resolution
npm view @robeasthope/eslint-config dist.tarball

# Check lockfile registry
grep -A5 "@robeasthope/eslint-config" pnpm-lock.yaml
```

### Clean Up

```bash
# Backup current .npmrc
cp ~/.npmrc ~/.npmrc.backup

# Remove scope override
npm config delete @robeasthope:registry

# Verify npm is used
npm view @robeasthope/eslint-config dist.tarball
# Should show: https://registry.npmjs.org/...

# Regenerate lockfile
rm pnpm-lock.yaml
pnpm install
```

### Verify Packages on npm

```bash
# Check versions
npm view @robeasthope/eslint-config versions

# Check specific version
npm view @robeasthope/eslint-config@3.0.1

# Check dist info
npm view @robeasthope/eslint-config dist

# Test installation
npm pack @robeasthope/eslint-config
```

---

## Appendix C: Related Issues and PRs

- **RobEasthope/hecate#197**: CI failing due to GitHub Packages authentication
- **Issue #226**: This issue (publish to npm registry)
- **PR #192**: GitHub Packages dual publishing support (merged Oct 3)
- **Commit a15c2ac**: First GitHub Packages attempt (Sept 11)
- **Commit a6b4929**: Removal of GitHub Packages (Sept 12)
- **Commit 0ff0bdc**: Namespace migration to @robeasthope (Oct 1)

---

## Conclusion

The `@robeasthope/eslint-config` package **is published to npm**, but the dual publishing implementation creates a configuration footgun that breaks the intended "npm as primary" strategy.

**The recommended solution is to remove GitHub Packages support entirely**, returning to the simple, maintainable npm-only approach that was working correctly before October 2nd. This aligns with the previous architectural decision (commit a6b4929) and eliminates the root cause of issue #226 and related problems.

The theoretical benefits of backup registry do not justify the real-world complexity, authentication issues, and maintenance burden of dual publishing.

---

**Document Version**: 1.0
**Last Updated**: 2025-10-03
**Author**: Claude Code
**Status**: DRAFT - Awaiting Decision
