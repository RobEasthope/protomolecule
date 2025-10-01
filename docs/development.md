# Development Guide

This guide covers everything you need to know for developing in the Protomolecule monorepo.

## Setting Up Your Environment

### Prerequisites

1. **Node.js 20.x or higher**

   ```bash
   # Check your version
   node --version

   # Install via nvm (recommended)
   nvm install 20
   nvm use 20
   ```

2. **pnpm 10.15.0 or higher**

   ```bash
   # Install pnpm
   npm install -g pnpm@latest

   # Check version
   pnpm --version
   ```

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/RobEasthope/protomolecule.git
   cd protomolecule
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Verify setup**

   ```bash
   # Run tests
   pnpm test

   # Start Storybook
   pnpm dev
   ```

## Available Scripts

All scripts are run from the monorepo root using Turborepo:

### Development Scripts

| Command           | Description                                     |
| ----------------- | ----------------------------------------------- |
| `pnpm dev`        | Start Storybook development server on port 6006 |
| `pnpm storybook`  | Alternative command for Storybook               |
| `pnpm test`       | Run all tests across packages                   |
| `pnpm test:ui`    | Run tests with Vitest UI interface              |
| `pnpm test:hooks` | Test git hooks configuration                    |

### Build Scripts

| Command                | Description                                 |
| ---------------------- | ------------------------------------------- |
| `pnpm build`           | Build all packages (TypeScript compilation) |
| `pnpm build-storybook` | Build static Storybook site                 |

### Code Quality Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `pnpm lint`          | Run ESLint across all packages |
| `pnpm lint:fix`      | Auto-fix linting issues        |
| `pnpm format`        | Format code with Prettier      |
| `pnpm sort-pkg-json` | Sort package.json files        |

### Maintenance Scripts

| Command                 | Description                            |
| ----------------------- | -------------------------------------- |
| `pnpm clean`            | Clean node_modules and build artifacts |
| `pnpm changeset`        | Create a changeset for version bumps   |
| `pnpm changeset status` | Check pending changesets               |

## Working with Components

### Creating a New Component

1. **Create component directory**

   ```bash
   mkdir -p packages/ui/src/components/MyComponent
   ```

2. **Create component files**

   ```typescript
   // packages/ui/src/components/MyComponent/MyComponent.tsx
   import React from 'react';

   export interface MyComponentProps {
     children?: React.ReactNode;
     variant?: 'primary' | 'secondary';
   }

   export const MyComponent = React.forwardRef<
     HTMLDivElement,
     MyComponentProps
   >(({ children, variant = 'primary', ...props }, ref) => {
     return (
       <div ref={ref} className={`my-component ${variant}`} {...props}>
         {children}
       </div>
     );
   });

   MyComponent.displayName = 'MyComponent';
   ```

3. **Create index export**

   ```typescript
   // packages/ui/src/components/MyComponent/index.ts
   export { MyComponent } from "./MyComponent";
   export type { MyComponentProps } from "./MyComponent";
   ```

4. **Add tests**

   ```typescript
   // packages/ui/src/components/MyComponent/MyComponent.test.tsx
   import { describe, it, expect } from 'vitest';
   import { render, screen } from '@testing-library/react';
   import { MyComponent } from './MyComponent';

   describe('MyComponent', () => {
     it('renders children', () => {
       render(<MyComponent>Test content</MyComponent>);
       expect(screen.getByText('Test content')).toBeInTheDocument();
     });
   });
   ```

5. **Add Storybook story**

   ```typescript
   // packages/ui/src/components/MyComponent/MyComponent.stories.ts
   import type { Meta, StoryObj } from "@storybook/react";
   import { MyComponent } from "./MyComponent";

   const meta: Meta<typeof MyComponent> = {
     title: "Components/MyComponent",
     component: MyComponent,
     parameters: {
       layout: "centered",
     },
   };

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Primary: Story = {
     args: {
       children: "Primary Component",
       variant: "primary",
     },
   };

   export const Secondary: Story = {
     args: {
       children: "Secondary Component",
       variant: "secondary",
     },
   };
   ```

### Adding Sanity CMS Support

If your component needs Sanity CMS integration:

1. **Create schema file**

   ```typescript
   // packages/ui/src/components/MyComponent/MyComponent.schema.ts
   import { defineType, defineField } from "sanity";

   export const myComponentSchema = defineType({
     name: "myComponent",
     title: "My Component",
     type: "object",
     fields: [
       defineField({
         name: "content",
         title: "Content",
         type: "string",
         validation: (Rule) => Rule.required(),
       }),
       defineField({
         name: "variant",
         title: "Variant",
         type: "string",
         options: {
           list: [
             { title: "Primary", value: "primary" },
             { title: "Secondary", value: "secondary" },
           ],
         },
       }),
     ],
   });
   ```

2. **Create GROQ query**
   ```typescript
   // packages/ui/src/components/MyComponent/MyComponent.query.ts
   export const myComponentQuery = `
     _type == "myComponent" => {
       _type,
       content,
       variant
     }
   `;
   ```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage

# Run tests with UI
pnpm test:ui
```

### Writing Tests

Tests use Vitest with Testing Library:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick}>Click me</MyComponent>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Code Style

### TypeScript Guidelines

- **Strict mode**: Always enabled
- **Explicit types**: Prefer explicit over inferred types for exports
- **Interfaces over types**: Use interfaces for object shapes
- **Const assertions**: Use `as const` for literal types

### React Guidelines

- **Functional components**: Always use functional components
- **Hooks**: Follow Rules of Hooks
- **ForwardRef**: Use for components that need DOM access
- **Display names**: Set for debugging

### Import Organisation

Imports should be organised in this order:

1. React and core libraries
2. Third-party libraries
3. Internal packages
4. Relative imports
5. Style imports

```typescript
// React and core
import React, { useState, useEffect } from "react";

// Third-party
import { cn } from "clsx";

// Internal packages
import { Button } from "@robeasthope/ui";

// Relative imports
import { utils } from "@/utils";
import { MyComponent } from "./MyComponent";

// Styles
import "./styles.css";
```

## Git Workflow

### Branch Naming

Use descriptive branch names:

- `feat/component-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/update-section` - Documentation
- `refactor/component-name` - Code refactoring
- `test/component-name` - Test updates

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature
git commit -m "feat(ui): add new Button component"

# Bug fix
git commit -m "fix(eslint-config): resolve TypeScript parsing error"

# Documentation
git commit -m "docs: update development guide"

# Breaking change
git commit -m "feat!: migrate to Tailwind CSS v4"
```

### Pre-commit Hooks

Husky runs automatic checks before commits:

- Prettier formatting
- ESLint checks
- TypeScript compilation

If a commit is blocked, fix the issues and try again:

```bash
# Fix linting issues
pnpm lint:fix

# Fix formatting
pnpm format

# Try commit again
git commit -m "fix: resolve linting issues"
```

## Working with Storybook

### Starting Storybook

```bash
pnpm storybook
# Opens at http://localhost:6006
```

### Story Best Practices

1. **Comprehensive coverage**: Create stories for all component states
2. **Controls**: Use args for interactive props
3. **Documentation**: Add JSDoc comments to components
4. **Accessibility**: Test with Storybook's a11y addon

### Story Template

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  title: "Category/MyComponent",
  component: MyComponent,
  parameters: {
    layout: "centered", // or 'fullscreen', 'padded'
    docs: {
      description: {
        component: "Component description here",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default content",
  },
};
```

## Debugging

### VS Code Configuration

Recommended extensions:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Vitest

### Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Common Issues

#### Port Already in Use

```bash
# Find process using port 6006
lsof -i :6006

# Kill the process
kill -9 <PID>
```

#### TypeScript Errors

```bash
# Clear TypeScript cache
pnpm clean
pnpm install
pnpm build
```

#### Dependency Issues

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
pnpm clean
pnpm install
```

## Performance Tips

### Development Performance

1. **Use Turbo cache**: Don't clear cache unnecessarily
2. **Selective testing**: Use pattern matching for tests
   ```bash
   pnpm test MyComponent
   ```
3. **Selective builds**: Build specific packages
   ```bash
   pnpm build --filter=@robeasthope/ui
   ```

### Bundle Size

Monitor bundle size for published packages:

```bash
# Check package size

npx bundlephobia @robeasthope/ui
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Vitest Documentation](https://vitest.dev/guide)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
