#!/usr/bin/env node

/**
 * Generate a descriptive release summary for PR titles
 * This script analyzes the packages being released and creates
 * a more informative title than "version packages"
 */

import fs from "fs";
import path from "path";
// If running directly (for testing)
import { fileURLToPath } from "url";

type PublishedPackage = {
  description?: string;
  name: string;
  version: string;
};

// Parse published packages from environment variable
const publishedPackages: PublishedPackage[] = process.env.PUBLISHED_PACKAGES
  ? JSON.parse(process.env.PUBLISHED_PACKAGES)
  : [];

/**
 * Extract package names without scope
 * @param packageName - Full package name with scope (e.g., '@protomolecule/ui')
 * @returns Package name without scope (e.g., 'ui')
 */
function getPackageShortName(packageName: string): string {
  return packageName.replace("@protomolecule/", "");
}

/**
 * Determine version bump type by comparing version strings
 * @param oldVersion - Previous version (e.g., '1.2.3')
 * @param newVersion - New version (e.g., '1.3.0')
 * @returns Version bump type ('major', 'minor', or 'patch')
 */
function getVersionBumpType(
  oldVersion: string,
  newVersion: string,
): "major" | "minor" | "patch" {
  if (!oldVersion || !newVersion) {
    return "patch";
  }

  const oldParts = oldVersion.split(".");
  const newParts = newVersion.split(".");

  if (oldParts[0] !== newParts[0]) {
    return "major";
  }

  if (oldParts[1] !== newParts[1]) {
    return "minor";
  }

  return "patch";
}

/**
 * Generate a descriptive PR title based on packages being released
 * @param packages - Array of package objects
 * @returns Generated PR title
 */
function generateReleaseSummary(packages: PublishedPackage[]): string {
  if (!packages || packages.length === 0) {
    return "chore: version packages";
  }

  // Group packages by version bump type
  const major: string[] = [];
  const minor: string[] = [];
  const patch: string[] = [];

  for (const pkg of packages) {
    const shortName = getPackageShortName(pkg.name);
    // For simplicity, we'll determine bump type from description or default to patch
    // In a real implementation, we'd analyze the actual version change
    if (
      pkg.description?.includes("breaking") ||
      pkg.description?.includes("major")
    ) {
      major.push(shortName);
    } else if (
      pkg.description?.includes("feat") ||
      pkg.description?.includes("feature")
    ) {
      minor.push(shortName);
    } else {
      patch.push(shortName);
    }
  }

  // Build title parts
  const parts: string[] = [];

  if (major.length > 0) {
    parts.push(`major: ${major.join(", ")}`);
  }

  if (minor.length > 0) {
    parts.push(`feat: ${minor.join(", ")}`);
  }

  if (patch.length > 0) {
    parts.push(`fix: ${patch.join(", ")}`);
  }

  // If we have multiple types, create a comprehensive title
  if (parts.length > 1) {
    const allPackages = [...major, ...minor, ...patch];
    if (allPackages.length <= 3) {
      return `chore: release ${allPackages.join(", ")}`;
    } else {
      return `chore: release ${allPackages.length} packages`;
    }
  }

  // Single type release
  if (parts.length === 1) {
    return `chore: ${parts[0]}`;
  }

  // Fallback
  return "chore: version packages";
}

const __filename = import.meta.filename;

if (process.argv[1] === __filename) {
  const summary = generateReleaseSummary(publishedPackages);
  console.log(summary);
}

export { generateReleaseSummary, getPackageShortName };
