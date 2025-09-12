---
"protomolecule": patch
---

fix(ci): add missing @changesets/get-github-info dependency

- Fixes release workflow failure caused by missing dependency
- Adds @changesets/get-github-info required by custom changelog config
- Adds tests to validate changelog configuration
- Adds dependency validation script to prevent future issues
- Adds validation step to release workflow for early detection
