# @protomolecule/ui

React component library for Protomolecule projects.

## Installation

This package is private and not published to npm. Components are intended to be copied and pasted or used as reference.

## Development

```bash
# Start Storybook
pnpm storybook

# Run tests
pnpm test

# Run linting
pnpm lint
```

## Components

### Layout Components
- **Box** - Polymorphic box component with semantic HTML support
- **Container** - Responsive container with max-width constraints
- **Type** - Typography component with heading and paragraph variants

### Link Components
- **EmailLink** - Email link component with Sanity schema
- **ExternalLink** - External link component with Sanity schema
- **NextInternalLink** - Internal link for Next.js applications
- **ReactRouterLink** - Internal link for React Router applications
- **OmniLink** - Universal link component that handles all link types

### Content Components
- **Prose** - Rich text rendering with Portable Text
- **BasicProse** - Simple prose component for basic content
- **FullProse** - Full-featured prose component with all formatting options

## Utilities

- **cn** - Class name utility for merging Tailwind classes
- **checkForStylingClasses** - Runtime validation for styling classes

## Sanity Integration

Each component that integrates with Sanity CMS includes:
- Schema definitions (`.schema.ts`)
- GROQ queries (`.query.ts`)
- Type definitions

## Framework Support

Components are designed to work with both Next.js and React Router. Use the appropriate link component for your framework:
- Next.js: `NextInternalLink`
- React Router: `ReactRouterLink`

## Storybook

View component documentation and examples:

```bash
pnpm storybook
```

Stories are co-located with components in `.stories.ts` files.