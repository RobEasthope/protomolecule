#!/bin/bash

# One-time script to publish existing NPM packages to GitHub Packages
# This establishes the packages on GitHub before the automated workflow takes over

set -e

echo "📦 Publishing to GitHub Packages"
echo "================================="
echo ""
echo "This script will publish the current package versions to GitHub Packages."
echo "These packages are already on NPM, so this is just mirroring them."
echo ""

# Check if GitHub token is available
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN environment variable is not set"
  echo ""
  echo "To set it:"
  echo "1. Go to https://github.com/settings/tokens"
  echo "2. Generate a new token with 'write:packages' scope"
  echo "3. Run: export GITHUB_TOKEN=your_token_here"
  exit 1
fi

echo "✅ GITHUB_TOKEN is set"
echo ""

# Configure npm for GitHub Packages
echo "📝 Configuring npm for GitHub Packages..."
cat > ~/.npmrc.github << EOF
@protomolecule:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF

echo "✅ Configuration created"
echo ""

# Build packages first
echo "🏗️  Building packages..."
pnpm build
echo "✅ Build complete"
echo ""

# List packages to publish
PACKAGES=("ui" "eslint-config" "colours")

echo "📦 Publishing packages:"
echo ""

SUCCESS_COUNT=0
FAIL_COUNT=0

for pkg in "${PACKAGES[@]}"; do
  PKG_PATH="packages/$pkg"
  if [ -f "$PKG_PATH/package.json" ]; then
    PKG_NAME=$(node -p "require('./$PKG_PATH/package.json').name")
    PKG_VERSION=$(node -p "require('./$PKG_PATH/package.json').version")
    PKG_PRIVATE=$(node -p "require('./$PKG_PATH/package.json').private || false")
    
    if [ "$PKG_PRIVATE" != "true" ]; then
      echo "Publishing $PKG_NAME@$PKG_VERSION..."
      cd "$PKG_PATH"
      
      # Check if already published
      if npm view "$PKG_NAME@$PKG_VERSION" --registry https://npm.pkg.github.com name 2>/dev/null; then
        echo "⏭️  $PKG_NAME@$PKG_VERSION already exists on GitHub Packages"
        ((SUCCESS_COUNT++))
      else
        # Publish to GitHub Packages
        if npm publish --registry https://npm.pkg.github.com --access public --userconfig ~/.npmrc.github; then
          echo "✅ $PKG_NAME@$PKG_VERSION published successfully"
          ((SUCCESS_COUNT++))
        else
          echo "❌ Failed to publish $PKG_NAME@$PKG_VERSION"
          ((FAIL_COUNT++))
        fi
      fi
      
      cd - > /dev/null
    else
      echo "⏭️  Skipping private package: $PKG_NAME"
    fi
    echo ""
  fi
done

# Clean up temp config
rm -f ~/.npmrc.github

echo "================================="
echo "📋 Publishing Summary"
echo ""
echo "✅ Successful: $SUCCESS_COUNT packages"
if [ $FAIL_COUNT -gt 0 ]; then
  echo "❌ Failed: $FAIL_COUNT packages"
fi
echo ""
echo "View your packages at:"
echo "https://github.com/RobEasthope?tab=packages&repo_name=protomolecule"
echo ""
echo "To use these packages:"
echo "npm install @protomolecule/[package-name] --registry=https://npm.pkg.github.com"