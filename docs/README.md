# Protomolecule Documentation

Welcome to the Protomolecule documentation. This directory contains comprehensive guides for working with and maintaining the Protomolecule monorepo.

## 📚 Documentation Index

### Getting Started

- [**Quick Start**](./quick-start.md) - Get up and running quickly
- [**Development Guide**](./development.md) - Local development setup and workflow
- [**Architecture Overview**](./architecture.md) - System design and structure

### Contributing

- [**Contributing Guide**](./contributing.md) - How to contribute to the project
- [**Release Process**](./release-process.md) - Understanding the automated release workflow

### Release & Publishing

- [**RELEASE_PAT Setup Guide**](./RELEASE_PAT_SETUP.md) - Configure Personal Access Token for releases
- [**Manual GitHub Packages Publishing**](./GITHUB_PACKAGES_MANUAL_PUBLISH.md) - Manual publishing instructions
- [**Release Process**](./release-process.md) - Automated release workflow details

## 🚀 Quick Links

### For New Contributors

1. Start with the [Quick Start](./quick-start.md) guide
2. Set up your [Development Environment](./development.md)
3. Read the [Contributing Guide](./contributing.md)
4. Understand the [Architecture](./architecture.md)

### For Maintainers

1. Configure [RELEASE_PAT](./RELEASE_PAT_SETUP.md) for automated releases
2. Learn about the [Release Process](./release-process.md)
3. Manual publishing with [GitHub Packages Guide](./GITHUB_PACKAGES_MANUAL_PUBLISH.md)

## 📦 Package Documentation

Individual package documentation can be found in their respective directories:

- [`@protomolecule/ui`](../packages/ui/README.md) - React component library
- [`@protomolecule/eslint-config`](../packages/eslint-config/README.md) - Shared ESLint configuration
- [`@protomolecule/colours`](../packages/colours/README.md) - Radix UI color system
- [`@protomolecule/tsconfig`](../packages/tsconfig/README.md) - Shared TypeScript configurations
- [`@protomolecule/github-rulesets`](../packages/github-rulesets/README.md) - GitHub repository configuration

## 🔧 Workflow Documentation

GitHub Actions workflows are documented in their respective files:

- [Release Workflow](../.github/workflows/release.yml) - Continuous release pipeline
- [Linting & Testing](../.github/workflows/linting-and-testing.yml) - CI quality checks
- [Claude Code Review](../.github/workflows/claude-code-review.yml) - AI-powered code reviews

## 📝 Additional Resources

- [CLAUDE.md](../CLAUDE.md) - AI assistant guidelines for this repository
- [Changesets Documentation](https://github.com/changesets/changesets) - Version management system
- [Turborepo Documentation](https://turbo.build/repo/docs) - Monorepo build system
- [GitHub Packages Documentation](https://docs.github.com/en/packages) - Package registry

## 🤝 Getting Help

If you need help:

1. Check the relevant documentation above
2. Search [existing issues](https://github.com/RobEasthope/protomolecule/issues)
3. Open a [new issue](https://github.com/RobEasthope/protomolecule/issues/new) with your question
4. Review the [Discussions](https://github.com/RobEasthope/protomolecule/discussions) (if enabled)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
