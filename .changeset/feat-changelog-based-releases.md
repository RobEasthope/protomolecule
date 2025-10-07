---
"@protomolecule/infrastructure": minor
---

Replace AI-generated release summaries with CHANGELOG-based extraction

**Problem:**
The current release workflow uses GitHub Models API to generate AI summaries, which causes multiple issues:

- ❌ **Rate limits:** 150 requests/day limit
- ❌ **Complex permissions:** Requires `id-token: write` permission
- ❌ **Token usage:** Unnecessary AI token consumption
- ❌ **Re-writing existing content:** CHANGELOGs already contain all the information
- ❌ **Missing links:** AI summaries don't preserve PR/commit links from changesets

**Solution:**
Rewrote `generate-summary.ts` to extract release notes directly from package CHANGELOG.md files that changesets automatically generates.

**Implementation:**

1. **New Functions:**
   - `findChangelogPath()` - Locates package CHANGELOGs in packages/, apps/, infrastructure/
   - `extractChangelogSection()` - Extracts version-specific content using regex
   - `generateChangelogBasedSummary()` - Combines all package sections
   - Maintains same input/output interface for workflow compatibility

2. **Workflow Updates:**
   - Removed `GITHUB_TOKEN` env var from generate-summary step
   - Removed `USED_AI` file check
   - Updated comments to reflect CHANGELOG-based approach

3. **Comprehensive Tests:**
   - 22 tests covering all functions (84 total tests across all scripts)
   - Tests for CHANGELOG path discovery
   - Tests for version section extraction
   - Tests for multi-line content and markdown link preservation
   - Tests for fallback behavior

**Benefits:**

- ✅ **Zero rate limits** - No API calls
- ✅ **Zero tokens** - No AI usage
- ✅ **Faster execution** - Direct file reads vs API calls
- ✅ **More accurate** - Uses exact changeset content with PR/commit links preserved
- ✅ **Simpler maintenance** - No API key management or permission configuration
- ✅ **Better formatting** - Preserves markdown links: [`abc123`](url) and [#42](url)

**Example Output:**
```markdown
## Workspace Updates

* @robeasthope/eslint-config@4.1.0
* @protomolecule/infrastructure@2.1.0

## 4.1.0

### Minor Changes

- [`7d563c1`](https://github.com/RobEasthope/protomolecule/commit/...) [#266](https://github.com/RobEasthope/protomolecule/pull/266) - Add common import ignore patterns...

## 2.1.0

### Minor Changes

- [`abc1234`](https://github.com/RobEasthope/protomolecule/commit/...) - Update build configuration...
```

Closes #269
