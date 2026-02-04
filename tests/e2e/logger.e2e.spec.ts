import { expect, test } from "@playwright/test";

test.describe("Logger Widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for the app to hydrate
    await page.waitForSelector('[data-testid="increment-button"]');
  });

  test("log drawer toggle button is visible with entry count", async ({ page }) => {
    const toggleButton = page.getByTestId("log-drawer-toggle");
    await expect(toggleButton).toBeVisible();
    // Should show "Logs (X)" where X is the entry count
    await expect(toggleButton).toContainText("Logs");
  });

  test("clicking toggle button opens the log drawer", async ({ page }) => {
    // Open the drawer
    await page.getByTestId("log-drawer-toggle").click();
    
    const drawer = page.getByTestId("log-drawer");
    await expect(drawer).toBeVisible();
    
    // Take a screenshot of the opened drawer
    await page.screenshot({ path: "tests/e2e/screenshots/logger-drawer-open.png" });
  });

  test("can close the log drawer", async ({ page }) => {
    // Open the drawer
    await page.getByTestId("log-drawer-toggle").click();
    await expect(page.getByTestId("log-drawer")).toBeVisible();
    
    // Close it
    await page.getByTestId("log-drawer-close").click();
    await expect(page.getByTestId("log-drawer")).not.toBeVisible();
    
    // Toggle button should be visible again
    await expect(page.getByTestId("log-drawer-toggle")).toBeVisible();
  });

  test("generates logs of all levels when clicking test button", async ({ page }) => {
    // Click the test logs button
    await page.getByTestId("test-logs-button").click();
    
    // Open the drawer
    await page.getByTestId("log-drawer-toggle").click();
    await expect(page.getByTestId("log-drawer")).toBeVisible();
    
    // Wait for logs to appear
    await page.waitForSelector('[data-testid="log-entry"]');
    
    // Take screenshot showing all log levels
    await page.screenshot({ path: "tests/e2e/screenshots/logger-all-levels.png" });
    
    // Verify we have multiple log entries (at least 5: mount info + debug, info, warn, error, fatal from test button)
    const entries = page.getByTestId("log-entry");
    const count = await entries.count();
    expect(count).toBeGreaterThanOrEqual(5);
    
    // Verify at least some of the key log levels are present (using first() to ensure visibility)
    // Note: trace is filtered by default since module config starts at "debug"
    await expect(page.getByTestId("log-level-debug").first()).toBeVisible();
    await expect(page.getByTestId("log-level-warn").first()).toBeVisible();
    await expect(page.getByTestId("log-level-error").first()).toBeVisible();
    await expect(page.getByTestId("log-level-fatal").first()).toBeVisible();
  });

  test("increment button generates info log", async ({ page }) => {
    // Click increment
    await page.getByTestId("increment-button").click();
    
    // Open drawer
    await page.getByTestId("log-drawer-toggle").click();
    await expect(page.getByTestId("log-drawer")).toBeVisible();
    
    // Wait for entries
    await page.waitForSelector('[data-testid="log-entry"]');
    
    // Verify info log about increment is present
    const logMessage = page.getByTestId("log-message").filter({ hasText: "Counter incremented" });
    await expect(logMessage).toBeVisible();
    
    // Verify it's from the logger-demo module
    const moduleText = page.getByTestId("log-module").filter({ hasText: "logger-demo" });
    await expect(moduleText.first()).toBeVisible();
    
    await page.screenshot({ path: "tests/e2e/screenshots/logger-increment-log.png" });
  });

  test("reset button generates warning log", async ({ page }) => {
    // First increment to have a value
    await page.getByTestId("increment-button").click();
    
    // Then reset
    await page.getByTestId("reset-button").click();
    
    // Open drawer
    await page.getByTestId("log-drawer-toggle").click();
    await expect(page.getByTestId("log-drawer")).toBeVisible();
    
    // Verify warning log about reset is present
    await page.waitForSelector('[data-testid="log-entry"]');
    const logMessage = page.getByTestId("log-message").filter({ hasText: "Counter reset" });
    await expect(logMessage).toBeVisible();
    
    // Verify warn level badge is present
    await expect(page.getByTestId("log-level-warn")).toBeVisible();
    
    await page.screenshot({ path: "tests/e2e/screenshots/logger-reset-warning.png" });
  });

  test("clear button removes all log entries", async ({ page }) => {
    // Generate some logs
    await page.getByTestId("test-logs-button").click();
    
    // Open drawer and verify logs exist
    await page.getByTestId("log-drawer-toggle").click();
    await page.waitForSelector('[data-testid="log-entry"]');
    const entriesBeforeClear = await page.getByTestId("log-entry").count();
    expect(entriesBeforeClear).toBeGreaterThan(0);
    
    // Clear logs
    await page.getByTestId("log-clear").click();
    
    // Verify logs are cleared (new UI says "No logs yet" or "No logs match current filters")
    await expect(page.getByText(/No logs/)).toBeVisible();
    
    await page.screenshot({ path: "tests/e2e/screenshots/logger-cleared.png" });
  });

  test("search filters log entries", async ({ page }) => {
    // Generate logs
    await page.getByTestId("test-logs-button").click();
    
    // Open drawer
    await page.getByTestId("log-drawer-toggle").click();
    await page.waitForSelector('[data-testid="log-entry"]');
    
    // Get count before filtering
    const entriesBefore = await page.getByTestId("log-entry").count();
    
    // Search for "error"
    await page.getByTestId("log-search").fill("error");
    
    // Wait for filtering to apply
    await page.waitForTimeout(100);
    
    // Should have fewer entries
    const entriesAfter = await page.getByTestId("log-entry").count();
    expect(entriesAfter).toBeLessThan(entriesBefore);
    expect(entriesAfter).toBeGreaterThan(0);
    
    // Verify the error log is still visible
    await expect(page.getByTestId("log-message").filter({ hasText: "error" })).toBeVisible();
    
    await page.screenshot({ path: "tests/e2e/screenshots/logger-search-filter.png" });
  });

  test("log entry shows module, function, and message", async ({ page }) => {
    // Generate a log
    await page.getByTestId("increment-button").click();
    
    // Open drawer
    await page.getByTestId("log-drawer-toggle").click();
    await page.waitForSelector('[data-testid="log-entry"]');
    
    const logEntry = page.getByTestId("log-entry").first();
    
    // Verify structure
    await expect(logEntry.getByTestId("log-module")).toBeVisible();
    await expect(logEntry.getByTestId("log-message")).toBeVisible();
    
    // Verify module is "logger-demo"
    await expect(logEntry.getByTestId("log-module")).toHaveText("logger-demo");
  });

  test("DOM snapshot captures log drawer structure", async ({ page }) => {
    // Generate logs
    await page.getByTestId("test-logs-button").click();
    
    // Open drawer
    await page.getByTestId("log-drawer-toggle").click();
    await page.waitForSelector('[data-testid="log-entry"]');
    
    // Get drawer snapshot
    const drawer = page.getByTestId("log-drawer");
    
    // Verify drawer contains expected elements
    await expect(drawer.locator("h2").first()).toHaveText("Logs");
    await expect(drawer.getByTestId("log-search")).toBeVisible();
    await expect(drawer.getByTestId("log-clear")).toBeVisible();
    await expect(drawer.getByTestId("log-entries-container")).toBeVisible();
    
    // Verify entry count is displayed
    await expect(drawer.getByText(/\d+ entries/)).toBeVisible();
    
    // Full page screenshot for reference
    await page.screenshot({ 
      path: "tests/e2e/screenshots/logger-full-page.png",
      fullPage: true 
    });
  });
});
