#!/usr/bin/env bash

# Script to update existing GitHub rulesets in repositories
# Usage: ./update-rulesets.sh OWNER REPO
#
# This script lists existing rulesets and allows you to update them
# with the JSON files from the rulesets directory.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RULESETS_DIR="$(cd "$SCRIPT_DIR/../rulesets" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
OWNER="${1:-}"
REPO="${2:-}"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub CLI${NC}"
    echo "Run: gh auth login"
    exit 1
fi

# Validate arguments
if [ -z "$OWNER" ] || [ -z "$REPO" ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo ""
    echo "Usage: $0 OWNER REPO"
    echo ""
    echo "Example:"
    echo "  $0 RobEasthope my-repo"
    exit 1
fi

echo -e "${BLUE}Fetching existing rulesets from $OWNER/$REPO...${NC}"
echo ""

# Get existing rulesets
rulesets_json=$(gh api "repos/$OWNER/$REPO/rulesets" 2>/dev/null || echo "[]")

if [ "$rulesets_json" == "[]" ]; then
    echo -e "${YELLOW}No existing rulesets found in $OWNER/$REPO${NC}"
    echo -e "${YELLOW}Use apply-rulesets.sh to create new rulesets${NC}"
    exit 0
fi

# Parse and display existing rulesets
echo -e "${GREEN}Existing rulesets:${NC}"
echo "$rulesets_json" | jq -r '.[] | "\(.id): \(.name)"' | while read -r line; do
    echo "  - $line"
done
echo ""

# Find matching rulesets by name
echo -e "${BLUE}Checking for matching rulesets to update...${NC}"
echo ""

updated_count=0
skipped_count=0

for ruleset_file in "$RULESETS_DIR"/*.json; do
    ruleset_name=$(jq -r '.name' "$ruleset_file")
    ruleset_filename=$(basename "$ruleset_file")

    # Find matching ruleset by name
    ruleset_id=$(echo "$rulesets_json" | jq -r --arg name "$ruleset_name" '.[] | select(.name == $name) | .id')

    if [ -z "$ruleset_id" ] || [ "$ruleset_id" == "null" ]; then
        echo -e "${YELLOW}⊘ No existing ruleset found for: $ruleset_filename (name: $ruleset_name)${NC}"
        ((skipped_count++))
        continue
    fi

    echo -e "${YELLOW}Updating ruleset: $ruleset_name (ID: $ruleset_id)${NC}"

    if gh api "repos/$OWNER/$REPO/rulesets/$ruleset_id" \
        --method PUT \
        --input "$ruleset_file" \
        --silent 2>/dev/null; then
        echo -e "${GREEN}✓ Successfully updated: $ruleset_name${NC}"
        ((updated_count++))
    else
        echo -e "${RED}✗ Failed to update: $ruleset_name${NC}"
    fi
    echo ""
done

echo -e "${GREEN}Updated $updated_count ruleset(s)${NC}"
[ $skipped_count -gt 0 ] && echo -e "${YELLOW}Skipped $skipped_count ruleset(s) (no matching name found)${NC}"

echo ""
echo -e "${GREEN}View rulesets at: https://github.com/$OWNER/$REPO/settings/rules${NC}"
