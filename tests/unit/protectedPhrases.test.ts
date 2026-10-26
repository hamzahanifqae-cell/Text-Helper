import { describe, it, expect } from "vitest";
import { verifyProtectedPhrases, buildProtectedPhrasesInstruction } from "@/lib/ai/protectedPhrases";

describe("protectedPhrases", () => {
  it("reports which phrases survived and which did not", () => {
    const result = verifyProtectedPhrases("The Acme Corp released a new product.", ["Acme Corp", "Globex Inc"]);
    expect(result).toEqual([
      { phrase: "Acme Corp", preserved: true },
      { phrase: "Globex Inc", preserved: false },
    ]);
  });

  it("returns an empty array for no phrases", () => {
    expect(verifyProtectedPhrases("anything", [])).toEqual([]);
  });

  it("builds an empty instruction string when there are no phrases", () => {
    expect(buildProtectedPhrasesInstruction([])).toBe("");
  });

  it("builds an instruction listing each phrase", () => {
    const instruction = buildProtectedPhrasesInstruction(["Acme Corp", "v2.0"]);
    expect(instruction).toContain("Acme Corp");
    expect(instruction).toContain("v2.0");
  });
});
