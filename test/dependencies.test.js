import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";

describe("Release Workflow Dependencies", () => {
  it("should have all required changeset dependencies", () => {
    const packageJsonPath = join(process.cwd(), "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    const requiredDeps = ["@changesets/cli", "@changesets/get-github-info"];

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    for (const dep of requiredDeps) {
      expect(allDeps[dep], `Missing dependency: ${dep}`).toBeDefined();
    }
  });

  it("should have changeset config defined", () => {
    const packageJsonPath = join(process.cwd(), ".changeset/config.json");
    const changesetConfig = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    expect(changesetConfig).toBeDefined();
    expect(changesetConfig.changelog).toBeDefined();
  });

  it("should have valid changeset changelog config", () => {
    const packageJsonPath = join(process.cwd(), ".changeset/config.json");
    const changesetConfig = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    // If using custom changelog, validate it points to our config
    if (Array.isArray(changesetConfig.changelog)) {
      expect(changesetConfig.changelog[0]).toBe("./changelog-config.js");
    }
  });

  it("should have GitHub Action dependencies installed", () => {
    const packageJsonPath = join(process.cwd(), "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    // Check for pnpm in package manager field
    expect(packageJson.packageManager).toContain("pnpm");

    // Ensure turbo is available for build commands
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    expect(allDeps.turbo).toBeDefined();
  });
});
