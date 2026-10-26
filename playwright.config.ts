import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3412",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run start:standalone",
    url: "http://127.0.0.1:3412",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { PORT: "3412" },
  },
});
