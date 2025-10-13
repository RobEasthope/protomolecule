---
"@robeasthope/eslint-config": minor
---

Add CommonJS support for .cjs files

The ESLint config now properly handles `.cjs` files, treating them as CommonJS scripts with appropriate Node.js environment globals.

**Features:**

- Automatically matches `**/*.cjs` files
- Sets `sourceType: "script"` for proper CommonJS parsing
- Provides Node.js globals (`require`, `module`, `exports`, `console`, `process`, etc.)
- Provides ES2021 globals

**Use case:**

This enables `.cjs` files (CommonJS by convention) to use `require()` and `module.exports` without ESLint parsing errors. Note that `.js` files are treated as ES modules by default, matching modern Node.js behavior.

**Dependencies:**

Added `globals` package (v15.18.0) for Node.js and ES global definitions.
