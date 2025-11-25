---
"@robeasthope/eslint-config": patch
---

Fix ESLint ignore patterns to use recursive globs, preventing massive performance issues

**Problem:** Ignore patterns used single asterisk (`*`) instead of double asterisk (`**`), causing ESLint to lint hundreds of build output files instead of ignoring them recursively. This caused lint times to go from ~6 seconds to minutes or hanging.

**Changes:**

- Changed `**/.vscode/*` → `**/.vscode/**` (and 7 other directory patterns)
- Added `**/.wrangler/**` for Cloudflare Wrangler state directory

**Impact:** ESLint will now properly ignore nested build outputs, dramatically improving lint performance when build artifacts exist.

Fixes #355
