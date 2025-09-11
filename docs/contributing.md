# Contributing Guide

Thank you for your interest in contributing to Protomolecule! This guide will help you get started with contributing to this open-source monorepo.

## Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Accept feedback gracefully
- Put the project's best interests first

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Node.js 20.x or higher**
2. **pnpm 10.15.0 or higher**
3. **Git** configured with your GitHub account
4. **A fork** of the repository

### Setting Up Your Fork

1. **Fork the repository**
   - Go to [GitHub repository](https://github.com/RobEasthope/protomolecule)
   - Click the "Fork" button in the top right
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR_USERNAME/protomolecule.git
     cd protomolecule
     ```

2. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/RobEasthope/protomolecule.git
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### 1. Keep Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your branch
git checkout main
git merge upstream/main
git push origin main

# Rebase your feature branch
git checkout feature/your-feature-name
git rebase main
```

### 2. Make Your Changes

Follow these guidelines:

- Write clean, readable code
- Follow existing patterns and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Commit Your Changes

#### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Commit Types

| Type       | Description                                       | Version Bump |
| ---------- | ------------------------------------------------- | ------------ |
| `feat`     | New feature for the user                          | MINOR        |
| `fix`      | Bug fix for the user                              | PATCH        |
| `docs`     | Documentation only changes                        | None         |
| `style`    | Code style changes (formatting, semicolons, etc)  | None         |
| `refactor` | Code refactoring without feature changes          | None         |
| `perf`     | Performance improvements                          | PATCH        |
| `test`     | Adding or updating tests                          | None         |
| `build`    | Changes to build system or dependencies           | None         |
| `ci`       | CI/CD configuration changes                       | None         |
| `chore`    | Other changes that don't modify src or test files | None         |

#### Breaking Changes

For breaking changes, add `!` after the type:

```bash
feat!: migrate to new API structure

BREAKING CHANGE: The API structure has changed...
```

#### Examples

```bash
# Feature
git commit -m "feat(ui): add new Card component with hover effects"

# Bug fix
git commit -m "fix(eslint-config): resolve TypeScript v5 parsing error"

# Documentation
git commit -m "docs: update contributing guide with examples"

# Breaking change
git commit -m "feat(ui)!: change Button API to use variant prop"
```

### 4. Add a Changeset

**Every PR that modifies packages must include a changeset:**

```bash
# Run the changeset CLI
pnpm changeset
```

This will prompt you to:

1. Select the packages you've changed
2. Choose the version bump type (patch/minor/major)
3. Write a summary for the changelog

Example changeset file (`.changeset/fluffy-pandas-dance.md`):

```markdown
---
"@protomolecule/ui": minor
"@protomolecule/eslint-config": patch
---

feat(ui): add new Card component with animations

fix(eslint-config): update TypeScript parser configuration
```

**Important:** Never include the root package `"protomolecule"` in changesets. Only scoped packages (`@protomolecule/*`) should be versioned.

### 5. Run Quality Checks

Before pushing, ensure your code passes all checks:

```bash
# Run tests
pnpm test

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Type checking
pnpm build
```

### 6. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template:
   - Clear title following conventional commits
   - Description of changes
   - Link to related issues
   - Screenshots for UI changes
4. Submit the PR

## Pull Request Guidelines

### PR Title Format

PR titles should follow conventional commits:

```text
feat(ui): add loading state to Button component
fix(colours): correct dark mode variable names
docs: improve installation instructions
```

### PR Description Template

```markdown
## Description

Brief description of what this PR does

## Type of Change

- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] Added new tests for changes
- [ ] Existing tests updated

## Checklist

- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Changeset added (if packages modified)

## Screenshots (if applicable)

Add screenshots for UI changes

## Related Issues

Closes #123
```

### Review Process

1. **Automated checks** run on every PR:
   - Linting
   - Tests
   - Type checking
   - Changeset verification

2. **Code review** by maintainers:
   - Code quality
   - Adherence to patterns
   - Test coverage
   - Documentation

3. **Feedback incorporation**:
   - Address review comments
   - Update code as requested
   - Re-request review when ready

## Types of Contributions

### Bug Reports

Submit bug reports via [GitHub Issues](https://github.com/RobEasthope/protomolecule/issues):

1. Search existing issues first
2. Use the bug report template
3. Include:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behaviour
   - Environment details
   - Screenshots/error messages

### Feature Requests

Submit feature requests via GitHub Issues:

1. Search existing requests
2. Describe the problem it solves
3. Propose implementation approach
4. Consider breaking changes

### Code Contributions

#### Good First Issues

Look for issues labelled `good first issue`:

- Simple bug fixes
- Documentation improvements
- Test additions
- Small feature additions

#### Component Contributions

When adding new components:

1. Create component with tests and stories
2. Follow existing patterns
3. Add Sanity schema if applicable
4. Update documentation
5. Ensure accessibility

#### Documentation Contributions

Help improve documentation:

- Fix typos and grammar
- Add examples
- Clarify confusing sections
- Translate documentation
- Add diagrams

### Package-Specific Guidelines

#### UI Package

- Components must be accessible
- Include comprehensive Storybook stories
- Follow React best practices
- Support both Next.js and React Router

#### ESLint Config Package

- Test with various project types
- Document rule reasoning
- Maintain backward compatibility

#### Colours Package

- Follow Radix UI patterns
- Test dark mode support
- Document colour usage

## Testing Guidelines

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component>Test</Component>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    // Test user interactions
  });

  it('should be accessible', () => {
    // Test accessibility
  });
});
```

### Test Coverage

- Aim for 80%+ coverage
- Test edge cases
- Test error states
- Test accessibility

## Release Process

Releases are automated via GitHub Actions:

1. **Changesets** create version PRs
2. **Merge** triggers automatic release
3. **NPM** packages published automatically
4. **GitHub Releases** created with summaries

Maintainers handle the release process, but contributors should:

- Include changesets with PRs
- Follow semantic versioning
- Document breaking changes

## Getting Help

### Resources

- [Development Guide](./development.md) - Detailed development instructions
- [Architecture Guide](./architecture.md) - System design and patterns
- [Quick Start](./quick-start.md) - Getting started quickly

### Communication

- **GitHub Issues** - Bug reports and features
- **GitHub Discussions** - Questions and ideas
- **Pull Requests** - Code contributions

## Recognition

Contributors are recognised in:

- GitHub contributors page
- Release notes
- Special mentions for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Protomolecule! 🚀
