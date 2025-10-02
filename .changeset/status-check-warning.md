---
"@robeasthope/github-rulesets": patch
---

Add warning about customizing status check names before applying rulesets

Added prominent warning section to README explaining that hardcoded status check names (Lint, Build, Test, Changeset Check) must match GitHub Actions workflow job names exactly. Includes instructions for both updating the ruleset JSON and updating workflows to match.
