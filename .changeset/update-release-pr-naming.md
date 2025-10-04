---
"@robeasthope/infrastructure": patch
---

Update release PR naming to use "release:" prefix instead of "chore:"

- Changed PR title from "chore: version packages" to "release: @robeasthope/package-name,..."
- Added PR title enhancement step that extracts package names from PR body
- Removed obsolete get-release-title.ts script
- Aligned with hecate repo release workflow pattern
