---
"@robeasthope/ui": patch
"@robeasthope/eslint-config": patch
"@robeasthope/colours": patch
---

Fix initial GitHub Packages publish script to not modify global .npmrc

**Problem:** The initial publish script was modifying `~/.npmrc` with a scope-level registry override (`@robeasthope:registry=https://npm.pkg.github.com`), causing all `@robeasthope/*` packages to resolve from GitHub Packages instead of npm. This required authentication and broke CI in other repositories.

**Solution:**

- Initial publish now uses temporary `.npmrc` (automatically cleaned up)
- No modification of user's global `~/.npmrc`
- Dual publishing continues to work (npm + GitHub Packages)
- Added cleanup script for affected users: `scripts/cleanup-npmrc.ts`
- Added verification check to warn about existing scope overrides

**Migration:** If you previously ran the initial publish script, run the cleanup script to restore normal npm behavior:
```bash
pnpm tsx scripts/cleanup-npmrc.ts
```

**Impact:** Packages now install from npm by default (no authentication required). GitHub Packages remains available as an explicit opt-in backup registry.

Fixes #226
