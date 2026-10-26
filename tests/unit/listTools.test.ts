import { describe, it, expect } from "vitest";
import {
  sortLines,
  reverseLineOrder,
  numberLines,
  removeDuplicateLineEntries,
  addPrefix,
  removePrefix,
  addSuffix,
  removeSuffix,
} from "@/lib/tools/listTools";

describe("listTools", () => {
  it("sorts lines alphabetically, case-insensitive", () => {
    expect(sortLines("banana\nApple\ncherry")).toBe("Apple\nbanana\ncherry");
  });

  it("sorts descending", () => {
    expect(sortLines("a\nb\nc", "desc")).toBe("c\nb\na");
  });

  it("reverses line order", () => {
    expect(reverseLineOrder("a\nb\nc")).toBe("c\nb\na");
  });

  it("numbers lines starting at 1", () => {
    expect(numberLines("a\nb")).toBe("1. a\n2. b");
  });

  it("removes duplicate lines case-insensitively", () => {
    expect(removeDuplicateLineEntries("a\nA\nb")).toBe("a\nb");
  });

  it("adds and removes a prefix, skipping empty lines", () => {
    const withPrefix = addPrefix("a\n\nb", "- ");
    expect(withPrefix).toBe("- a\n\n- b");
    expect(removePrefix(withPrefix, "- ")).toBe("a\n\nb");
  });

  it("adds and removes a suffix", () => {
    const withSuffix = addSuffix("a\nb", ";");
    expect(withSuffix).toBe("a;\nb;");
    expect(removeSuffix(withSuffix, ";")).toBe("a\nb");
  });

  it("handles empty input", () => {
    expect(sortLines("")).toBe("");
    expect(numberLines("")).toBe("1. ");
  });
});
