import { expect, test } from "@playwright/test";

test("prod smoke: Vercel deploy loads with no console errors", async ({ page }) => {
  test.skip(
    !process.env.E2E_PROD_BASE_URL,
    "E2E_PROD_BASE_URL not set (set it to run this prod smoke test)",
  );
  const baseURL = process.env.E2E_PROD_BASE_URL;

  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));

  await page.goto(String(baseURL));
  await expect(page.getByText("Powered by Slopdog")).toBeVisible();
  await expect(page.getByRole("img", { name: "slopdog crew" })).toBeVisible();

  await page.waitForTimeout(250);
  expect(consoleErrors, `Console errors:\n${consoleErrors.join("\n")}`).toEqual([]);
});

