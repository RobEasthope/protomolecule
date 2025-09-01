# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a monorepo using Turborepo and pnpm workspaces. Packages are organized as follows:

```
packages/
├── ui/                    # React component library with Storybook
├── eslint-config/         # Shared ESLint configuration
├── github-rulesets/       # GitHub configuration rulesets
├── radix-colors/          # Radix UI color system CSS
├── tailwind-config/       # Tailwind CSS v4 configuration
└── tsconfig/              # Shared TypeScript configurations
```

## Build and Development Commands

All commands run from the root directory using Turborepo:

```bash
# Development
pnpm dev          # Start Storybook for UI package
pnpm storybook    # Run Storybook on port 6006

# Building
pnpm build        # Build all packages
pnpm build-storybook

# Testing
pnpm test         # Run all tests
pnpm test:ui      # Run Vitest with UI for UI package

# Code Quality
pnpm lint         # ESLint across all packages
pnpm lint:fix     # Fix linting issues
```

## Architecture Overview

This is a React component library monorepo built with:

- **Build Tool**: Turborepo for orchestration
- **Package Manager**: pnpm with workspace support
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 (CSS-based config)
- **Testing**: Vitest with happy-dom environment
- **Component Development**: Storybook for isolated development

### Package Details

1. **@protomolecule/ui**: React components with Storybook
   - Components with co-located tests, stories, and Sanity schemas
   - Multi-framework support (Next.js and React Router)
   - Utilities for Tailwind class management

2. **@protomolecule/eslint-config**: Shared ESLint rules (publishable)

3. **@protomolecule/github-rulesets**: GitHub repository configuration (private)

4. **@protomolecule/radix-colors**: Radix UI color imports (private)

5. **@protomolecule/tailwind-config**: Tailwind v4 configuration (publishable)

6. **@protomolecule/tsconfig**: Shared TypeScript configurations (publishable)

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
   - `src/utils/checkForStylingClasses.ts`: Runtime validation
   - Style checking utilities

6. **Component Patterns**:
   - Forwardref pattern for refs
   - Polymorphic components with `as` prop
   - Null-safety with early returns