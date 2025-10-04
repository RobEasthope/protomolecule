#!/usr/bin/env tsx
/**
 * Publish packages to GitHub Packages registry
 *
 * This script publishes packages that were just published to npm
 * to the GitHub Packages registry as a mirror/backup.
 *
 * Environment variables required:
 * - PUBLISHED_PACKAGES: JSON array of published packages from changesets
 *   Format: [{"name": "@scope/package", "version": "1.0.0"}]
 * - NODE_AUTH_TOKEN: GitHub token for authentication (set by workflow)
 *
 * Usage: tsx scripts/publish-github-packages.ts
 *
 * Exit codes:
 * - 0: Success or non-fatal errors (at least one package published)
 * - 1: Fatal error (no packages could be published)
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import os from "os";
import { join } from "path";

type PublishedPackage = {
  name: string;
  version: string;
};

/**
 * Main entry point for publishing to GitHub Packages
 * Reads PUBLISHED_PACKAGES env var and publishes each package
 */
function main() {
  // Verify user's .npmrc doesn't have scope override
  checkUserNpmrc();

  const publishedPackagesJson = process.env.PUBLISHED_PACKAGES;

  if (!publishedPackagesJson || publishedPackagesJson === "[]") {
    // eslint-disable-next-line no-console
    console.log("📦 No packages to publish to GitHub Packages");
    return;
  }

  // Parse published packages with error handling
  let publishedPackages: PublishedPackage[];
  try {
    publishedPackages = JSON.parse(publishedPackagesJson);
  } catch (error) {
    console.error("❌ Failed to parse PUBLISHED_PACKAGES:");
    console.error(`  Raw value: ${publishedPackagesJson}`);
    console.error(
      `  Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    process.exit(1);
  }

  if (publishedPackages.length === 0) {
    // eslint-disable-next-line no-console
    console.log("📦 No packages to publish to GitHub Packages");
    return;
  }

  // eslint-disable-next-line no-console
  console.log(
    `📦 Publishing ${publishedPackages.length} package(s) to GitHub Packages...`,
  );
  // eslint-disable-next-line no-console
  console.log("");

  // Track failures to determine exit code
  let successCount = 0;
  let failureCount = 0;

  for (const pkg of publishedPackages) {
    try {
      publishToGitHubPackages(pkg);
      successCount++;
    } catch (error) {
      failureCount++;
      console.error(
        `❌ Unrecoverable error publishing ${pkg.name}@${pkg.version}`,
      );
      console.error(
        `  Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  // eslint-disable-next-line no-console
  console.log("");

  if (successCount > 0) {
    // eslint-disable-next-line no-console
    console.log(
      `✅ Published ${successCount}/${publishedPackages.length} package(s) to GitHub Packages`,
    );
  }

  if (failureCount > 0) {
    console.warn(
      `⚠️ Failed to publish ${failureCount}/${publishedPackages.length} package(s)`,
    );

    // Only fail if ALL packages failed (at least one success is acceptable)
    if (successCount === 0) {
      console.error("❌ No packages could be published to GitHub Packages");
      process.exit(1);
    }
  }
}

/**
 * Publishes a single package to GitHub Packages
 * Temporarily modifies package.json to point to GitHub Packages registry
 * @param pkg - Package to publish (name and version)
 * @throws Error if package path is invalid or package.json is malformed
 */
function publishToGitHubPackages(pkg: PublishedPackage) {
  const packagePath = getPackagePath(pkg.name);
  const packageJsonPath = join(packagePath, "package.json");

  // eslint-disable-next-line no-console
  console.log(`📤 Publishing ${pkg.name}@${pkg.version} to GitHub Packages...`);

  // Read original package.json
  const originalPackageJson = readFileSync(packageJsonPath, "utf8");
  const packageJson = JSON.parse(originalPackageJson);

  // Backup original publishConfig
  const originalPublishConfig = packageJson.publishConfig;

  try {
    // Update publishConfig to point to GitHub Packages
    packageJson.publishConfig = {
      ...originalPublishConfig,
      registry: "https://npm.pkg.github.com/",
    };

    // Write modified package.json
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

    // Publish to GitHub Packages
    try {
      execSync("npm publish --registry=https://npm.pkg.github.com/", {
        cwd: packagePath,
        stdio: "inherit",
      });
      // eslint-disable-next-line no-console
      console.log(
        `  ✅ ${pkg.name}@${pkg.version} published to GitHub Packages`,
      );
    } catch (error) {
      // Non-fatal error - log warning but continue

      console.warn(
        `  ⚠️ Failed to publish ${pkg.name}@${pkg.version} to GitHub Packages`,
      );

      console.warn(
        `  Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );

      console.warn(
        "  This is non-fatal - package is still available on npm registry",
      );
    }
  } finally {
    // Restore original package.json
    writeFileSync(packageJsonPath, originalPackageJson);
  }

  // eslint-disable-next-line no-console
  console.log("");
}

/**
 * Converts a scoped package name to its file system path
 * @param packageName - Scoped package name (e.g., "@robeasthope/ui")
 * @returns Absolute path to the package directory
 * @throws Error if package name is not scoped or directory doesn't exist
 * @example
 * getPackagePath("@robeasthope/ui") // -> "/path/to/packages/ui"
 */
function getPackagePath(packageName: string): string {
  // Validate package name format
  const parts = packageName.split("/");
  if (parts.length !== 2) {
    throw new Error(
      `Invalid package name format: ${packageName}. Expected scoped package like "@robeasthope/ui"`,
    );
  }

  const [scope, name] = parts;
  if (!scope.startsWith("@")) {
    throw new Error(
      `Invalid package name format: ${packageName}. Scope must start with "@"`,
    );
  }

  if (!name || name.trim() === "") {
    throw new Error(
      `Invalid package name format: ${packageName}. Package name cannot be empty`,
    );
  }

  // Build and validate path
  const packagePath = join(process.cwd(), "packages", name);

  if (!existsSync(packagePath)) {
    throw new Error(
      `Package directory not found: ${packagePath} (for package ${packageName})`,
    );
  }

  return packagePath;
}

/**
 * Checks if user's .npmrc has problematic scope override
 * Warns but doesn't fail - this is for developer awareness
 */
function checkUserNpmrc() {
  const homeNpmrc = join(os.homedir(), ".npmrc");

  if (!existsSync(homeNpmrc)) {
    return; // No .npmrc, nothing to check
  }

  const content = readFileSync(homeNpmrc, "utf8");

  if (content.includes("@robeasthope:registry=")) {
    console.warn("");
    console.warn("⚠️  WARNING: Found @robeasthope:registry in your ~/.npmrc");
    console.warn(
      "⚠️  This may cause packages to resolve from GitHub Packages instead of npm",
    );
    console.warn("");
    console.warn("To fix this, run:");
    console.warn("  pnpm tsx scripts/cleanup-npmrc.ts");
    console.warn("");
  }
}

// Run the script
main();
