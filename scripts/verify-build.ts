#!/usr/bin/env node

/**
 * Verify that all publishable packages have their expected build outputs
 * This script dynamically discovers packages and their build requirements
 */

/* eslint-disable no-console */

import { getExpectedBuildOutputs, getPublishablePackages } from "./packages.js";
import { existsSync, statSync } from "fs";
import { relative } from "path";

let hasErrors = false;

console.log("## 🏗️ Build Output Verification\n");

// Get all publishable packages
const publishablePackages = getPublishablePackages();

if (publishablePackages.length === 0) {
  console.log("⚠️ No publishable packages found");
  process.exit(0);
}

console.log(
  `Found ${publishablePackages.length} publishable package(s) to verify:\n`,
);

// Verify each package
for (const pkg of publishablePackages) {
  const expectedOutputs = getExpectedBuildOutputs(pkg);

  // If package has no expected outputs defined, check for common patterns
  if (expectedOutputs.length === 0) {
    console.log(`⚠️ ${pkg.name}: No build outputs defined in package.json`);
    continue;
  }

  console.log(`### ${pkg.name}`);

  let packageHasErrors = false;

  // Check each expected output
  for (const outputPath of expectedOutputs) {
    const relativePath = relative(process.cwd(), outputPath);

    if (existsSync(outputPath)) {
      // Check if it's a file and verify it has content
      try {
        const stats = statSync(outputPath);
        if (stats.isFile()) {
          if (stats.size < 10) {
            console.log(
              `  ⚠️ Warning: ${relativePath} seems unusually small (${stats.size} bytes)`,
            );
          } else {
            console.log(`  ✅ ${relativePath}`);
          }
        } else if (stats.isDirectory()) {
          console.log(`  ✅ ${relativePath} (directory)`);
        }
      } catch (error) {
        console.log(
          `  ❌ Error checking ${relativePath}: ${(error as Error).message}`,
        );
        packageHasErrors = true;
        hasErrors = true;
      }
    } else {
      console.log(`  ❌ Missing: ${relativePath}`);
      packageHasErrors = true;
      hasErrors = true;
    }
  }

  if (!packageHasErrors) {
    console.log("  ✅ All build outputs verified");
  }

  console.log(""); // Empty line between packages
}

// Summary
console.log("---\n");

if (hasErrors) {
  console.error("❌ Build verification failed - see errors above\n");
  process.exit(1);
} else {
  console.log("✅ All build verifications passed\n");
  process.exit(0);
}
