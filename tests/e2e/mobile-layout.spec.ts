import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test("home page has no horizontal overflow on a mobile viewport", async ({ page }) => {
  await page.goto("/");
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasOverflow).toBe(false);
});

test("tool page has no horizontal overflow and mobile menu opens", async ({ page }) => {
  await page.goto("/tools/word-counter");
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasOverflow).toBe(false);

  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("heading", { name: "Browse tools" })).toBeVisible();
});
