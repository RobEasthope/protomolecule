---
"@robeasthope/ui": major
"@robeasthope/eslint-config": major
"@robeasthope/colours": major
---

BREAKING CHANGE: Migrate package namespace from @protomolecule to @robeasthope

All packages have been renamed to use the @robeasthope namespace for GitHub Packages compatibility:

- @protomolecule/ui → @robeasthope/ui
- @protomolecule/eslint-config → @robeasthope/eslint-config
- @protomolecule/colours → @robeasthope/colours

Migration guide:

1. Update package.json dependencies from @protomolecule/*to @robeasthope/*
2. Update any imports from @protomolecule/*to @robeasthope/*
3. Clear node_modules and reinstall dependencies
