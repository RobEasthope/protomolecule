# Protomolecule

[![CI](https://github.com/RobEasthope/protomolecule/actions/workflows/linting-and-testing.yml/badge.svg)](https://github.com/RobEasthope/protomolecule/actions/workflows/linting-and-testing.yml)
[![Release](https://github.com/RobEasthope/protomolecule/actions/workflows/release.yml/badge.svg)](https://github.com/RobEasthope/protomolecule/actions/workflows/release.yml)

[![UI Components](https://img.shields.io/npm/v/@protomolecule/ui.svg?label=ui)](https://www.npmjs.com/package/@protomolecule/ui)
[![ESLint Config](https://img.shields.io/npm/v/@protomolecule/eslint-config.svg?label=eslint-config)](https://www.npmjs.com/package/@protomolecule/eslint-config)
[![Colours](https://img.shields.io/npm/v/@protomolecule/colours.svg?label=colours)](https://www.npmjs.com/package/@protomolecule/colours)

A modern, open-source React component library monorepo built with TypeScript, Storybook, and Tailwind CSS v4.

> **Open Source**: This project is open source and free to use. Feel free to fork, modify, and use in your own projects at your own risk.

## 📚 Documentation

### Getting Started

- [**Quick Start Guide**](./docs/quick-start.md) - Get up and running in minutes
- [**Development Guide**](./docs/development.md) - Comprehensive development instructions
- [**Architecture Overview**](./docs/architecture.md) - System design and technical decisions

### Contributing

- [**Contributing Guide**](./docs/contributing.md) - How to contribute to the project
- [**Release Process**](./docs/release-process.md) - Understanding our automated releases

### Release & Publishing

- [**RELEASE_PAT Setup Guide**](./docs/release-pat-setup.md) - Configure Personal Access Token for releases
- [**Manual GitHub Packages Publishing**](./docs/github-packages-manual-publish.md) - Manual publishing instructions

### Package Documentation

- [**UI Components**](./packages/ui/README.md) - React component library with Storybook
- [**ESLint Config**](./packages/eslint-config/README.md) - Shared ESLint configuration
- [**Colours**](./packages/colours/README.md) - Radix UI colour system
- [**TypeScript Config**](./packages/tsconfig/README.md) - Shared TypeScript configurations
- [**GitHub Rulesets**](./packages/github-rulesets/README.md) - Repository configuration

### Quick Links for Maintainers

1. Configure [RELEASE_PAT](./docs/release-pat-setup.md) for automated releases
2. Learn about the [Release Process](./docs/release-process.md)
3. Manual publishing with [GitHub Packages Guide](./docs/github-packages-manual-publish.md)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/RobEasthope/protomolecule.git
cd protomolecule

# Install dependencies
pnpm install

# Start development (Storybook)
pnpm dev
```

Visit [http://localhost:6006](http://localhost:6006) to see the component library in action.

## 📦 Packages

This monorepo contains the following packages:

| Package                                                        | Description                            | Version | Status  |
| -------------------------------------------------------------- | -------------------------------------- | ------- | ------- |
| [`@protomolecule/ui`](./packages/ui)                           | React component library with Storybook | 3.0.2   | **NPM** |
| [`@protomolecule/eslint-config`](./packages/eslint-config)     | Shared ESLint configuration            | 2.1.3   | **NPM** |
| [`@protomolecule/colours`](./packages/colours)                 | Radix UI colour system                 | 2.1.4   | **NPM** |
| [`@protomolecule/tsconfig`](./packages/tsconfig)               | Shared TypeScript configurations       | 2.0.0   | Private |
| [`@protomolecule/github-rulesets`](./packages/github-rulesets) | GitHub repository configuration        | 2.0.0   | Private |

### Installing Published Packages

```bash
# React component library
npm install @protomolecule/ui

# ESLint configuration
npm install --save-dev @protomolecule/eslint-config

# Colour system
npm install @protomolecule/colours
```

## 🛠️ Available Scripts

All commands run from the monorepo root:

| Command       | Description                        |
| ------------- | ---------------------------------- |
| `pnpm dev`    | Start Storybook development server |
| `pnpm build`  | Build all packages                 |
| `pnpm test`   | Run all tests                      |
| `pnpm lint`   | Run ESLint across all packages     |
| `pnpm format` | Format code with Prettier          |

See the [Development Guide](./docs/development.md) for a complete list of available scripts.

## 🏗️ Tech Stack

- **Monorepo**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Framework**: [React 19](https://react.dev/) with [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Storybook v9](https://storybook.js.org/)
- **Testing**: [Vitest](https://vitest.dev/)
- **CI/CD**: GitHub Actions with [Changesets](https://github.com/changesets/changesets)

See the [Architecture Guide](./docs/architecture.md) for detailed technical information.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details on:

- Setting up your development environment
- Our development workflow
- Commit conventions
- Creating pull requests
- Adding changesets for version management

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

**Note**: This software is provided "as is", without warranty of any kind. Use at your own risk.

## 🔗 Links

- [GitHub Repository](https://github.com/RobEasthope/protomolecule)
- [NPM Organisation](https://www.npmjs.com/org/protomolecule)
- [Storybook](http://localhost:6006) (when running locally)

---

Built with ❤️ using modern web technologies
