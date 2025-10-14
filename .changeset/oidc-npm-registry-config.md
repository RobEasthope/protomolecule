---
"@protomolecule/infrastructure": patch
---

Fix npm OIDC publishing by configuring registry before publish

Added npm registry configuration step before the changesets action to resolve ENEEDAUTH authentication errors when publishing with OIDC trusted publishers. The `.npmrc` file now explicitly sets the npm registry, allowing the `--provenance` flag to handle OIDC authentication automatically.
