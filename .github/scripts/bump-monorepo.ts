#!/usr/bin/env tsx
/**
 * bump-monorepo.ts
 *
 * Bumps monorepo version based on published package versions.
 * Determines bump type (major/minor/patch) from package changes,
 * updates root package.json, creates git tag, and pushes changes.
 *
 * Usage:
 *   tsx bump-monorepo.ts
 *
 * Environment variables:
 *   PUBLISHED_PACKAGES: Required - JSON array of {name, version} objects
 *   GITHUB_TOKEN: Required for git push authentication
 *
 * Outputs (to /tmp for next step):
 *   /tmp/published-packages.json: Copy of input JSON
 *   /tmp/bump-type.txt: Calculated bump type (major/minor/patch)
 *   /tmp/package-count.txt: Number of packages published
 *   /tmp/new-version.txt: New monorepo version
 *
 * Exit codes:
 *   0: Success
 *   1: Error (invalid input, git operations failed, etc.)
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

interface Package {
  name: string;
  version: string;
}

interface PackageJson {
  version: string;
  [key: string]: unknown;
}

interface SemverParts {
  major: number;
  minor: number;
  patch: number;
}

export type BumpType = "major" | "minor" | "patch";

/**
 * Parses a semver string into its components
 * Pure function - easily testable
 */
export function parseSemver(version: string): SemverParts {
  // Validate version string format
  if (!version || typeof version !== "string") {
    throw new Error(`Invalid version: expected string, got ${typeof version}`);
  }

  const parts = version.split(".");

  // Validate we have exactly 3 parts (major.minor.patch)
  if (parts.length < 3) {
    throw new Error(
      `Invalid semver format: ${version} (expected major.minor.patch)`,
    );
  }

  const major = Number.parseInt(parts[0], 10);
  const minor = Number.parseInt(parts[1], 10);

  // Handle pre-release versions (e.g., 1.0.0-beta.1)
  const patchPart = parts[2].split("-")[0];
  const patch = Number.parseInt(patchPart, 10);

  // Validate all parts are valid numbers
  if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
    throw new Error(
      `Invalid semver components in: ${version} (major=${major}, minor=${minor}, patch=${patch})`,
    );
  }

  // Validate non-negative
  if (major < 0 || minor < 0 || patch < 0) {
    throw new Error(
      `Invalid semver: negative values not allowed in ${version}`,
    );
  }

  return { major, minor, patch };
}

/**
 * Gets the previous git tag for a package
 */
function getPreviousTag(packageName: string): string | null {
  try {
    const tags = execSync(`git tag -l "${packageName}@*" --sort=-v:refname`, {
      encoding: "utf8",
    })
      .trim()
      .split("\n")
      .filter(Boolean);

    // Get the second most recent tag (most recent is current release)
    return tags.length >= 2 ? tags[1] : null;
  } catch {
    return null;
  }
}

/**
 * Determines the bump type by comparing package versions
 */
function determineBumpType(packages: Package[]): BumpType {
  let bumpType: BumpType = "patch";

  for (const pkg of packages) {
    const { name, version } = pkg;
    const currentVersion = parseSemver(version);

    // Get previous version from git tags
    const prevTag = getPreviousTag(name);

    if (prevTag) {
      // Extract version from tag (format: @scope/package@1.0.0)
      const prevVersionStr = prevTag.split("@").pop() || "";
      const prevVersion = parseSemver(prevVersionStr);

      // Compare versions to determine bump type
      if (currentVersion.major > prevVersion.major) {
        console.log(
          `Detected major bump in ${name}: ${prevVersionStr} → ${version}`,
        );
        return "major"; // Major bump wins immediately
      } else if (
        currentVersion.minor > prevVersion.minor &&
        bumpType !== "major"
      ) {
        bumpType = "minor";
        console.log(
          `Detected minor bump in ${name}: ${prevVersionStr} → ${version}`,
        );
      }
    } else {
      // First release of this package - treat as minor by default
      console.log(
        `First release of ${name}@${version} (no previous tag found)`,
      );
      if (bumpType === "patch") {
        bumpType = "minor";
      }
    }
  }

  return bumpType;
}

/**
 * Calculates the new monorepo version
 * Pure function - easily testable
 */
export function calculateNewVersion(
  currentVersion: string,
  bumpType: BumpType,
): string {
  const { major, minor, patch } = parseSemver(currentVersion);

  switch (bumpType) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
  }
}

/**
 * Checks if a git tag exists
 */
function tagExists(tag: string): boolean {
  try {
    execSync(`git rev-parse "${tag}"`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a git tag exists on remote
 */
function remoteTagExists(tag: string): boolean {
  try {
    const output = execSync("git ls-remote --tags origin", {
      encoding: "utf8",
    });
    return output.includes(`refs/tags/${tag}`);
  } catch {
    return false;
  }
}

/**
 * Updates package.json with new version
 */
function updatePackageJson(newVersion: string): void {
  const packageJson = JSON.parse(
    readFileSync("package.json", "utf8"),
  ) as PackageJson;
  packageJson.version = newVersion;
  writeFileSync("package.json", JSON.stringify(packageJson, null, 2) + "\n");
}

/**
 * Main monorepo bump logic
 */
function bumpMonorepo(): void {
  // Get published packages from environment variable (avoids shell quoting issues with JSON)
  const publishedJson = process.env.PUBLISHED_PACKAGES;
  if (!publishedJson) {
    console.error("❌ ERROR: PUBLISHED_PACKAGES environment variable not set");
    console.error("Usage: tsx bump-monorepo.ts");
    console.error("Environment variable PUBLISHED_PACKAGES must be set");
    process.exit(1);
  }

  // Parse packages
  let packages: Package[];
  try {
    packages = JSON.parse(publishedJson) as Package[];
  } catch (error) {
    console.error(
      "❌ ERROR: Invalid JSON in PUBLISHED_PACKAGES environment variable",
    );
    console.error(`Received: ${publishedJson}`);
    process.exit(1);
  }

  console.log("Creating monorepo release...");

  // Get current monorepo version
  const packageJson = JSON.parse(
    readFileSync("package.json", "utf8"),
  ) as PackageJson;
  const currentVersion = packageJson.version || "0.0.0";
  console.log(`Current monorepo version: ${currentVersion}`);

  // Determine bump type
  const bumpType = determineBumpType(packages);
  console.log(`Calculated bump type: ${bumpType}`);

  // Calculate new version
  const newVersion = calculateNewVersion(currentVersion, bumpType);
  console.log(`New monorepo version: ${newVersion}`);

  // Update package.json
  updatePackageJson(newVersion);

  // Configure git with error handling
  try {
    execSync('git config user.name "github-actions[bot]"');
    execSync(
      'git config user.email "github-actions[bot]@users.noreply.github.com"',
    );
  } catch (error) {
    console.error("❌ ERROR: Failed to configure git user");
    throw error;
  }

  // Commit version bump
  try {
    execSync("git add package.json");
    execSync(`git commit -m "chore: bump monorepo to v${newVersion}"`);
  } catch (error) {
    console.error("❌ ERROR: Failed to commit version bump");
    throw error;
  }

  // Store data for next step (write BEFORE pushing in case push fails)
  writeFileSync("/tmp/published-packages.json", publishedJson);
  writeFileSync("/tmp/bump-type.txt", bumpType);
  writeFileSync("/tmp/package-count.txt", String(packages.length));
  writeFileSync("/tmp/new-version.txt", newVersion);

  // Generate package list for logging
  const packageList = packages
    .map((pkg) => `${pkg.name}@${pkg.version}`)
    .join(", ");
  console.log(`Packages: ${packageList}`);

  // Create and push tag (idempotency)
  const tag = `v${newVersion}`;
  if (tagExists(tag)) {
    console.log(`⚠️  Tag ${tag} already exists, skipping tag creation`);
  } else {
    execSync(`git tag "${tag}"`);
    console.log(`✅ Created tag ${tag}`);
  }

  // Push commit
  execSync("git push origin HEAD");

  // Push tag with error handling for race conditions
  try {
    execSync(`git push origin "${tag}"`, { stdio: "inherit" });
    console.log(`✅ Pushed tag ${tag} to remote`);
  } catch (error) {
    // Tag might already exist on remote (race condition)
    if (remoteTagExists(tag)) {
      console.log(
        `⚠️  Tag ${tag} already exists on remote (concurrent creation detected)`,
      );
    } else {
      // Different error - re-throw
      console.error(`❌ ERROR: Failed to push tag ${tag}`);
      throw error;
    }
  }

  console.log(`✅ Monorepo version updated to ${newVersion}`);

  console.log("✅ Monorepo version bump complete");
}

// Run the script only if executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    bumpMonorepo();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ ERROR: Unexpected error:", errorMessage);
    process.exit(1);
  }
}
