import { describe, it, expect } from "vitest";
import { computeTextStats, countWords, countGraphemes, formatDuration } from "@/lib/tools/counters";

describe("counters", () => {
  it("handles empty input", () => {
    const stats = computeTextStats("");
    expect(stats.words).toBe(0);
    expect(stats.charactersWithSpaces).toBe(0);
    expect(stats.sentences).toBe(0);
    expect(stats.paragraphs).toBe(0);
    expect(stats.lines).toBe(0);
  });

  it("counts a simple sentence", () => {
    const stats = computeTextStats("Hello world. This is a test!");
    expect(stats.words).toBe(6);
    expect(stats.sentences).toBe(2);
  });

  it("counts emoji and combining characters as single graphemes", () => {
    // flag emoji is a multi-codepoint grapheme cluster
    expect(countGraphemes("👍")).toBe(1);
    expect(countGraphemes("🇨🇦")).toBe(1);
    expect(countGraphemes("café")).toBe(4);
  });

  it("counts unicode words across scripts reasonably", () => {
    expect(countWords("Hello world")).toBe(2);
    expect(countWords("héllo wörld")).toBe(2);
  });

  it("handles multiline text with paragraphs and blank lines", () => {
    const text = "Paragraph one.\n\nParagraph two.\nStill paragraph two.\n\n\nParagraph three.";
    const stats = computeTextStats(text);
    expect(stats.paragraphs).toBe(3);
    expect(stats.lines).toBe(7);
  });

  it("handles a large input without throwing", () => {
    const large = "word ".repeat(50000);
    const stats = computeTextStats(large);
    expect(stats.words).toBe(50000);
  });

  it("estimates reading and speaking time", () => {
    const text = "word ".repeat(200).trim();
    const stats = computeTextStats(text);
    expect(stats.readingTimeSeconds).toBe(60);
    expect(formatDuration(stats.readingTimeSeconds)).toBe("1 min");
  });
});
