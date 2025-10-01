#!/usr/bin/env node

/**
 * Shared utilities for package discovery and introspection
 * This module provides dynamic package discovery to eliminate hard-coded package references
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

/**
 * Package metadata extracted from package.json
 */
export type PackageInfo = {
  /**
   * Package exports map
   */
  exports?: Record<string, unknown> | string;
  /**
   * Build output files/directories from package.json 'files' field
   */
  files?: string[];
  /**
   * Main entry point
   */
  main?: string;
  /**
   * Module entry point
   */
  module?: string;
  /**
   * Full package name with scope (e.g., '@robeasthope/ui')
   */
  name: string;
  /**
   * Path to the package directory
   */
  path: string;
  /**
   * Whether the package is marked as private
   */
  private: boolean;
  /**
   * Package scope (e.g., '@robeasthope')
   */
  scope: string;
  /**
   * Package name without scope (e.g., 'ui')
   */
  shortName: string;
  /**
   * TypeScript type definitions entry point
   */
  types?: string;
  /**
   * Package version
   */
  version: string;
};

/**
 * Represents expected build outputs for a package
 */
export type BuildOutput = {
  /**
   * Expected output files to verify
   */
  files: string[];
  /**
   * Package name
   */
  packageName: string;
};

/**
 * Get all packages in the monorepo
 * @param packagesDirectory - Path to the packages directory (defaults to ./packages)
 * @returns Array of package information
 */
export function getAllPackages(
  packagesDirectory: string = join(process.cwd(), "packages"),
): PackageInfo[] {
  if (!existsSync(packagesDirectory)) {
    throw new Error(`Packages directory not found: ${packagesDirectory}`);
  }

  const packages: PackageInfo[] = [];
  const packageDirectories = readdirSync(packagesDirectory, {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const directory of packageDirectories) {
    const packagePath = join(packagesDirectory, directory);
    const packageJsonPath = join(packagePath, "package.json");

    if (existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          readFileSync(packageJsonPath, "utf8"),
        ) as {
          exports?: Record<string, unknown> | string;
          files?: string[];
          main?: string;
          module?: string;
          name: string;
          private?: boolean;
          types?: string;
          version: string;
        };

        // Extract scope from package name
        const scopeMatch = packageJson.name.match(/^(@[^/]+)\//);
        const scope = scopeMatch?.[1] ?? "";
        const shortName = packageJson.name.replace(/^@[^/]+\//, "");

        packages.push({
          exports: packageJson.exports,
          files: packageJson.files,
          main: packageJson.main,
          module: packageJson.module,
          name: packageJson.name,
          path: packagePath,
          private: packageJson.private ?? false,
          scope,
          shortName,
          types: packageJson.types,
          version: packageJson.version,
        });
      } catch (error) {
        console.warn(
          `Warning: Could not parse package.json for ${directory}: ${(error as Error).message}`,
        );
      }
    }
  }

  return packages;
}

/**
 * Get all publishable (non-private) packages
 * @param packagesDirectory - Path to the packages directory
 * @returns Array of publishable package information
 */
export function getPublishablePackages(
  packagesDirectory?: string,
): PackageInfo[] {
  return getAllPackages(packagesDirectory).filter((pkg) => !pkg.private);
}

/**
 * Get all private packages
 * @param packagesDirectory - Path to the packages directory
 * @returns Array of private package information
 */
export function getPrivatePackages(packagesDirectory?: string): PackageInfo[] {
  return getAllPackages(packagesDirectory).filter((pkg) => pkg.private);
}

/**
 * Get a specific package by name
 * @param packageName - Full package name (e.g., '@robeasthope/ui')
 * @param packagesDirectory - Path to the packages directory
 * @returns Package information or undefined if not found
 */
export function getPackage(
  packageName: string,
  packagesDirectory?: string,
): PackageInfo | undefined {
  return getAllPackages(packagesDirectory).find(
    (pkg) => pkg.name === packageName,
  );
}

/**
 * Extract all unique scopes used in the monorepo
 * @param packagesDirectory - Path to the packages directory
 * @returns Array of unique scopes (e.g., ['@robeasthope'])
 */
export function getPackageScopes(packagesDirectory?: string): string[] {
  const scopes = new Set<string>();
  for (const pkg of getAllPackages(packagesDirectory)) {
    if (pkg.scope) {
      scopes.add(pkg.scope);
    }
  }

  return Array.from(scopes);
}

/**
 * Determine expected build outputs for a package based on its package.json
 * @param pkg - Package information
 * @returns Array of expected output file paths
 */
export function getExpectedBuildOutputs(pkg: PackageInfo): string[] {
  const outputs: string[] = [];

  // Check explicit build outputs from 'files' field
  if (pkg.files) {
    for (const file of pkg.files) {
      // Files field can include directories and glob patterns
      // For simplicity, we'll track the exact paths
      outputs.push(join(pkg.path, file));
    }
  }

  // Check entry points
  if (pkg.main) {
    outputs.push(join(pkg.path, pkg.main));
  }

  if (pkg.module) {
    outputs.push(join(pkg.path, pkg.module));
  }

  if (pkg.types) {
    outputs.push(join(pkg.path, pkg.types));
  }

  // For packages without explicit outputs, check common patterns
  if (outputs.length === 0) {
    // Check for common build directories
    const commonBuildDirectories = ["dist", "build", "lib"];
    for (const directory of commonBuildDirectories) {
      const directoryPath = join(pkg.path, directory);
      if (existsSync(directoryPath)) {
        outputs.push(directoryPath);
      }
    }
  }

  return outputs;
}

/**
 * Get build verification info for all publishable packages
 * @param packagesDirectory - Path to the packages directory
 * @returns Array of packages with their expected build outputs
 */
export function getBuildVerificationInfo(
  packagesDirectory?: string,
): BuildOutput[] {
  const publishablePackages = getPublishablePackages(packagesDirectory);
  const buildOutputs: BuildOutput[] = [];

  for (const pkg of publishablePackages) {
    const expectedOutputs = getExpectedBuildOutputs(pkg);
    if (expectedOutputs.length > 0) {
      buildOutputs.push({
        files: expectedOutputs,
        packageName: pkg.name,
      });
    }
  }

  return buildOutputs;
}

/**
 * Verify that all expected build outputs exist for publishable packages
 * @param packagesDirectory - Path to the packages directory
 * @returns Object with verification results
 */
export function verifyBuildOutputs(packagesDirectory?: string): {
  failed: Array<{ file: string; packageName: string }>;
  success: boolean;
} {
  const buildInfo = getBuildVerificationInfo(packagesDirectory);
  const failed: Array<{ file: string; packageName: string }> = [];

  for (const { files, packageName } of buildInfo) {
    for (const file of files) {
      if (!existsSync(file)) {
        failed.push({ file, packageName });
      }
    }
  }

  return {
    failed,
    success: failed.length === 0,
  };
}

/**
 * Extract the short name from a full package name
 * This works dynamically with any scope
 * @param packageName - Full package name (e.g., '@robeasthope/ui')
 * @returns Package name without scope (e.g., 'ui')
 */
export function getPackageShortName(packageName: string): string {
  return packageName.replace(/^@[^/]+\//, "");
}

/**
 * Get the scope from a package name
 * @param packageName - Full package name (e.g., '@robeasthope/ui')
 * @returns Package scope (e.g., '@robeasthope') or empty string if no scope
 */
export function getPackageScope(packageName: string): string {
  const scopeMatch = packageName.match(/^(@[^/]+)\//);
  return scopeMatch?.[1] ?? "";
}
