# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Development
pnpm dev          # Start Vite dev server
pnpm storybook    # Run Storybook on port 6006

# Building
pnpm build        # TypeScript check + Vite build
pnpm build-storybook

# Testing
pnpm test         # Run Vitest tests
pnpm test:ui      # Run Vitest with UI
# Run a single test file: pnpm test path/to/file.test.tsx

# Code Quality
pnpm lint         # ESLint with TypeScript rules
```

## Architecture Overview

This is a React component library built with Vite, TypeScript, and Storybook. The codebase uses:

- **Framework**: React 18 with TypeScript, built with Vite
- **Styling**: Tailwind CSS with custom utility functions
- **Testing**: Vitest with happy-dom environment
- **Component Development**: Storybook for isolated component development
- **Package Manager**: pnpm

### Key Architectural Patterns

1. **Component Structure**: Components live in `src/components/` with co-located tests (`.test.tsx`), stories (`.stories.ts`), and schemas (`.schema.ts`)

2. **Multi-Framework Support**: Components are designed to work with both Next.js and React Router:
   - `NextInternalLink.tsx` for Next.js routing
   - `ReactRouterLink.tsx` for React Router routing
   - Framework-agnostic components that can adapt to either

3. **Sanity CMS Integration**: Components include Sanity schemas and GROQ queries for CMS integration:
   - Schema files define Sanity document types
   - Query files (`.query.ts`) contain GROQ queries
   - Portable Text components for rich text rendering

4. **Path Aliasing**: `@/` maps to `./src/` directory (configured in tsconfig.json and vite.config.ts)

5. **Utility Functions**:
   - `src/utils/tailwind.ts`: Tailwind class management with cn() helper
   - `src/utils/checkForStylingClasses.ts`: Runtime style class validation
   - Custom styling checks to prevent invalid class usage

6. **Component Patterns**:
   - Forwardref pattern for component refs (see Box.tsx)
   - Polymorphic components using `as` prop for semantic HTML
   - Null-safety checks with early returns