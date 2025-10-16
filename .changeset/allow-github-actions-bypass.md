---
"@robeasthope/github-rulesets": patch
---

Allow GitHub Actions to bypass Protect production ruleset

Adds GitHub Actions (integration_id: 15368) as a bypass actor to allow CI/CD workflows to push version bump commits directly to the default branch during releases.

**What changed:**

- Add `bypass_actors` with GitHub Actions integration
- Enables automated release workflow to function
- Human developers still blocked from direct pushes

**Why this is needed:**
The `update` rule blocks ALL direct pushes to main, including automated CI/CD workflows. This change allows the release workflow (`changesets/action`) to push version bump commits while maintaining protection against manual developer pushes.

**Security:**

- Only workflows running from repository branches can bypass
- External forks cannot trigger bypass-enabled workflows
- `RELEASE_PAT` token still requires proper permissions
