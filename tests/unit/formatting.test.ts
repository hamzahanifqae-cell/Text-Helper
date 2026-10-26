import { describe, it, expect } from "vitest";
import { escapeHtml, unescapeHtml, urlEncode, urlDecode } from "@/lib/tools/formatting";

describe("formatting", () => {
  it("handles empty input", () => {
    expect(escapeHtml("")).toBe("");
    expect(unescapeHtml("")).toBe("");
  });

  it("escapes HTML special characters, including script tags", () => {
    const result = escapeHtml('<script>alert("xss")</script>');
    expect(result).not.toContain("<script>");
    expect(result).toBe("&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
  });

  it("round-trips escape/unescape", () => {
    const original = `<div class="a">Tom & Jerry's "show"</div>`;
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });

  it("encodes and decodes URL components", () => {
    const encoded = urlEncode("hello world/?=&");
    expect(encoded.ok).toBe(true);
    const decoded = urlDecode(encoded.value);
    expect(decoded.ok).toBe(true);
    expect(decoded.value).toBe("hello world/?=&");
  });

  it("returns a clear error for invalid percent-encoding instead of throwing", () => {
    const result = urlDecode("%E0%A4%A");
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
