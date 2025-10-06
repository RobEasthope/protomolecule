# @robeasthope/eslint-config

Shared ESLint v9 configuration with TypeScript and React support.

## 📦 Installation

Install the config along with required peer dependencies:

```bash
pnpm add -D @robeasthope/eslint-config \
  eslint-plugin-import-x \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  eslint-plugin-unicorn \
  eslint-plugin-prettier \
  eslint-plugin-promise \
  eslint-plugin-regexp \
  eslint-plugin-n \
  eslint-plugin-jsdoc \
  typescript-eslint

# Optional: Add Astro plugin if using Astro
pnpm add -D eslint-plugin-astro
```

> **Note:** pnpm will warn you if any required peer dependencies are missing during installation.

## 🚀 Usage

### ESLint v9 Flat Config

In your `eslint.config.js`:

```javascript
import eslintConfig from "@robeasthope/eslint-config";

export default [
  ...eslintConfig,
  // your custom rules
  {
    rules: {
      // override or add rules here
    },
  },
];
```

### Legacy Config (ESLint < v9)

In your `.eslintrc.js`:

```javascript
module.exports = {
  extends: ["@robeasthope/eslint-config"],
  // your custom rules
};
```

## ✨ Features

This configuration includes:

- **TypeScript Support**: Full TypeScript linting with type checking
- **React Support**: React and JSX best practices
- **Modern JavaScript**: ES2022+ features
- **Code Quality**: Enforces consistent code style
- **Accessibility**: Basic a11y checks for React components

## 📝 Rules Overview

### Included Plugins

- TypeScript ESLint rules
- React hooks rules
- Import ordering and resolution
- Best practices for modern JavaScript

### Key Rules

- Strict TypeScript checking
- React 19 compatible rules
- Consistent import ordering
- No unused variables or imports
- Consistent naming conventions

## 🛠️ Customization

### Override Rules

You can override any rules by adding them to your local config:

```javascript
export default [
  ...eslintConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // downgrade from error
      "react/prop-types": "off", // disable prop-types
    },
  },
];
```

### Using Re-exported Plugins

All plugins are re-exported for custom configurations in monorepo workspaces:

```javascript
import eslintConfig, {
  pluginReact,
  pluginImportX,
  pluginUnicorn,
  typescriptEslint,
} from "@robeasthope/eslint-config";

export default [
  ...eslintConfig,
  {
    plugins: {
      react: pluginReact,
    },
    rules: {
      "react/jsx-uses-react": "error",
    },
  },
];
```

**Available exports:**

- `pluginAstro` - Astro linting rules
- `pluginImportX` - Import/export ordering and resolution
- `pluginJsdoc` - JSDoc comment validation
- `pluginJsxA11y` - Accessibility rules for JSX
- `pluginN` - Node.js best practices
- `pluginPrettier` - Prettier integration
- `pluginPromise` - Promise best practices
- `pluginReact` - React rules
- `pluginReactHooks` - React Hooks rules
- `pluginRegexp` - Regular expression best practices
- `pluginUnicorn` - Code quality improvements
- `typescriptEslint` - TypeScript ESLint utilities

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Run linting on this package
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## 📄 License

MIT License - see [LICENSE](../../LICENSE) file in the root directory.

This software is provided "as is", without warranty of any kind. Use at your own risk.
