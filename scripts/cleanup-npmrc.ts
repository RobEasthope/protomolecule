#!/usr/bin/env tsx
/**
 * Cleanup script to remove GitHub Packages scope override from .npmrc
 *
 * This fixes the issue where packages were resolving from GitHub Packages
 * instead of npm, causing authentication errors.
 *
 * What it does:
 * - Checks for @robeasthope:registry override in ~/.npmrc
 * - Creates a backup before making changes
 * - Removes the scope override
 * - Cleans up GitHub Packages auth token if present
 *
 * Usage: pnpm tsx scripts/cleanup-npmrc.ts
 *
 * Safe to run multiple times - will skip if no cleanup needed.
 */

/* eslint-disable no-console */

import { copyFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import os from "os";
import { join } from "path";

function main() {
  console.log("🔍 GitHub Packages .npmrc Cleanup");
  console.log("=====================================");
  console.log("");

  const npmrcPath = join(os.homedir(), ".npmrc");

  if (!existsSync(npmrcPath)) {
    console.log("✅ No ~/.npmrc file found - nothing to clean up");
    console.log("");
    console.log("Your npm is using the default registry (npmjs.org).");
    return;
  }

  console.log(`📄 Checking ${npmrcPath}...`);

  const content = readFileSync(npmrcPath, "utf8");
  const lines = content.split("\n");

  // Check if scope override exists
  const hasScopeOverride = lines.some((line) =>
    line.includes("@robeasthope:registry=https://npm.pkg.github.com"),
  );

  if (!hasScopeOverride) {
    console.log("✅ No GitHub Packages scope override found - already clean!");
    console.log("");
    console.log("Your @robeasthope/* packages will install from npm.");
    return;
  }

  console.log("⚠️  Found GitHub Packages scope override");
  console.log("");

  // Create backup
  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
  const backupPath = `${npmrcPath}.backup-${timestamp}`;
  copyFileSync(npmrcPath, backupPath);
  console.log(`📄 Created backup at: ${backupPath}`);

  // Remove problematic lines
  const cleanedLines = lines.filter((line) => {
    // Remove scope override
    if (line.includes("@robeasthope:registry=https://npm.pkg.github.com")) {
      return false;
    }

    // Remove GitHub Packages header comment
    if (line.trim() === "# GitHub Packages configuration") {
      return false;
    }

    // Remove GitHub Packages auth token
    if (line.trim().startsWith("//npm.pkg.github.com/:_authToken")) {
      return false;
    }

    return true;
  });

  // Write cleaned content
  writeFileSync(npmrcPath, cleanedLines.join("\n"));

  console.log("✅ Removed GitHub Packages configuration from ~/.npmrc");
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("Next steps:");
  console.log("");
  console.log("1️⃣  Verify packages now resolve from npm:");
  console.log("   npm view @robeasthope/eslint-config dist.tarball");
  console.log("   (should show: https://registry.npmjs.org/...)");
  console.log("");
  console.log("2️⃣  In affected projects, regenerate lockfiles:");
  console.log("   rm pnpm-lock.yaml && pnpm install");
  console.log("");
  console.log("3️⃣  Test installation works without authentication:");
  console.log("   npm install @robeasthope/eslint-config");
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log(
    "📚 For more info, see: planning/issue-226-solution-keep-dual-publishing.md",
  );
}

main();
