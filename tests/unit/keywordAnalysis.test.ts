import { describe, it, expect } from "vitest";
import { wordFrequency, repeatedPhrases, vocabularyVariety, keywordStats } from "@/lib/tools/keywordAnalysis";

describe("keywordAnalysis", () => {
  it("handles empty input", () => {
    expect(wordFrequency("")).toEqual([]);
    expect(vocabularyVariety("").totalWords).toBe(0);
  });

  it("computes word frequency excluding stopwords by default", () => {
    const freq = wordFrequency("the cat and the dog and the bird", true);
    const words = freq.map((f) => f.word);
    expect(words).not.toContain("the");
    expect(words).not.toContain("and");
    expect(words).toContain("cat");
  });

  it("finds repeated multi-word phrases", () => {
    const phrases = repeatedPhrases("the quick fox the quick fox jumped", [2]);
    expect(phrases.some((p) => p.phrase === "the quick")).toBe(true);
  });

  it("computes vocabulary variety as a type-token ratio", () => {
    const variety = vocabularyVariety("cat dog cat dog cat");
    expect(variety.totalWords).toBe(5);
    expect(variety.uniqueWords).toBe(2);
    expect(variety.typeTokenRatio).toBe(40);
  });

  it("computes occurrences and density for a keyword phrase", () => {
    const stats = keywordStats("red apple green apple red apple", "red apple");
    expect(stats.occurrences).toBe(2);
    expect(stats.density).toBeGreaterThan(0);
  });
});
