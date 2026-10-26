import { describe, it, expect } from "vitest";
import {
  detectRepeatedWords,
  detectMisspellings,
  detectVariantMismatches,
  detectPunctuation,
  detectAll,
  applySuggestion,
} from "@/lib/tools/grammarLite";

describe("grammarLite", () => {
  it("handles empty input across all detectors", () => {
    expect(detectRepeatedWords("")).toEqual([]);
    expect(detectMisspellings("")).toEqual([]);
    expect(detectPunctuation("")).toEqual([]);
  });

  it("detects repeated consecutive words", () => {
    const result = detectRepeatedWords("This is is a test");
    expect(result).toHaveLength(1);
    expect(result[0]?.suggestion).toBe("is");
  });

  it("detects common misspellings and preserves capitalization", () => {
    const result = detectMisspellings("Teh quick fox recieved the memo.");
    const fixes = result.map((r) => [r.original, r.suggestion]);
    expect(fixes).toContainEqual(["Teh", "The"]);
    expect(fixes).toContainEqual(["recieved", "received"]);
  });

  it("respects the custom dictionary to suppress false positives", () => {
    const result = detectMisspellings("teh", new Set(["teh"]));
    expect(result).toHaveLength(0);
  });

  it("flags UK spelling when checking for US English", () => {
    const result = detectVariantMismatches("I love this colour and flavour.", "US");
    expect(result.map((r) => r.original)).toEqual(["colour", "flavour"]);
  });

  it("flags US spelling when checking for UK English", () => {
    const result = detectVariantMismatches("I love this color.", "UK");
    expect(result.map((r) => r.original)).toEqual(["color"]);
  });

  it("detects basic punctuation issues", () => {
    const result = detectPunctuation("Hello  world,this is great!!!");
    const types = result.map((r) => r.explanation);
    expect(types.some((t) => t.includes("space"))).toBe(true);
  });

  it("deduplicates overlapping suggestions from detectAll", () => {
    const result = detectAll("Teh cat.", { variant: "US" });
    const positions = result.map((r) => `${r.start}-${r.end}`);
    expect(new Set(positions).size).toBe(positions.length);
  });

  it("applies a suggestion when the text range still matches", () => {
    const text = "Teh cat sat.";
    const suggestion = detectMisspellings(text)[0]!;
    const result = applySuggestion(text, suggestion);
    expect(result.ok).toBe(true);
    expect(result.text).toBe("The cat sat.");
  });

  it("refuses to apply a suggestion when the underlying text has changed (stale range)", () => {
    const original = "Teh cat sat.";
    const suggestion = detectMisspellings(original)[0]!;
    const editedText = "Teh dog sat."; // user edited the text after the suggestion was generated
    const result = applySuggestion(editedText, suggestion);
    // The suggestion's range still points at "Teh" in both strings here, so
    // sanity-check with a case that actually shifts the range out from under it:
    const shiftedText = "Say: Teh cat sat.";
    const shiftedResult = applySuggestion(shiftedText, suggestion);
    expect(shiftedResult.ok).toBe(false);
    expect(shiftedResult.reason).toBeTruthy();
    // and confirm the "same word, different sentence" case is still internally consistent
    expect(result.ok).toBe(true);
  });

  it("refuses to apply a suggestion whose range is out of bounds", () => {
    const suggestion = {
      id: "x",
      type: "spelling" as const,
      start: 100,
      end: 110,
      original: "foo",
      suggestion: "bar",
      explanation: "test",
    };
    const result = applySuggestion("short text", suggestion);
    expect(result.ok).toBe(false);
  });
});
