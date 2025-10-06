# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start for New Contributors

### Making Code Changes

1. **Package changes** → Create changeset for the specific package (e.g., `@robeasthope/ui`)
2. **Infrastructure changes** → Create changeset for `@protomolecule/infrastructure`
3. **Documentation only** → No changeset required

### Example Workflow

```bash
# Make changes to UI package
vim packages/ui/src/components/Button.tsx

# Create package changeset
pnpm changeset
# Select: @robeasthope/ui, minor, "Add loading state to Button"

# OR make infrastructure changes
vim .github/workflows/release.yml

# Create infrastructure changeset
pnpm changeset
# Select: @protomolecule/infrastructure, patch, "Fix release workflow timing"

# Commit with conventional format
git commit -m "feat(ui): add loading state to Button component"
```

See sections below for detailed guidance on [Changesets](#changeset-requirements), [Infrastructure](#infrastructure-package), and [Git Conventions](#git-commit-and-pr-conventions).

## Package Namespace

**All packages use the `@robeasthope/*` namespace** for npm and GitHub Packages publishing. This namespace aligns with the GitHub username for seamless GitHub Packages integration.

## Git Commit and PR Conventions

### Conventional Commits Format

Always use conventional commits format for all commits and PR titles:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- `feat`: New feature for the user (MINOR version bump)
- `fix`: Bug fix for the user (PATCH version bump)
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, semicolons, etc)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: CI/CD configuration changes
- `chore`: Other changes that don't modify src or test files

### Breaking Changes

- Add `!` after type for breaking changes: `feat!:` or `fix!:`
- OR include `BREAKING CHANGE:` in the footer
- These trigger MAJOR version bumps

### Scope Examples

- `feat(ui):` - Changes to UI package
- `fix(eslint-config):` - Fixes in eslint-config package
- `docs(readme):` - README updates
- `build(deps):` - Dependency updates

### PR Title Examples

- `feat(ui): add new Button component with size variants`
- `fix(eslint-config): correct TypeScript parsing for v5`
- `feat!: migrate to Tailwind CSS v4`
- `chore(deps): update vitest to v2.0`

### Commit Message Examples

```text
feat(ui): add loading state to Button component

- Added isLoading prop
- Shows spinner when loading
- Disables interaction during loading
```

```text
fix!: change primary color token name

BREAKING CHANGE: Renamed --color-primary to --color-brand-primary
for consistency with design system naming conventions
```

### Rules for Claude Code

1. **Always use conventional commits format** for commits and PR titles
2. **Include scope** when changes affect a specific package
3. **Use present tense** ("add" not "added")
4. **Keep first line under 72 characters**
5. **Add body for complex changes** explaining what and why
6. **Mark breaking changes clearly** with `!` or `BREAKING CHANGE:`
7. **Choose the most specific type** that applies

## Changeset Requirements

### When Changesets ARE Required

Create a changeset **ONLY** when you modify source code in `packages/*/src/` or package-specific files that affect published packages:

- Adding/modifying components in `packages/ui/src/`
- Changing ESLint rules in `packages/eslint-config/`
- Updating color exports in `packages/colours/`
- **Modifying `packages/*/package.json`** (dependencies, exports, scripts)
- Modifying package-specific configuration that affects consumers
- Updating package dependencies that affect functionality

### When Changesets ARE NOT Required

**DO NOT** create package changesets for infrastructure changes:

- ❌ Root `package.json` script changes → Use `@protomolecule/infrastructure` changeset
- ❌ `.github/` directory changes (workflows, scripts, actions) → Use `@protomolecule/infrastructure` changeset
- ❌ Root configuration files (`.prettierrc`, `.eslintrc`, etc.) → Use `@protomolecule/infrastructure` changeset
- ❌ Build/test tooling configuration at root level → Use `@protomolecule/infrastructure` changeset
- ❌ CI/CD configuration changes → Use `@protomolecule/infrastructure` changeset
- ❌ Git hooks or linting configuration → Use `@protomolecule/infrastructure` changeset
- ✅ Documentation updates (`*.md` files) → No changeset required

See [Infrastructure Package](#infrastructure-package) for infrastructure changeset guidelines.

### Creating Changesets

1. **Determine version bump** based on your changes:
   - `patch`: Bug fixes, dependency updates, small improvements
   - `minor`: New features, new components, new exports
   - `major`: Breaking changes, API changes, major refactors

2. **Create changeset programmatically:**

   ```bash
   # Option 1: Use interactive CLI (if available)
   pnpm changeset

   # Option 2: Create file directly (recommended for AI)
   cat > .changeset/descriptive-name.md << 'EOF'
   ---
   "@robeasthope/package-name": minor
   ---

   Brief description of the change for the changelog
   EOF
   ```

3. **Include changeset in your commits:**

   ```bash
   git add .changeset/*.md
   git commit -m "chore: add changeset"
   ```

### Important Rules

**CRITICAL:** Never include the root package name (e.g., `"protomolecule"`) in changesets. Only include scoped package names that start with `@robeasthope/`. The root package in a monorepo is not versioned or published.

**CI Enforcement:** The changeset check runs automatically on all PRs. PRs modifying `packages/` without a changeset will fail CI.

**Published to NPM:**

- `@robeasthope/ui` - React component library
- `@robeasthope/eslint-config` - ESLint configuration
- `@robeasthope/colours` - Radix UI color system

**Private packages** (`tsconfig`, `github-rulesets`) still require changesets for version tracking but are not published to NPM.

**When in doubt:** If you're only modifying files at the repository root level or in `.github/`, you should create a changeset for `@protomolecule/infrastructure` instead of a package changeset. See [Infrastructure Package](#infrastructure-package) below.

## Monorepo Structure

This is a monorepo using Turborepo and pnpm workspaces. Packages are organized as follows:

```text
packages/
├── ui/                    # React component library with Storybook (includes Tailwind CSS v4 config)
├── eslint-config/         # Shared ESLint configuration
├── github-rulesets/       # GitHub configuration rulesets
├── colours/               # Radix UI color system CSS
└── tsconfig/              # Shared TypeScript configurations
```

## Build and Development Commands

All commands run from the root directory using Turborepo:

```bash
# Development
pnpm dev          # Start Storybook for UI package
pnpm storybook    # Run Storybook on port 6006

# Building
pnpm build        # Build all packages (TypeScript compilation)
pnpm build-storybook  # Build static Storybook site

# Testing
pnpm test         # Run all tests (Vitest)
pnpm test:ui      # Run Vitest with UI for UI package
pnpm test:hooks   # Test git hooks

# Code Quality
pnpm lint         # ESLint across all packages
pnpm lint:fix     # Fix linting issues
pnpm format       # Format code with Prettier
pnpm sort-pkg-json # Sort package.json files

# Maintenance
pnpm clean        # Clean node_modules and build artifacts
```

## Architecture Overview

This is a React component library monorepo built with:

- **Build Tool**: Turborepo for orchestration
- **Package Manager**: pnpm with workspace support (v10.15.0)
- **Framework**: React 19 with TypeScript 5
- **Styling**: Tailwind CSS v4 (CSS-based config)
- **Testing**: Vitest with happy-dom environment
- **Component Development**: Storybook v9 for isolated development
- **Code Quality**: ESLint v9, Prettier, Husky with lint-staged
- **Node Version**: 20.x

### Package Details

1. **@robeasthope/ui**: React components with Storybook (published to NPM)
   - Components with co-located tests, stories, and Sanity schemas
   - Multi-framework support (Next.js and React Router)
   - Utilities for Tailwind class management
   - Includes Tailwind CSS v4 configuration

2. **@robeasthope/eslint-config**: Shared ESLint rules (published to NPM)

3. **@robeasthope/github-rulesets**: GitHub repository configuration (private)

4. **@robeasthope/colours**: Radix UI color imports (published to NPM)

5. **@robeasthope/tsconfig**: Shared TypeScript configurations (private)

### Key Architectural Patterns

1. **Component Structure**: Components in `packages/ui/src/components/` with:
   - Co-located tests (`.test.tsx`)
   - Stories (`.stories.ts`)
   - Sanity schemas (`.schema.ts`)

2. **Multi-Framework Support**: Components work with both Next.js and React Router:
   - `NextInternalLink.tsx` for Next.js routing
   - `ReactRouterLink.tsx` for React Router routing
   - Framework-agnostic components

3. **Sanity CMS Integration**: Components include:
   - Schema definitions for Sanity document types
   - GROQ queries (`.query.ts`)
   - Portable Text components

4. **Path Aliasing**: `@/` maps to `./src/` in each package

5. **Utility Functions** (in UI package):
   - `src/utils/tailwind.ts`: Tailwind class management
   - Style checking utilities

6. **Component Patterns**:
   - Forwardref pattern for refs
   - Polymorphic components with `as` prop
   - Null-safety with early returns

## Infrastructure Package

### Purpose

The `infrastructure/` directory contains a virtual package (`@protomolecule/infrastructure`) for tracking CI/CD, workflow, and tooling changes separate from code packages. It has no actual code - it's purely for version tracking.

### When to Create Infrastructure Changesets

Create changesets for `@protomolecule/infrastructure` when modifying:

**CI/CD & Workflows:**

- `.github/workflows/` - GitHub Actions workflows
- `.github/actions/` - Custom composite actions
- `.github/scripts/` - Release automation scripts

**Build & Tooling:**

- `turbo.json`, `pnpm-workspace.yaml`
- Root `package.json` scripts and dependencies
- ESLint, Prettier, TypeScript configs at root level

**Git Configuration:**

- `.husky/` - Git hooks
- `lint-staged` configuration
- `.gitignore`, `.gitattributes`

**Linting & Validation:**

- `.yamllint.yml` - YAML linting rules
- `.actrc`, `.actrc.example` - Act configuration

See `infrastructure/README.md` for comprehensive changeset guidance and `.github/scripts/README.md` for release automation documentation.

### Version Guidelines

- **Patch**: Bug fixes in workflows, minor config tweaks
- **Minor**: New workflows/jobs, new dev tooling
- **Major**: Breaking changes to build system, Node version updates

## Git Hooks (Husky)

### Pre-commit Hook

Runs `lint-staged` to format and lint staged files:

- Formats with Prettier
- Runs ESLint with auto-fix
- Validates YAML in workflows
- Lints markdown files

### Pre-push Hook

**Package Changeset Enforcement:**

- Detects changes to `packages/*/src/`, build configs, or functional `package.json` changes
- Requires a changeset for any package source code modifications
- Allows documentation-only changes without changesets

**Infrastructure Changeset Enforcement:**

- Detects changes to `.github/`, `.husky/`, root configs, and tooling files
- Requires a changeset for `@protomolecule/infrastructure`
- Lists the changed infrastructure files for clarity
- Provides helpful guidance on creating infrastructure changesets

**Bypass Hook (not recommended):**

```bash
git push --no-verify
```

## Testing GitHub Actions Workflows Locally with Act

The project supports [Act](https://github.com/nektos/act) for running GitHub Actions workflows locally in Docker containers.

### Prerequisites

- Docker Desktop must be running
- Act installed via Homebrew: `brew install act`

### Configuration

**`.actrc.example`** - Template configuration (tracked in git)
**`.actrc`** - Your local configuration (git-ignored)

Copy the example to get started:

```bash
cp .actrc.example .actrc
```

Default configuration:

- Container architecture: linux/amd64 (Apple Silicon compatible)
- Artifact server: /tmp/artifacts
- Runner image: catthehacker/ubuntu:act-latest (Medium ~500MB)

### Common Commands

```bash
# List all available workflows
act -l

# Dry run to see execution plan (no actual execution)
act -n -W .github/workflows/release.yml

# Run release workflow (triggered by push event)
act push -W .github/workflows/release.yml

# Run pull request workflows
act pull_request

# Run specific job
act -j release

# Verbose output for debugging
act push --verbose

# Run with secrets (interactive prompt)
act -s GITHUB_TOKEN

# Or create .secrets file (ensure it's in .gitignore!)
echo "GITHUB_TOKEN=ghp_..." > .secrets
act --secret-file .secrets
```

### Workflow Testing Strategy

**Release workflow:** Test locally before creating changesets to verify workflow logic without creating actual GitHub releases.

**CI workflows:** Test linting, type checking, and tests locally to catch issues before pushing.

**YAML validation:** Test workflow syntax changes to ensure YAML is valid before committing.

### Limitations

- **First run is slow:** Downloads Docker images (~500MB for Medium image)
- **Subsequent runs are fast:** Images are cached locally
- **Secrets required:** Some workflows need secrets passed via `-s` flag or `.secrets` file
- **Not 100% identical:** Some GitHub Actions features may behave slightly differently
- **Docker required:** Docker Desktop must be running

### Troubleshooting

**Issue:** "Cannot connect to Docker daemon"
**Solution:** Ensure Docker Desktop is running

**Issue:** Workflow fails with missing secrets
**Solution:** Pass secrets via `-s GITHUB_TOKEN` or create `.secrets` file (git-ignored)

**Issue:** "No workflows detected"
**Solution:** Specify workflow file: `act -W .github/workflows/workflow-name.yml`

## Release Automation Scripts

### Overview

The `.github/scripts/` directory contains TypeScript automation scripts for release workflows:

| Script                | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `detect-published.ts` | Detects published packages from CHANGELOG changes    |
| `create-releases.ts`  | Creates individual GitHub releases from changelogs   |
| `bump-monorepo.ts`    | Bumps monorepo version based on package changes      |
| `generate-summary.ts` | Generates AI-powered release summaries with fallback |

### Testing Scripts

**Run all tests:**

```bash
pnpm test:scripts
```

**Run with coverage:**

```bash
pnpm test:scripts:coverage
```

**Watch mode (TDD):**

```bash
pnpm test:scripts:watch
```

**Total: 90 tests** covering pure functions and business logic.

### Test Philosophy

- **Separation of Concerns**: Logic separated from I/O operations
- **Dependency Injection**: File system operations passed as parameters
- **Import Guards**: Scripts don't execute on import
- **Fast Execution**: All 90 tests complete in <20ms

See `.github/scripts/README.md` for detailed testing documentation.

### GitHub Actions Best Practices

**IMPORTANT:** Always use `pnpm tsx` (not bare `tsx`) when executing TypeScript scripts in GitHub Actions workflows.

**Why:** The `tsx` binary is installed in `node_modules/.bin/` and is not available in the GitHub Actions runner's global PATH.

**Correct usage:**

```yaml
- name: Run TypeScript Script
  run: pnpm tsx .github/scripts/my-script.ts
```

**Incorrect usage (will fail):**

```yaml
- name: Run TypeScript Script
  run: tsx .github/scripts/my-script.ts # ❌ WRONG - tsx not in PATH
```
