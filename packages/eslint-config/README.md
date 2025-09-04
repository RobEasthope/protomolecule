# @protomolecule/eslint-config

Shared ESLint configuration for Protomolecule projects.

## Installation

```bash
npm install --save-dev @protomolecule/eslint-config
```

## Usage

In your `.eslintrc.js` or `eslint.config.js`:

```javascript
module.exports = require("@protomolecule/eslint-config");
```

Or extend from it:

```javascript
module.exports = {
  extends: ["@protomolecule/eslint-config"],
  // your custom rules
};
```
