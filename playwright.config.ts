import { defineConfig, devices } from "@playwright/test";

const port = 3001;
const baseURL = `http://127.0.0.1:${port}`;

const defaultHeadless =
  process.env.PLAYWRIGHT_HEADLESS != null
    ? process.env.PLAYWRIGHT_HEADLESS !== "0"
    : Boolean(process.env.CI);

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    headless: defaultHeadless,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm --prefix src run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

