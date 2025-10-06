# @protomolecule/infrastructure

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
