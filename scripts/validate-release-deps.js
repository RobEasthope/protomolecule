#!/usr/bin/env node

/**
 * Validates that all dependencies required for the release workflow are installed
 * This script is run in CI before attempting to publish packages
 */

import { existsSync, readFileSync } from "fs";
import { createRequire } from "module";
import { join } from "path";

const require = createRequire(import.meta.url);

let hasErrors = false;

console.log("🔍 Validating release workflow dependencies...\n");

// Check for required packages
const requiredPackages = ["@changesets/cli", "@changesets/get-github-info"];

for (const pkg of requiredPackages) {
  try {
    require.resolve(pkg);
    console.log(`✅ ${pkg} is installed`);
  } catch {
    console.error(`❌ ${pkg} is NOT installed - release will fail!`);
    hasErrors = true;
  }
}

// Check changeset config exists
const changesetConfigPath = join(process.cwd(), ".changeset", "config.json");
if (existsSync(changesetConfigPath)) {
  console.log("✅ Changeset config exists");

  try {
    const config = JSON.parse(readFileSync(changesetConfigPath, "utf-8"));

    // If using custom changelog, validate it exists
    if (Array.isArray(config.changelog)) {
      const changelogPath = join(
        process.cwd(),
        ".changeset",
        config.changelog[0],
      );
      if (existsSync(changelogPath)) {
        console.log(
          `✅ Custom changelog config exists at ${config.changelog[0]}`,
        );

        // Try to import it to ensure it's valid
        try {
          await import(changelogPath);
          console.log("✅ Changelog config can be imported successfully");
        } catch (error) {
          console.error(
            `❌ Failed to import changelog config: ${error.message}`,
          );
          hasErrors = true;
        }
      } else {
        console.error(
          `❌ Custom changelog config not found at ${config.changelog[0]}`,
        );
        hasErrors = true;
      }
    }
  } catch (error) {
    console.error(`❌ Failed to parse changeset config: ${error.message}`);
    hasErrors = true;
  }
} else {
  console.error("❌ Changeset config not found at .changeset/config.json");
  hasErrors = true;
}

// Check package.json for proper setup
const packageJsonPath = join(process.cwd(), "package.json");
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

  if (
    packageJson.packageManager &&
    packageJson.packageManager.includes("pnpm")
  ) {
    console.log(`✅ Package manager is set to ${packageJson.packageManager}`);
  } else {
    console.warn("⚠️ Package manager is not set to pnpm");
  }
} else {
  console.error("❌ package.json not found");
  hasErrors = true;
}

console.log("\n" + "=".repeat(50));

if (hasErrors) {
  console.error(
    "\n❌ Validation failed! Fix the issues above before releasing.\n",
  );
  process.exit(1);
} else {
  console.log("\n✅ All release dependencies are properly configured!\n");
  process.exit(0);
}
