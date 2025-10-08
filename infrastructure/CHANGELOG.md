# @protomolecule/infrastructure

## 2.2.1

### Patch Changes

- [`d0896e5`](https://github.com/RobEasthope/protomolecule/commit/d0896e5cf1a5387d9031c57d34d26263433833ee) [#274](https://github.com/RobEasthope/protomolecule/pull/274) - Remove automatic Claude Code Review workflow to reduce CI time

  **Problem:**
  The `claude-code-review.yml` workflow runs automatically on every PR (opened, synchronize), which:
  - Takes significant time to complete
  - Can slow down PR feedback loops
  - Is especially slow on busy PRs with many changes

  **Solution:**
  Removed the automatic workflow while keeping the `@claude` mention-based workflow (`claude.yml`).

  **Changes:**
  - Deleted `.github/workflows/claude-code-review.yml`
  - Kept `.github/workflows/claude.yml` for on-demand reviews

  **Usage Going Forward:**
  - **CLI**: Run `claude code` locally for code reviews
  - **PR Comments**: Tag `@claude` in a PR comment to trigger an on-demand review
  - **Issue Comments**: Tag `@claude` in issue comments to get assistance

  **Benefits:**
  - ✅ **Faster CI** - No automatic review blocking PR workflows
  - ✅ **On-demand reviews** - Use `@claude` when needed in PR comments
  - ✅ **Local reviews** - Run `claude code` from CLI for immediate feedback
  - ✅ **More control** - Choose when to get Claude's input vs. automated every time

  Closes #273

## 2.2.0

### Minor Changes

- [`9ff3f5b`](https://github.com/RobEasthope/protomolecule/commit/9ff3f5bdb7beb1ad75008305325d4cb03f359f61) [#271](https://github.com/RobEasthope/protomolecule/pull/271) - Replace AI-generated release summaries with CHANGELOG-based extraction

  **Problem:**
  The current release workflow uses GitHub Models API to generate AI summaries, which causes multiple issues:
  - ❌ **Rate limits:** 150 requests/day limit
  - ❌ **Complex permissions:** Requires `id-token: write` permission
  - ❌ **Token usage:** Unnecessary AI token consumption
  - ❌ **Re-writing existing content:** CHANGELOGs already contain all the information
  - ❌ **Missing links:** AI summaries don't preserve PR/commit links from changesets

  **Solution:**
  Rewrote `generate-summary.ts` to extract release notes directly from package CHANGELOG.md files that changesets automatically generates.

  **Implementation:**
  1. **New Functions:**
     - `findChangelogPath()` - Locates package CHANGELOGs in packages/, apps/, infrastructure/
     - `extractChangelogSection()` - Extracts version-specific content using regex
     - `generateChangelogBasedSummary()` - Combines all package sections
     - Maintains same input/output interface for workflow compatibility
  2. **Workflow Updates:**
     - Removed `GITHUB_TOKEN` env var from generate-summary step
     - Removed `USED_AI` file check
     - Updated comments to reflect CHANGELOG-based approach
  3. **Comprehensive Tests:**
     - 22 tests covering all functions (84 total tests across all scripts)
     - Tests for CHANGELOG path discovery
     - Tests for version section extraction
     - Tests for multi-line content and markdown link preservation
     - Tests for fallback behavior

  **Benefits:**
  - ✅ **Zero rate limits** - No API calls
  - ✅ **Zero tokens** - No AI usage
  - ✅ **Faster execution** - Direct file reads vs API calls
  - ✅ **More accurate** - Uses exact changeset content with PR/commit links preserved
  - ✅ **Simpler maintenance** - No API key management or permission configuration
  - ✅ **Better formatting** - Preserves markdown links: [`abc123`](url) and [#42](url)

  **Example Output:**

  ```markdown
  ## Workspace Updates

  - @robeasthope/eslint-config@4.1.0
  - @protomolecule/infrastructure@2.1.0

  ## 4.1.0

  ### Minor Changes

  - [`7d563c1`](https://github.com/RobEasthope/protomolecule/commit/...) [#266](https://github.com/RobEasthope/protomolecule/pull/266) - Add common import ignore patterns...

  ## 2.1.0

  ### Minor Changes

  - [`abc1234`](https://github.com/RobEasthope/protomolecule/commit/...) - Update build configuration...
  ```

  Closes #269

### Patch Changes

- [`20aab65`](https://github.com/RobEasthope/protomolecule/commit/20aab65d37a0a799236502abee57dd0099753213) [#270](https://github.com/RobEasthope/protomolecule/pull/270) - Fix markdownlint processing all files during lint-staged runs

  **Problem:** When committing files with lint-staged, markdownlint was processing ALL markdown files in the repo, not just the staged ones. This caused unrelated markdown files to be auto-fixed and left unstaged.

  **Root Cause:** The `globs` array in `.markdownlint-cli2.jsonc` was overriding the specific file paths that lint-staged passes to markdownlint.

  **Solution:** Moved glob patterns from config file to package.json scripts:
  - Removed `globs` from `.markdownlint-cli2.jsonc`
  - Added globs to all `lint:md` and `lint:md:fix` scripts in root and package.json files

  **Benefits:**
  - ✅ `pnpm lint:md` still works (uses globs from scripts)
  - ✅ lint-staged only processes staged files (file args take precedence)
  - ✅ No more surprise modifications to unstaged markdown files
  - ✅ Clear separation: config = rules, scripts/args = file selection

  **Files Modified:**
  - `.markdownlint-cli2.jsonc` - Removed globs array
  - `package.json` - Added globs to root lint:md scripts
  - All package `package.json` files - Added globs to lint:md scripts

## 2.1.0

### Minor Changes

- [`6b1c355`](https://github.com/RobEasthope/protomolecule/commit/6b1c355581b64add595bf3299cc7219414dfdc1a) [#254](https://github.com/RobEasthope/protomolecule/pull/254) - Add automatic git config cleanup for act workflow testing

  **Problem:**
  The `act` tool (local GitHub Actions testing) sets local git config to simulate GitHub Actions:
  - `user.name=github-actions[bot]`
  - `user.email=github-actions[bot]@users.noreply.github.com`

  This config persists after act finishes, causing subsequent commits to be incorrectly attributed to github-actions[bot] instead of the actual developer.

  **Solution:**
  Added multiple cleanup approaches with comprehensive documentation:
  1. **Shell Wrapper (Recommended)** - Auto-cleanup function for `~/.zshrc` or `~/.bashrc`
  2. **Cleanup Script** - `.github/scripts/act-cleanup.sh` for manual cleanup
  3. **Manual Commands** - Direct git config commands for quick fixes

  **Changes:**
  - Added `.github/scripts/act-cleanup.sh` cleanup script with detailed comments
  - Added "Git Config Cleanup" section to CLAUDE.md with three solutions
  - Documented the problem, solutions, and verification steps

  **Benefits:**
  - ✅ Prevents commit attribution errors after act testing
  - ✅ Multiple solutions for different workflows
  - ✅ Clear documentation for team members
  - ✅ Automatic cleanup with shell wrapper

  Closes #253

- [`790e0f0`](https://github.com/RobEasthope/protomolecule/commit/790e0f0223e46642ae96379808be271001b493ef) [#252](https://github.com/RobEasthope/protomolecule/pull/252) - Simplify infrastructure changeset policy to "all root files except pnpm-lock.yaml"

  **New Policy:**
  All tracked files in the repository root (excluding `pnpm-lock.yaml`) are infrastructure files that require changesets.

  **Rationale:**
  - `pnpm-lock.yaml` is the ONLY root file that changes automatically as a side-effect
  - Everything else requires intentional human edits and affects monorepo infrastructure
  - This eliminates the maintenance burden of explicit file lists

  **Benefits:**
  - ✅ Maintainable - No need to update the hook when adding new root config files
  - ✅ Complete - Automatically covers all infrastructure files including docs
  - ✅ Clear - Simple principle that's easy to understand and remember
  - ✅ Future-proof - Works with any new root files added to the monorepo

  **Changes:**
  - Updated `.husky/pre-push` to use pattern-based detection: `^[^/]+$` (root files) excluding `pnpm-lock.yaml`
  - Updated `CLAUDE.md` with simplified policy documentation
  - Removed explicit file list from pre-push hook (was 12+ patterns, now 2 simple rules)

  Closes #249

### Patch Changes

- [`95453b8`](https://github.com/RobEasthope/protomolecule/commit/95453b8d6a85fc553f07cac397ff52950ff54a43) [#250](https://github.com/RobEasthope/protomolecule/pull/250) - Rename infrastructure package from @robeasthope/infrastructure to @protomolecule/infrastructure

  The `@robeasthope/*` namespace is reserved for packages published to npm. Since the infrastructure package is a virtual package (never published), it makes more sense to use the monorepo name `@protomolecule/*` to avoid confusion.

  This is a virtual package used only for version tracking - no code changes required.

## 2.0.1

### Patch Changes

- [`703ec6e`](https://github.com/RobEasthope/protomolecule/commit/703ec6e150c8c88154494662e34b2806dd1a9aac) [#235](https://github.com/RobEasthope/protomolecule/pull/235) - Update release PR naming to use "release:" prefix instead of "chore:"
  - Changed PR title from "chore: version packages" to "release: @robeasthope/package-name,..."
  - Added PR title enhancement step that extracts package names from PR body
  - Removed obsolete get-release-title.ts script
  - Aligned with hecate repo release workflow pattern

## 2.0.0

### Major Changes

- [`be84285`](https://github.com/RobEasthope/protomolecule/commit/be8428580f6348560835d666bf3e29d8795844f7) [#233](https://github.com/RobEasthope/protomolecule/pull/233) - Add infrastructure package and advanced tooling from hecate

  Initial release of infrastructure package and comprehensive CI/CD automation:

  **Infrastructure Package (1.0.0)**
  - Virtual package for tracking CI/CD and tooling changes
  - Enables semantic versioning of workflows, scripts, and configurations
  - Comprehensive README documenting changeset requirements

  **YAML Validation**
  - yamllint integration with GitHub Actions-friendly configuration
  - actionlint for workflow syntax validation
  - Only fails on errors, warnings are informational

  **Release Automation (90 unit tests)**
  - detect-published.ts - Detects published packages from CHANGELOG changes
  - create-releases.ts - Creates individual GitHub releases per package
  - bump-monorepo.ts - Bumps monorepo version based on changes
  - generate-summary.ts - AI-powered release summaries with template fallback

  **Enhanced Pre-push Hook**
  - Enforces changesets for both package and infrastructure changes
  - Clear file listing when changesets are missing
  - Prevents accidental unversioned changes

  **Documentation & Tooling**
  - Enhanced CLAUDE.md with infrastructure and testing guides
  - VS Code debugging configurations for test development
  - Comprehensive scripts README with error handling patterns

  Related: #232
