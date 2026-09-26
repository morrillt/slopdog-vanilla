import { defineConfig, devices } from "@playwright/test";
import { spawnSync } from "node:child_process";

const port = 3005;
const baseURL = `http://127.0.0.1:${port}`;

// Headless everywhere by default (T-434). A headed run (--headed or PLAYWRIGHT_HEADLESS=0)
// must say why in PW_HEADED_REASON: the reason is announced to Todd as it starts (a terminal
// line and notify-send), and a headed run without one refuses to start.
const wantsHeaded = process.env.PLAYWRIGHT_HEADLESS === "0" || process.argv.includes("--headed");
if (wantsHeaded && !process.env.PW_HEADED_ANNOUNCED) {
  const reason = process.env.PW_HEADED_REASON?.trim();
  if (!reason) throw new Error('Headed Playwright run refused: say why with PW_HEADED_REASON="..." (T-434).');
  const msg = `Headed Playwright run in ${process.cwd()} (${process.argv.slice(2).join(" ")}): ${reason}`;
  console.log(`\n>>> ${msg}\n`);
  spawnSync("notify-send", ["Playwright headed", msg]);
  process.env.PW_HEADED_ANNOUNCED = "1";
}
const defaultHeadless = !wantsHeaded;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    headless: defaultHeadless,
    trace: "on-first-retry",
    launchOptions: {
      // Sets WM_CLASS to PlaywrightChromium so ~/.config/i3/config parks headed
      // runs on workspace 10 with no_focus; real Chromium/Chrome keep their own
      // class. Harmless headless and on other OSes. T-434 checks every repo has it.
      args: ["--class=PlaywrightChromium"],
    },
  },
  webServer: {
    command: `npm --prefix src run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

