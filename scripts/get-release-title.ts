#!/usr/bin/env node

/**
 * Generate a descriptive release title based on pending changesets
 * This script analyzes changeset files to create informative PR titles
 */

import fs from "fs";
import path from "path";

type PackageChange = {
  name: string;
  type: "major" | "minor" | "patch";
};

type Changeset = {
  file: string;
  packages: PackageChange[];
  summary: string;
};

/**
 * Read and parse all changeset files from the .changeset directory
 * @returns Array of parsed changesets
 */
function getChangesets(): Changeset[] {
  const changesetDirectory = path.join(process.cwd(), ".changeset");
  const files = fs.readdirSync(changesetDirectory);

  const changesets: Changeset[] = [];

  for (const file of files) {
    if (file.endsWith(".md") && file !== "README.md") {
      const filePath = path.join(changesetDirectory, file);
      const content = fs.readFileSync(filePath, "utf8");

      // Parse the frontmatter
      const lines = content.split("\n");
      let inFrontmatter = false;
      let frontmatter = "";
      let summary = "";

      for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        if (line === "---") {
          if (!inFrontmatter) {
            inFrontmatter = true;
          } else {
            // End of frontmatter, rest is summary
            summary = lines
              .slice(index + 1)
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
        const packages: PackageChange[] = [];
        const packageRegex =
          /"@protomolecule\/([^"]+)":\s*(patch|minor|major)/g;
        let match;
        while ((match = packageRegex.exec(frontmatter)) !== null) {
          packages.push({
            name: match[1],
            type: match[2] as "major" | "minor" | "patch",
          });
        }

        changesets.push({
          file,
          packages,
          summary,
        });
      }
    }
  }

  return changesets;
}

/**
 * Determine the priority of a version bump type
 * @param type - Version bump type (major, minor, patch)
 * @returns Priority value (higher is more significant)
 */
function getVersionBumpPriority(type: string): number {
  const priorities: Record<string, number> = {
    major: 3,
    minor: 2,
    patch: 1,
  };
  return priorities[type] || 0;
}

/**
 * Compare two version bump types and return the more significant one
 * @param current - Current version bump type
 * @param candidate - Candidate version bump type
 * @returns The more significant version bump type
 */
function getHigherVersionBump(current: string, candidate: string): string {
  return getVersionBumpPriority(candidate) > getVersionBumpPriority(current)
    ? candidate
    : current;
}

/**
 * Generate a descriptive PR title based on pending changesets
 * @returns Generated PR title
 */
function generateTitle(): string {
  try {
    const changesets = getChangesets();

    if (changesets.length === 0) {
      return "chore: version packages";
    }

    // Analyze all changesets
    const allPackages = new Map<string, string>();
    let hasBreaking = false;
    let hasFeatures = false;
    let hasFixes = false;
    let hasDocumentation = false;

    for (const changeset of changesets) {
      // Track packages and their version bump types
      for (const pkg of changeset.packages) {
        if (!allPackages.has(pkg.name)) {
          allPackages.set(pkg.name, pkg.type);
        } else {
          // Use the more significant version bump type
          const current = allPackages.get(pkg.name) ?? "patch";
          const higher = getHigherVersionBump(current, pkg.type);
          allPackages.set(pkg.name, higher);
        }
      }

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
        hasDocumentation = true;
      }
    }

    // Generate title based on what we found
    const packageNames = Array.from(allPackages.keys());
    const hasMajor = Array.from(allPackages.values()).includes("major");
    const hasMinor = Array.from(allPackages.values()).includes("minor");

    let titlePrefix = "chore";
    let description = "";

    // Determine title prefix and description
    if (hasBreaking || hasMajor) {
      titlePrefix = "chore!";
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
    } else if (hasDocumentation) {
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

    return `${titlePrefix}: ${description}`;
  } catch (error) {
    console.error("Error generating title:", error);
    return "chore: version packages";
  }
}

// Output the title
const generatedTitle = generateTitle();
// eslint-disable-next-line no-console
console.log(generatedTitle);
