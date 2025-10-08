---
"@protomolecule/infrastructure": patch
---

Remove automatic Claude Code Review workflow to reduce CI time

**Problem:**
The `claude-code-review.yml` workflow runs automatically on every PR (opened, synchronize), which:

- Takes significant time to complete
- Can slow down PR feedback loops
- Is especially slow on busy PRs with many changes

**Solution:**
Removed the automatic workflow while keeping the `@claude` mention-based workflow (`claude.yml`).

**Changes:**

- Deleted `.github/workflows/claude-code-review.yml`
- Kept `.github/workflows/claude.yml` for on-demand reviews

**Usage Going Forward:**

- **CLI**: Run `claude code` locally for code reviews
- **PR Comments**: Tag `@claude` in a PR comment to trigger an on-demand review
- **Issue Comments**: Tag `@claude` in issue comments to get assistance

**Benefits:**

- ✅ **Faster CI** - No automatic review blocking PR workflows
- ✅ **On-demand reviews** - Use `@claude` when needed in PR comments
- ✅ **Local reviews** - Run `claude code` from CLI for immediate feedback
- ✅ **More control** - Choose when to get Claude's input vs. automated every time

Closes #273
