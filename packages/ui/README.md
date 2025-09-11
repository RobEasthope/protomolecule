# @protomolecule/ui

React component library for Protomolecule projects with Storybook, Tailwind CSS v4, and Sanity CMS integration.

## 📦 Installation

This package is private and part of the Protomolecule monorepo. It's not published to npm.

### Using in Your Project

Since this is a private package within the monorepo, you can import components directly:

```typescript
import { Box, Container, Type } from "@protomolecule/ui/components";
import { cn } from "@protomolecule/ui/utils";
```

## 🚀 Development

All commands should be run from the monorepo root:

```bash
# Start Storybook development server
pnpm dev
# or
pnpm storybook

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Build TypeScript
pnpm build

# Build static Storybook
pnpm build-storybook
```

## 🧩 Components

### Layout Components

| Component     | Description               | Features                                  |
| ------------- | ------------------------- | ----------------------------------------- |
| **Box**       | Polymorphic box component | Semantic HTML support, `as` prop          |
| **Container** | Responsive container      | Max-width constraints, responsive padding |
| **Type**      | Typography component      | Heading and paragraph variants            |

### Link Components

| Component            | Description                      | Framework          |
| -------------------- | -------------------------------- | ------------------ |
| **EmailLink**        | Email link with Sanity schema    | Framework-agnostic |
| **ExternalLink**     | External link with Sanity schema | Framework-agnostic |
| **NextInternalLink** | Internal link for Next.js        | Next.js            |
| **ReactRouterLink**  | Internal link for React Router   | React Router       |
| **OmniLink**         | Universal link component         | Multi-framework    |

### Content Components

| Component      | Description                  | Use Case               |
| -------------- | ---------------------------- | ---------------------- |
| **Prose**      | Rich text with Portable Text | Dynamic content        |
| **BasicProse** | Simple prose component       | Basic formatting       |
| **FullProse**  | Full-featured prose          | All formatting options |

## 🛠️ Utilities

```typescript
// Tailwind class merging utility
import { cn } from "@protomolecule/ui/utils";

const className = cn(
  "base-class",
  conditional && "conditional-class",
  "override-class",
);
```

## 🎨 Styling

This package uses Tailwind CSS v4 with CSS-based configuration. The configuration is located in the package root and includes:

- Custom color system via `@protomolecule/colours`
- Responsive design utilities
- Component-specific styles

## 🧪 Testing

Tests are co-located with components using the `.test.tsx` extension:

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests in watch mode
pnpm test --watch
```

Testing stack:

- **Vitest** for test runner
- **Testing Library** for component testing
- **happy-dom** for DOM environment

## 📚 Sanity CMS Integration

Components with CMS integration include:

```
component/
├── Component.tsx          # React component
├── Component.test.tsx     # Tests
├── Component.stories.ts   # Storybook stories
├── Component.schema.ts    # Sanity schema definition
└── Component.query.ts     # GROQ queries
```

### Using Sanity Schemas

```typescript
import { emailLinkSchema } from "@protomolecule/ui/components/EmailLink/EmailLink.schema";

// Use in your Sanity configuration
export default {
  types: [emailLinkSchema /* other schemas */],
};
```

## 🎭 Storybook

Interactive component documentation and playground:

```bash
# Start Storybook dev server
pnpm storybook

# Build static Storybook
pnpm build-storybook
```

Access at: <http://localhost:6006>

### Story Structure

Stories are co-located with components:

```typescript
// Component.stories.ts
import type { Meta, StoryObj } from "@storybook/react";
import { Component } from "./Component";

const meta: Meta<typeof Component> = {
  title: "Category/Component",
  component: Component,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // default props
  },
};
```

## 🔧 Configuration

### TypeScript

Uses shared configuration from `@protomolecule/tsconfig`:

- Strict mode enabled
- Path aliasing: `@/` → `./src/`
- React 19 JSX transform

### ESLint

Uses shared configuration from `@protomolecule/eslint-config`:

- TypeScript rules
- React best practices
- Accessibility checks

## 📁 Project Structure

```
packages/ui/
├── src/
│   ├── components/        # React components
│   │   └── [Component]/
│   │       ├── index.ts
│   │       ├── Component.tsx
│   │       ├── Component.test.tsx
│   │       ├── Component.stories.ts
│   │       └── Component.schema.ts
│   └── utils/            # Utility functions
├── .storybook/           # Storybook configuration
├── tailwind.config.ts    # Tailwind CSS v4 config
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite configuration
└── package.json
```

## 🤝 Contributing

1. Create a new component in `src/components/`
2. Add tests, stories, and schemas
3. Run tests and linting
4. Update this README if needed
5. Submit a PR

## 📄 License

MIT License - see [LICENSE](../../LICENSE) file in the root directory.

This software is provided "as is", without warranty of any kind. Use at your own risk.
