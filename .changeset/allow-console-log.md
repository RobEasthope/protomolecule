---
"@robeasthope/eslint-config": minor
---

Allow console.log() in no-console ESLint rule

The no-console rule now allows console.log() alongside error, debug, and warn methods. This change enables legitimate use of console.log() in:

- GitHub Actions scripts for CI output visibility
- CLI tools for normal operation
- Utility scripts for progress reporting

The rule remains configured as a warning (not error), maintaining visibility while allowing practical usage.
