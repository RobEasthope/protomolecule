# @protomolecule/infrastructure

Virtual package for tracking monorepo infrastructure and tooling changes.

## Purpose

This package exists solely to track version history of infrastructure changes that don't belong to a specific package. It has no actual code - it's a version tracking mechanism.

## When to Create Changesets for Infrastructure

Create changesets for `@protomolecule/infrastructure` when making changes to:

### CI/CD & Workflows

- `.github/workflows/` - GitHub Actions workflows
- `.github/actions/` - Custom GitHub Actions
- `.github/scripts/` - Release automation and CI scripts
- Release automation and deployment scripts

### Build & Tooling Configuration

- `turbo.json` - Turborepo configuration
- `pnpm-workspace.yaml` - Workspace configuration
- Root-level `package.json` scripts and dependencies
- ESLint, Prettier, TypeScript configs at root level

### Changesets & Release Tooling

- `.changeset/config.json` - Changesets configuration
- Release scripts and tooling

### Testing Infrastructure

- Root-level test configuration (Vitest, Playwright, etc.)
- Test utilities shared across packages
- CI test runners and coverage reporting

### Documentation (Infrastructure-focused)

- `CLAUDE.md` - Project instructions for AI assistants
- Development workflow documentation
- Contributing guides (when infrastructure-focused)

### Git Configuration

- `.gitignore`, `.gitattributes`
- Git hooks (`.husky/`)
- `lint-staged` configuration

### YAML & Linting

- `.yamllint.yml` - YAML linting configuration
- Markdownlint, ESLint, or other linter configurations at root level

## When NOT to Use Infrastructure

**Use the actual package instead** for:

- `@robeasthope/ui` - React component library changes
- `@robeasthope/eslint-config` - ESLint configuration package changes
- `@robeasthope/tsconfig` - TypeScript configuration changes
- `@robeasthope/colours` - Color system changes
- `@robeasthope/github-rulesets` - GitHub rulesets package changes
- `@robeasthope/markdownlint-config` - Markdownlint configuration package changes

## Creating Infrastructure Changesets

### Interactive Method

```bash
pnpm changeset
# When prompted, select @protomolecule/infrastructure
# Choose patch/minor/major based on change significance
```

### Manual Method

Create `.changeset/your-change-name.md`:

```markdown
---
"@protomolecule/infrastructure": patch
---

Description of infrastructure change
```

## Version Significance Guidelines

**Patch** (default for most infrastructure changes):

- Bug fixes in workflows
- Documentation updates
- Test improvements
- Minor config tweaks

**Minor**:

- New CI/CD workflows or jobs
- New development tooling
- Significant test infrastructure additions
- Breaking changes to development workflow (that don't affect production)

**Major**:

- Breaking changes to build system
- Node version updates
- Major tooling migrations (e.g., Jest → Vitest)
- Changes requiring developer environment updates

## Examples

### Patch Changes

```markdown
---
"@protomolecule/infrastructure": patch
---

Fix: GitHub Actions workflow now correctly handles release failures
```

### Minor Changes

```markdown
---
"@protomolecule/infrastructure": minor
---

Add: YAML linting with yamllint and actionlint in CI
```

### Major Changes

```markdown
---
"@protomolecule/infrastructure": major
---

BREAKING: Upgrade to Node 22, requires developers to update local environment
```

## Release Process

Infrastructure versions are released alongside other packages. The changelog for this package provides a historical record of infrastructure evolution.

## Related Documentation

- [Changesets Workflow](../CLAUDE.md#changeset-requirements)
- [Contributing Guide](../README.md)
