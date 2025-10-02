---
"@robeasthope/github-rulesets": patch
---

Improve error diagnostics in ruleset scripts

Enhanced error handling in apply-rulesets.sh and update-rulesets.sh to provide better diagnostic information:

- Capture and display actual error messages from GitHub API failures
- Differentiate between "already exists" errors and other failures
- Show specific error details for JSON parsing errors, API errors, and network failures
- Maintain graceful handling of the "already exists" case with helpful suggestions
