import { test, expect } from "@playwright/test";

test("theme toggle switches and persists across reload without a flash", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const initialTheme = await html.getAttribute("data-theme");

  await page.getByRole("button", { name: /switch to (dark|light) theme/i }).click();
  const newTheme = await html.getAttribute("data-theme");
  expect(newTheme).not.toBe(initialTheme);

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", newTheme ?? "");
});
