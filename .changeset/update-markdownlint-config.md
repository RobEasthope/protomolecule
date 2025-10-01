---
"@protomolecule/ui": patch
"@protomolecule/eslint-config": patch
"@protomolecule/colours": patch
"@protomolecule/github-rulesets": patch
"@protomolecule/tsconfig": patch
---

Update markdown linting to use markdownlint-cli2 configuration format. Migrated from separate .markdownlint.json and .markdownlintignore files to unified .markdownlint-cli2.jsonc files. Simplified lint:md scripts to use config file exclusively, adding MDX file support.
