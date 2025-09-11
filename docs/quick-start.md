# Quick Start Guide

Welcome to Protomolecule! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **pnpm** 10.15.0 or higher

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/RobEasthope/protomolecule.git
cd protomolecule
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development

```bash
# Start Storybook for component development
pnpm dev
```

This will start Storybook on [http://localhost:6006](http://localhost:6006) where you can explore and develop components interactively.

## Using Published Packages

If you want to use the published packages in your own project:

### React Component Library

```bash
npm install @protomolecule/ui
# or
pnpm add @protomolecule/ui
```

```typescript
import { Box, Container, Type } from "@protomolecule/ui/components";
import { cn } from "@protomolecule/ui/utils";
```

### ESLint Configuration

```bash
npm install --save-dev @protomolecule/eslint-config
# or
pnpm add -D @protomolecule/eslint-config
```

```javascript
// eslint.config.js
import eslintConfig from "@protomolecule/eslint-config";

export default [
  ...eslintConfig,
  // your custom rules
];
```

### Colour System

```bash
npm install @protomolecule/colours
# or
pnpm add @protomolecule/colours
```

```css
@import "@protomolecule/colours";
```

## Next Steps

- **Explore Components**: Run `pnpm storybook` to see all available components
- **Read the Docs**: Check out our [development guide](./development.md) for detailed information
- **Contribute**: See our [contributing guide](./contributing.md) to help improve Protomolecule

## Common Commands

```bash
# Development
pnpm dev          # Start Storybook
pnpm test         # Run tests
pnpm lint         # Run linting

# Building
pnpm build        # Build all packages

# Code Quality
pnpm format       # Format code with Prettier
```

## Troubleshooting

### Installation Issues

If you encounter issues during installation:

1. Ensure you're using the correct Node.js version (20.x)
2. Clear the pnpm cache: `pnpm store prune`
3. Delete `node_modules` and reinstall: `pnpm clean && pnpm install`

### Port Conflicts

If port 6006 is already in use, Storybook will automatically try the next available port.

## Getting Help

- [GitHub Issues](https://github.com/RobEasthope/protomolecule/issues) - Report bugs or request features
- [Architecture Guide](./architecture.md) - Understand the project structure
- [CLAUDE.md](../CLAUDE.md) - AI assistant guidance for development
