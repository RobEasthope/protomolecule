# @robeasthope/tsconfig

Shared TypeScript configurations for React and Node.js projects.

## 📦 Installation

This package is designed to be publishable to npm:

```bash
npm install --save-dev @robeasthope/tsconfig
# or
pnpm add -D @robeasthope/tsconfig
```

## 🚀 Usage

Extend from the appropriate configuration in your `tsconfig.json`:

### For React Applications

```json
{
  "extends": "@robeasthope/tsconfig/react.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### For Node.js Applications

```json
{
  "extends": "@robeasthope/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### For Libraries

```json
{
  "extends": "@robeasthope/tsconfig/library.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

## ✨ Available Configurations

| Config         | Use Case             | Key Features                   |
| -------------- | -------------------- | ------------------------------ |
| `base.json`    | Base configuration   | Strict mode, ES2022 target     |
| `react.json`   | React applications   | JSX support, DOM types         |
| `node.json`    | Node.js applications | Node types, CommonJS           |
| `library.json` | Published libraries  | Declaration files, source maps |

## 📝 Configuration Details

### Base Configuration

All configurations extend from `base.json` which includes:

- **Strict Mode**: All strict type-checking options enabled
- **ES2022 Target**: Modern JavaScript features
- **Module Resolution**: Node.js style resolution
- **Path Mapping**: Support for `@/` alias
- **Source Maps**: Enabled for debugging

### React Configuration

Adds React-specific settings:

- JSX Transform: React 19 automatic runtime
- DOM Types: Browser API types
- ES Modules: Modern module system

### Node Configuration

Optimized for server-side Node.js:

- Node Types: Node.js API types
- Module System: CommonJS or ESM
- Resolution: Node.js module resolution

### Library Configuration

For publishable packages:

- Declaration Files: `.d.ts` generation
- Declaration Maps: For "Go to Definition"
- Source Maps: For debugging

## 🛠️ Customization

You can override any compiler options:

```json
{
  "extends": "@robeasthope/tsconfig/react.json",
  "compilerOptions": {
    "target": "ES2023", // Override target
    "strict": false, // Disable strict mode (not recommended)
    "paths": {
      // Add custom paths
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Build TypeScript
pnpm build

# Clean build artifacts
pnpm clean
```

## 📁 Package Structure

```text
packages/tsconfig/
├── base.json       # Base configuration
├── react.json      # React applications
├── node.json       # Node.js applications
├── library.json    # Libraries
├── package.json
└── README.md
```

## 🎯 Best Practices

1. **Always extend** rather than copy configurations
2. **Keep overrides minimal** to maintain consistency
3. **Use strict mode** for better type safety
4. **Enable source maps** for debugging
5. **Configure paths** for cleaner imports

## 📄 License

MIT License - see [LICENSE](../../LICENSE) file in the root directory.

This software is provided "as is", without warranty of any kind. Use at your own risk.
