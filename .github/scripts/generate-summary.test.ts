import { describe, it, expect } from "vitest";
import {
  findChangelogPath,
  extractChangelogSection,
  generateChangelogBasedSummary,
  type Package,
} from "./generate-summary";

describe("findChangelogPath", () => {
  it("finds CHANGELOG in packages directory", () => {
    const mockFileExists = (path: string) =>
      path.includes("packages/eslint-config/CHANGELOG.md");

    const result = findChangelogPath(
      "@robeasthope/eslint-config",
      "/repo",
      mockFileExists,
    );

    expect(result).toBe("/repo/packages/eslint-config/CHANGELOG.md");
  });

  it("finds CHANGELOG in apps directory", () => {
    const mockFileExists = (path: string) =>
      path.includes("apps/my-app/CHANGELOG.md");

    const result = findChangelogPath(
      "@robeasthope/my-app",
      "/repo",
      mockFileExists,
    );

    expect(result).toBe("/repo/apps/my-app/CHANGELOG.md");
  });

  it("finds CHANGELOG in infrastructure directory", () => {
    const mockFileExists = (path: string) =>
      path.includes("infrastructure/CHANGELOG.md");

    const result = findChangelogPath(
      "@protomolecule/infrastructure",
      "/repo",
      mockFileExists,
    );

    expect(result).toBe("/repo/infrastructure/CHANGELOG.md");
  });

  it("returns null when CHANGELOG not found", () => {
    const mockFileExists = () => false;

    const result = findChangelogPath(
      "@robeasthope/nonexistent",
      "/repo",
      mockFileExists,
    );

    expect(result).toBeNull();
  });

  it("handles package names without scope", () => {
    const mockFileExists = (path: string) =>
      path.includes("packages/eslint-config/CHANGELOG.md");

    const result = findChangelogPath("eslint-config", "/repo", mockFileExists);

    expect(result).toBe("/repo/packages/eslint-config/CHANGELOG.md");
  });

  it("checks packages directory before apps directory", () => {
    const checkedPaths: string[] = [];
    const mockFileExists = (path: string) => {
      checkedPaths.push(path);
      return path.includes("apps/ui/CHANGELOG.md");
    };

    const result = findChangelogPath(
      "@robeasthope/ui",
      "/repo",
      mockFileExists,
    );

    expect(result).toBe("/repo/apps/ui/CHANGELOG.md");
    expect(checkedPaths[0]).toContain("packages/ui");
    expect(checkedPaths[1]).toContain("apps/ui");
  });
});

describe("extractChangelogSection", () => {
  it("extracts simple version section", () => {
    const changelog = `# Package Name

## 1.0.0

### Patch Changes

- Fix something

## 0.9.0

### Minor Changes

- Add feature
`;

    const result = extractChangelogSection(changelog, "1.0.0");

    expect(result).toContain("## 1.0.0");
    expect(result).toContain("Fix something");
    expect(result).not.toContain("## 0.9.0");
    expect(result).not.toContain("Add feature");
  });

  it("extracts version section with multi-line content", () => {
    const changelog = `# @robeasthope/eslint-config

## 4.1.0

### Minor Changes

- [\`7d563c1\`](https://github.com/RobEasthope/protomolecule/commit/7d563c1) [#266](https://github.com/RobEasthope/protomolecule/pull/266) - Add common import ignore patterns to Astro rules

  **Enhancement:**
  Added commonly-needed import ignore patterns to the Astro configuration.

  **Benefits:**
  - ✅ Reduces boilerplate in consumer configs
  - ✅ Covers 90%+ of Astro projects out of the box

## 4.0.2

### Patch Changes

- Fix parser resolution
`;

    const result = extractChangelogSection(changelog, "4.1.0");

    expect(result).toContain("## 4.1.0");
    expect(result).toContain("Add common import ignore patterns");
    expect(result).toContain("**Enhancement:**");
    expect(result).toContain("✅ Reduces boilerplate");
    expect(result).not.toContain("## 4.0.2");
    expect(result).not.toContain("Fix parser resolution");
  });

  it("extracts last version section (no next version)", () => {
    const changelog = `# Package

## 2.0.0

### Major Changes

- Breaking change

## 1.0.0

### Minor Changes

- Initial release
`;

    const result = extractChangelogSection(changelog, "1.0.0");

    expect(result).toContain("## 1.0.0");
    expect(result).toContain("Initial release");
    expect(result).not.toContain("Breaking change");
  });

  it("returns null when version not found", () => {
    const changelog = `# Package

## 1.0.0

### Patch Changes

- Fix something
`;

    const result = extractChangelogSection(changelog, "2.0.0");

    expect(result).toBeNull();
  });

  it("handles version at start of file", () => {
    const changelog = `## 1.0.0

### Patch Changes

- Fix something

## 0.9.0

### Minor Changes

- Add feature
`;

    const result = extractChangelogSection(changelog, "1.0.0");

    expect(result).toContain("## 1.0.0");
    expect(result).toContain("Fix something");
    expect(result).not.toContain("## 0.9.0");
  });

  it("preserves markdown links in extracted section", () => {
    const changelog = `# Package

## 1.0.0

### Patch Changes

- [\`abc123\`](https://github.com/user/repo/commit/abc123) [#42](https://github.com/user/repo/pull/42) - Fix something

## 0.9.0
`;

    const result = extractChangelogSection(changelog, "1.0.0");

    expect(result).toContain("[`abc123`]");
    expect(result).toContain("(https://github.com/user/repo/commit/abc123)");
    expect(result).toContain("[#42]");
    expect(result).toContain("(https://github.com/user/repo/pull/42)");
  });

  it("handles version sections with code blocks", () => {
    const changelog = `# Package

## 1.0.0

### Minor Changes

- New feature

  \`\`\`typescript
  const example = "code";
  \`\`\`

## 0.9.0
`;

    const result = extractChangelogSection(changelog, "1.0.0");

    expect(result).toContain("## 1.0.0");
    expect(result).toContain("```typescript");
    expect(result).toContain('const example = "code";');
    expect(result).not.toContain("## 0.9.0");
  });

  it("handles version with special characters", () => {
    const changelog = `# Package

## 1.0.0-beta.1

### Patch Changes

- Beta release

## 0.9.0
`;

    const result = extractChangelogSection(changelog, "1.0.0-beta.1");

    expect(result).toContain("## 1.0.0-beta.1");
    expect(result).toContain("Beta release");
  });
});

describe("generateChangelogBasedSummary", () => {
  it("generates summary for single package", () => {
    const packages: Package[] = [
      { name: "@robeasthope/eslint-config", version: "4.1.0" },
    ];

    const mockFileExists = (path: string) =>
      path.includes("eslint-config/CHANGELOG.md");

    const mockReadFile = () => `# @robeasthope/eslint-config

## 4.1.0

### Minor Changes

- Add new feature
`;

    const result = generateChangelogBasedSummary(
      packages,
      "/repo",
      mockFileExists,
      mockReadFile,
    );

    expect(result).toContain("## Workspace Updates");
    expect(result).toContain("* @robeasthope/eslint-config@4.1.0");
    expect(result).toContain("## 4.1.0");
    expect(result).toContain("Add new feature");
  });

  it("generates summary for multiple packages", () => {
    const packages: Package[] = [
      { name: "@robeasthope/eslint-config", version: "4.1.0" },
      { name: "@protomolecule/infrastructure", version: "2.1.0" },
    ];

    const mockFileExists = (path: string) =>
      path.includes("eslint-config/CHANGELOG.md") ||
      path.includes("infrastructure/CHANGELOG.md");

    const mockReadFile = (path: string) => {
      if (path.includes("eslint-config")) {
        return `## 4.1.0\n\n### Minor Changes\n\n- ESLint feature`;
      }
      if (path.includes("infrastructure")) {
        return `## 2.1.0\n\n### Minor Changes\n\n- Infrastructure update`;
      }
      return "";
    };

    const result = generateChangelogBasedSummary(
      packages,
      "/repo",
      mockFileExists,
      mockReadFile,
    );

    expect(result).toContain("* @robeasthope/eslint-config@4.1.0");
    expect(result).toContain("* @protomolecule/infrastructure@2.1.0");
    expect(result).toContain("ESLint feature");
    expect(result).toContain("Infrastructure update");
  });

  it("handles missing CHANGELOG files gracefully", () => {
    const packages: Package[] = [
      { name: "@robeasthope/nonexistent", version: "1.0.0" },
    ];

    const mockFileExists = () => false;
    const mockReadFile = () => "";

    const result = generateChangelogBasedSummary(
      packages,
      "/repo",
      mockFileExists,
      mockReadFile,
    );

    expect(result).toContain("## Workspace Updates");
    expect(result).toContain("* @robeasthope/nonexistent@1.0.0");
    expect(result).toContain(
      "_See individual package changelogs for detailed changes._",
    );
  });

  it("handles version not found in CHANGELOG", () => {
    const packages: Package[] = [
      { name: "@robeasthope/eslint-config", version: "5.0.0" },
    ];

    const mockFileExists = (path: string) =>
      path.includes("eslint-config/CHANGELOG.md");

    const mockReadFile = () => `## 4.1.0\n\n### Minor Changes\n\n- Old version`;

    const result = generateChangelogBasedSummary(
      packages,
      "/repo",
      mockFileExists,
      mockReadFile,
    );

    expect(result).toContain("## Workspace Updates");
    expect(result).toContain("* @robeasthope/eslint-config@5.0.0");
    // Should include fallback message when version not found
    expect(result).toContain(
      "_See individual package changelogs for detailed changes._",
    );
  });

  it("preserves markdown formatting from CHANGELOGs", () => {
    const packages: Package[] = [
      { name: "@robeasthope/eslint-config", version: "4.1.0" },
    ];

    const mockFileExists = (path: string) =>
      path.includes("eslint-config/CHANGELOG.md");

    const mockReadFile = () => `## 4.1.0

### Minor Changes

- [\`abc123\`](https://github.com/user/repo/commit/abc123) [#42](https://github.com/user/repo/pull/42) - New feature

  **Benefits:**
  - ✅ Benefit 1
  - ✅ Benefit 2
`;

    const result = generateChangelogBasedSummary(
      packages,
      "/repo",
      mockFileExists,
      mockReadFile,
    );

    expect(result).toContain("[`abc123`]");
    expect(result).toContain("[#42]");
    expect(result).toContain("**Benefits:**");
    expect(result).toContain("✅ Benefit 1");
  });

  it("handles empty packages array", () => {
    const packages: Package[] = [];

    const result = generateChangelogBasedSummary(
      packages,
      "/repo",
      () => false,
      () => "",
    );

    expect(result).toContain("## Workspace Updates");
  });

  it("handles read errors gracefully", () => {
    const packages: Package[] = [
      { name: "@robeasthope/eslint-config", version: "4.1.0" },
    ];

    const mockFileExists = (path: string) =>
      path.includes("eslint-config/CHANGELOG.md");

    const mockReadFile = () => {
      throw new Error("EACCES: permission denied");
    };

    const result = generateChangelogBasedSummary(
      packages,
      "/repo",
      mockFileExists,
      mockReadFile,
    );

    expect(result).toContain("## Workspace Updates");
    expect(result).toContain("* @robeasthope/eslint-config@4.1.0");
  });

  it("separates package sections with blank lines", () => {
    const packages: Package[] = [
      { name: "@robeasthope/eslint-config", version: "4.1.0" },
      { name: "@protomolecule/infrastructure", version: "2.1.0" },
    ];

    const mockFileExists = (path: string) => {
      return (
        path.includes("eslint-config/CHANGELOG.md") ||
        path.includes("infrastructure/CHANGELOG.md")
      );
    };

    const mockReadFile = (path: string) => {
      if (path.includes("eslint-config")) {
        return `## 4.1.0\n\n### Minor Changes\n\n- ESLint feature`;
      }
      if (path.includes("infrastructure")) {
        return `## 2.1.0\n\n### Minor Changes\n\n- Infrastructure update`;
      }
      return "";
    };

    const result = generateChangelogBasedSummary(
      packages,
      "/repo",
      mockFileExists,
      mockReadFile,
    );

    // Should have double newlines between the two package sections
    expect(result).toContain("## 4.1.0");
    expect(result).toContain("## 2.1.0");
    expect(result).toContain("ESLint feature");
    expect(result).toContain("Infrastructure update");
    // Check that sections are separated by double newlines
    expect(result).toMatch(/ESLint feature\n\n## 2\.1\.0/);
  });
});
