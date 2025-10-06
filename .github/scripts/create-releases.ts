#!/usr/bin/env tsx
/**
 * create-releases.ts
 *
 * Creates GitHub releases for published packages.
 * Extracts changelog content and creates appropriately tagged releases.
 *
 * Usage:
 *   tsx create-releases.ts <repository>
 *
 * Arguments:
 *   repository: GitHub repository in format "owner/repo"
 *
 * Environment variables:
 *   PUBLISHED_PACKAGES: Required - JSON array of {name, version} objects
 *   GITHUB_TOKEN: Required for gh CLI authentication
 *   GITHUB_STEP_SUMMARY: Optional, for GitHub Actions job summary
 *
 * Exit codes:
 *   0: Success
 *   1: Error (invalid input, release creation failed, etc.)
 */

import { execSync } from "node:child_process";
import {
  readFileSync,
  existsSync,
  appendFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface Package {
  name: string;
  version: string;
}

// Type for file system operations (allows dependency injection for testing)
export type FileExistsFn = (path: string) => boolean;

// Semver regex pattern
export const SEMVER_REGEX =
  /^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;

// Package name regex (scoped package with lowercase alphanumeric and hyphens)
export const PACKAGE_NAME_REGEX = /^@[a-z0-9-]+\/[a-z0-9-]+$/;

/**
 * Appends text to GITHUB_STEP_SUMMARY
 */
function addToSummary(text: string): void {
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, text);
  }
}

/**
 * Checks if a GitHub release exists
 */
function releaseExists(tag: string): boolean {
  try {
    execSync(`gh release view "${tag}"`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Determines possible changelog paths for a package
 * Pure function - easily testable
 */
export function getChangelogPaths(packageName: string): string[] {
  if (packageName === "@protomolecule/infrastructure") {
    return ["infrastructure/CHANGELOG.md"];
  }

  // Extract package name without scope
  const pkgName = packageName.replace("@robeasthope/", "");

  // Try apps/ first, then packages/
  return [`apps/${pkgName}/CHANGELOG.md`, `packages/${pkgName}/CHANGELOG.md`];
}

/**
 * Finds the CHANGELOG.md file for a package using file system check
 * I/O wrapper with dependency injection for testability
 */
export function findChangelogPath(
  packageName: string,
  fileExists: FileExistsFn,
): string | null {
  const paths = getChangelogPaths(packageName);

  for (const path of paths) {
    if (fileExists(path)) {
      return path;
    }
  }

  return null;
}

/**
 * Extracts changelog content for a specific version from changelog text
 * Pure function - easily testable
 */
export function extractChangelogContent(
  content: string,
  version: string,
): string {
  const lines = content.split("\n");

  // No need to escape - we're doing literal string matching with startsWith
  const versionHeader = `## ${version}`;

  // Find the start of this version section
  const startIndex = lines.findIndex((line) => line.startsWith(versionHeader));
  if (startIndex === -1) return "";

  // Find the end (next version header or end of file)
  // Match full semver pattern: ## 1.2.3 (not ## Unreleased or other headers)
  const endIndex = lines.findIndex(
    (line, idx) => idx > startIndex && line.match(/^## \d+\.\d+\.\d+/),
  );

  // Extract content between headers (excluding the header itself)
  const changelogLines =
    endIndex === -1
      ? lines.slice(startIndex + 1)
      : lines.slice(startIndex + 1, endIndex);

  return changelogLines.join("\n").trim();
}

/**
 * Creates a GitHub release
 */
function createRelease(tag: string, changelog: string, version: string): void {
  const notes = changelog || `Release ${version}`;

  // Write notes to temporary file to prevent command injection
  const notesFile = join(tmpdir(), `release-notes-${Date.now()}.md`);
  writeFileSync(notesFile, notes, "utf8");

  try {
    execSync(
      `gh release create "${tag}" --title "${tag}" --notes-file "${notesFile}" --target main`,
      {
        stdio: "inherit",
      },
    );
  } catch (error) {
    console.error(`❌ ERROR: Failed to create release for ${tag}`);
    throw error;
  }
}

/**
 * Main release creation logic
 */
function createReleases(): void {
  // Validate arguments
  if (process.argv.length < 3) {
    console.error("❌ ERROR: Missing required argument");
    console.error("Usage: tsx create-releases.ts <repository>");
    console.error("Environment variable PUBLISHED_PACKAGES must be set");
    process.exit(1);
  }

  const repository = process.argv[2];

  // Get published packages from environment variable (avoids shell quoting issues with JSON)
  const publishedJson = process.env.PUBLISHED_PACKAGES;
  if (!publishedJson) {
    console.error("❌ ERROR: PUBLISHED_PACKAGES environment variable not set");
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

  console.log("Creating releases for published packages...");

  // Initialize summary table
  addToSummary("## 🚀 Release Summary\n\n");
  addToSummary("| Package | Version | Tag | Release |\n");
  addToSummary("|---------|---------|-----|---------|\\n");

  for (const pkg of packages) {
    const { name, version } = pkg;

    // Validate package name format
    if (!PACKAGE_NAME_REGEX.test(name)) {
      console.error(`❌ ERROR: Invalid package name format: ${name}`);
      console.error(
        "Expected format: @scope/package-name (lowercase, alphanumeric, hyphens only)",
      );
      process.exit(1);
    }

    // Validate version format
    if (!SEMVER_REGEX.test(version)) {
      console.error(`❌ ERROR: Invalid version format: ${version}`);
      console.error(
        "Expected semver format (e.g., 1.0.0, 1.0.0-beta.1, 1.0.0+build.123)",
      );
      process.exit(1);
    }

    const tag = `${name}@${version}`;
    console.log(`Creating release for ${tag}...`);

    // Check if release already exists (idempotency)
    if (releaseExists(tag)) {
      console.log(`⚠️  Release ${tag} already exists, skipping creation`);
      console.log(
        `   Existing release: https://github.com/${repository}/releases/tag/${tag}`,
      );

      const releaseUrl = `https://github.com/${repository}/releases/tag/${tag}`;
      addToSummary(
        `| ${name} | ${version} | \`${tag}\` | [View Release](${releaseUrl}) |\\n`,
      );
      continue;
    }

    // Extract changelog
    const changelogPath = findChangelogPath(name, existsSync);
    let changelog = "";
    if (changelogPath && existsSync(changelogPath)) {
      const content = readFileSync(changelogPath, "utf8");
      changelog = extractChangelogContent(content, version);
    }

    // Create release
    try {
      createRelease(tag, changelog, version);
      console.log(`✅ Successfully created release ${tag}`);

      const releaseUrl = `https://github.com/${repository}/releases/tag/${tag}`;
      addToSummary(
        `| ${name} | ${version} | \`${tag}\` | [View Release](${releaseUrl}) |\\n`,
      );
    } catch (error) {
      process.exit(1);
    }
  }

  // Add summary footer
  addToSummary(`\n**Total packages released:** ${packages.length}\n`);

  console.log("🎉 All package releases created successfully");
}

// Run the script only if executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    createReleases();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ ERROR: Unexpected error:", errorMessage);
    process.exit(1);
  }
}
