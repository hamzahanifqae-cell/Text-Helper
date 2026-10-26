import { describe, it, expect } from "vitest";
import { computeReadability, countSyllables, longSentences, difficultWordSuggestions } from "@/lib/tools/readability";

describe("readability", () => {
  it("handles empty input without throwing", () => {
    const scores = computeReadability("");
    expect(Number.isFinite(scores.averageSentenceLength)).toBe(true);
    expect(scores.totalSyllables).toBe(0);
  });

  it("counts syllables heuristically", () => {
    expect(countSyllables("cat")).toBe(1);
    expect(countSyllables("banana")).toBeGreaterThanOrEqual(2);
  });

  it("flags unusually long sentences", () => {
    const longSentence = Array.from({ length: 30 }, (_, i) => `word${i}`).join(" ") + ".";
    const result = longSentences(`Short one. ${longSentence}`, 25);
    expect(result).toHaveLength(1);
  });

  it("suggests simpler alternatives for known overused words", () => {
    const suggestions = difficultWordSuggestions("We need to utilize this facilitate approach.");
    const words = suggestions.map((s) => s.word.toLowerCase());
    expect(words).toContain("utilize");
    expect(words).toContain("facilitate");
  });

  it("produces a lower Flesch Reading Ease score for denser text", () => {
    const simple = computeReadability("The cat sat. The dog ran. It was fun.");
    const complex = computeReadability(
      "The multifaceted implementation necessitates comprehensive consideration of interdependent organizational ramifications."
    );
    expect(complex.fleschReadingEase).toBeLessThan(simple.fleschReadingEase);
  });
});
