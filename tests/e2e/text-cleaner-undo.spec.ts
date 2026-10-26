import { test, expect } from "@playwright/test";

test("text cleaner applies a transformation and undo reverts it", async ({ page }) => {
  await page.goto("/tools/text-cleaner");
  const input = page.getByLabel("Input text");
  await input.fill("hello    world");
  await page.getByRole("button", { name: "Remove extra spaces" }).click();
  await expect(input).toHaveValue("hello world");

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(input).toHaveValue("hello    world");
});

test("text cleaner strips HTML tags without executing them", async ({ page }) => {
  await page.goto("/tools/text-cleaner");
  const input = page.getByLabel("Input text");
  await input.fill('<script>window.__xss = true;</script><b>Hello</b>');
  await page.getByRole("button", { name: "Remove HTML tags" }).click();
  await expect(input).toHaveValue("Hello");
  await expect(input).not.toHaveValue(/window\.__xss/);
  const xssFlag = await page.evaluate(() => (window as unknown as { __xss?: boolean }).__xss);
  expect(xssFlag).toBeUndefined();
});
