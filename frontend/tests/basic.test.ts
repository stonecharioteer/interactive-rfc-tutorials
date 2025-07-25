import { test, expect } from "@playwright/test";

test.describe("RFC Tutorial App", () => {
  test("homepage loads correctly", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle(/RFC Tutorial/);

    // Check main heading
    await expect(page.locator("h1")).toContainText(
      "Read the RFCs That Built the Internet",
    );

    // Check that RFC cards are present
    await expect(page.locator(".rfc-card")).toHaveCount(5);

    // Check progress section
    await expect(page.locator("text=Your Progress")).toBeVisible();
  });

  test("navigation works correctly", async ({ page }) => {
    await page.goto("/");

    // Click on RFC 1 card
    await page.click("text=RFC 1");

    // Should navigate to RFC detail page
    await expect(page.url()).toContain("/rfc/1");
    await expect(page.locator("h1")).toContainText("Host Software");

    // Go back to home
    await page.click("text=Back to Timeline");
    await expect(page.url()).toBe("http://localhost:3000/");
  });

  test("mobile responsive design", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check that content is still visible on mobile
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".rfc-card")).toHaveCount(5);

    // Check mobile navigation
    await expect(page.locator("header")).toBeVisible();
  });

  test("progress tracking works", async ({ page }) => {
    await page.goto("/");

    // Initially should show 0 completed
    await expect(page.locator("text=0").first()).toBeVisible();

    // Go to an RFC page
    await page.click("text=RFC 1");

    // Mark as complete
    await page.click("text=Mark Complete");
    await expect(page.locator("text=Completed")).toBeVisible();

    // Go back to home
    await page.click("text=Back to Timeline");

    // Should now show 1 completed
    await expect(page.locator("text=1").first()).toBeVisible();
  });

  test("RFC content loads properly", async ({ page }) => {
    // Test each RFC page loads
    const rfcNumbers = [1, 675, 791, 793, 821];

    for (const rfcNumber of rfcNumbers) {
      await page.goto(`/rfc/${rfcNumber}`);

      // Should have RFC number in header
      await expect(page.locator(`text=RFC ${rfcNumber}`)).toBeVisible();

      // Should have learning objectives
      await expect(page.locator("text=Learning Objectives")).toBeVisible();

      // Should have article content
      await expect(page.locator("article")).toBeVisible();
    }
  });

  test("search and filtering works on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check that all eras are visible
    await expect(page.locator("text=Foundation Era")).toBeVisible();

    // Check that RFC cards are organized by era
    const foundationSection = page
      .locator("text=Foundation Era")
      .locator("..")
      .locator("..");
    await expect(foundationSection.locator(".rfc-card")).toHaveCount(5);
  });

  test("error handling for non-existent RFC", async ({ page }) => {
    await page.goto("/rfc/999");

    // Should show RFC not found message
    await expect(page.locator("text=RFC Not Found")).toBeVisible();
    await expect(page.locator("text=Back to Home")).toBeVisible();
  });

  test("accessibility basics", async ({ page }) => {
    await page.goto("/");

    // Check for proper heading hierarchy
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h2")).toBeVisible();

    // Check for alt text on important elements
    const logo = page.locator('[data-testid="logo"]');
    if ((await logo.count()) > 0) {
      await expect(logo).toHaveAttribute("alt");
    }

    // Check keyboard navigation
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();
  });
});
