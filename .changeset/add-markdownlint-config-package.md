---
"@robeasthope/markdownlint-config": minor
---

feat(markdownlint-config): add shareable markdownlint configuration package

- Created new `@robeasthope/markdownlint-config` package for consistent Markdown formatting
- Extracted configuration from root `.markdownlint-cli2.jsonc`
- Updated root and all package configs to extend from the new shared package
- Provides sensible defaults with flexibility for documentation needs
