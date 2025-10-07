#!/usr/bin/env tsx
/**
 * generate-summary.ts
 *
 * Generates release summaries by extracting version-specific sections from package
 * CHANGELOG.md files that changesets automatically generates.
 *
 * Usage:
 *   tsx generate-summary.ts
 *
 * Input (reads from /tmp):
 *   /tmp/published-packages.json: Array of {name, version} objects
 *   /tmp/bump-type.txt: Version bump type (major/minor/patch)
 *   /tmp/package-count.txt: Number of packages published
 *   /tmp/new-version.txt: New monorepo version
 *
 * Output (writes to /tmp for next step):
 *   /tmp/release-summary.txt: Generated release notes from CHANGELOGs
 *
 * Exit codes:
 *   0: Success (summary generated from CHANGELOGs)
 *   1: Error (missing input files, invalid data, etc.)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface Package {
  name: string;
  version: string;
}

export type BumpType = "major" | "minor" | "patch";

/**
 * Finds the CHANGELOG.md path for a given package
 * Handles different monorepo structures: packages/, apps/, infrastructure/
 * Pure function - easily testable with dependency injection
 */
export function findChangelogPath(
  packageName: string,
  repoRoot: string,
  fileExists: (path: string) => boolean = existsSync,
): string | null {
  // Extract package scope and name (e.g., @protomolecule/infrastructure -> infrastructure)
  const shortName = packageName.includes("/")
    ? packageName.split("/")[1]
    : packageName;

  // Special case: infrastructure directory is at repo root, not in packages/
  if (shortName === "infrastructure") {
    const infraPath = resolve(repoRoot, "infrastructure", "CHANGELOG.md");
    if (fileExists(infraPath)) {
      return infraPath;
    }
  }

  // Try common monorepo locations
  const locations = [
    resolve(repoRoot, "packages", shortName, "CHANGELOG.md"),
    resolve(repoRoot, "apps", shortName, "CHANGELOG.md"),
  ];

  for (const path of locations) {
    if (fileExists(path)) {
      return path;
    }
  }

  return null;
}

/**
 * Extracts version-specific section from CHANGELOG.md
 * Handles standard changesets format with ## version headers
 * Pure function - easily testable
 */
export function extractChangelogSection(
  changelogContent: string,
  version: string,
): string | null {
  // Match version header (e.g., "## 4.1.0")
  const versionHeaderRegex = new RegExp(`^## ${version}$`, "m");
  const match = changelogContent.match(versionHeaderRegex);

  if (!match || match.index === undefined) {
    return null;
  }

  // Find start of this version section
  const startIndex = match.index;

  // Find next version header (or end of file)
  // Match both standard versions (1.0.0) and v-prefixed versions (v1.0.0)
  const nextVersionRegex = /^## v?\d+\.\d+\.\d+/m;
  const restOfContent = changelogContent.slice(startIndex + match[0].length);
  const nextMatch = restOfContent.match(nextVersionRegex);

  let endIndex: number;
  if (nextMatch && nextMatch.index !== undefined) {
    endIndex = startIndex + match[0].length + nextMatch.index;
  } else {
    endIndex = changelogContent.length;
  }

  // Extract and trim the section
  return changelogContent.slice(startIndex, endIndex).trim();
}

/**
 * Generates release summary from CHANGELOG sections
 * Pure function - easily testable with dependency injection
 */
export function generateChangelogBasedSummary(
  packages: Package[],
  repoRoot: string,
  fileExists: (path: string) => boolean = existsSync,
  readFile: (path: string, encoding: BufferEncoding) => string = readFileSync,
): string {
  let summary = `## Workspace Updates\n\n`;

  // List all published packages
  for (const pkg of packages) {
    summary += `* ${pkg.name}@${pkg.version}\n`;
  }
  summary += "\n";

  // Extract CHANGELOG sections for each package
  for (const pkg of packages) {
    const changelogPath = findChangelogPath(pkg.name, repoRoot, fileExists);

    if (!changelogPath) {
      console.log(`⚠️ No CHANGELOG.md found for ${pkg.name}`);
      continue;
    }

    try {
      const changelogContent = readFile(changelogPath, "utf8");
      const section = extractChangelogSection(changelogContent, pkg.version);

      if (section) {
        // Add package name subheading to prevent confusion when multiple packages share version numbers
        summary += `### ${pkg.name}\n\n`;
        summary += `${section}\n\n`;
      } else {
        console.log(
          `⚠️ Version ${pkg.version} not found in CHANGELOG for ${pkg.name}`,
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log(`⚠️ Error reading CHANGELOG for ${pkg.name}:`, errorMessage);
    }
  }

  // Add footer if no CHANGELOG sections were found
  if (
    summary ===
    `## Workspace Updates\n\n${packages.map((p) => `* ${p.name}@${p.version}\n`).join("")}\n`
  ) {
    summary += `_See individual package changelogs for detailed changes._\n`;
  }

  return summary.trim();
}

/**
 * Main function - generates release summary from CHANGELOGs
 */
async function generateSummary(): Promise<void> {
  // Validate required input files exist
  const requiredFiles = [
    "/tmp/published-packages.json",
    "/tmp/bump-type.txt",
    "/tmp/package-count.txt",
    "/tmp/new-version.txt",
  ];

  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      console.error(`❌ ERROR: Required file not found: ${file}`);
      process.exit(1);
    }
  }

  // Read data from previous step
  const publishedPackages = JSON.parse(
    readFileSync("/tmp/published-packages.json", "utf8"),
  ) as Package[];
  const bumpType = readFileSync(
    "/tmp/bump-type.txt",
    "utf8",
  ).trim() as BumpType;
  const packageCount = Number.parseInt(
    readFileSync("/tmp/package-count.txt", "utf8").trim(),
    10,
  );
  const newVersion = readFileSync("/tmp/new-version.txt", "utf8").trim();

  console.log(
    `Generating CHANGELOG-based summary for ${packageCount} package(s)`,
  );
  console.log(`Bump type: ${bumpType}, New version: ${newVersion}`);

  // Determine repository root (2 levels up from .github/scripts/)
  const repoRoot = resolve(__dirname, "..", "..");

  // Generate summary from CHANGELOGs
  const summary = generateChangelogBasedSummary(publishedPackages, repoRoot);

  // Write output to /tmp
  writeFileSync("/tmp/release-summary.txt", summary, "utf8");

  console.log("✅ Release summary generated from CHANGELOGs");
  console.log("Summary preview:", summary.substring(0, 200) + "...");
}

// Run the script only if executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSummary().catch((error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ ERROR: Failed to generate summary:", errorMessage);
    process.exit(1);
  });
}
