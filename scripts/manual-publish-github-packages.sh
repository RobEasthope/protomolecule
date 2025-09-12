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