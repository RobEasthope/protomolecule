---
"@protomolecule/ui": patch
"@protomolecule/eslint-config": patch
"@protomolecule/colours": patch
---

Configure GitHub Packages with personal namespace and add individual publish scripts

- Updated all GitHub Packages configuration to use personal namespace (RobEasthope) instead of organization
- Fixed manual publish script hanging issue by redirecting stdin from /dev/null
- Added individual publish scripts for each package for more granular control
- Improved error detection and reporting in publish scripts
- Scripts now automatically load .env file for convenience
- Updated documentation to explain personal namespace setup
