#!/bin/bash
set -eo pipefail

# Load .env file if it exists
if [ -f .env ]; then
  echo "📄 Loading environment variables from .env file..."
  set -a
  if source .env 2>/tmp/env-error.log; then
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
  echo "See docs/release-pat-setup.md for token setup instructions"
  exit 1
fi

# Setup auth - Using personal namespace (RobEasthope)
echo "📝 Setting up authentication..."
echo "   Using personal namespace: RobEasthope"
cat > ~/.npmrc.github << EOF
@protomolecule:registry=https://npm.pkg.github.com/RobEasthope
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
  
  # Run npm publish with input redirected from /dev/null to prevent hanging
  npm publish --userconfig ~/.npmrc.github --access public < /dev/null 2>&1 | tee /tmp/npm-publish-$package.log
  PUBLISH_EXIT_CODE=${PIPESTATUS[0]}
  
  # Read the output for error checking
  OUTPUT=$(cat /tmp/npm-publish-$package.log 2>/dev/null || echo "")
  rm -f /tmp/npm-publish-$package.log
  
  if [ $PUBLISH_EXIT_CODE -eq 0 ]; then
    echo "  ✅ Successfully published"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  elif [ $PUBLISH_EXIT_CODE -eq 124 ]; then
    echo "  ❌ Publishing timed out after 30 seconds"
    echo "     This might indicate an interactive prompt or network issue"
    FAILED_PACKAGES="$FAILED_PACKAGES $package"
  else
    # Check the error message
    if echo "$OUTPUT" | grep -q "403"; then
      echo "  ❌ Failed with 403 error - permission denied"
      echo "     Check that your token has 'packages:write' scope"
      FAILED_PACKAGES="$FAILED_PACKAGES $package"
    elif echo "$OUTPUT" | grep -q "cannot publish over\|You cannot publish over\|E409"; then
      CURRENT_VERSION=$(node -p "require('./package.json').version")
      echo "  ⏭️  Already published (version $CURRENT_VERSION exists)"
      SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
      echo "  ❌ Failed to publish"
      echo "     Error: $(echo "$OUTPUT" | grep -E "npm ERR!" | head -1)"
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