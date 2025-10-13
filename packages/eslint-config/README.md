# @robeasthope/eslint-config

Shared ESLint v9 configuration with TypeScript and React support.

## 📦 Installation

Install the config along with ESLint:

```bash
pnpm add -D @robeasthope/eslint-config eslint
```

That's it! All ESLint plugins are bundled as dependencies, so you don't need to install them separately.

### Migrating from v4.x

If you're upgrading from v4.x, you can remove the plugin dependencies:

```bash
# Update to v5.0.0
pnpm update @robeasthope/eslint-config@5.0.0

# Remove plugin dependencies (now bundled)
pnpm remove astro-eslint-parser eslint-plugin-import-x \
  eslint-plugin-jsdoc eslint-plugin-jsx-a11y eslint-plugin-n \
  eslint-plugin-prettier eslint-plugin-promise eslint-plugin-react \
  eslint-plugin-react-hooks eslint-plugin-regexp eslint-plugin-unicorn \
  typescript-eslint
```

## 🚀 Usage

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

> **Note:** This config requires ESLint v9+ with flat config. For older ESLint versions, use `@robeasthope/eslint-config@4.x`.

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

### Custom Plugin Configuration

If you need to configure plugins directly, install them separately:

```javascript
import eslintConfig from "@robeasthope/eslint-config";
import pluginReact from "eslint-plugin-react";

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
