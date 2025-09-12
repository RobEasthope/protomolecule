---
"@protomolecule/eslint-config": patch
"@protomolecule/ui": patch
"@protomolecule/colours": patch
---

feat(ci): add descriptive PR titles for version releases

Improved the release workflow to generate more descriptive PR titles based on the packages being released and the types of changes included. PR titles now indicate:

- Which packages are being released
- The nature of changes (features, fixes, breaking changes)
- The number of packages when releasing many at once

This makes it easier to understand at a glance what each release PR contains without having to open it.
