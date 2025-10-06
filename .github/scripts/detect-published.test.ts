import { describe, it, expect, vi } from "vitest";
import {
  filterChangelogFiles,
  validatePackageJson,
  parseChangelogs,
  type PackageJson,
  type ReadFileFn,
  type FileExistsFn,
} from "./detect-published";

describe("filterChangelogFiles", () => {
  it("filters to only CHANGELOG.md files", () => {
    const files = [
      "apps/markdown/CHANGELOG.md",
      "apps/markdown/package.json",
      "packages/ui/CHANGELOG.md",
      "README.md",
      "infrastructure/CHANGELOG.md",
    ];

    const result = filterChangelogFiles(files);

    expect(result).toEqual([
      "apps/markdown/CHANGELOG.md",
      "packages/ui/CHANGELOG.md",
      "infrastructure/CHANGELOG.md",
    ]);
  });

  it("returns empty array when no CHANGELOG files", () => {
    const files = ["README.md", "package.json", "src/index.ts"];

    const result = filterChangelogFiles(files);

    expect(result).toEqual([]);
  });

  it("handles empty array", () => {
    const result = filterChangelogFiles([]);

    expect(result).toEqual([]);
  });

  it("filters case-insensitively", () => {
    const files = [
      "apps/markdown/CHANGELOG.md",
      "packages/ui/changelog.md",
      "infrastructure/Changelog.md",
      "apps/other/ChangeLog.MD",
    ];

    const result = filterChangelogFiles(files);

    expect(result).toEqual([
      "apps/markdown/CHANGELOG.md",
      "packages/ui/changelog.md",
      "infrastructure/Changelog.md",
      "apps/other/ChangeLog.MD",
    ]);
  });
});

describe("validatePackageJson", () => {
  it("validates package with name and version", () => {
    const packageJson: PackageJson = {
      name: "@robeasthope/markdown",
      version: "1.0.0",
    };

    expect(() => validatePackageJson(packageJson)).not.toThrow();
  });

  it("throws when name is missing", () => {
    const packageJson: PackageJson = {
      version: "1.0.0",
    };

    expect(() => validatePackageJson(packageJson)).toThrow(
      "Invalid package.json: missing name or version",
    );
  });

  it("throws when version is missing", () => {
    const packageJson: PackageJson = {
      name: "@robeasthope/markdown",
    };

    expect(() => validatePackageJson(packageJson)).toThrow(
      "Invalid package.json: missing name or version",
    );
  });

  it("throws when both name and version are missing", () => {
    const packageJson: PackageJson = {};

    expect(() => validatePackageJson(packageJson)).toThrow(
      "Invalid package.json: missing name or version",
    );
  });

  it("throws when name is not a string", () => {
    const packageJson = {
      name: 123,
      version: "1.0.0",
    } as unknown as PackageJson;

    expect(() => validatePackageJson(packageJson)).toThrow(
      "Invalid package.json: name must be a string, got number",
    );
  });

  it("throws when version is not a string", () => {
    const packageJson = {
      name: "@robeasthope/markdown",
      version: { major: 1, minor: 0, patch: 0 },
    } as unknown as PackageJson;

    expect(() => validatePackageJson(packageJson)).toThrow(
      "Invalid package.json: version must be a string, got object",
    );
  });

  it("throws when both name and version are wrong types", () => {
    const packageJson = {
      name: ["@robeasthope/markdown"],
      version: 1.0,
    } as unknown as PackageJson;

    expect(() => validatePackageJson(packageJson)).toThrow(
      "Invalid package.json: name must be a string, got object",
    );
  });
});

describe("parseChangelogs", () => {
  it("extracts package info from CHANGELOG changes", () => {
    const files = ["apps/markdown/CHANGELOG.md"];
    const mockRead: ReadFileFn = vi.fn((path: string) => {
      if (path === "apps/markdown/package.json") {
        return JSON.stringify({
          name: "@robeasthope/markdown",
          version: "1.0.0",
        });
      }
      return "";
    });
    const mockExists: FileExistsFn = vi.fn(() => true);

    const result = parseChangelogs(files, mockRead, mockExists);

    expect(result).toEqual([
      { name: "@robeasthope/markdown", version: "1.0.0" },
    ]);
    expect(mockRead).toHaveBeenCalledWith("apps/markdown/package.json");
    expect(mockExists).toHaveBeenCalledWith("apps/markdown/package.json");
  });

  it("handles multiple packages", () => {
    const files = ["apps/markdown/CHANGELOG.md", "packages/ui/CHANGELOG.md"];
    const mockRead: ReadFileFn = vi.fn((path: string) => {
      if (path === "apps/markdown/package.json") {
        return JSON.stringify({
          name: "@robeasthope/markdown",
          version: "1.0.0",
        });
      }
      if (path === "packages/ui/package.json") {
        return JSON.stringify({
          name: "@robeasthope/ui",
          version: "2.1.0",
        });
      }
      return "";
    });
    const mockExists: FileExistsFn = vi.fn(() => true);

    const result = parseChangelogs(files, mockRead, mockExists);

    expect(result).toEqual([
      { name: "@robeasthope/markdown", version: "1.0.0" },
      { name: "@robeasthope/ui", version: "2.1.0" },
    ]);
  });

  it("skips CHANGELOG without package.json", () => {
    const files = [
      "apps/markdown/CHANGELOG.md",
      "docs/CHANGELOG.md", // No package.json here
    ];
    const mockRead: ReadFileFn = vi.fn((path: string) => {
      if (path === "apps/markdown/package.json") {
        return JSON.stringify({
          name: "@robeasthope/markdown",
          version: "1.0.0",
        });
      }
      return "";
    });
    const mockExists: FileExistsFn = vi.fn(
      (path: string) => path === "apps/markdown/package.json",
    );

    const result = parseChangelogs(files, mockRead, mockExists);

    expect(result).toEqual([
      { name: "@robeasthope/markdown", version: "1.0.0" },
    ]);
  });

  it("throws on invalid JSON", () => {
    const files = ["apps/markdown/CHANGELOG.md"];
    const mockRead: ReadFileFn = vi.fn(() => "invalid json{");
    const mockExists: FileExistsFn = vi.fn(() => true);

    expect(() => parseChangelogs(files, mockRead, mockExists)).toThrow(
      /Invalid JSON in apps\/markdown\/package\.json/,
    );
  });

  it("throws on missing name field", () => {
    const files = ["apps/markdown/CHANGELOG.md"];
    const mockRead: ReadFileFn = vi.fn(() =>
      JSON.stringify({ version: "1.0.0" }),
    );
    const mockExists: FileExistsFn = vi.fn(() => true);

    expect(() => parseChangelogs(files, mockRead, mockExists)).toThrow(
      /Invalid JSON in apps\/markdown\/package\.json/,
    );
  });

  it("throws on missing version field", () => {
    const files = ["apps/markdown/CHANGELOG.md"];
    const mockRead: ReadFileFn = vi.fn(() =>
      JSON.stringify({ name: "@robeasthope/markdown" }),
    );
    const mockExists: FileExistsFn = vi.fn(() => true);

    expect(() => parseChangelogs(files, mockRead, mockExists)).toThrow(
      /Invalid JSON in apps\/markdown\/package\.json/,
    );
  });

  it("returns empty array for empty input", () => {
    const mockRead: ReadFileFn = vi.fn();
    const mockExists: FileExistsFn = vi.fn();

    const result = parseChangelogs([], mockRead, mockExists);

    expect(result).toEqual([]);
    expect(mockRead).not.toHaveBeenCalled();
    expect(mockExists).not.toHaveBeenCalled();
  });

  it("handles infrastructure package specially", () => {
    const files = ["infrastructure/CHANGELOG.md"];
    const mockRead: ReadFileFn = vi.fn(() =>
      JSON.stringify({
        name: "@protomolecule/infrastructure",
        version: "0.1.0",
      }),
    );
    const mockExists: FileExistsFn = vi.fn(() => true);

    const result = parseChangelogs(files, mockRead, mockExists);

    expect(result).toEqual([
      { name: "@protomolecule/infrastructure", version: "0.1.0" },
    ]);
  });
});
