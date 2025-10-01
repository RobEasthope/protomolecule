---
"@robeasthope/ui": patch
"@robeasthope/eslint-config": patch
"@robeasthope/colours": patch
"@robeasthope/github-rulesets": patch
"@robeasthope/tsconfig": patch
---

Update markdown linting to use markdownlint-cli2 configuration format. Migrated from separate .markdownlint.json and .markdownlintignore files to unified .markdownlint-cli2.jsonc files. Simplified lint:md scripts to use config file exclusively, adding MDX file support.
