import { describe, it, expect } from "vitest";
import {
  removeExtraSpaces,
  removeEmptyLines,
  removeDuplicateLines,
  normalizeLineBreaks,
  removeHtmlTags,
  tabsToSpaces,
  spacesToTabs,
} from "@/lib/tools/cleanup";

describe("cleanup", () => {
  it("handles empty input without throwing", () => {
    expect(removeExtraSpaces("").text).toBe("");
    expect(removeEmptyLines("").text).toBe("");
    expect(removeDuplicateLines("").text).toBe("");
  });

  it("removes extra spaces and trims line edges", () => {
    const result = removeExtraSpaces("  hello   world  ");
    expect(result.text).toBe("hello world");
    expect(result.changes).toBeGreaterThan(0);
  });

  it("removes empty lines", () => {
    const result = removeEmptyLines("a\n\nb\n\n\nc");
    expect(result.text).toBe("a\nb\nc");
    expect(result.changes).toBe(3);
  });

  it("removes duplicate lines, keeping first occurrence", () => {
    const result = removeDuplicateLines("a\nb\na\nc\nb");
    expect(result.text).toBe("a\nb\nc");
    expect(result.changes).toBe(2);
  });

  it("normalizes CRLF and collapses excess blank lines", () => {
    const result = normalizeLineBreaks("a\r\nb\r\n\r\n\r\n\r\nc", { collapseBlankLines: true });
    expect(result.text).not.toContain("\r");
    expect(result.text).not.toMatch(/\n{3,}/);
  });

  it("strips HTML tags and decodes common entities", () => {
    const result = removeHtmlTags("<p>Hello &amp; welcome</p>");
    expect(result.text).toBe("Hello & welcome");
  });

  it("removes script tags along with their contents, not just the tag markup", () => {
    const result = removeHtmlTags('<script>alert("xss")</script>Hello');
    expect(result.text).not.toContain("<script>");
    expect(result.text).not.toContain("alert(");
    expect(result.text).toBe("Hello");
  });

  it("converts tabs to spaces and back", () => {
    const toSpaces = tabsToSpaces("a\tb", 4);
    expect(toSpaces.text).toBe("a    b");
    const toTabs = spacesToTabs("a    b", 4);
    expect(toTabs.text).toBe("a\tb");
  });

  it("handles large multiline input without throwing", () => {
    const large = Array.from({ length: 20000 }, (_, i) => `line ${i}`).join("\n");
    const result = removeDuplicateLines(large);
    expect(result.changes).toBe(0);
  });
});
