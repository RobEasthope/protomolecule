#!/bin/bash

# Test script to validate changeset check logic locally
# This simulates what the CI will do

set -e

echo "🔍 Testing changeset check logic..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

# Get the base branch (usually main)
BASE_BRANCH=${1:-main}
echo "📊 Checking against base branch: $BASE_BRANCH"

# Check if any packages have changed
echo "📦 Checking for package changes..."
CHANGED_FILES=$(git diff --name-only origin/$BASE_BRANCH...HEAD 2>/dev/null || git diff --name-only $BASE_BRANCH...HEAD)

if echo "$CHANGED_FILES" | grep -q "^packages/"; then
    echo -e "${YELLOW}📝 Package changes detected:${NC}"
    echo "$CHANGED_FILES" | grep "^packages/" | head -5
    echo ""
    
    # Check for changeset files
    if [ -z "$(ls -A .changeset/*.md 2>/dev/null | grep -v README.md)" ]; then
        echo -e "${RED}❌ No changeset found!${NC}"
        echo ""
        echo "This PR modifies packages but has no changeset."
        echo "To fix:"
        echo "  1. Run: pnpm changeset"
        echo "  2. Select affected packages"
        echo "  3. Choose version bump type"
        echo "  4. Describe your changes"
        echo "  5. Commit and push the changeset file"
        exit 1
    else
        echo -e "${GREEN}✅ Changeset found:${NC}"
        ls -la .changeset/*.md | grep -v README.md
        echo ""
        echo "Content:"
        for file in .changeset/*.md; do
            if [[ $(basename "$file") != "README.md" ]]; then
                echo "---"
                cat "$file"
                echo "---"
            fi
        done
    fi
else
    echo -e "${GREEN}✅ No package changes detected - changeset not required${NC}"
fi

echo ""
echo -e "${GREEN}✅ All checks passed!${NC}"