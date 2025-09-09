#!/usr/bin/env node

/**
 * Generates user-friendly release summaries from changeset data
 * This script transforms technical changeset descriptions into
 * plain language summaries suitable for non-technical users
 */

import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Map technical terms to user-friendly descriptions
const USER_FRIENDLY_MAPPINGS = {
  // Package descriptions
  "@protomolecule/eslint-config": "Code Quality Tools",
  "@protomolecule/ui": "User Interface Components",
  "@protomolecule/tsconfig": "TypeScript Configuration",
  "@protomolecule/radix-colors": "Color System",
  "@protomolecule/github-rulesets": "GitHub Settings",

  // Version bump descriptions
  major: "Breaking Changes (requires migration)",
  minor: "New Features",
  patch: "Bug Fixes & Improvements",

  // Common technical terms
  typescript: "type safety",
  eslint: "code quality",
  react: "user interface",
  npm: "package registry",
  api: "integration",
  config: "settings",
  deps: "dependencies",
  dev: "development",
};

// Templates for different types of changes
const SUMMARY_TEMPLATES = {
  feature: (pkg, desc) => `✨ **New capability**: ${desc}`,
  fix: (pkg, desc) => `🐛 **Issue resolved**: ${desc}`,
  perf: (pkg, desc) => `⚡ **Performance boost**: ${desc}`,
  docs: (pkg, desc) => `📚 **Documentation update**: ${desc}`,
  chore: (pkg, desc) => `🔧 **Maintenance**: ${desc}`,
  default: (pkg, desc) => `📦 **Update**: ${desc}`,
};

/**
 * Determines the type of change from the description
 */
function getChangeType(description) {
  const desc = description.toLowerCase();
  if (desc.includes("add") || desc.includes("new") || desc.includes("feature"))
    return "feature";
  if (desc.includes("fix") || desc.includes("bug") || desc.includes("resolve"))
    return "fix";
  if (
    desc.includes("perf") ||
    desc.includes("optim") ||
    desc.includes("faster")
  )
    return "perf";
  if (desc.includes("doc") || desc.includes("readme")) return "docs";
  if (desc.includes("chore") || desc.includes("deps") || desc.includes("build"))
    return "chore";
  return "default";
}

/**
 * Transforms technical description to user-friendly language
 */
function makeUserFriendly(text) {
  let result = text;

  // Replace technical terms (only whole words for shorter terms)
  Object.entries(USER_FRIENDLY_MAPPINGS).forEach(([technical, friendly]) => {
    // For package names, replace exactly
    if (technical.startsWith("@")) {
      const regex = new RegExp(
        technical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "gi",
      );
      result = result.replace(regex, friendly);
    } else if (technical.length <= 6) {
      // For short terms, match whole words only
      const regex = new RegExp(`\\b${technical}\\b`, "gi");
      result = result.replace(regex, friendly);
    } else {
      // For longer terms, match anywhere
      const regex = new RegExp(technical, "gi");
      result = result.replace(regex, friendly);
    }
  });

  // Simplify common patterns
  result = result
    .replace(/\bv?\d+\.\d+\.\d+\b/g, "") // Remove version numbers
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
    .trim();

  return result;
}

/**
 * Generates a user-friendly summary from published packages data
 */
function generateSummary(publishedPackages) {
  if (!publishedPackages || publishedPackages.length === 0) {
    return "📦 No packages were published in this release.";
  }

  const sections = {
    features: [],
    fixes: [],
    other: [],
  };

  publishedPackages.forEach((pkg) => {
    const friendlyName = USER_FRIENDLY_MAPPINGS[pkg.name] || pkg.name;
    const changeType = getChangeType(pkg.description || "");
    const friendlyDesc = makeUserFriendly(
      pkg.description || "General improvements",
    );

    const template = SUMMARY_TEMPLATES[changeType];
    const summary = template(friendlyName, friendlyDesc);

    if (changeType === "feature") {
      sections.features.push(summary);
    } else if (changeType === "fix") {
      sections.fixes.push(summary);
    } else {
      sections.other.push(summary);
    }
  });

  // Build the final summary
  let summary = "## 🎉 Release Highlights\n\n";
  summary +=
    "*This release includes improvements to our development tools and infrastructure.*\n\n";

  if (sections.features.length > 0) {
    summary += "### What's New\n";
    sections.features.forEach((item) => {
      summary += `${item}\n`;
    });
    summary += "\n";
  }

  if (sections.fixes.length > 0) {
    summary += "### Problems Solved\n";
    sections.fixes.forEach((item) => {
      summary += `${item}\n`;
    });
    summary += "\n";
  }

  if (sections.other.length > 0) {
    summary += "### Other Improvements\n";
    sections.other.forEach((item) => {
      summary += `${item}\n`;
    });
    summary += "\n";
  }

  // Add impact statement
  summary += "### Who This Affects\n";
  summary +=
    "👥 **Developers**: These updates improve the development experience ";
  summary +=
    "with better tooling, clearer error messages, and more reliable builds.\n\n";

  // Add action items if needed
  const hasMajorChanges = publishedPackages.some((pkg) => {
    // Check if this is a major version (x.0.0 where x > 0)
    // or if it's the first 1.0.0 release (which is also major)
    if (!pkg.version) return false;
    const [major, minor, patch] = pkg.version.split(".");
    return (
      (major === "1" && minor === "0" && patch === "0") || parseInt(major) > 1
    );
  });

  if (hasMajorChanges) {
    summary += "### Action Required\n";
    summary += "⚠️ This release contains breaking changes. Please review the ";
    summary += "technical changelog below for migration instructions.\n\n";
  } else {
    summary += "### Action Required\n";
    summary +=
      "✅ No action needed - these updates are backward compatible.\n\n";
  }

  summary += "---\n\n";
  summary += "*For technical details, see the full changelog below.*\n";

  return summary;
}

// Main execution
try {
  // Read published packages from environment or stdin
  const input = process.env.PUBLISHED_PACKAGES || "";

  if (!input) {
    console.log("📦 No release information available.");
    process.exit(0);
  }

  const publishedPackages = JSON.parse(input);
  const summary = generateSummary(publishedPackages);

  // Output the summary
  console.log(summary);

  // Also write to file if specified
  if (process.env.OUTPUT_FILE) {
    fs.writeFileSync(process.env.OUTPUT_FILE, summary);
  }
} catch (error) {
  console.error("Error generating release summary:", error);
  // Don't fail the build, just output a simple message
  console.log("📦 Release completed successfully.");
}

export { generateSummary, makeUserFriendly };
