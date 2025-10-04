#!/usr/bin/env tsx
/**
 * detect-published.ts
 *
 * Detects if packages were published in the current commit by checking for
 * CHANGELOG.md updates. Extracts package information and outputs as JSON.
 *
 * Usage:
 *   tsx detect-published.ts
 *   # Or directly: ./detect-published.ts
 *
 * Outputs (via $GITHUB_OUTPUT):
 *   published: "true" or "false"
 *   publishedPackages: JSON array of {name, version} objects (compact, single-line)
 *
 * Exit codes:
 *   0: Success (published or not published)
 *   1: Error (invalid JSON, missing files, etc.)
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync, appendFileSync } from 'node:fs';
import { dirname } from 'node:path';

export interface Package {
  name: string;
  version: string;
}

export interface PackageJson {
  name?: string;
  version?: string;
  [key: string]: unknown;
}

// Type for file reading function (allows dependency injection for testing)
export type ReadFileFn = (path: string) => string;
export type FileExistsFn = (path: string) => boolean;

/**
 * Appends a key=value pair to GITHUB_OUTPUT
 */
function setOutput(key: string, value: string): void {
  const output = `${key}=${value}\n`;
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, output);
  } else {
    // For local testing
    console.log(`[OUTPUT] ${key}=${value}`);
  }
}

/**
 * Checks if a git ref exists
 */
function gitRefExists(ref: string): boolean {
  try {
    execSync(`git rev-parse ${ref}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Filters file list to only include CHANGELOG.md files (case-insensitive)
 * Pure function - easily testable
 */
export function filterChangelogFiles(changedFiles: string[]): string[] {
  return changedFiles.filter((file) =>
    file.toLowerCase().includes('changelog.md')
  );
}

/**
 * Validates a package.json object has required fields with correct types
 * Pure function - easily testable
 */
export function validatePackageJson(packageJson: PackageJson): void {
  if (!packageJson.name || !packageJson.version) {
    throw new Error('Invalid package.json: missing name or version');
  }

  // Runtime type validation (JSON.parse doesn't guarantee types match interface)
  if (typeof packageJson.name !== 'string') {
    throw new Error(`Invalid package.json: name must be a string, got ${typeof packageJson.name}`);
  }

  if (typeof packageJson.version !== 'string') {
    throw new Error(`Invalid package.json: version must be a string, got ${typeof packageJson.version}`);
  }
}

/**
 * Parses changed CHANGELOG files to extract package information
 * Pure function with dependency injection for testability
 *
 * Security note: This function constructs file paths from git diff output.
 * Input is trusted (comes from git, not user input), so path traversal
 * validation is not required. Paths are constrained to the git repository.
 *
 * @param changelogFiles - Array of CHANGELOG.md file paths
 * @param readFile - Function to read file contents
 * @param fileExists - Function to check if file exists
 * @returns Array of Package objects with name and version
 */
export function parseChangelogs(
  changelogFiles: string[],
  readFile: ReadFileFn,
  fileExists: FileExistsFn
): Package[] {
  const packages: Package[] = [];

  for (const changelog of changelogFiles) {
    const dir = dirname(changelog);
    const packageJsonPath = `${dir}/package.json`;

    if (!fileExists(packageJsonPath)) {
      continue;
    }

    try {
      // Read and parse package.json
      const content = readFile(packageJsonPath);
      const packageJson = JSON.parse(content) as PackageJson;

      // Validate required fields
      validatePackageJson(packageJson);

      packages.push({
        name: packageJson.name,
        version: packageJson.version
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid JSON in ${packageJsonPath}: ${errorMessage}`);
    }
  }

  return packages;
}

/**
 * Main detection logic
 */
function detectPublished(): void {
  // Check if HEAD~1 exists (handles first commit or shallow clone)
  if (!gitRefExists('HEAD~1')) {
    console.log('⚠️  Cannot detect previous commit (first commit or shallow clone)');
    setOutput('published', 'false');
    return;
  }

  // Get changed files between HEAD~1 and HEAD
  let changedFiles;
  try {
    changedFiles = execSync('git diff HEAD~1 HEAD --name-only', {
      encoding: 'utf8'
    }).trim();
  } catch (error) {
    console.error('❌ ERROR: Failed to get changed files:', error.message);
    process.exit(1);
  }

  // Check if this commit contains version bumps (CHANGELOG updates)
  if (!changedFiles.includes('CHANGELOG.md')) {
    console.log('ℹ️  No version changes detected in this commit');
    setOutput('published', 'false');
    return;
  }

  console.log('✅ Detected package version changes in this commit');

  // Extract list of published packages from CHANGELOG changes
  const fileList = changedFiles.split('\n');
  const changelogFiles = filterChangelogFiles(fileList);

  let packages: Package[];
  try {
    packages = parseChangelogs(changelogFiles, readFileSync, existsSync);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ ERROR: ${errorMessage}`);
    process.exit(1);
  }

  // Check if any packages were actually found
  if (packages.length === 0) {
    console.log('⚠️  CHANGELOG changes detected but no valid packages found');
    setOutput('published', 'false');
    return;
  }

  // Convert to compact JSON (single line for GitHub Actions)
  const publishedPackagesCompact = JSON.stringify(packages);

  setOutput('published', 'true');
  setOutput('publishedPackages', publishedPackagesCompact);
  console.log(`✅ Found ${packages.length} package(s) to release`);
}

// Run the script only if executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    detectPublished();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ ERROR: Unexpected error:', errorMessage);
    process.exit(1);
  }
}
