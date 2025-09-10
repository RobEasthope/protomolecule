#!/usr/bin/env node

import { exec } from "child_process";
import { promisify } from "util";
import { describe, expect, it } from "vitest";
import {
  compareSemver,
  parseVersion,
} from "../../scripts/parse-release-info.js";

const execAsync = promisify(exec);

describe("parse-release-info", () => {
  describe("parseVersion", () => {
    it("should parse regular versions correctly", () => {
      expect(parseVersion("1.2.3")).toEqual({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: "",
      });
    });

    it("should parse prerelease versions correctly", () => {
      expect(parseVersion("1.0.0-alpha.1")).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: "alpha.1",
      });
    });
  });

  describe("compareSemver", () => {
    it("should sort versions correctly (highest first)", () => {
      const versions = ["1.0.0", "2.0.0", "10.0.0", "1.1.0", "1.0.1"];
      const sorted = versions.sort((a, b) => compareSemver(b, a));
      expect(sorted).toEqual(["10.0.0", "2.0.0", "1.1.0", "1.0.1", "1.0.0"]);
    });

    it("should handle prerelease versions correctly", () => {
      const versions = ["1.0.0", "1.0.0-alpha", "1.0.0-beta", "1.0.0-rc.1"];
      const sorted = versions.sort((a, b) => compareSemver(b, a));
      expect(sorted).toEqual([
        "1.0.0",
        "1.0.0-rc.1",
        "1.0.0-beta",
        "1.0.0-alpha",
      ]);
    });

    it("should not incorrectly sort 10.0.0 before 2.0.0", () => {
      // This was the bug - string comparison would put "10" before "2"
      expect(compareSemver("10.0.0", "2.0.0")).toBeGreaterThan(0);
      expect(compareSemver("2.0.0", "10.0.0")).toBeLessThan(0);
    });
  });

  describe("script execution", () => {
    it("should parse scoped packages correctly", async () => {
      const input = "@protomolecule/eslint-config@1.0.5";
      const { stdout } = await execAsync(
        `echo "${input}" | node scripts/parse-release-info.js`,
      );
      const result = JSON.parse(stdout);

      expect(result.version).toBe("1.0.5");
      expect(result.packages).toBe("@protomolecule/eslint-config@1.0.5");
      expect(result.packageData).toEqual([
        { name: "@protomolecule/eslint-config", version: "1.0.5" },
      ]);
    });

    it("should parse non-scoped packages correctly", async () => {
      const input = "prettier@3.0.0";
      const { stdout } = await execAsync(
        `echo "${input}" | node scripts/parse-release-info.js`,
      );
      const result = JSON.parse(stdout);

      expect(result.version).toBe("3.0.0");
      expect(result.packages).toBe("prettier@3.0.0");
      expect(result.packageData).toEqual([
        { name: "prettier", version: "3.0.0" },
      ]);
    });

    it("should handle multiple packages and select highest version", async () => {
      const input = `@protomolecule/ui@1.2.3
@protomolecule/eslint-config@10.0.0
prettier@2.8.0`;
      const { stdout } = await execAsync(
        `echo "${input}" | node scripts/parse-release-info.js`,
      );
      const result = JSON.parse(stdout);

      expect(result.version).toBe("10.0.0");
      expect(result.packages).toContain("@protomolecule/ui@1.2.3");
      expect(result.packages).toContain("@protomolecule/eslint-config@10.0.0");
      expect(result.packages).toContain("prettier@2.8.0");
    });

    it("should handle prerelease versions", async () => {
      const input = `@protomolecule/ui@1.0.0-beta.1
@protomolecule/eslint-config@1.0.0`;
      const { stdout } = await execAsync(
        `echo "${input}" | node scripts/parse-release-info.js`,
      );
      const result = JSON.parse(stdout);

      expect(result.version).toBe("1.0.0");
      expect(result.packageData).toHaveLength(2);
    });

    it("should handle empty input gracefully", async () => {
      const { stdout } = await execAsync(
        `echo "" | node scripts/parse-release-info.js`,
      );
      const result = JSON.parse(stdout);

      expect(result.version).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Date format
      expect(result.packages).toBe("No packages published");
      expect(result.packageData).toEqual([]);
    });

    it("should parse NPM publish output format", async () => {
      // Simulate actual NPM publish output
      const input = `Publishing @protomolecule/eslint-config@1.0.5 to npm...
Publishing prettier@3.0.0 to npm...`;
      const { stdout } = await execAsync(
        `echo "${input}" | grep -oE "(@[^[:space:]]+@[0-9]+\\.[0-9]+\\.[0-9]+[^[:space:]]*|[^@[:space:]]+@[0-9]+\\.[0-9]+\\.[0-9]+[^[:space:]]*)" | node scripts/parse-release-info.js`,
      );
      const result = JSON.parse(stdout);

      expect(result.version).toBe("3.0.0");
      expect(result.packageData).toContainEqual({
        name: "@protomolecule/eslint-config",
        version: "1.0.5",
      });
      expect(result.packageData).toContainEqual({
        name: "prettier",
        version: "3.0.0",
      });
    });
  });
});
