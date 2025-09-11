---
"@protomolecule/ui": minor
"@protomolecule/colours": minor
---

feat: configure UI and colours packages for NPM publishing

- Removed private flag from @protomolecule/ui package to enable NPM publishing
- Removed private flag from @protomolecule/colours package to enable NPM publishing
- Added publishConfig with public access for both packages
- Added proper build process for UI package using Vite
- Configured package.json with correct exports and build outputs
- Updated release workflow to verify build outputs for new public packages
- Updated documentation to reflect newly published packages

Both packages are now available on NPM:

- @protomolecule/ui - React component library with Storybook
- @protomolecule/colours - Radix UI color system CSS imports
