# Protomolecule

[![CI](https://github.com/RobEasthope/protomolecule/actions/workflows/linting-and-testing.yml/badge.svg)](https://github.com/RobEasthope/protomolecule/actions/workflows/linting-and-testing.yml)
[![Release](https://github.com/RobEasthope/protomolecule/actions/workflows/release.yml/badge.svg)](https://github.com/RobEasthope/protomolecule/actions/workflows/release.yml)
[![npm version](https://img.shields.io/npm/v/@protomolecule/eslint-config.svg)](https://www.npmjs.com/package/@protomolecule/eslint-config)

A modern, open-source React component library monorepo built with TypeScript, Storybook, and Tailwind CSS v4.

> **Open Source**: This project is open source and free to use. Feel free to fork, modify, and use in your own projects at your own risk.

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- pnpm 10.15.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/RobEasthope/protomolecule.git
cd protomolecule

# Install dependencies
pnpm install

# Start development (Storybook)
pnpm dev
```

## 📦 Packages

This monorepo contains the following packages:

| Package                                                        | Description                            | Version | Status  |
| -------------------------------------------------------------- | -------------------------------------- | ------- | ------- |
| [`@protomolecule/ui`](./packages/ui)                           | React component library with Storybook | 2.0.0   | **NPM** |
| [`@protomolecule/eslint-config`](./packages/eslint-config)     | Shared ESLint configuration            | 2.0.1   | **NPM** |
| [`@protomolecule/tsconfig`](./packages/tsconfig)               | Shared TypeScript configurations       | 2.0.0   | Private |
| [`@protomolecule/colours`](./packages/colours)                 | Radix UI color system                  | 2.0.0   | **NPM** |
| [`@protomolecule/github-rulesets`](./packages/github-rulesets) | GitHub repository configuration        | 2.0.0   | Private |

### 📥 Installing Public Packages

```bash
# Install the UI component library
npm install @protomolecule/ui
# or
pnpm add @protomolecule/ui

# Install the ESLint configuration
npm install --save-dev @protomolecule/eslint-config
# or
pnpm add -D @protomolecule/eslint-config

# Install the colour system
npm install @protomolecule/colours
# or
pnpm add @protomolecule/colours
```

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

#### Versioning & Publishing

```bash
pnpm changeset    # Create a changeset for version bumps
pnpm changeset status  # Check pending changesets
```

## 🏗️ Architecture

### Tech Stack

- **Monorepo Management**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/) with workspaces
- **Framework**: [React 19](https://react.dev/) with [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-based configuration)
- **Component Development**: [Storybook v9](https://storybook.js.org/)
- **Testing**: [Vitest](https://vitest.dev/) with happy-dom
- **Versioning**: [Changesets](https://github.com/changesets/changesets) for automated releases
- **Code Quality**:
  - [ESLint v9](https://eslint.org/) for linting
  - [Prettier](https://prettier.io/) for formatting
  - [Husky](https://typicode.github.io/husky/) for git hooks
  - [lint-staged](https://github.com/okonet/lint-staged) for pre-commit checks

### Project Structure

```text
protomolecule/
├── packages/
│   ├── ui/                    # React component library
│   ├── eslint-config/         # Shared ESLint configuration
│   ├── tsconfig/              # Shared TypeScript configurations
│   ├── colours/               # Radix UI color system
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
- **Changesets**: Required for all package modifications

## 🚀 Release Process

This project uses continuous deployment:

1. **Create a PR** with your changes
2. **Include a changeset** describing your changes
3. **CI validates** your code (lint, test, typecheck, changeset check)
4. **On merge to main**:
   - Versions are automatically bumped
   - Packages are published to NPM
   - GitHub releases are created with user-friendly summaries
   - No manual intervention required!

### Published Packages

The following packages are published to NPM:

- `@protomolecule/ui` - React component library
- `@protomolecule/eslint-config` - ESLint configuration
- `@protomolecule/colours` - Radix UI color system

Other packages (`tsconfig`, `github-rulesets`) remain private but are still versioned for internal tracking.

## 📝 Development Guide

### Setting Up Your Environment

1. **Clone the repository**

   ```bash
   git clone https://github.com/RobEasthope/protomolecule.git
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

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. **Add a changeset** for any package changes:
   ```bash
   pnpm changeset
   # Select packages, version bump type, and add a description
   ```
5. Commit your changes (following conventional commits)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Versioning Guidelines

This project uses [Changesets](https://github.com/changesets/changesets) for version management:

- **Every PR that modifies packages must include a changeset**
- CI will block PRs without changesets when packages are modified
- Versions are automatically bumped and packages published on merge to main
- Follow semantic versioning:
  - `patch`: Bug fixes and minor improvements
  - `minor`: New features (backward compatible)
  - `major`: Breaking changes

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
type(scope): description

[optional body]

[optional footer]
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

**Note**: This software is provided "as is", without warranty of any kind. Use at your own risk.

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
