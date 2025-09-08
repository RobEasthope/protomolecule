# @protomolecule/github-rulesets

GitHub repository configuration and rulesets for Protomolecule projects, ensuring consistent branch protection and workflow standards.

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

- **Required Reviews**: Pull requests require approval before merging
- **Dismiss Stale Reviews**: Previous approvals dismissed when new commits pushed
- **Required Status Checks**: CI/CD must pass before merging
- **Up-to-date Branches**: Branches must be up to date with base branch
- **No Force Pushes**: Prevents history rewriting on protected branches
- **No Deletions**: Protected branches cannot be deleted
- **Linear History**: Enforces a clean commit history

## 🛠️ How to Apply Rulesets

### Via GitHub UI

1. Navigate to your repository's **Settings**
2. Go to **Rules** > **Rulesets**
3. Click **"New ruleset"** > **"Import"**
4. Select the JSON file from this package
5. Review and adjust settings as needed
6. Click **"Create"** to apply

### Via GitHub CLI

```bash
# Export ruleset from this package
gh api repos/OWNER/REPO/rulesets \
  --method POST \
  --input "Protect production ruleset.json"
```

### Via GitHub API

```javascript
const ruleset = require("@protomolecule/github-rulesets/Protect production ruleset.json");

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

- **Different branch names**: Update `conditions.ref_name.include`
- **Review requirements**: Modify `required_approving_review_count`
- **Status checks**: Add your CI/CD workflow names
- **Bypass permissions**: Configure who can bypass rules

## 📁 Package Structure

```
packages/github-rulesets/
├── Protect production ruleset.json
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
