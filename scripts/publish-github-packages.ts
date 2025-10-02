#!/usr/bin/env tsx
/**
 * Publish packages to GitHub Packages registry
 *
 * This script publishes packages that were just published to npm
 * to the GitHub Packages registry as a mirror/backup.
 *
 * Usage: tsx scripts/publish-github-packages.ts
 *
 * Environment variables required:
 * - PUBLISHED_PACKAGES: JSON array of published packages from changesets
 * - NODE_AUTH_TOKEN: GitHub token for authentication
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type PublishedPackage = {
  name: string;
  version: string;
};

function main() {
  const publishedPackagesJson = process.env.PUBLISHED_PACKAGES;

  if (!publishedPackagesJson || publishedPackagesJson === "[]") {
    // eslint-disable-next-line no-console
    console.log("📦 No packages to publish to GitHub Packages");
    return;
  }

  const publishedPackages: PublishedPackage[] = JSON.parse(
    publishedPackagesJson,
  );

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

  for (const pkg of publishedPackages) {
    publishToGitHubPackages(pkg);
  }

  // eslint-disable-next-line no-console
  console.log("");
  // eslint-disable-next-line no-console
  console.log("✅ All packages published to GitHub Packages");
}

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

function getPackagePath(packageName: string): string {
  // Convert scoped package name to directory path
  // @robeasthope/ui -> packages/ui
  // @robeasthope/eslint-config -> packages/eslint-config
  const name = packageName.split("/")[1];
  return join(process.cwd(), "packages", name);
}

// Run the script
main();
