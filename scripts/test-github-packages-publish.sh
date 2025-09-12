#!/bin/bash

# Test script for GitHub Packages publishing logic
# This script simulates the workflow logic locally for testing

set -euo pipefail

# Load .env file if it exists
if [ -f .env ]; then
  echo "📄 Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
fi

echo "🧪 Testing GitHub Packages Publishing Logic"
echo "==========================================="
echo ""

# Check if GITHUB_TOKEN is set
if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "❌ Error: GITHUB_TOKEN environment variable is not set"
  echo "Please set it with: export GITHUB_TOKEN=your_token"
  exit 1
fi

# Store workspace directory
WORKSPACE_ROOT="$(pwd)"

# Create a temporary file to track results
RESULTS_FILE="/tmp/test-github-packages-results.txt"
> "$RESULTS_FILE"

# Mock published packages for testing with timestamp-based version to avoid conflicts
TEST_VERSION="999.999.$(date +%s)"
PUBLISHED_PKGS="[{\"name\":\"@protomolecule/ui\",\"version\":\"$TEST_VERSION\"}]"

echo "📋 Test Configuration:"
echo "  Workspace: $WORKSPACE_ROOT"
echo "  Test Package: @protomolecule/ui@$TEST_VERSION"
echo ""

# Function to setup GitHub Packages registry
setup_github_registry() {
  echo "🔧 Setting up GitHub Packages registry..."
  cat > ~/.npmrc.github.test <<EOF
@protomolecule:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF
  echo "  ✅ Registry configuration created"
}

# Function to check if package exists
check_package_exists() {
  local pkg_name="$1"
  local pkg_version="$2"
  
  echo "  🔍 Checking if $pkg_name@$pkg_version exists..."
  
  if npm view "${pkg_name}@${pkg_version}" version \
    --userconfig ~/.npmrc.github.test \
    --registry=https://npm.pkg.github.com \
    2>/dev/null; then
    echo "    ✅ Package exists"
    return 0
  else
    echo "    ❌ Package does not exist"
    return 1
  fi
}

# Function to test authentication
test_authentication() {
  echo "🔐 Testing GitHub Packages authentication..."
  
  # Try to list packages in the org
  if npm search "@protomolecule" \
    --userconfig ~/.npmrc.github.test \
    --registry=https://npm.pkg.github.com \
    2>/dev/null | grep -q "protomolecule"; then
    echo "  ✅ Authentication successful"
    return 0
  else
    echo "  ❌ Authentication failed or no packages found"
    return 1
  fi
}

# Setup registry
setup_github_registry

# Test authentication
if ! test_authentication; then
  echo ""
  echo "⚠️ Warning: Authentication test failed"
  echo "This might mean:"
  echo "  1. The GITHUB_TOKEN doesn't have 'packages:read' permission"
  echo "  2. No packages exist in the @protomolecule scope yet"
  echo ""
fi

# Process test packages
echo ""
echo "📦 Processing test packages..."
echo "$PUBLISHED_PKGS" | jq -c '.[]' 2>/dev/null | while IFS= read -r pkg; do
  name=$(echo "$pkg" | jq -r '.name')
  version=$(echo "$pkg" | jq -r '.version')
  dir=$(echo "$name" | sed 's/@protomolecule\///')
  
  echo ""
  echo "📦 Testing $name@$version"
  echo "  Directory: packages/$dir"
  
  if [ ! -d "packages/$dir" ]; then
    echo "  ❌ Package directory not found"
    echo "FAILED:$name@$version:dir_not_found" >> "$RESULTS_FILE"
    continue
  fi
  
  # Check if package exists (should not exist with test version)
  if check_package_exists "$name" "$version"; then
    echo "  ⏭️ Test version already exists (unexpected)"
    echo "SKIPPED:$name@$version" >> "$RESULTS_FILE"
  else
    echo "  ✅ Test version does not exist (expected)"
    echo "SUCCESS:$name@$version" >> "$RESULTS_FILE"
  fi
  
  # Test with actual current version
  current_version=$(node -p "require('./packages/$dir/package.json').version")
  echo ""
  echo "  Testing current version: $name@$current_version"
  if check_package_exists "$name" "$current_version"; then
    echo "    ✅ Current version exists in GitHub Packages"
  else
    echo "    ℹ️ Current version not in GitHub Packages (may not have been published yet)"
  fi
done

# Clean up
rm -f ~/.npmrc.github.test

# Generate summary
echo ""
echo "📊 Test Results Summary"
echo "======================"

SUCCESS_COUNT=$(grep -c "^SUCCESS:" "$RESULTS_FILE" 2>/dev/null || echo 0)
SKIPPED_COUNT=$(grep -c "^SKIPPED:" "$RESULTS_FILE" 2>/dev/null || echo 0)
FAILED_COUNT=$(grep -c "^FAILED:" "$RESULTS_FILE" 2>/dev/null || echo 0)

echo "  ✅ Success: $SUCCESS_COUNT"
echo "  ⏭️ Skipped: $SKIPPED_COUNT"
echo "  ❌ Failed: $FAILED_COUNT"

# Clean up
rm -f "$RESULTS_FILE"

echo ""
echo "✅ Test completed successfully!"
echo ""
echo "📝 Notes:"
echo "  - This test validates the GitHub Packages configuration"
echo "  - It checks if packages can be queried from GitHub Packages"
echo "  - Actual publishing is not tested to avoid creating test packages"