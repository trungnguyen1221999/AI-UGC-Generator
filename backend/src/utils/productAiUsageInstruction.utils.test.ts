import { describe, it, expect } from "vitest";
import { getProductUsageInstruction } from "./productAiUsageInstruction.utils.js";

describe("getProductUsageInstruction", () => {
  it("detects footwear category", () => {
    const result = getProductUsageInstruction(
      "Nike Air",
      "sneaker for running",
    );
    expect(result).toContain("WEARING");
    expect(result).toContain("feet");
  });

  it("detects bag category", () => {
    const result = getProductUsageInstruction("Gucci", "luxury handbag");
    expect(result).toContain("WEARING");
    expect(result).toContain("shoulder");
  });

  it("detects beverage category", () => {
    const result = getProductUsageInstruction("Starbucks", "iced coffee drink");
    expect(result).toContain("DRINKING");
  });

  it("returns default instruction when no category matches", () => {
    const result = getProductUsageInstruction("XYZ", "some random product");
    expect(result).toContain("holding");
    expect(result).toContain("visible");
  });

  it("is case-insensitive", () => {
    const upper = getProductUsageInstruction("SHOE", "SNEAKER");
    const lower = getProductUsageInstruction("shoe", "sneaker");
    expect(upper).toBe(lower);
  });
});
