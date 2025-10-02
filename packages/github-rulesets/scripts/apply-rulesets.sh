#!/usr/bin/env bash

# Script to apply GitHub rulesets to repositories
# Usage: ./apply-rulesets.sh OWNER REPO [RULESET_FILE]
#
# Examples:
#   ./apply-rulesets.sh RobEasthope my-repo
#   ./apply-rulesets.sh RobEasthope my-repo "Protect production ruleset.json"
#   ./apply-rulesets.sh RobEasthope my-repo --all

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RULESETS_DIR="$(cd "$SCRIPT_DIR/../rulesets" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
OWNER="${1:-}"
REPO="${2:-}"
RULESET="${3:-all}"

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
    echo "Usage: $0 OWNER REPO [RULESET_FILE|--all]"
    echo ""
    echo "Examples:"
    echo "  $0 RobEasthope my-repo"
    echo "  $0 RobEasthope my-repo 'Protect production ruleset.json'"
    echo "  $0 RobEasthope my-repo --all"
    echo ""
    echo "Available rulesets:"
    find "$RULESETS_DIR" -name "*.json" -exec basename {} \;
    exit 1
fi

# Function to apply a single ruleset
apply_ruleset() {
    local ruleset_file="$1"
    local ruleset_name=$(basename "$ruleset_file" .json)
    local error_output
    local exit_code

    echo -e "${YELLOW}Applying ruleset: $ruleset_name${NC}"

    # Capture stderr while preserving exit code
    error_output=$(gh api "repos/$OWNER/$REPO/rulesets" \
        --method POST \
        --input "$ruleset_file" \
        2>&1 >/dev/null)
    exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully applied: $ruleset_name${NC}"
        return 0
    else
        # Check if it's the "already exists" error
        if echo "$error_output" | grep -qi "already exists\|duplicate"; then
            echo -e "${YELLOW}⊘ Ruleset already exists: $ruleset_name${NC}"
            echo -e "${YELLOW}  Use update-rulesets.sh to update existing rulesets.${NC}"
        else
            echo -e "${RED}✗ Failed to apply: $ruleset_name${NC}"
            # Show the actual error message for debugging
            if [ -n "$error_output" ]; then
                echo -e "${RED}  Error: ${error_output}${NC}"
            fi
        fi
        return 1
    fi
}

# Main logic
if [ "$RULESET" == "--all" ] || [ "$RULESET" == "all" ]; then
    echo -e "${GREEN}Applying all rulesets to $OWNER/$REPO${NC}"
    echo ""

    success_count=0
    fail_count=0

    for ruleset_file in "$RULESETS_DIR"/*.json; do
        if apply_ruleset "$ruleset_file"; then
            ((success_count++))
        else
            ((fail_count++))
        fi
        echo ""
    done

    echo -e "${GREEN}Applied $success_count ruleset(s) successfully${NC}"
    [ $fail_count -gt 0 ] && echo -e "${YELLOW}Failed to apply $fail_count ruleset(s)${NC}"

else
    # Apply specific ruleset
    ruleset_file="$RULESETS_DIR/$RULESET"

    if [ ! -f "$ruleset_file" ]; then
        echo -e "${RED}Error: Ruleset file not found: $RULESET${NC}"
        echo ""
        echo "Available rulesets:"
        find "$RULESETS_DIR" -name "*.json" -exec basename {} \;
        exit 1
    fi

    apply_ruleset "$ruleset_file"
fi

echo ""
echo -e "${GREEN}View rulesets at: https://github.com/$OWNER/$REPO/settings/rules${NC}"
