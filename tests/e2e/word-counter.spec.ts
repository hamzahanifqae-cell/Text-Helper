import { test, expect } from "@playwright/test";

test("word counter updates stats as text is typed", async ({ page }) => {
  await page.goto("/tools/word-counter");
  const input = page.getByLabel("Input text");
  await input.fill("The quick brown fox jumps over the lazy dog.");
  await expect(page.getByText("9").first()).toBeVisible();
});

test("word counter handles emoji and unicode without crashing", async ({ page }) => {
  await page.goto("/tools/word-counter");
  const input = page.getByLabel("Input text");
  await input.fill("Héllo 👍 wörld café");
  // Should render stats without throwing a client-side error overlay.
  await expect(page.getByText("Words", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Word Counter");
});

test("clearing input resets stats to zero", async ({ page }) => {
  await page.goto("/tools/word-counter");
  const input = page.getByLabel("Input text");
  await input.fill("some text here");
  await page.getByRole("button", { name: "Clear input" }).click();
  await expect(input).toHaveValue("");
});
