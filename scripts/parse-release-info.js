#!/usr/bin/env node

/**
 * Parses published package information and determines release version
 * Used by the continuous deployment workflow to create GitHub releases
 */

import fs from "fs";

/**
 * Parse semantic version with pre-release support
 */
function parseVersion(version) {
  const [versionPart, prerelease] = version.split("-");
  const [major, minor, patch] = versionPart.split(".").map(Number);
  return { major, minor, patch, prerelease: prerelease || "" };
}

/**
 * Compare two semantic versions (returns positive if a > b)
 */
function compareSemver(a, b) {
  const va = parseVersion(a);
  const vb = parseVersion(b);

  // Compare version numbers (positive if a > b)
  if (va.major !== vb.major) return va.major - vb.major;
  if (va.minor !== vb.minor) return va.minor - vb.minor;
  if (va.patch !== vb.patch) return va.patch - vb.patch;

  // If versions are equal, non-prerelease > prerelease
  if (!va.prerelease && vb.prerelease) return 1;
  if (va.prerelease && !vb.prerelease) return -1;

  // Both prereleases: sort alphabetically
  return va.prerelease.localeCompare(vb.prerelease);
}

/**
 * Main function to parse release information
 */
function main() {
  try {
    // Read published packages from stdin
    const input = fs.readFileSync(0, "utf8").trim();
    const packages = [];

    // Parse the published packages from grep output
    if (input) {
      const lines = input.split("\n").filter(Boolean);
      for (const line of lines) {
        // Match both scoped (@scope/package@version) and non-scoped (package@version) packages
        // First try to match scoped packages
        let match = line.match(/(@[^@]+@[0-9]+\.[0-9]+\.[0-9]+.*)/);
        if (match) {
          // Scoped package: @scope/package@version
          const parts = match[1].match(/(@[^@]+)@([0-9]+\.[0-9]+\.[0-9]+.*)/);
          if (parts) {
            packages.push({
              name: parts[1],
              version: parts[2],
            });
          }
        } else {
          // Try non-scoped package: package@version
          match = line.match(/([^@]+)@([0-9]+\.[0-9]+\.[0-9]+.*)/);
          if (match) {
            packages.push({
              name: match[1],
              version: match[2],
            });
          }
        }
      }
    }

    // Determine release version and package list
    let result;
    if (packages.length > 0) {
      // Sort versions using proper semver comparison (descending order)
      const versions = packages.map((p) => p.version);
      const highest = versions.sort((a, b) => compareSemver(b, a))[0];
      const pkgList = packages.map((p) => `${p.name}@${p.version}`).join(", ");

      result = {
        version: highest,
        packages: pkgList,
        packageData: packages,
      };
    } else {
      // Fallback to date-based version if no packages
      const date = new Date().toISOString().split("T")[0];
      result = {
        version: date,
        packages: "No packages published",
        packageData: [],
      };
    }

    // Output JSON result
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error("Error parsing release info:", error.message);
    // Output fallback on error
    const date = new Date().toISOString().split("T")[0];
    console.log(
      JSON.stringify({
        version: date,
        packages: "Error parsing packages",
        packageData: [],
      }),
    );
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parseVersion, compareSemver };
