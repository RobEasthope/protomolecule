#!/usr/bin/env node

/**
 * Simple test script to verify package discovery utilities work correctly
 */

/* eslint-disable no-console */

import {
  getAllPackages,
  getPackageScope,
  getPackageScopes,
  getPackageShortName,
  getPublishablePackages,
} from "./packages.js";

console.log("🧪 Testing Package Discovery Utilities\n");

// Test getAllPackages
console.log("📦 All Packages:");
const allPackages = getAllPackages();
console.log(
  `  Found ${allPackages.length} packages:\n${allPackages.map((pkg) => `    - ${pkg.name} (v${pkg.version}) ${pkg.private ? "[private]" : "[public]"}`).join("\n")}`,
);
console.log("");

// Test getPublishablePackages
console.log("📤 Publishable Packages:");
const publishablePackages = getPublishablePackages();
console.log(
  `  Found ${publishablePackages.length} publishable packages:\n${publishablePackages.map((pkg) => `    - ${pkg.name} (v${pkg.version})`).join("\n")}`,
);
console.log("");

// Test getPackageScopes
console.log("🏷️  Package Scopes:");
const scopes = getPackageScopes();
console.log(`  Found ${scopes.length} unique scope(s): ${scopes.join(", ")}`);
console.log("");

// Test getPackageShortName
console.log("✂️  Short Name Extraction:");
const testNames = [
  "@robeasthope/ui",
  "@robeasthope/eslint-config",
  "@somescope/package-name",
  "unscoped-package",
];
for (const name of testNames) {
  const shortName = getPackageShortName(name);
  console.log(`  ${name} → ${shortName}`);
}

console.log("");

// Test getPackageScope
console.log("🎯 Scope Extraction:");
for (const name of testNames) {
  const scope = getPackageScope(name);
  console.log(`  ${name} → ${scope || "(no scope)"}`);
}

console.log("");

console.log("✅ All tests completed successfully!\n");
