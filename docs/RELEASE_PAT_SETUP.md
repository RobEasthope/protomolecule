# RELEASE_PAT Setup Guide

This guide explains how to set up the `RELEASE_PAT` (Personal Access Token) required for the release workflow to function properly.

## Why RELEASE_PAT is Needed

The `RELEASE_PAT` is required because:

1. **Protected Branches**: Allows pushing version commits to protected main branch
2. **GitHub Packages**: Enables publishing packages to GitHub Packages registry
3. **Changeset Operations**: Permits creating release commits and tags
4. **Cross-Repository Access**: If workflows modify other repos or trigger other workflows

## Required Permissions

### Option 1: Classic Personal Access Token (Recommended)

Create a Classic PAT with these scopes:

| Scope            | Required | Purpose                                       |
| ---------------- | -------- | --------------------------------------------- |
| `repo`           | ✅ Yes   | Full repository access for protected branches |
| `write:packages` | ✅ Yes   | Publish packages to GitHub Packages           |
| `read:packages`  | ✅ Yes   | Read packages from GitHub Packages            |
| `workflow`       | ⚠️ Maybe | Only if workflows are modified during release |

### Option 2: Fine-grained Personal Access Token

For fine-grained tokens, configure these permissions:

| Permission        | Access Level | Purpose                    |
| ----------------- | ------------ | -------------------------- |
| **Contents**      | Write        | Push commits, create tags  |
| **Pull requests** | Write        | Create release PRs         |
| **Packages**      | Write        | Publish to GitHub Packages |
| **Actions**       | Write        | If workflows are modified  |
| **Metadata**      | Read         | Always required            |

## Step-by-Step Setup

### 1. Generate the Token

#### Classic Token

1. Go to https://github.com/settings/tokens/new
2. Give it a descriptive name: `Protomolecule Release Token`
3. Set expiration (recommend 90 days with calendar reminder)
4. Select scopes:
   - ✅ `repo` (entire checkbox)
   - ✅ `write:packages`
   - ✅ `read:packages`
   - ✅ `delete:packages` (for cleanup)
   - ✅ `workflow` (if needed)
5. Click "Generate token"
6. **Copy the token immediately** (starts with `ghp_`)

#### Fine-grained Token

1. Go to https://github.com/settings/personal-access-tokens/new
2. Set token name: `Protomolecule Release Token`
3. Set expiration (max 1 year)
4. Select repository: `RobEasthope/protomolecule`
5. Configure permissions as listed above
6. Click "Generate token"
7. **Copy the token immediately**

### 2. Add to GitHub Repository

1. Go to https://github.com/RobEasthope/protomolecule/settings/secrets/actions
2. Click "New repository secret" or update existing
3. Name: `RELEASE_PAT`
4. Value: Paste your token
5. Click "Add secret" or "Update secret"

### 3. Verify Setup

Run this command locally to test:

```bash
# Create .env file
echo "GITHUB_TOKEN=your_pat_here" > .env

# Run test script
./scripts/test-github-packages-publish.sh
```

## Token Maintenance

### Security Best Practices

1. **Rotate regularly**: Set calendar reminder for token expiration
2. **Minimum scope**: Only grant permissions actually needed
3. **Never commit**: Ensure `.env` is in `.gitignore`
4. **Audit usage**: Review token usage in GitHub settings periodically

### When to Update

Update the token if:

- It expires (check expiration in GitHub settings)
- You add new workflow requirements
- Security audit recommends rotation
- Token is compromised

### Troubleshooting

| Error                 | Cause                    | Solution                       |
| --------------------- | ------------------------ | ------------------------------ |
| 403 on packages       | Missing `write:packages` | Regenerate with packages scope |
| Can't push to main    | Missing `repo` scope     | Regenerate with repo scope     |
| Workflow fails        | Missing `workflow` scope | Add workflow scope if needed   |
| Authentication failed | Token expired            | Generate new token             |

## Related Documentation

- [GitHub PAT Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Packages Permissions](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages)
- [Changeset Action](https://github.com/changesets/action)
