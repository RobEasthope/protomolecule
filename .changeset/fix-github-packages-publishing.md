---
"@protomolecule/ui": patch
"@protomolecule/eslint-config": patch
"@protomolecule/colours": patch
---

fix(ci): comprehensive fix for GitHub Packages publishing failures

- Fixed workspace directory reference issue that caused cd command failures
- Added retry mechanism with exponential backoff for transient failures
- Implemented package existence check before attempting to publish
- Improved error handling with specific error detection patterns
- Added detailed logging and debugging output for troubleshooting
- Created separate npmrc configuration to avoid conflicts with NPM registry
- Used file-based result tracking to work around bash array limitations in pipelines
- Added comprehensive summary reporting with success/skip/failure counts
- Created test script for local validation of publishing logic
