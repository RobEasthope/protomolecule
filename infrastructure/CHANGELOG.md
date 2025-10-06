# @protomolecule/infrastructure

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
