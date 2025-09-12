---
"protomolecule": patch
---

feat: add ESLint and TypeScript configuration for root files

- Add ESLint configuration for root directory using shared config
- Add TypeScript configuration for root directory
- Add lint:root and lint:root:fix scripts for linting root files  
- Add format:root script for formatting root files
- Add typecheck script for TypeScript checking
- Update lint-staged to include root file linting
- Update CI workflow to run root linting and type checking
- Add necessary dependencies (eslint, typescript, prettier, @typescript-eslint)
