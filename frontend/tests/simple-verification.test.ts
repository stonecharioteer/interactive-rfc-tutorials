import { test, expect } from "@playwright/test";

test.describe("RFC Tutorial Basic Verification", () => {
  test("homepage loads and shows RFC content", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check page title
    await expect(page).toHaveTitle(/RFC Tutorial/);

    // Check that the main content loads
    const mainHeading = page.locator("h1").first();
    await expect(mainHeading).toBeVisible();

    // Check for RFC mentions (at least one should exist)
    const rfcMentions = page.locator("text=/RFC \\d+/");
    await expect(rfcMentions.first()).toBeVisible();

    console.log("✅ Homepage loads successfully");
  });

  test("can navigate to RFC pages", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Try to find and click any RFC link
    const rfcLinks = [
      "text=RFC 1",
      "text=RFC 793",
      "text=RFC 821",
      "text=RFC 791",
      "text=RFC 675",
    ];

    let navigationWorked = false;

    for (const linkText of rfcLinks) {
      const link = page.locator(linkText).first();
      if (await link.isVisible()) {
        await link.click();
        await page.waitForLoadState("networkidle");

        // Check if we navigated (URL should contain /rfc/)
        if (page.url().includes("/rfc/")) {
          navigationWorked = true;
          console.log(`✅ Successfully navigated via ${linkText}`);
          break;
        }
      }
    }

    expect(navigationWorked).toBe(true);
  });

  test("RFC pages contain expected content", async ({ page }) => {
    const rfcNumbers = [1, 675, 791, 793, 821];
    let successCount = 0;

    for (const rfcNum of rfcNumbers) {
      await page.goto(`/rfc/${rfcNum}`);
      await page.waitForLoadState("networkidle");

      // Check if page contains RFC-related content
      const hasRfcContent = await page
        .locator(`text=/RFC.{0,50}${rfcNum}/`)
        .first()
        .isVisible();
      const hasArticleContent = await page.locator("article").isVisible();

      if (hasRfcContent || hasArticleContent) {
        successCount++;
        console.log(`✅ RFC ${rfcNum} page loads with content`);
      } else {
        console.log(`⚠️  RFC ${rfcNum} page may have issues`);
      }
    }

    // At least 4 out of 5 should work
    expect(successCount).toBeGreaterThanOrEqual(4);
  });

  test("GitHub links are present", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check for GitHub links
    const githubLinks = page.locator(
      "a[href*='github.com/stonecharioteer/interactive-rfc-tutorials']",
    );
    const linkCount = await githubLinks.count();

    expect(linkCount).toBeGreaterThanOrEqual(1);
    console.log(`✅ Found ${linkCount} GitHub link(s)`);
  });

  test("Docker examples are mentioned in TCP and SMTP pages", async ({
    page,
  }) => {
    // Check TCP page
    await page.goto("/rfc/793");
    await page.waitForLoadState("networkidle");

    const tcpHasDocker = await page
      .locator("text=/[Dd]ocker/")
      .first()
      .isVisible();
    console.log(`TCP Docker content: ${tcpHasDocker ? "✅" : "⚠️"}`);

    // Check SMTP page
    await page.goto("/rfc/821");
    await page.waitForLoadState("networkidle");

    const smtpHasDocker = await page
      .locator("text=/[Dd]ocker/")
      .first()
      .isVisible();
    console.log(`SMTP Docker content: ${smtpHasDocker ? "✅" : "⚠️"}`);

    // At least one should have Docker content
    expect(tcpHasDocker || smtpHasDocker).toBe(true);
  });

  test("mobile layout works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check main content is visible on mobile
    const mainContent = page.locator("main, [role='main'], h1").first();
    await expect(mainContent).toBeVisible();

    console.log("✅ Mobile layout works");
  });

  test("can access all implemented RFCs directly", async ({ page }) => {
    const rfcUrls = ["/rfc/1", "/rfc/675", "/rfc/791", "/rfc/793", "/rfc/821"];

    let accessibleCount = 0;

    for (const url of rfcUrls) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");

      // Check if we get actual content (not just a 404 or empty page)
      const hasContent = await page
        .locator("article, main, .content")
        .first()
        .isVisible();
      const hasRfcMention = await page
        .locator("text=/RFC/")
        .first()
        .isVisible();

      if (hasContent || hasRfcMention) {
        accessibleCount++;
        console.log(`✅ ${url} is accessible`);
      } else {
        console.log(`⚠️  ${url} may have issues`);
      }
    }

    // All 5 implemented RFCs should be accessible
    expect(accessibleCount).toBe(5);
  });
});
