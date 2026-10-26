import { test, expect } from "@playwright/test";

// Regression test for a real bug: percent-encoded output (and similar
// unbroken machine-generated strings) has no natural word-break points, so
// `white-space: pre-wrap` alone lets it overflow its container and push the
// page wider than the viewport. Every result panel needs `overflow-wrap`
// (Tailwind `break-words`) in addition to `whitespace-pre-wrap`.
test("URL encoder result wraps a long unbroken encoded string instead of overflowing", async ({ page }) => {
  await page.goto("/tools/url-encoder-decoder");
  const input = page.getByLabel("Input text");
  const longText = "word ".repeat(80) + "https://example.com/a/very/long/path/that/keeps/going";
  await input.fill(longText);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBe(0);
});

test("HTML escape result wraps long unbroken output instead of overflowing", async ({ page }) => {
  await page.goto("/tools/html-escape-tool");
  const input = page.getByLabel("Input text");
  await input.fill("<" + "a".repeat(300) + ">");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBe(0);
});
