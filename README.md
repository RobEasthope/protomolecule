# Protomolecule

A modern React component library monorepo built with TypeScript, Storybook, and Tailwind CSS v4.

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- pnpm 10.15.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/protomolecule.git
cd protomolecule

# Install dependencies
pnpm install

# Start development (Storybook)
pnpm dev
```

## 📦 Packages

This monorepo contains the following packages:

| Package                                                        | Description                            | Status      |
| -------------------------------------------------------------- | -------------------------------------- | ----------- |
| [`@protomolecule/ui`](./packages/ui)                           | React component library with Storybook | Private     |
| [`@protomolecule/eslint-config`](./packages/eslint-config)     | Shared ESLint configuration            | Publishable |
| [`@protomolecule/tsconfig`](./packages/tsconfig)               | Shared TypeScript configurations       | Publishable |
| [`@protomolecule/radix-colors`](./packages/radix-colors)       | Radix UI color system                  | Private     |
| [`@protomolecule/github-rulesets`](./packages/github-rulesets) | GitHub repository configuration        | Private     |

## 🛠️ Development

### Available Scripts

All commands are run from the root directory using Turborepo:

#### Development

```bash
pnpm dev          # Start Storybook for UI development
pnpm storybook    # Alternative command for Storybook
```

#### Building

```bash
pnpm build             # Build all packages (TypeScript compilation)
pnpm build-storybook   # Build static Storybook site
```

#### Testing

```bash
pnpm test         # Run all tests
pnpm test:ui      # Run Vitest with UI
pnpm test:hooks   # Test git hooks
```

#### Code Quality

```bash
pnpm lint         # Run ESLint across all packages
pnpm lint:fix     # Auto-fix linting issues
pnpm format       # Format code with Prettier
pnpm sort-pkg-json # Sort package.json files
```

#### Maintenance

```bash
pnpm clean        # Clean node_modules and build artifacts
```

## 🏗️ Architecture

### Tech Stack

- **Monorepo Management**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/) with workspaces
- **Framework**: [React 19](https://react.dev/) with [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-based configuration)
- **Component Development**: [Storybook v9](https://storybook.js.org/)
- **Testing**: [Vitest](https://vitest.dev/) with happy-dom
- **Code Quality**:
  - [ESLint v9](https://eslint.org/) for linting
  - [Prettier](https://prettier.io/) for formatting
  - [Husky](https://typicode.github.io/husky/) for git hooks
  - [lint-staged](https://github.com/okonet/lint-staged) for pre-commit checks

### Project Structure

```
protomolecule/
├── packages/
│   ├── ui/                    # React component library
│   ├── eslint-config/         # Shared ESLint configuration
│   ├── tsconfig/              # Shared TypeScript configurations
│   ├── radix-colors/          # Radix UI color system
│   └── github-rulesets/       # GitHub configuration
├── .husky/                    # Git hooks
├── turbo.json                 # Turborepo configuration
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── CLAUDE.md                  # AI assistant guidance
└── README.md                  # You are here
```

## 🧩 Component Library

The UI package (`@protomolecule/ui`) provides a comprehensive set of React components:

### Components Available

- **Layout Components**: Box, Container, Type
- **Link Components**: EmailLink, ExternalLink, NextInternalLink, ReactRouterLink, OmniLink
- **Content Components**: Prose, BasicProse, FullProse
- **Utilities**: Tailwind class management utilities

### Framework Support

Components are designed to work with both Next.js and React Router. Each component that integrates with Sanity CMS includes:

- Schema definitions (`.schema.ts`)
- GROQ queries (`.query.ts`)
- Type definitions

## 🚦 Git Workflow

This repository uses Husky for git hooks and lint-staged for pre-commit checks:

- **Pre-commit**: Automatically formats staged files with Prettier
- **Commit messages**: Follow conventional commits format

## 📝 Development Guide

### Setting Up Your Environment

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/protomolecule.git
   cd protomolecule
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development**
   ```bash
   pnpm dev
   ```
   This will start Storybook on http://localhost:6006

### Working with Components

1. **Creating a new component**
   - Add component file in `packages/ui/src/components/`
   - Create co-located test file (`.test.tsx`)
   - Add Storybook story (`.stories.ts`)
   - Include Sanity schema if applicable (`.schema.ts`)

2. **Testing components**

   ```bash
   pnpm test              # Run all tests
   pnpm test:ui           # Run with Vitest UI
   ```

3. **Building for production**
   ```bash
   pnpm build             # Build all packages
   pnpm build-storybook   # Build static Storybook
   ```

### Code Style Guidelines

- TypeScript is enforced for all code
- Components use forwardRef pattern for refs
- Polymorphic components use the `as` prop
- Null-safety with early returns
- Co-locate tests, stories, and schemas with components
- Use `@/` path alias for imports within packages

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (following conventional commits)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🔗 Links

- [Storybook Documentation](http://localhost:6006) (when running locally)
- [Component Library](./packages/ui)
- [Architecture Guide](./CLAUDE.md)

## 💡 Tips for New Developers

1. **Start with Storybook**: Run `pnpm dev` to explore existing components and their documentation
2. **Check CLAUDE.md**: Contains detailed architecture patterns and conventions
3. **Use the provided scripts**: All common tasks have npm scripts configured
4. **Follow existing patterns**: Look at existing components for examples
5. **Test your changes**: Run `pnpm test` and `pnpm lint` before committing

---

Built with ❤️ using modern web technologies
