# Protomolecule

[![CI](https://github.com/RobEasthope/protomolecule/actions/workflows/linting-and-testing.yml/badge.svg)](https://github.com/RobEasthope/protomolecule/actions/workflows/linting-and-testing.yml)
[![Release](https://github.com/RobEasthope/protomolecule/actions/workflows/release.yml/badge.svg)](https://github.com/RobEasthope/protomolecule/actions/workflows/release.yml)

[![UI Components](https://img.shields.io/npm/v/@robeasthope/ui.svg?label=ui)](https://www.npmjs.com/package/@robeasthope/ui)
[![ESLint Config](https://img.shields.io/npm/v/@robeasthope/eslint-config.svg?label=eslint-config)](https://www.npmjs.com/package/@robeasthope/eslint-config)
[![Colours](https://img.shields.io/npm/v/@robeasthope/colours.svg?label=colours)](https://www.npmjs.com/package/@robeasthope/colours)

A modern, open-source React component library monorepo built with TypeScript, Storybook, and Tailwind CSS v4.

> **Package Namespace**: All packages are published under the `@robeasthope/*` namespace for npm and GitHub Packages compatibility.
>
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

- [**RELEASE_PAT Setup Guide**](./docs/release-pat-setup.md) - Configure GitHub Personal Access Token
- [**NPM Token Setup Guide**](./docs/npm-token-setup.md) - Configure NPM publishing token

### Package Documentation

- [**UI Components**](./packages/ui/README.md) - React component library with Storybook
- [**ESLint Config**](./packages/eslint-config/README.md) - Shared ESLint configuration
- [**Colours**](./packages/colours/README.md) - Radix UI colour system
- [**TypeScript Config**](./packages/tsconfig/README.md) - Shared TypeScript configurations
- [**GitHub Rulesets**](./packages/github-rulesets/README.md) - Repository configuration

### Quick Links for Maintainers

1. Configure [RELEASE_PAT](./docs/release-pat-setup.md) for automated releases
2. Learn about the [Release Process](./docs/release-process.md)

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

| Package                                                      | Description                            | Version | Status  |
| ------------------------------------------------------------ | -------------------------------------- | ------- | ------- |
| [`@robeasthope/ui`](./packages/ui)                           | React component library with Storybook | 3.0.2   | **NPM** |
| [`@robeasthope/eslint-config`](./packages/eslint-config)     | Shared ESLint configuration            | 2.1.3   | **NPM** |
| [`@robeasthope/colours`](./packages/colours)                 | Radix UI colour system                 | 2.1.4   | **NPM** |
| [`@robeasthope/tsconfig`](./packages/tsconfig)               | Shared TypeScript configurations       | 2.0.0   | Private |
| [`@robeasthope/github-rulesets`](./packages/github-rulesets) | GitHub repository configuration        | 2.0.0   | Private |

### Installing Published Packages

#### From npm (Recommended - No Authentication Required)

All packages are published to npm and install without any configuration:

```bash
# React component library
npm install @robeasthope/ui

# ESLint configuration
npm install --save-dev @robeasthope/eslint-config

# Colour system
npm install @robeasthope/colours
```

**No setup needed** - packages install from npm by default.

#### From GitHub Packages (Optional Backup)

Packages are also available on GitHub Packages as a backup registry. This requires authentication:

1. Create a GitHub Personal Access Token with `read:packages` scope
2. Configure npm (in project `.npmrc` or global `~/.npmrc`):
   ```bash
   echo "@robeasthope:registry=https://npm.pkg.github.com" >> .npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> .npmrc
   ```

**Note:** Most users should use npm installation (above). GitHub Packages is provided as an optional backup. See [GitHub's documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) for more details.

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

## 🧪 Testing Workflows Locally

The project uses [Act](https://github.com/nektos/act) to run GitHub Actions workflows locally. This enables faster iteration and debugging without requiring push/PR cycles.

### Prerequisites

- **Docker Desktop** must be running
- **Act** installed via Homebrew: `brew install act`
- **Configuration**: Copy `.actrc.example` to `.actrc` for local settings

### Quick Start

```bash
# Copy example configuration
cp .actrc.example .actrc

# List all available workflows
act -l

# Test CI workflow (dry run)
act pull_request -W .github/workflows/linting-and-testing.yml -n

# Run push event workflows
act push

# Run specific job
act -j build

# Verbose output for debugging
act push --verbose
```

### Common Workflows

```bash
# Test linting and testing workflow
act pull_request -W .github/workflows/linting-and-testing.yml

# Test release workflow
act push -W .github/workflows/release.yml

# Run with secrets (interactive prompt)
act -s GITHUB_TOKEN
```

### Important Notes

- **First run downloads Docker images** (~500MB) - subsequent runs are much faster
- **Secrets** need to be provided via `-s` flag or `.secrets` file (git-ignored)
- **Not 100% identical** to GitHub Actions - some features may behave slightly differently

### Troubleshooting

| Issue                               | Solution                                                            |
| ----------------------------------- | ------------------------------------------------------------------- |
| "Cannot connect to Docker daemon"   | Ensure Docker Desktop is running                                    |
| Workflow fails with missing secrets | Pass secrets via `-s GITHUB_TOKEN` or create `.secrets` file        |
| "No workflows detected"             | Specify workflow file: `act -W .github/workflows/workflow-name.yml` |
| First run is very slow              | Expected - downloading Docker images (~500MB)                       |

For more information, see the [Act documentation](https://nektosact.com/usage/index.html).

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
- [npm Packages](https://www.npmjs.com/~robeasthope) - Published under `@robeasthope/*` namespace
- [GitHub Packages](https://github.com/RobEasthope?tab=packages) - Backup registry (requires authentication)
- [Storybook](http://localhost:6006) (when running locally)

---

Built with ❤️ using modern web technologies
