# @robeasthope/eslint-config

Shared ESLint v9 configuration with TypeScript and React support.

## 📦 Installation

This package is designed to be publishable to npm:

```bash
npm install --save-dev @robeasthope/eslint-config
# or
pnpm add -D @robeasthope/eslint-config
```

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
