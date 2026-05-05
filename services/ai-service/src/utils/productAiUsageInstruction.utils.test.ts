import { describe, it, expect } from "vitest";
import { getProductUsageInstruction } from "./productAiUsageInstruction.utils.js";

describe("getProductUsageInstruction()", () => {
  // 1. Basic Category Detection
  it("should detect footwear category and return wearing instructions", () => {
    const result = getProductUsageInstruction(
      "Nike Air",
      "sneaker for running",
    );
    expect(result).toContain("WEARING");
    expect(result).toContain("feet");
  });

  it("should detect skincare/makeup and return application instructions", () => {
    const result = getProductUsageInstruction(
      "Serum",
      "moisturizing facial cream",
    );
    expect(result).toContain("APPLYING");
    expect(result).toContain("directly to their skin");
  });

  it("should detect electronics and return active usage instructions", () => {
    const result = getProductUsageInstruction(
      "iPhone",
      "latest smartphone model",
    );
    expect(result).toContain("ACTIVELY USING");
    expect(result).toContain("holding phone to ear");
  });

  // 2. Case Insensitivity
  it("should return identical results regardless of text casing", () => {
    const upper = getProductUsageInstruction("SHOE", "SNEAKER");
    const lower = getProductUsageInstruction("shoe", "sneaker");
    const mixed = getProductUsageInstruction("ShOe", "SnEaKeR");

    expect(upper).toBe(lower);
    expect(mixed).toBe(lower);
  });

  // 3. Logic Priority (Conflict Handling)
  it("should prioritize categories based on the defined 'if' order", () => {
    // Both "shoe" and "shirt" exist. Footwear is defined first in code.
    const result = getProductUsageInstruction(
      "Running shoes",
      "goes well with a white shirt",
    );
    expect(result).toContain("shoes/footwear");
    expect(result).not.toContain("clothing item");
  });

  // 4. Fallback & Edge Cases
  it("should return the default instruction when no keywords match", () => {
    const result = getProductUsageInstruction(
      "Unknown",
      "Generic item description",
    );
    const defaultMsg =
      "The person is holding the product naturally at chest level";
    expect(result).toContain(defaultMsg);
  });

  it("should handle empty inputs by returning the default instruction", () => {
    const result = getProductUsageInstruction("", "");
    expect(result).toContain("holding the product naturally");
  });

  // 5. Strict String Matching (Prompt Integrity)
  it("should match the exact prompt string for beverages", () => {
    const expected =
      "The person is DRINKING or holding the beverage naturally, about to take a sip.";
    expect(getProductUsageInstruction("Coffee", "hot drink")).toBe(expected);
  });

  // 6. Comprehensive Regex Keyword Check
  it("should correctly map various keywords to their respective categories", () => {
    const testCases = [
      {
        name: "Ray-Ban",
        desc: "sunglasses",
        expected: "glasses on their face",
      },
      {
        name: "Rolex",
        desc: "gold watch",
        expected: "accessory on the appropriate body part",
      },
      { name: "Cap", desc: "baseball hat", expected: "hat/cap on their head" },
      {
        name: "Pizza",
        desc: "delicious meal",
        expected: "EATING or holding the food",
      },
    ];

    testCases.forEach(({ name, desc, expected }) => {
      expect(getProductUsageInstruction(name, desc)).toContain(expected);
    });
  });
});
