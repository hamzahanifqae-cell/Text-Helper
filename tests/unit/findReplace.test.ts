import { describe, it, expect } from "vitest";
import { findMatches, replaceAll } from "@/lib/tools/findReplace";

describe("findReplace", () => {
  it("returns no matches for empty query or text", () => {
    expect(findMatches("", "x")).toEqual([]);
    expect(findMatches("hello", "")).toEqual([]);
  });

  it("finds case-insensitive matches by default", () => {
    const matches = findMatches("Hello hello HELLO", "hello");
    expect(matches).toHaveLength(3);
  });

  it("respects case-sensitive option", () => {
    const matches = findMatches("Hello hello HELLO", "hello", { caseSensitive: true });
    expect(matches).toHaveLength(1);
  });

  it("respects whole-word option", () => {
    const matches = findMatches("cat category cats", "cat", { wholeWord: true });
    expect(matches).toHaveLength(1);
  });

  it("replaces all matches and reports an accurate count", () => {
    const result = replaceAll("foo bar foo baz foo", "foo", "qux");
    expect(result.text).toBe("qux bar qux baz qux");
    expect(result.count).toBe(3);
  });

  it("escapes special regex characters in the query", () => {
    const matches = findMatches("price: $5.00 (sale)", "$5.00");
    expect(matches).toHaveLength(1);
  });
});
