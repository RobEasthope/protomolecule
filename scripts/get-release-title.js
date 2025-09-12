#!/usr/bin/env node

/**
 * Generate a descriptive release title based on pending changesets
 * This script analyzes changeset files to create informative PR titles
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getChangesets() {
  const changesetDir = path.join(process.cwd(), ".changeset");
  const files = fs.readdirSync(changesetDir);

  const changesets = [];

  files.forEach((file) => {
    if (file.endsWith(".md") && file !== "README.md") {
      const filePath = path.join(changesetDir, file);
      const content = fs.readFileSync(filePath, "utf8");

      // Parse the frontmatter
      const lines = content.split("\n");
      let inFrontmatter = false;
      let frontmatter = "";
      let summary = "";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === "---") {
          if (!inFrontmatter) {
            inFrontmatter = true;
          } else {
            // End of frontmatter, rest is summary
            summary = lines
              .slice(i + 1)
              .join("\n")
              .trim();
            break;
          }
        } else if (inFrontmatter) {
          frontmatter += line + "\n";
        }
      }

      if (frontmatter && summary) {
        // Parse packages from frontmatter
        const packages = [];
        const packageRegex =
          /"@protomolecule\/([^"]+)":\s*(patch|minor|major)/g;
        let match;
        while ((match = packageRegex.exec(frontmatter)) !== null) {
          packages.push({
            name: match[1],
            type: match[2],
          });
        }

        changesets.push({
          file,
          packages,
          summary,
        });
      }
    }
  });

  return changesets;
}

function generateTitle() {
  try {
    const changesets = getChangesets();

    if (changesets.length === 0) {
      return "chore: version packages";
    }

    // Analyze all changesets
    const allPackages = new Map();
    const changeTypes = new Set();
    let hasBreaking = false;
    let hasFeatures = false;
    let hasFixes = false;
    let hasDocs = false;

    changesets.forEach((changeset) => {
      // Track packages and their version bump types
      changeset.packages.forEach((pkg) => {
        if (!allPackages.has(pkg.name)) {
          allPackages.set(pkg.name, pkg.type);
        } else {
          // Upgrade to higher bump type if needed
          const current = allPackages.get(pkg.name);
          if (
            pkg.type === "major" ||
            (pkg.type === "minor" && current === "patch")
          ) {
            allPackages.set(pkg.name, pkg.type);
          }
        }
      });

      // Analyze summary for change types
      const summary = changeset.summary.toLowerCase();

      if (summary.includes("breaking") || summary.includes("!:")) {
        hasBreaking = true;
      }
      if (
        summary.startsWith("feat") ||
        summary.includes("feature") ||
        summary.includes("add")
      ) {
        hasFeatures = true;
      }
      if (
        summary.startsWith("fix") ||
        summary.includes("fix") ||
        summary.includes("bug")
      ) {
        hasFixes = true;
      }
      if (summary.startsWith("docs") || summary.includes("documentation")) {
        hasDocs = true;
      }
    });

    // Generate title based on what we found
    const packageNames = Array.from(allPackages.keys());
    const hasMajor = Array.from(allPackages.values()).includes("major");
    const hasMinor = Array.from(allPackages.values()).includes("minor");

    let title = "chore";
    let description = "";

    // Determine title prefix and description
    if (hasBreaking || hasMajor) {
      title = "chore!";
      if (packageNames.length === 1) {
        description = `release ${packageNames[0]} with breaking changes`;
      } else if (packageNames.length <= 3) {
        description = `release ${packageNames.join(", ")} (breaking changes)`;
      } else {
        description = `release ${packageNames.length} packages (breaking changes)`;
      }
    } else if (hasFeatures && hasFixes) {
      if (packageNames.length === 1) {
        description = `release ${packageNames[0]} with features and fixes`;
      } else if (packageNames.length <= 3) {
        description = `release ${packageNames.join(", ")} with features and fixes`;
      } else {
        description = `release ${packageNames.length} packages with features and fixes`;
      }
    } else if (hasFeatures || hasMinor) {
      if (packageNames.length === 1) {
        description = `release ${packageNames[0]} with new features`;
      } else if (packageNames.length <= 3) {
        description = `release ${packageNames.join(", ")} with new features`;
      } else {
        description = `release ${packageNames.length} packages with new features`;
      }
    } else if (hasFixes) {
      if (packageNames.length === 1) {
        description = `release ${packageNames[0]} with bug fixes`;
      } else if (packageNames.length <= 3) {
        description = `release ${packageNames.join(", ")} with bug fixes`;
      } else {
        description = `release ${packageNames.length} packages with bug fixes`;
      }
    } else if (hasDocs) {
      if (packageNames.length === 1) {
        description = `release ${packageNames[0]} with documentation updates`;
      } else {
        description = `release ${packageNames.length} packages with documentation updates`;
      }
    } else {
      // Default case
      if (packageNames.length === 1) {
        description = `release ${packageNames[0]}`;
      } else if (packageNames.length <= 3) {
        description = `release ${packageNames.join(", ")}`;
      } else {
        description = `release ${packageNames.length} packages`;
      }
    }

    return `${title}: ${description}`;
  } catch (error) {
    console.error("Error generating title:", error);
    return "chore: version packages";
  }
}

// Output the title
const title = generateTitle();
console.log(title);
