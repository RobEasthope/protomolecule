#!/usr/bin/env tsx
/**
 * Initial manual publish to GitHub Packages
 *
 * This script performs the first-time publish of packages to GitHub Packages.
 * After this initial publish, the automated workflow can handle subsequent releases.
 *
 * Prerequisites:
 * 1. Authenticate with GitHub: gh auth login
 * 2. Run from repository root: tsx scripts/initial-github-packages-publish.ts
 *
 * What it does:
 * - Reads current package versions from package.json
 * - Configures npm for GitHub Packages registry
 * - Publishes each package to GitHub Packages
 * - Restores original package.json files
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Packages to publish (exclude private packages)
const PACKAGES = [
  { name: "@robeasthope/ui", path: "packages/ui" },
  { name: "@robeasthope/eslint-config", path: "packages/eslint-config" },
  { name: "@robeasthope/colours", path: "packages/colours" },
];

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

  // Configure npm for GitHub Packages
  configureNpmForGitHub(token);

  // Publish each package
  for (const pkg of PACKAGES) {
    publishPackage(pkg);
  }

  // eslint-disable-next-line no-console
  console.log("");
  // eslint-disable-next-line no-console
  console.log("✅ All packages published to GitHub Packages!");
  // eslint-disable-next-line no-console
  console.log("");
  // eslint-disable-next-line no-console
  console.log("Next steps:");
  // eslint-disable-next-line no-console
  console.log(
    "1. Verify packages at https://github.com/RobEasthope?tab=packages",
  );
  // eslint-disable-next-line no-console
  console.log("2. Merge PR #192 to enable automated dual publishing");
}

function configureNpmForGitHub(token: string) {
  const npmrcPath = join(process.env.HOME || "~", ".npmrc");

  // eslint-disable-next-line no-console
  console.log("📝 Configuring .npmrc for GitHub Packages...");

  // Read existing .npmrc if it exists
  let npmrcContent = "";
  try {
    npmrcContent = readFileSync(npmrcPath, "utf8");
  } catch {
    // File doesn't exist, start fresh
  }

  // Add GitHub Packages configuration if not already present
  const githubConfig = `
# GitHub Packages configuration
//npm.pkg.github.com/:_authToken=${token}
@robeasthope:registry=https://npm.pkg.github.com
`;

  if (npmrcContent.includes("npm.pkg.github.com")) {
    // eslint-disable-next-line no-console
    console.log("✅ .npmrc already configured");
  } else {
    writeFileSync(npmrcPath, npmrcContent + githubConfig);
    // eslint-disable-next-line no-console
    console.log("✅ .npmrc configured");
  }

  // eslint-disable-next-line no-console
  console.log("");
}

function publishPackage(pkg: { name: string; path: string }) {
  const packagePath = join(process.cwd(), pkg.path);
  const packageJsonPath = join(packagePath, "package.json");

  // Read package.json
  const packageJsonContent = readFileSync(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonContent);

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

    // Publish to GitHub Packages
    try {
      execSync("npm publish --registry=https://npm.pkg.github.com/", {
        cwd: packagePath,
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
