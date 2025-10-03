#!/usr/bin/env tsx
/**
 * Initial manual publish to GitHub Packages
 *
 * ⚠️  MAINTAINERS ONLY - For initial GitHub Packages setup
 * ⚠️  Normal package installation uses npm (no authentication required)
 * ⚠️  This script does NOT modify your global ~/.npmrc file
 *
 * This script performs the first-time publish of packages to GitHub Packages.
 * After this initial publish, the automated workflow handles subsequent releases.
 *
 * Environment variables required:
 * - GITHUB_TOKEN or GH_TOKEN: GitHub personal access token with packages:write scope
 *
 * Prerequisites:
 * 1. Authenticate with GitHub: gh auth login
 * 2. Export token: export GITHUB_TOKEN=$(gh auth token)
 * 3. Run from repository root: pnpm tsx scripts/initial-github-packages-publish.ts
 *
 * What it does:
 * - Creates temporary .npmrc for GitHub Packages authentication
 * - Publishes each package to GitHub Packages
 * - Cleans up temporary configuration automatically
 * - Does NOT modify your global ~/.npmrc file
 *
 * Exit codes:
 * - 0: Success
 * - 1: Fatal error (missing token or publish failure)
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

// Packages to publish (exclude private packages)
const PACKAGES = [
  { name: "@robeasthope/ui", path: "packages/ui" },
  { name: "@robeasthope/eslint-config", path: "packages/eslint-config" },
  { name: "@robeasthope/colours", path: "packages/colours" },
];

/**
 * Main entry point for initial GitHub Packages publish
 * Uses temporary .npmrc configuration that is automatically cleaned up
 */
function main() {
  // eslint-disable-next-line no-console
  console.log("🚀 Initial GitHub Packages Publish");
  // eslint-disable-next-line no-console
  console.log("=====================================");
  // eslint-disable-next-line no-console
  console.log("");

  // Check for GitHub token
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    console.error(
      "❌ Error: GITHUB_TOKEN or GH_TOKEN environment variable required",
    );
    console.error("");
    console.error("Run: export GITHUB_TOKEN=$(gh auth token)");
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log("✅ GitHub token found");
  // eslint-disable-next-line no-console
  console.log("");

  // Create temporary .npmrc for GitHub Packages
  const temporaryNpmrcPath = createTemporaryNpmrc(token);

  // Track publish results
  let successCount = 0;
  let failureCount = 0;

  try {
    // Publish each package
    for (const pkg of PACKAGES) {
      try {
        publishPackage(pkg, temporaryNpmrcPath);
        successCount++;
      } catch (error) {
        failureCount++;
        console.error(`❌ Failed to publish ${pkg.name}`);
        console.error(
          `   Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        // Continue to next package instead of exiting
      }
    }
  } finally {
    // Always clean up temporary .npmrc
    cleanupTemporaryNpmrc(temporaryNpmrcPath);
  }

  // eslint-disable-next-line no-console
  console.log("");

  if (successCount > 0) {
    // eslint-disable-next-line no-console
    console.log(
      `✅ Published ${successCount}/${PACKAGES.length} package(s) to GitHub Packages!`,
    );
    // eslint-disable-next-line no-console
    console.log("");
    // eslint-disable-next-line no-console
    console.log("Next steps:");
    // eslint-disable-next-line no-console
    console.log(
      "1. Verify packages at https://github.com/RobEasthope?tab=packages",
    );
    // eslint-disable-next-line no-console
    console.log(
      "2. Future releases will automatically publish to both registries",
    );
  }

  if (failureCount > 0) {
    console.warn(
      `⚠️ ${failureCount}/${PACKAGES.length} package(s) failed to publish`,
    );

    // Exit with error if all packages failed
    if (successCount === 0) {
      console.error("❌ No packages could be published");
      process.exit(1);
    }
  }
}

/**
 * Creates a temporary .npmrc file for GitHub Packages authentication
 * @param token - GitHub personal access token
 * @returns Path to the temporary .npmrc file
 */
function createTemporaryNpmrc(token: string): string {
  const temporaryNpmrcPath = join(process.cwd(), ".npmrc.github-packages-temp");

  // eslint-disable-next-line no-console
  console.log("📝 Creating temporary .npmrc for GitHub Packages...");

  // Only include auth token, NOT scope override
  // This allows npm to use GitHub Packages with explicit --registry flag
  const githubConfig = `//npm.pkg.github.com/:_authToken=${token}`;

  writeFileSync(temporaryNpmrcPath, githubConfig);

  // eslint-disable-next-line no-console
  console.log("✅ Created temporary .npmrc");
  // eslint-disable-next-line no-console
  console.log("⚠️  This does NOT modify your global ~/.npmrc file");
  // eslint-disable-next-line no-console
  console.log("");

  return temporaryNpmrcPath;
}

/**
 * Cleans up the temporary .npmrc file
 * @param temporaryNpmrcPath - Path to the temporary .npmrc file
 */
function cleanupTemporaryNpmrc(temporaryNpmrcPath: string) {
  if (existsSync(temporaryNpmrcPath)) {
    unlinkSync(temporaryNpmrcPath);
    // eslint-disable-next-line no-console
    console.log("");
    // eslint-disable-next-line no-console
    console.log("🧹 Cleaned up temporary configuration");
  }
}

/**
 * Publishes a single package to GitHub Packages using temporary .npmrc
 * @param pkg - Package configuration
 * @param pkg.name - Package name (e.g., "@robeasthope/ui")
 * @param pkg.path - Relative path to package directory
 * @param temporaryNpmrcPath - Path to temporary .npmrc file
 * @throws Error if publish fails
 */
function publishPackage(
  pkg: { name: string; path: string },
  temporaryNpmrcPath: string,
) {
  const packagePath = join(process.cwd(), pkg.path);
  const packageJsonPath = join(packagePath, "package.json");

  // Read and parse package.json
  const packageJsonContent = readFileSync(packageJsonPath, "utf8");
  let packageJson;
  try {
    packageJson = JSON.parse(packageJsonContent);
  } catch (error) {
    throw new Error(
      `Failed to parse package.json at ${packageJsonPath}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  // eslint-disable-next-line no-console
  console.log(`📦 Publishing ${pkg.name}@${packageJson.version}...`);

  // Check if package is private
  if (packageJson.private) {
    // eslint-disable-next-line no-console
    console.log("   ⏭️  Skipping (private package)");
    // eslint-disable-next-line no-console
    console.log("");
    return;
  }

  // Backup original publishConfig
  const originalPublishConfig = packageJson.publishConfig;

  try {
    // Update publishConfig for GitHub Packages
    packageJson.publishConfig = {
      ...originalPublishConfig,
      registry: "https://npm.pkg.github.com/",
    };

    // Write modified package.json
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

    // Publish to GitHub Packages using temporary .npmrc
    try {
      execSync("npm publish --registry=https://npm.pkg.github.com/", {
        cwd: packagePath,
        env: {
          ...process.env,
          NPM_CONFIG_USERCONFIG: temporaryNpmrcPath, // Use temp .npmrc
        },
        stdio: "inherit",
      });
      // eslint-disable-next-line no-console
      console.log("   ✅ Published successfully");
    } catch (error) {
      console.error("   ❌ Failed to publish");
      console.error(
        `   Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw error;
    }
  } finally {
    // Restore original package.json
    writeFileSync(packageJsonPath, packageJsonContent);
  }

  // eslint-disable-next-line no-console
  console.log("");
}

// Run the script
main();
