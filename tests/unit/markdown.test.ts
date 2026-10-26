import { describe, it, expect } from "vitest";
import { renderMarkdownSafe } from "@/lib/tools/markdown";

describe("markdown", () => {
  it("renders basic markdown to HTML", async () => {
    const html = await renderMarkdownSafe("# Heading\n\nSome **bold** text.");
    expect(html).toContain("<h1");
    expect(html).toContain("<strong>bold</strong>");
  });

  it("strips script tags from embedded raw HTML (XSS prevention)", async () => {
    const html = await renderMarkdownSafe('Hello <script>alert("xss")</script> world');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("alert(");
  });

  it("strips inline event-handler attributes", async () => {
    const html = await renderMarkdownSafe('<img src="x.png" onerror="alert(1)">');
    expect(html).not.toContain("onerror");
  });

  it("handles empty input", async () => {
    expect(await renderMarkdownSafe("")).toBe("");
  });
});
