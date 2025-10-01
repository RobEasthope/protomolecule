#!/bin/bash

# Test script to safely test publishing workflow
# Everything runs with --dry-run flag

set -e

echo "🚀 Testing publish workflow (DRY RUN ONLY)"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check changeset status
echo -e "${BLUE}📊 Step 1: Checking changeset status...${NC}"
pnpm changeset status || true
echo ""

# Step 2: Test version bumping (dry run)
echo -e "${BLUE}📦 Step 2: Testing version bumps (dry run)...${NC}"
pnpm changeset version --dry-run
echo ""

# Step 3: Check what would be published
echo -e "${BLUE}📤 Step 3: Checking what would be published...${NC}"
pnpm changeset publish --dry-run
echo ""

# Step 4: Show current versions
echo -e "${BLUE}📋 Step 4: Current package versions:${NC}"
for pkg in packages/*/package.json; do
    if [ -f "$pkg" ]; then
        NAME=$(grep '"name"' "$pkg" | cut -d'"' -f4)
        VERSION=$(grep '"version"' "$pkg" | cut -d'"' -f4)
        PRIVATE=$(grep '"private"' "$pkg" | cut -d':' -f2 | tr -d ' ,' | tr -d '"')
        
        if [ "$PRIVATE" = "true" ]; then
            echo -e "  ${YELLOW}$NAME@$VERSION (private)${NC}"
        else
            echo -e "  ${GREEN}$NAME@$VERSION (public)${NC}"
        fi
    fi
done
echo ""

# Step 5: Verify NPM authentication
echo -e "${BLUE}🔐 Step 5: Verifying NPM authentication...${NC}"
if npm whoami > /dev/null 2>&1; then
    USER=$(npm whoami)
    echo -e "${GREEN}✅ Logged in to NPM as: $USER${NC}"
else
    echo -e "${RED}❌ Not logged in to NPM${NC}"
    echo "Run 'npm login' to authenticate"
fi
echo ""

echo -e "${GREEN}✅ Dry run complete - no packages were published${NC}"
echo ""
echo "To actually publish (when ready):"
echo "  1. Remove --dry-run flags"
echo "  2. Ensure you're on main branch"
echo "  3. Run: pnpm changeset publish"