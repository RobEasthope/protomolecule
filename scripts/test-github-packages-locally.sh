#!/bin/bash

# Local test script to verify GitHub Packages configuration
# Run this before pushing to ensure everything works

set -e

echo "🧪 Local GitHub Packages Configuration Test"
echo "==========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
run_test() {
  local test_name=$1
  local test_command=$2
  
  echo -n "Testing: $test_name... "
  
  if eval "$test_command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((TESTS_PASSED++))
    return 0
  else
    echo -e "${RED}❌ FAILED${NC}"
    ((TESTS_FAILED++))
    return 1
  fi
}

echo "1️⃣  Checking Prerequisites"
echo "----------------------------"

# Check Node.js
run_test "Node.js installed" "which node"

# Check pnpm
run_test "pnpm installed" "which pnpm"

# Check jq
run_test "jq installed" "which jq"

echo ""
echo "2️⃣  Validating Package Configurations"
echo "--------------------------------------"

# Check each package
for pkg in ui eslint-config colours; do
  PKG_PATH="packages/$pkg"
  
  if [ -f "$PKG_PATH/package.json" ]; then
    # Valid JSON
    run_test "$pkg: Valid JSON" "node -e \"JSON.parse(require('fs').readFileSync('$PKG_PATH/package.json', 'utf8'))\""
    
    # Has repository field
    run_test "$pkg: Has repository field" "node -p \"require('./$PKG_PATH/package.json').repository ? 'true' : 'false'\" | grep -q true"
    
    # Has publishConfig
    run_test "$pkg: Has publishConfig" "node -p \"require('./$PKG_PATH/package.json').publishConfig ? 'true' : 'false'\" | grep -q true"
    
    # No duplicate fields (check line count of publishConfig)
    run_test "$pkg: No duplicate publishConfig" "[ \$(grep -c '\"publishConfig\"' $PKG_PATH/package.json) -eq 1 ]"
  fi
done

echo ""
echo "3️⃣  Testing Build Artifacts"
echo "----------------------------"

# Build packages first
echo "Building packages..."
if pnpm build > /dev/null 2>&1; then
  echo -e "${GREEN}Build successful${NC}"
  
  # Check build outputs
  run_test "eslint-config: dist/index.js exists" "[ -f packages/eslint-config/dist/index.js ]"
  run_test "ui: dist directory exists" "[ -d packages/ui/dist ]"
  run_test "colours: index.css exists" "[ -f packages/colours/index.css ]"
else
  echo -e "${RED}Build failed${NC}"
  ((TESTS_FAILED++))
fi

echo ""
echo "4️⃣  Testing Workflow Logic"
echo "---------------------------"

# Test package name extraction
test_extraction() {
  local input="$1"
  local expected="$2"
  local result=$(echo "$input" | sed 's/@protomolecule\///')
  [ "$result" = "$expected" ]
}

run_test "Package extraction: @protomolecule/ui -> ui" "test_extraction '@protomolecule/ui' 'ui'"
run_test "Package extraction: @protomolecule/eslint-config -> eslint-config" "test_extraction '@protomolecule/eslint-config' 'eslint-config'"

# Test JSON parsing with jq
TEST_JSON='[{"name":"@protomolecule/ui","version":"2.1.1"}]'
run_test "JSON parsing with jq" "echo '$TEST_JSON' | jq -r '.[] | \"\(.name)\t\(.version)\"' | grep -q '@protomolecule/ui'"

# Test variable scoping with process substitution
test_scoping() {
  local VAR=true
  while IFS= read -r line; do
    VAR=false
  done < <(echo "test")
  [ "$VAR" = "false" ]
}

run_test "Process substitution preserves scope" "test_scoping"

echo ""
echo "5️⃣  Testing Registry Configuration"
echo "-----------------------------------"

# Test creating npmrc
test_npmrc() {
  local temp_npmrc=$(mktemp)
  echo "@protomolecule:registry=https://npm.pkg.github.com" > "$temp_npmrc"
  echo "//npm.pkg.github.com/:_authToken=TEST_TOKEN" >> "$temp_npmrc"
  
  grep -q "@protomolecule:registry" "$temp_npmrc" && \
  grep -q "npm.pkg.github.com/:_authToken" "$temp_npmrc"
  
  local result=$?
  rm -f "$temp_npmrc"
  return $result
}

run_test "NPM registry configuration format" "test_npmrc"

echo ""
echo "6️⃣  Testing Error Handling"
echo "---------------------------"

# Test malformed JSON handling
run_test "Malformed JSON detection" "! echo '[{\"name\":\"test\"' | jq -r '.[] | .name' 2>/dev/null"

# Test empty array handling
run_test "Empty array handling" "[ -z \"\$(echo '[]' | jq -r '.[] | .name' 2>/dev/null)\" ]"

echo ""
echo "==========================================="
echo "📊 Test Summary"
echo "==========================================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed! Ready to publish to GitHub Packages.${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please fix the issues before proceeding.${NC}"
  exit 1
fi