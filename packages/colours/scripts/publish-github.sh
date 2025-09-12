#!/bin/bash
set -eo pipefail

# Publish @protomolecule/colours to GitHub Packages
# Usage: ./scripts/publish-github.sh

echo "📦 Publishing @protomolecule/colours to GitHub Packages"
echo "=================================================="

# Load .env file if it exists (from repo root)
if [ -f ../../.env ]; then
  echo "📄 Loading environment variables from .env file..."
  set -a
  if source ../../.env 2>/tmp/env-error.log; then
    # Validate critical variables were loaded
    if [ -n "${GITHUB_TOKEN:-}" ]; then
      echo "✅ Environment variables loaded successfully"
    else
      echo "⚠️ Warning: .env file loaded but GITHUB_TOKEN not set"
    fi
  else
    echo "⚠️ Warning: Error loading .env file"
    if [ -s /tmp/env-error.log ]; then
      echo "   Error details: $(cat /tmp/env-error.log)"
    fi
  fi
  set +a
  rm -f /tmp/env-error.log
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

# Setup GitHub Packages auth (personal namespace)
cat > ~/.npmrc.github-colours << EOF
@protomolecule:registry=https://npm.pkg.github.com/RobEasthope
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF

# Test auth
echo "🔐 Testing authentication..."
if npm whoami --registry=https://npm.pkg.github.com --userconfig ~/.npmrc.github-colours > /dev/null 2>&1; then
  echo "✅ Authenticated as: $(npm whoami --registry=https://npm.pkg.github.com --userconfig ~/.npmrc.github-colours)"
else
  echo "❌ Authentication failed"
  rm ~/.npmrc.github-colours
  exit 1
fi

# Publish with stdin redirect to prevent hanging
echo ""
echo "📤 Publishing..."

# Run publish and capture output via file to avoid hanging
npm publish --userconfig ~/.npmrc.github-colours --access public < /dev/null 2>&1 | tee /tmp/npm-publish-colours.log
EXIT_CODE=${PIPESTATUS[0]}

# Read output for error checking
OUTPUT=$(cat /tmp/npm-publish-colours.log 2>/dev/null || echo "")
rm -f /tmp/npm-publish-colours.log

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
rm ~/.npmrc.github-colours

echo ""
echo "View at: https://github.com/RobEasthope/protomolecule/packages"