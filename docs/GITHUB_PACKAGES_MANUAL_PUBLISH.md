# Manual GitHub Packages Publishing Guide

This guide provides instructions for manually publishing packages to GitHub Packages, which is required for first-time publishing or troubleshooting failed automated releases.

## When to Use This Guide

Use manual publishing when:

- **First-time setup**: Publishing packages to GitHub Packages for the first time
- **Failed automation**: The release workflow fails with permission errors
- **Testing**: Verifying GitHub Packages configuration before automation
- **Recovery**: Fixing a broken release state

## Prerequisites

Before starting, ensure you have:

1. **RELEASE_PAT token** with required scopes (see [RELEASE_PAT Setup Guide](./RELEASE_PAT_SETUP.md))
2. **Node.js and pnpm** installed locally
3. **Built packages** ready for publishing

## Current Package Versions

As of the latest release:

- `@protomolecule/colours`: 2.1.4
- `@protomolecule/eslint-config`: 2.1.3
- `@protomolecule/ui`: 3.0.2

## Step-by-Step Manual Publishing

### 1. Set Up Authentication

Create a temporary npm configuration for GitHub Packages:

```bash
# Export your token (replace with your actual RELEASE_PAT)
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx

# Create GitHub Packages npm config
cat > ~/.npmrc.github << EOF
@protomolecule:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF
```

### 2. Verify Setup

Check that authentication is working:

```bash
# Test authentication
npm whoami --registry=https://npm.pkg.github.com --userconfig ~/.npmrc.github
# Should return your GitHub username
```

### 3. Build All Packages

Ensure packages are built and ready:

```bash
# From repository root
pnpm install
pnpm build
```

### 4. Publish Each Package

Publish packages in dependency order:

```bash
# 1. Publish colours (no dependencies)
cd packages/colours
npm publish --userconfig ~/.npmrc.github --access public
cd ../..

# 2. Publish eslint-config (no dependencies)
cd packages/eslint-config
npm publish --userconfig ~/.npmrc.github --access public
cd ../..

# 3. Publish ui (depends on colours)
cd packages/ui
npm publish --userconfig ~/.npmrc.github --access public
cd ../..
```

### 5. Verify Publishing

Confirm packages are available:

```bash
# Check each package
npm view @protomolecule/colours version \
  --registry=https://npm.pkg.github.com \
  --userconfig ~/.npmrc.github

npm view @protomolecule/eslint-config version \
  --registry=https://npm.pkg.github.com \
  --userconfig ~/.npmrc.github

npm view @protomolecule/ui version \
  --registry=https://npm.pkg.github.com \
  --userconfig ~/.npmrc.github
```

You should also see them at: https://github.com/RobEasthope?tab=packages

### 6. Clean Up

Remove temporary configuration:

```bash
# Remove temporary npm config
rm ~/.npmrc.github

# Clear environment variable
unset GITHUB_TOKEN
```

## Automated Script

For convenience, save this script as `scripts/manual-publish-github-packages.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Manual GitHub Packages Publishing"
echo "====================================="
echo ""

# Check for token
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Error: GITHUB_TOKEN environment variable not set"
  echo ""
  echo "Please run:"
  echo "  export GITHUB_TOKEN=your_release_pat_here"
  echo ""
  echo "See docs/RELEASE_PAT_SETUP.md for token setup instructions"
  exit 1
fi

# Setup auth
echo "📝 Setting up authentication..."
cat > ~/.npmrc.github << EOF
@protomolecule:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF

# Test auth
echo "🔐 Testing authentication..."
if npm whoami --registry=https://npm.pkg.github.com --userconfig ~/.npmrc.github > /dev/null 2>&1; then
  echo "✅ Authentication successful"
else
  echo "❌ Authentication failed - check your token"
  rm ~/.npmrc.github
  exit 1
fi

# Build
echo ""
echo "🔨 Building packages..."
pnpm build

# Track results
FAILED_PACKAGES=""
SUCCESS_COUNT=0

# Publish each package
echo ""
echo "📦 Publishing packages..."
echo ""

for package in colours eslint-config ui; do
  echo "Publishing @protomolecule/$package..."
  cd packages/$package

  if npm publish --userconfig ~/.npmrc.github --access public 2>/dev/null; then
    echo "  ✅ Successfully published"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  else
    # Check if already published
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    if npm view "@protomolecule/$package@$CURRENT_VERSION" version \
       --registry=https://npm.pkg.github.com \
       --userconfig ~/.npmrc.github > /dev/null 2>&1; then
      echo "  ⏭️  Already published (version $CURRENT_VERSION exists)"
      SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
      echo "  ❌ Failed to publish"
      FAILED_PACKAGES="$FAILED_PACKAGES $package"
    fi
  fi

  cd ../..
  echo ""
done

# Cleanup
rm ~/.npmrc.github

# Summary
echo "====================================="
if [ -z "$FAILED_PACKAGES" ]; then
  echo "✨ All packages processed successfully!"
  echo ""
  echo "View your packages at:"
  echo "https://github.com/RobEasthope?tab=packages"
else
  echo "⚠️  Some packages failed to publish:$FAILED_PACKAGES"
  echo ""
  echo "Check the error messages above for details."
  exit 1
fi
```

Make it executable and run:

```bash
chmod +x scripts/manual-publish-github-packages.sh
export GITHUB_TOKEN=your_release_pat_here
./scripts/manual-publish-github-packages.sh
```

## Troubleshooting

### Common Issues and Solutions

| Issue                     | Cause                          | Solution                                                                               |
| ------------------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| **403 Forbidden**         | Missing `write:packages` scope | Regenerate token with correct scopes (see [RELEASE_PAT Setup](./RELEASE_PAT_SETUP.md)) |
| **404 Not Found**         | Package namespace not linked   | This is normal for first publish, continue with manual steps                           |
| **Version conflict**      | Version already exists         | Bump version in package.json first                                                     |
| **Authentication failed** | Invalid or expired token       | Generate new token                                                                     |
| **Cannot find module**    | Package not built              | Run `pnpm build` first                                                                 |

### Checking Package Status

To see what's already published:

```bash
# List all packages in @protomolecule scope
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/orgs/protomolecule/packages?package_type=npm
```

### Version Conflicts

If a version is already published, you'll need to bump the version:

```bash
# Bump patch version for a package
cd packages/[package-name]
npm version patch
cd ../..

# Commit the change
git add -A
git commit -m "chore: bump [package-name] version for manual publish"
```

## After Manual Publishing

Once packages are manually published:

1. **Automated releases will work**: The CI/CD workflow can now publish new versions
2. **No more 403 errors**: The package namespace is established
3. **Regular flow resumes**: Use changesets and the normal release process

## Related Documentation

- [RELEASE_PAT Setup Guide](./RELEASE_PAT_SETUP.md) - Setting up your Personal Access Token
- [Release Workflow](./.github/workflows/release.yml) - The automated release process
- [GitHub Packages Documentation](https://docs.github.com/en/packages)

## Support

If you encounter issues not covered here:

1. Check the [GitHub Packages Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
2. Review the [workflow logs](https://github.com/RobEasthope/protomolecule/actions)
3. Open an issue in the repository
