import { existsSync } from "fs";
import { createRequire } from "module";
import { join } from "path";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);

describe("Changelog Configuration", () => {
  it("should have changelog config file", () => {
    const configPath = join(
      process.cwd(),
      ".changeset",
      "changelogFunctions.js",
    );
    expect(existsSync(configPath)).toBe(true);
  });

  it("should have @changesets/get-github-info dependency installed", () => {
    let hasPackage = false;
    try {
      require.resolve("@changesets/get-github-info");
      hasPackage = true;
    } catch {
      hasPackage = false;
    }

    expect(hasPackage).toBe(true);
  });

  it("should be able to import changelog config without errors", async () => {
    let changelogConfig: undefined | { default: unknown };
    let error: Error | null = null;

    try {
      changelogConfig = await import("../.changeset/changelogFunctions.js");
    } catch (error_) {
      error = error_ as Error;
    }

    expect(error).toBeNull();
    expect(changelogConfig).toBeDefined();
    expect(changelogConfig?.default).toBeDefined();
  });

  it("should export required changelog functions", async () => {
    const changelogConfig = await import("../.changeset/changelogFunctions.js");
    const config = changelogConfig.default;

    expect(typeof config.getDependencyReleaseLine).toBe("function");
    expect(typeof config.getReleaseLine).toBe("function");
    expect(typeof config.generatePRTitle).toBe("function");
  });

  it("should generate PR titles correctly", async () => {
    const changelogConfig = await import("../.changeset/changelogFunctions.js");
    const config = changelogConfig.default;

    // Test with no changesets
    const emptyTitle = await config.generatePRTitle?.([]);
    expect(emptyTitle).toBe("chore: version packages");

    // Test with feature changeset
    const featureTitle = await config.generatePRTitle?.([
      {
        releases: [{ name: "@protomolecule/ui", type: "minor" }],
        summary: "feat: add new component",
      },
    ]);
    expect(featureTitle).toContain("ui");
    expect(featureTitle).toContain("feature");
  });
});
