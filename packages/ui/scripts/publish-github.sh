#!/bin/bash
set -e

# Publish @protomolecule/ui to GitHub Packages
# Usage: ./scripts/publish-github.sh

echo "📦 Publishing @protomolecule/ui to GitHub Packages"
echo "=============================================="

# Load .env file if it exists (from repo root)
if [ -f ../../.env ]; then
  echo "📄 Loading environment variables from .env file..."
  set -a
  source ../../.env 2>/dev/null || echo "⚠️ Warning: Could not load .env file"
  set +a
fi

# Check for token
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Error: GITHUB_TOKEN not set"
  echo "Run: export GITHUB_TOKEN=your_token"
  echo "Or add it to the .env file in the repo root"
  exit 1
fi

# Get package info
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")

echo "Package: $PACKAGE_NAME@$PACKAGE_VERSION"
echo ""

# Build first
echo "🔨 Building package..."
pnpm build

# Setup GitHub Packages auth (personal namespace)
cat > ~/.npmrc.github-ui << EOF
@protomolecule:registry=https://npm.pkg.github.com/RobEasthope
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF

# Test auth
echo "🔐 Testing authentication..."
if npm whoami --registry=https://npm.pkg.github.com --userconfig ~/.npmrc.github-ui > /dev/null 2>&1; then
  echo "✅ Authenticated as: $(npm whoami --registry=https://npm.pkg.github.com --userconfig ~/.npmrc.github-ui)"
else
  echo "❌ Authentication failed"
  rm ~/.npmrc.github-ui
  exit 1
fi

# Publish with stdin redirect to prevent hanging
echo ""
echo "📤 Publishing..."

# Run publish and capture output via file to avoid hanging
npm publish --userconfig ~/.npmrc.github-ui --access public < /dev/null 2>&1 | tee /tmp/npm-publish-ui.log
EXIT_CODE=${PIPESTATUS[0]}

# Read output for error checking
OUTPUT=$(cat /tmp/npm-publish-ui.log 2>/dev/null || echo "")
rm -f /tmp/npm-publish-ui.log

if [ $EXIT_CODE -eq 0 ]; then
  echo ""
  echo "✅ Successfully published $PACKAGE_NAME@$PACKAGE_VERSION"
elif echo "$OUTPUT" | grep -q "cannot publish over\|You cannot publish over\|E409"; then
  echo ""
  echo "⏭️  Version $PACKAGE_VERSION already exists in registry"
elif echo "$OUTPUT" | grep -q "403\|E403"; then
  echo ""
  echo "❌ Permission denied - check token has 'packages:write' scope"
  exit 1
else
  echo ""
  echo "❌ Failed to publish (exit code: $EXIT_CODE)"
  exit $EXIT_CODE
fi

# Cleanup
rm ~/.npmrc.github-ui

echo ""
echo "View at: https://github.com/RobEasthope/protomolecule/packages"