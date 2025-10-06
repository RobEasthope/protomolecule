---
"@protomolecule/infrastructure": patch
---

Rename infrastructure package from @robeasthope/infrastructure to @protomolecule/infrastructure

The `@robeasthope/*` namespace is reserved for packages published to npm. Since the infrastructure package is a virtual package (never published), it makes more sense to use the monorepo name `@protomolecule/*` to avoid confusion.

This is a virtual package used only for version tracking - no code changes required.
