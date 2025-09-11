#!/bin/bash

# Test script to manually publish packages to GitHub Packages
# This will help verify the configuration before the workflow runs

set -e

echo "🔧 Testing GitHub Packages Publishing"
echo "======================================"
echo ""

# Check if GitHub token is available
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN environment variable is not set"
  echo "Please run: export GITHUB_TOKEN=your_github_token"
  exit 1
fi

echo "✅ GITHUB_TOKEN is set"
echo ""

# Configure npm for GitHub Packages
echo "📝 Configuring npm for GitHub Packages..."
echo "@protomolecule:registry=https://npm.pkg.github.com" > ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> ~/.npmrc

echo "✅ NPM configured for GitHub Packages"
echo ""

# List packages to publish
PACKAGES=("ui" "eslint-config" "colours")

echo "📦 Packages to test:"
for pkg in "${PACKAGES[@]}"; do
  PKG_PATH="packages/$pkg"
  if [ -f "$PKG_PATH/package.json" ]; then
    PKG_NAME=$(node -p "require('./$PKG_PATH/package.json').name")
    PKG_VERSION=$(node -p "require('./$PKG_PATH/package.json').version")
    echo "  - $PKG_NAME@$PKG_VERSION"
  fi
done
echo ""

# Dry run to test configuration
echo "🧪 Running dry-run test..."
echo ""

for pkg in "${PACKAGES[@]}"; do
  PKG_PATH="packages/$pkg"
  if [ -f "$PKG_PATH/package.json" ]; then
    PKG_NAME=$(node -p "require('./$PKG_PATH/package.json').name")
    PKG_VERSION=$(node -p "require('./$PKG_PATH/package.json').version")
    PKG_PRIVATE=$(node -p "require('./$PKG_PATH/package.json').private || false")
    
    if [ "$PKG_PRIVATE" != "true" ]; then
      echo "Testing $PKG_NAME..."
      cd "$PKG_PATH"
      
      # Run npm publish with --dry-run to test
      if npm publish --registry https://npm.pkg.github.com --access public --dry-run 2>&1 | grep -q "npm notice"; then
        echo "✅ $PKG_NAME: Dry-run successful"
      else
        echo "❌ $PKG_NAME: Dry-run failed"
      fi
      
      cd - > /dev/null
    else
      echo "⏭️  Skipping private package: $PKG_NAME"
    fi
    echo ""
  fi
done

echo "======================================"
echo "📋 Test Summary"
echo ""
echo "If all dry-runs passed, you can publish for real by:"
echo "1. Remove the --dry-run flag from this script"
echo "2. Or wait for the PR to be merged and the workflow to run"
echo ""
echo "Note: Packages need to be built first (pnpm build)"