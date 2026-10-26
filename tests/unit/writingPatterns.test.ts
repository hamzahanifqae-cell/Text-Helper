import { describe, it, expect } from "vitest";
import { analyzeWritingPatterns } from "@/lib/tools/writingPatterns";

describe("writingPatterns", () => {
  it("handles empty input without throwing", () => {
    const report = analyzeWritingPatterns("");
    expect(report.sentenceCount).toBe(0);
  });

  it("computes sentence-length statistics", () => {
    const report = analyzeWritingPatterns("This is short. This one is quite a bit longer than that one.");
    expect(report.sentenceCount).toBe(2);
    expect(report.averageSentenceLength).toBeGreaterThan(0);
  });

  it("detects repeated sentence starters", () => {
    const report = analyzeWritingPatterns("First, we begin. First, we continue. First, we finish.");
    expect(report.repeatedSentenceStarters.some((s) => s.starter === "first")).toBe(true);
  });

  it("never includes any authorship percentage field", () => {
    const report = analyzeWritingPatterns("Some text here.");
    expect(Object.keys(report)).not.toContain("aiPercentage");
    expect(Object.keys(report)).not.toContain("confidence");
  });
});
