import { describe, it, expect } from "vitest";
import {
  determineSummaryDepth,
  formatPackageSummary,
  generateFallbackSummary,
  validateAIResponse,
  type Package,
  type BumpType,
} from "./generate-summary";

describe("determineSummaryDepth", () => {
  it("returns brief for single package patch", () => {
    const result = determineSummaryDepth("patch", 1);

    expect(result).toBe("brief");
  });

  it("returns brief for single package minor", () => {
    const result = determineSummaryDepth("minor", 1);

    expect(result).toBe("brief");
  });

  it("returns detailed for single package major", () => {
    const result = determineSummaryDepth("major", 1);

    expect(result).toBe("detailed");
  });

  it("returns comprehensive for major with 2 packages", () => {
    const result = determineSummaryDepth("major", 2);

    expect(result).toBe("comprehensive");
  });

  it("returns comprehensive for major with 3+ packages", () => {
    const result = determineSummaryDepth("major", 5);

    expect(result).toBe("comprehensive");
  });

  it("returns detailed for 3+ packages with minor bump", () => {
    const result = determineSummaryDepth("minor", 3);

    expect(result).toBe("detailed");
  });

  it("returns detailed for 3+ packages with patch bump", () => {
    const result = determineSummaryDepth("patch", 3);

    expect(result).toBe("detailed");
  });

  it("returns brief for 2 packages with minor bump", () => {
    const result = determineSummaryDepth("minor", 2);

    expect(result).toBe("brief");
  });
});

describe("formatPackageSummary", () => {
  it("formats single package", () => {
    const packages: Package[] = [
      { name: "@robeasthope/markdown", version: "1.0.0" },
    ];

    const result = formatPackageSummary(packages);

    expect(result).toBe("@robeasthope/markdown@1.0.0");
  });

  it("formats multiple packages with newlines", () => {
    const packages: Package[] = [
      { name: "@robeasthope/markdown", version: "1.0.0" },
      { name: "@robeasthope/ui", version: "2.1.0" },
      { name: "@protomolecule/infrastructure", version: "0.3.0" },
    ];

    const result = formatPackageSummary(packages);

    expect(result).toBe(
      "@robeasthope/markdown@1.0.0\n@robeasthope/ui@2.1.0\n@protomolecule/infrastructure@0.3.0",
    );
  });

  it("handles empty array", () => {
    const result = formatPackageSummary([]);

    expect(result).toBe("");
  });

  it("handles pre-release versions", () => {
    const packages: Package[] = [
      { name: "@robeasthope/markdown", version: "1.0.0-beta.1" },
    ];

    const result = formatPackageSummary(packages);

    expect(result).toBe("@robeasthope/markdown@1.0.0-beta.1");
  });
});

describe("generateFallbackSummary", () => {
  it("generates template for single package", () => {
    const packages: Package[] = [
      { name: "@robeasthope/markdown", version: "1.0.0" },
    ];

    const result = generateFallbackSummary(packages);

    expect(result).toContain("## Workspace Updates");
    expect(result).toContain("* @robeasthope/markdown@1.0.0");
    expect(result).toContain("AI summary unavailable");
    expect(result).toContain("see individual package changelogs");
  });

  it("generates template for multiple packages", () => {
    const packages: Package[] = [
      { name: "@robeasthope/markdown", version: "1.0.0" },
      { name: "@robeasthope/ui", version: "2.1.0" },
    ];

    const result = generateFallbackSummary(packages);

    expect(result).toContain("* @robeasthope/markdown@1.0.0");
    expect(result).toContain("* @robeasthope/ui@2.1.0");
  });

  it("handles empty packages array", () => {
    const result = generateFallbackSummary([]);

    expect(result).toContain("## Workspace Updates");
    expect(result).toContain("AI summary unavailable");
  });

  it("formats with markdown list items", () => {
    const packages: Package[] = [
      { name: "@robeasthope/test", version: "1.0.0" },
    ];

    const result = generateFallbackSummary(packages);

    // Should start with * for markdown list
    expect(result).toMatch(/\* @robeasthope\/test@1\.0\.0/);
  });
});

describe("validateAIResponse", () => {
  it("validates valid string response", () => {
    const content = "This is a valid AI response with sufficient length.";

    const result = validateAIResponse(content);

    expect(result).toBe(content);
  });

  it("throws on empty string", () => {
    expect(() => validateAIResponse("")).toThrow(
      "AI response is empty or not a string",
    );
  });

  it("throws on null", () => {
    expect(() => validateAIResponse(null)).toThrow(
      "AI response is empty or not a string",
    );
  });

  it("throws on undefined", () => {
    expect(() => validateAIResponse(undefined)).toThrow(
      "AI response is empty or not a string",
    );
  });

  it("throws on number", () => {
    expect(() => validateAIResponse(123)).toThrow(
      "AI response is empty or not a string",
    );
  });

  it("throws on object", () => {
    expect(() => validateAIResponse({ content: "test" })).toThrow(
      "AI response is empty or not a string",
    );
  });

  it("throws on too short response", () => {
    expect(() => validateAIResponse("short")).toThrow(
      "AI response too short: 5 characters",
    );
  });

  it("throws on response at 9 characters (boundary)", () => {
    expect(() => validateAIResponse("123456789")).toThrow(
      "AI response too short: 9 characters",
    );
  });

  it("accepts response at 10 characters (boundary)", () => {
    const content = "1234567890";

    const result = validateAIResponse(content);

    expect(result).toBe(content);
  });

  it("throws on too long response", () => {
    const content = "x".repeat(5001);

    expect(() => validateAIResponse(content)).toThrow(
      "AI response too long: 5001 characters",
    );
  });

  it("accepts response at 5000 characters (boundary)", () => {
    const content = "x".repeat(5000);

    const result = validateAIResponse(content);

    expect(result).toBe(content);
  });

  it("accepts typical AI response length", () => {
    const content =
      "## Summary\n\nThis release includes updates to the markdown package with improved performance and new features.\n\n## Highlights\n* ✨ New feature\n* ⚡ Performance improvements";

    const result = validateAIResponse(content);

    expect(result).toBe(content);
  });
});
