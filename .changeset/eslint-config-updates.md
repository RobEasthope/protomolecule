---
"@protomolecule/eslint-config": patch
---

fix: update ESLint rules for better compatibility

- Changed no-console from error to warning to allow debugging
- Added avoidEscape option to quotes rule to prevent circular fixes
- Disabled canonical/filename-match-regex rule for more flexible naming
