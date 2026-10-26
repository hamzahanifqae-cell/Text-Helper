import { test, expect } from "@playwright/test";

// This suite runs against a server started WITHOUT a GROQ_API_KEY (the
// default for this local project until credentials are supplied), so it
// verifies the honest "not configured" degradation path rather than a real
// AI call. See README "Testing" section for the separate, explicit real-API
// smoke test.
test("AI tool shows a clear unavailable banner when no API key is configured", async ({ page }) => {
  await page.goto("/tools/ai-text-humanizer");
  await expect(page.getByText(/AI tools are not configured on this server/i)).toBeVisible();
});

test("grammar checker's local checks still work fully without any AI configuration", async ({ page }) => {
  await page.goto("/tools/grammar-checker");
  const input = page.getByLabel("Input text");
  await input.fill("Teh cat sat on teh mat.");
  await expect(page.getByText("The").first()).toBeVisible();
});
