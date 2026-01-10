import { expect, test } from "@playwright/test";

test("smoke: home loads with no console errors", async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  page.on("pageerror", (err) => {
    consoleErrors.push(String(err));
  });

  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);

  await expect(page.getByText("Powered by Slopdog")).toBeVisible();
  await expect(page.getByRole("img", { name: "slopdog crew" })).toBeVisible();

  // Allow any immediate hydration/network console errors to surface.
  await page.waitForTimeout(250);

  expect(consoleErrors, `Console errors:\n${consoleErrors.join("\n")}`).toEqual([]);
});

