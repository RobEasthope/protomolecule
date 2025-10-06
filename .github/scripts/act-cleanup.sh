#!/bin/bash

# Script to clean up local git config set by 'act'
#
# Problem: The 'act' tool (local GitHub Actions testing) sets local git config:
#   user.name=github-actions[bot]
#   user.email=github-actions[bot]@users.noreply.github.com
#
# This config persists in .git/config after act finishes, overriding your
# global git config. This means subsequent commits are incorrectly attributed
# to github-actions[bot] instead of you.
#
# Solution: Run this script after using act to restore your git config.

set -euo pipefail

echo "🔍 Checking for local git config set by act..."

if git config --local user.name >/dev/null 2>&1; then
  echo "📝 Found local git config:"
  echo "   user.name:  $(git config --local user.name)"
  echo "   user.email: $(git config --local user.email 2>/dev/null || echo '(not set)')"

  git config --local --unset user.name 2>/dev/null || true
  git config --local --unset user.email 2>/dev/null || true

  echo "✅ Cleaned up local git config"
  echo ""
  echo "Your global git config will now be used for commits:"
  echo "   user.name:  $(git config --global user.name 2>/dev/null || echo '(not set)')"
  echo "   user.email: $(git config --global user.email 2>/dev/null || echo '(not set)')"
else
  echo "✅ No local git config found - nothing to clean up"
fi
