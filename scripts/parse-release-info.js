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

  // Compare version numbers
  if (va.major !== vb.major) return vb.major - va.major;
  if (va.minor !== vb.minor) return vb.minor - va.minor;
  if (va.patch !== vb.patch) return vb.patch - va.patch;

  // If versions are equal, non-prerelease > prerelease
  if (!va.prerelease && vb.prerelease) return -1;
  if (va.prerelease && !vb.prerelease) return 1;

  // Both prereleases: sort alphabetically (reversed)
  return vb.prerelease.localeCompare(va.prerelease);
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
        // Match pattern: @scope/package@version or package@version
        const match = line.match(/@?([^@]+)@([0-9]+\.[0-9]+\.[0-9]+.*)/);
        if (match) {
          const name = match[1].startsWith("@") ? match[1] : "@" + match[1];
          packages.push({
            name: name,
            version: match[2],
          });
        }
      }
    }

    // Determine release version and package list
    let result;
    if (packages.length > 0) {
      // Sort versions using proper semver comparison
      const versions = packages.map((p) => p.version);
      const highest = versions.sort(compareSemver)[0];
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