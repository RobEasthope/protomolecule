import { describe, it, expect } from "vitest";
import { sum } from "./sum";

describe("sum", () => {
  it("adds positive numbers correctly", () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(10, 20)).toBe(30);
  });

  it("handles negative numbers", () => {
    expect(sum(-1, -2)).toBe(-3);
    expect(sum(-5, 5)).toBe(0);
  });

  it("handles zero", () => {
    expect(sum(0, 0)).toBe(0);
    expect(sum(5, 0)).toBe(5);
    expect(sum(0, -5)).toBe(-5);
  });
});
