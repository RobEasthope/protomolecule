---
"@robeasthope/eslint-config": minor
---

Add automatic CommonJS detection and Node.js environment

The ESLint config now automatically detects CommonJS files (`.js` and `.cjs`) and applies appropriate Node.js environment globals, treating them as scripts rather than ES modules.

**Features:**

- Automatically matches `**/*.js` and `**/*.cjs` files
- Sets `sourceType: "script"` for proper CommonJS parsing
- Provides Node.js globals (`require`, `module`, `exports`, `console`, `process`, etc.)
- Provides ES2021 globals
- Excludes `.mjs` files which are explicitly ES modules

**Use case:**

This enables CommonJS files in monorepos (like `.changeset/changelogFunctions.js`) to use `require()` and `module.exports` without ESLint errors about undefined globals.

**Dependencies:**

Added `globals` package (v15.18.0) for Node.js and ES global definitions.
