---
"@robeasthope/github-rulesets": minor
---

Add comprehensive branch protection rules and automation scripts

- Enhanced production ruleset with pull request reviews, status checks, and linear history enforcement
- Added apply-rulesets.sh script to create rulesets in repositories via GitHub CLI
- Added update-rulesets.sh script to update existing rulesets by name matching
- Updated README with script usage examples and multi-repo sync strategies
- Removed repo-specific fields from ruleset JSON for true portability across repositories
