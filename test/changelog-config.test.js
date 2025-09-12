import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { join } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

describe("Changelog Configuration", () => {
  it("should have changelog config file", () => {
    const configPath = join(process.cwd(), ".changeset", "changelog-config.js");
    expect(existsSync(configPath)).toBe(true);
  });

  it("should have @changesets/get-github-info dependency installed", () => {
    let hasPackage = false;
    try {
      require.resolve("@changesets/get-github-info");
      hasPackage = true;
    } catch (e) {
      hasPackage = false;
    }
    expect(hasPackage).toBe(true);
  });

  it("should be able to import changelog config without errors", async () => {
    let changelogConfig;
    let error = null;

    try {
      changelogConfig = await import("../.changeset/changelog-config.js");
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
    expect(changelogConfig).toBeDefined();
    expect(changelogConfig.default).toBeDefined();
  });

  it("should export required changelog functions", async () => {
    const changelogConfig = await import("../.changeset/changelog-config.js");
    const config = changelogConfig.default;

    expect(typeof config.getDependencyReleaseLine).toBe("function");
    expect(typeof config.getReleaseLine).toBe("function");
    expect(typeof config.generatePRTitle).toBe("function");
  });

  it("should generate PR titles correctly", async () => {
    const changelogConfig = await import("../.changeset/changelog-config.js");
    const config = changelogConfig.default;

    // Test with no changesets
    const emptyTitle = await config.generatePRTitle([]);
    expect(emptyTitle).toBe("chore: version packages");

    // Test with feature changeset
    const featureTitle = await config.generatePRTitle([
      {
        summary: "feat: add new component",
        releases: [{ name: "@protomolecule/ui", type: "minor" }],
      },
    ]);
    expect(featureTitle).toContain("ui");
    expect(featureTitle).toContain("feature");
  });
});
