import { test, expect } from "@playwright/test";

test("home page loads and links to a tool", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("everyday text toolkit");
  await page.getByRole("link", { name: "Try the word counter" }).click();
  await expect(page).toHaveURL(/\/tools\/word-counter/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Word Counter");
});

test("all tools page lists tools and filters by search", async ({ page }) => {
  await page.goto("/tools");
  await expect(page.getByRole("heading", { level: 1, name: "All Tools" })).toBeVisible();
  const filterInput = page.getByLabel("Filter tools");
  await filterInput.fill("case converter");
  await expect(page.getByRole("link", { name: /Case Converter/ })).toBeVisible();
});

test("404 page renders for an unknown tool and offers navigation back", async ({ page }) => {
  const response = await page.goto("/tools/this-tool-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("We couldn't find that page")).toBeVisible();
  await page.getByRole("link", { name: "Browse all tools" }).click();
  await expect(page).toHaveURL(/\/tools$/);
});

test("keyboard navigation reaches the skip-to-content link", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByText("Skip to content");
  await expect(skipLink).toBeFocused();
});
