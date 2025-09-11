# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

When creating PRs that modify any package:

1. **Always create a changeset file** before pushing the PR
2. **Determine version bump** based on your changes:
   - `patch`: Bug fixes, dependency updates, small improvements
   - `minor`: New features, new components, new exports
   - `major`: Breaking changes, API changes, major refactors

3. **Create changeset programmatically:**

   ```bash
   # Option 1: Use interactive CLI (if available)
   pnpm changeset

   # Option 2: Create file directly (recommended for AI)
   cat > .changeset/descriptive-name.md << 'EOF'
   ---
   "@protomolecule/package-name": minor
   ---

   Brief description of the change for the changelog
   EOF
   ```

4. **Include changeset in your commits:**

   ```bash
   git add .changeset/*.md
   git commit -m "chore: add changeset"
   ```

5. **CI will block PRs without changesets** - this is mandatory

**IMPORTANT:** Never include the root package name (e.g., `"protomolecule"`) in changesets. Only include scoped package names that start with `@protomolecule/`. The root package in a monorepo is not versioned or published.

**Published to NPM:**

- `@protomolecule/ui` - React component library
- `@protomolecule/eslint-config` - ESLint configuration
- `@protomolecule/colours` - Radix UI color system

**Private packages** (`tsconfig`, `github-rulesets`) still require changesets for version tracking but are not published to NPM.

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

1. **@protomolecule/ui**: React components with Storybook (published to NPM)
   - Components with co-located tests, stories, and Sanity schemas
   - Multi-framework support (Next.js and React Router)
   - Utilities for Tailwind class management
   - Includes Tailwind CSS v4 configuration

2. **@protomolecule/eslint-config**: Shared ESLint rules (published to NPM)

3. **@protomolecule/github-rulesets**: GitHub repository configuration (private)

4. **@protomolecule/colours**: Radix UI color imports (published to NPM)

5. **@protomolecule/tsconfig**: Shared TypeScript configurations (private)

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
