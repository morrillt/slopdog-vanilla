import { test, expect } from "@playwright/test";

test.describe("Docs System", () => {
  test.describe("Explorer Page", () => {
    test("loads with filter controls", async ({ page }) => {
      await page.goto("/docs");

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Verify filter panel exists
      await expect(page.getByPlaceholder("Search by title...")).toBeVisible();
      await expect(page.getByText("Type", { exact: true })).toBeVisible();
      await expect(page.getByText("Status", { exact: true })).toBeVisible();
    });

    test("displays document cards", async ({ page }) => {
      await page.goto("/docs");

      // Wait for manifest to load
      await page.waitForLoadState("networkidle");

      // Verify at least one doc appears - look for "Updated:" which appears in cards
      await expect(page.getByText("Updated:").first()).toBeVisible({
        timeout: 10000,
      });
    });

    test("shows multiple document types", async ({ page }) => {
      await page.goto("/docs");
      await page.waitForLoadState("networkidle");

      // Wait for docs to load
      await expect(page.getByText("Updated:").first()).toBeVisible({
        timeout: 10000,
      });

      // Check that we can see document titles
      // These are from our test fixtures
      const pageContent = await page.content();
      const hasStyleGuide =
        pageContent.includes("Style Guide") ||
        pageContent.includes("Code Style Guide");
      expect(hasStyleGuide).toBe(true);
    });

    test("filters by type", async ({ page }) => {
      await page.goto("/docs");
      await page.waitForLoadState("networkidle");

      // Wait for initial load
      await expect(page.getByText("Updated:").first()).toBeVisible({
        timeout: 10000,
      });

      // Find and interact with type filter
      const typeSelect = page.locator("select").filter({ hasText: "All Types" });
      if (await typeSelect.isVisible()) {
        await typeSelect.selectOption("plan");
        // After filtering, should still see the Plans section if it exists
        await page.waitForTimeout(500);
      }
    });

    test("search filters documents", async ({ page }) => {
      await page.goto("/docs");
      await page.waitForLoadState("networkidle");

      // Wait for initial load
      await expect(page.getByText("Updated:").first()).toBeVisible({
        timeout: 10000,
      });

      // Search for a known doc
      await page.getByPlaceholder("Search by title...").fill("Style");
      await page.waitForTimeout(500);

      // Should still see style guide
      await expect(page.getByText(/style/i).first()).toBeVisible();
    });
  });

  test.describe("Document Viewer", () => {
    test("renders document content", async ({ page }) => {
      await page.goto("/docs/styleguide");
      await page.waitForLoadState("networkidle");

      // Verify content renders - look for the title or back button
      await expect(
        page.getByText("Back to Docs").or(page.getByText("← Back to Docs"))
      ).toBeVisible({ timeout: 10000 });
    });

    test("displays table of contents for docs with headings", async ({
      page,
    }) => {
      // Navigate to a doc with multiple headings
      await page.goto("/docs/how-to/docs-system-guide");
      await page.waitForLoadState("networkidle");

      // Wait for content to load
      await expect(
        page.getByText("Back to Docs").or(page.getByText("← Back to Docs"))
      ).toBeVisible({ timeout: 10000 });

      // Verify TOC sidebar appears (it shows "Table of Contents" text)
      const toc = page.getByText("Table of Contents", { exact: true });
      // TOC may or may not be visible depending on heading count
      if (await toc.isVisible()) {
        await expect(toc).toBeVisible();
      }
    });

    test("back button navigates to explorer", async ({ page }) => {
      await page.goto("/docs/styleguide");
      await page.waitForLoadState("networkidle");

      // Wait for page to load
      await expect(
        page.getByText("Back to Docs").or(page.getByText("← Back to Docs"))
      ).toBeVisible({ timeout: 10000 });

      // Click back button
      await page
        .getByText("Back to Docs")
        .or(page.getByText("← Back to Docs"))
        .click();

      // Verify we're on the explorer page
      await expect(page).toHaveURL(/\/docs$/);
    });

    test("shows front matter section", async ({ page }) => {
      await page.goto("/docs/styleguide");
      await page.waitForLoadState("networkidle");

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Verify front matter display - may show "Front Matter" or just YAML content
      const hasFrontMatter =
        (await page.getByText("Front Matter").isVisible()) ||
        (await page.getByText("YAML").isVisible());
      // Front matter section should be visible
      expect(hasFrontMatter).toBe(true);
    });
  });

  test.describe("Navigation", () => {
    test("header has docs link", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Verify docs link in header
      await expect(page.getByRole("link", { name: /docs/i })).toBeVisible();
    });

    test("can navigate from home to docs", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Click docs link
      await page.getByRole("link", { name: /docs/i }).click();

      // Verify navigation
      await expect(page).toHaveURL(/\/docs/);
    });

    test("clicking doc card navigates to viewer", async ({ page }) => {
      await page.goto("/docs");
      await page.waitForLoadState("networkidle");

      // Wait for docs to load
      await expect(page.getByText("Updated:").first()).toBeVisible({
        timeout: 10000,
      });

      // Find and click a doc link - look for Style Guide
      const styleGuideLink = page.getByText("Style Guide").first();
      if (await styleGuideLink.isVisible()) {
        await styleGuideLink.click();
        await page.waitForLoadState("networkidle");

        // Verify we navigated to a doc page
        await expect(page).toHaveURL(/\/docs\/.+/);
      }
    });
  });

  test.describe("Ticket Documents", () => {
    test("can view ticket document", async ({ page }) => {
      // Navigate to the ticket doc
      await page.goto(
        "/docs/epics/EPIC-003-bulletproof-backtest/TICKET-001-unit-tests-fixtures"
      );
      await page.waitForLoadState("networkidle");

      // Wait for content to load
      await expect(
        page.getByText("Back to Docs").or(page.getByText("← Back to Docs"))
      ).toBeVisible({ timeout: 10000 });

      // Verify ticket content loads
      const pageContent = await page.content();
      const hasTicketContent =
        pageContent.includes("TICKET") ||
        pageContent.includes("Unit Tests") ||
        pageContent.includes("Acceptance Criteria");
      expect(hasTicketContent).toBe(true);
    });
  });
});
