# @robeasthope/github-rulesets

GitHub repository configuration and rulesets ensuring consistent branch protection and workflow standards.

## 📦 Package Details

This is a private package containing GitHub repository configuration files that can be imported to maintain consistent settings across repositories.

## 🚀 Usage

### Importing Rulesets

These rulesets can be imported into your GitHub repository settings to enforce consistent branch protection rules and workflows.

### Available Rulesets

| Ruleset                           | Purpose                      | Protected Branches             |
| --------------------------------- | ---------------------------- | ------------------------------ |
| `Protect production ruleset.json` | Production branch protection | `main`, `master`, `production` |

## 📝 Ruleset Features

### Production Protection Rules

The production ruleset enforces:

- **Required Reviews**: 1 approval required before merging
- **Dismiss Stale Reviews**: Previous approvals dismissed when new commits pushed
- **Required Thread Resolution**: All PR conversation threads must be resolved
- **Required Status Checks**: All CI/CD checks must pass (Lint, Build, Test, Changeset Check)
- **Up-to-date Branches**: Branches must be up to date with base branch before merging
- **No Force Pushes**: Prevents history rewriting on protected branches
- **No Deletions**: Protected branches cannot be deleted
- **Linear History**: Enforces merge commits or rebase, no merge bubbles

## 🛠️ How to Apply Rulesets

### Via Scripts (Recommended)

This package includes helper scripts to apply and update rulesets across repositories.

**Apply rulesets to a new repository:**

```bash
# Apply all rulesets
./scripts/apply-rulesets.sh OWNER REPO --all

# Apply specific ruleset
./scripts/apply-rulesets.sh OWNER REPO "Protect production ruleset.json"

# Example
./scripts/apply-rulesets.sh RobEasthope my-new-repo --all
```

**Update existing rulesets in a repository:**

```bash
# Automatically matches rulesets by name and updates them
./scripts/update-rulesets.sh OWNER REPO

# Example
./scripts/update-rulesets.sh RobEasthope protomolecule
```

**Prerequisites:**

- GitHub CLI (`gh`) installed and authenticated
- Repository admin access

### Via GitHub UI

1. Navigate to your repository's **Settings**
2. Go to **Rules** > **Rulesets**
3. Click **"New ruleset"** > **"Import"**
4. Select the JSON file from `rulesets/` directory
5. Review and adjust settings as needed
6. Click **"Create"** to apply

### Via GitHub CLI (Manual)

```bash
# Create ruleset in a repository
gh api repos/OWNER/REPO/rulesets \
  --method POST \
  --input "rulesets/Protect production ruleset.json"

# Update existing ruleset (get ID from repo settings)
gh api repos/OWNER/REPO/rulesets/RULESET_ID \
  --method PUT \
  --input "rulesets/Protect production ruleset.json"
```

### Via GitHub API

```javascript
const ruleset = require("@robeasthope/github-rulesets/Protect production ruleset.json");

await octokit.repos.createRepoRuleset({
  owner: "your-org",
  repo: "your-repo",
  ...ruleset,
});
```

## 🔧 Customization

### Modifying Rulesets

1. Copy the ruleset JSON file
2. Modify the rules as needed:

   ```json
   {
     "name": "Custom Protection",
     "target": "branch",
     "enforcement": "active",
     "conditions": {
       "ref_name": {
         "include": ["refs/heads/main"],
         "exclude": []
       }
     },
     "rules": [
       // Customize rules here
     ]
   }
   ```

3. Import the modified ruleset

### Common Customizations

- **Different branch names**: Update `conditions.ref_name.include` (use `~DEFAULT_BRANCH` for main branch)
- **Review requirements**: Modify `required_approving_review_count` in the `pull_request` rule
- **Status checks**: Update `required_status_checks` array with your CI/CD job names (integration_id 15368 is GitHub Actions)
- **Bypass permissions**: Add entries to `bypass_actors` array (requires actor IDs from GitHub API)

### Sharing Rulesets Across Repositories

**Method 1: Use the Scripts (Easiest)**

```bash
# Apply to multiple repos with a loop
for repo in repo1 repo2 repo3; do
  ./scripts/apply-rulesets.sh OWNER $repo --all
done

# Update rulesets across multiple repos
for repo in repo1 repo2 repo3; do
  ./scripts/update-rulesets.sh OWNER $repo
done
```

**Method 2: Copy-Paste JSON**

1. Copy the ruleset JSON file to your other repo
2. Import via GitHub UI: Settings → Rules → Rulesets → Import
3. Adjust repo-specific status check names if needed

**Method 3: Organization-Level Rulesets**

- Create at org level: `https://github.com/organizations/ORG/settings/rules`
- Apply to all repos or specific repos via targeting
- Centrally managed, no manual sync needed

## 📁 Package Structure

```text
packages/github-rulesets/
├── rulesets/
│   └── Protect production ruleset.json
├── scripts/
│   ├── apply-rulesets.sh       # Apply rulesets to repos
│   └── update-rulesets.sh      # Update existing rulesets
├── package.json
└── README.md
```

## 🎯 Best Practices

1. **Start with defaults**: Use provided rulesets as a baseline
2. **Gradual enforcement**: Start with "evaluate" mode before "active"
3. **Document exceptions**: Keep track of bypass permissions
4. **Regular reviews**: Audit ruleset effectiveness periodically
5. **Consistent naming**: Use standard branch names across repos

## 🔐 Security Considerations

- Rulesets help prevent accidental or malicious code changes
- Enforce code review requirements
- Maintain audit trail of all changes
- Protect critical branches from direct pushes

## 📄 License

MIT License - see [LICENSE](../../LICENSE) file in the root directory.

This software is provided "as is", without warranty of any kind. Use at your own risk.
