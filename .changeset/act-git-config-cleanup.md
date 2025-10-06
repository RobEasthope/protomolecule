---
"@protomolecule/infrastructure": minor
---

Add automatic git config cleanup for act workflow testing

**Problem:**
The `act` tool (local GitHub Actions testing) sets local git config to simulate GitHub Actions:

- `user.name=github-actions[bot]`
- `user.email=github-actions[bot]@users.noreply.github.com`

This config persists after act finishes, causing subsequent commits to be incorrectly attributed to github-actions[bot] instead of the actual developer.

**Solution:**
Added multiple cleanup approaches with comprehensive documentation:

1. **Shell Wrapper (Recommended)** - Auto-cleanup function for `~/.zshrc` or `~/.bashrc`
2. **Cleanup Script** - `.github/scripts/act-cleanup.sh` for manual cleanup
3. **Manual Commands** - Direct git config commands for quick fixes

**Changes:**

- Added `.github/scripts/act-cleanup.sh` cleanup script with detailed comments
- Added "Git Config Cleanup" section to CLAUDE.md with three solutions
- Documented the problem, solutions, and verification steps

**Benefits:**

- ✅ Prevents commit attribution errors after act testing
- ✅ Multiple solutions for different workflows
- ✅ Clear documentation for team members
- ✅ Automatic cleanup with shell wrapper

Closes #253
