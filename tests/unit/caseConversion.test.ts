import { describe, it, expect } from "vitest";
import { toUpperCase, toLowerCase, toSentenceCase, toTitleCase, toToggleCase } from "@/lib/tools/caseConversion";

describe("caseConversion", () => {
  it("handles empty input for every mode", () => {
    expect(toUpperCase("")).toBe("");
    expect(toLowerCase("")).toBe("");
    expect(toSentenceCase("")).toBe("");
    expect(toTitleCase("")).toBe("");
    expect(toToggleCase("")).toBe("");
  });

  it("converts upper/lower case", () => {
    expect(toUpperCase("hello")).toBe("HELLO");
    expect(toLowerCase("HELLO")).toBe("hello");
  });

  it("applies sentence case across multiple sentences", () => {
    expect(toSentenceCase("hello world. this is great! really?")).toBe(
      "Hello world. This is great! Really?"
    );
  });

  it("applies title case while keeping small words lowercase", () => {
    expect(toTitleCase("the quick brown fox jumps over the lazy dog")).toBe(
      "The Quick Brown Fox Jumps over the Lazy Dog"
    );
  });

  it("toggles case per character", () => {
    expect(toToggleCase("Hello World")).toBe("hELLO wORLD");
  });

  it("handles unicode accented characters", () => {
    expect(toUpperCase("café")).toBe("CAFÉ");
    expect(toLowerCase("CAFÉ")).toBe("café");
  });
});
