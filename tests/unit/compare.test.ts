import { describe, it, expect } from "vitest";
import { compareWords, compareLines, diffStats } from "@/lib/tools/compare";

describe("compare", () => {
  it("handles two empty strings", () => {
    expect(compareWords("", "")).toEqual([]);
  });

  it("detects word-level additions and deletions", () => {
    const segments = compareWords("the quick fox", "the quick brown fox");
    const added = segments.filter((s) => s.added).map((s) => s.value.trim());
    expect(added.join(" ")).toContain("brown");
  });

  it("detects line-level changes", () => {
    const segments = compareLines("line one\nline two", "line one\nline three");
    const removed = segments.some((s) => s.removed && s.value.includes("line two"));
    const added = segments.some((s) => s.added && s.value.includes("line three"));
    expect(removed).toBe(true);
    expect(added).toBe(true);
  });

  it("computes diff stats", () => {
    const segments = compareWords("a b c", "a b c d");
    const stats = diffStats(segments);
    expect(stats.additions).toBe(1);
    expect(stats.unchanged).toBe(3);
  });

  it("keeps a visible space between a removed word and the word that replaces it (regression)", () => {
    // Without the fix, jsdiff emits adjacent {removed:"jumps"}{added:"leaps"}
    // segments with no space between them, so a renderer that shows both
    // sides concatenates them into "jumpsleaps".
    const segments = compareWords(
      "The quick brown fox jumps over the lazy dog.",
      "The quick brown fox leaps over the lazy dog."
    );
    const rendered = segments.map((s) => s.value).join("");
    expect(rendered).not.toMatch(/jumpsleaps/);
    expect(rendered).toBe("The quick brown fox jumpsleaps over the lazy dog.".replace("jumpsleaps", "jumps leaps"));
  });

  it("does not add extra spaces for ordinary additions/deletions that already have correct spacing", () => {
    const segments = compareWords("the quick fox", "the quick brown fox");
    const rendered = segments.map((s) => s.value).join("");
    expect(rendered).toBe("the quick brown fox");
  });
});
