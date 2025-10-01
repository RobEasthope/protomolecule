---
"@robeasthope/eslint-config": patch
---

Improve Astro support by ignoring virtual imports (astro:*) instead of disabling import resolution entirely. The import/no-unresolved rule now uses a targeted regex pattern to allow Astro's virtual modules (astro:content, astro:assets, etc.) while still validating other imports in .astro files.
