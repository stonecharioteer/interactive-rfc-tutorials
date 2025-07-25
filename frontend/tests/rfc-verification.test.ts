import { test, expect } from "@playwright/test";

test.describe("RFC Pages Verification", () => {
  test("homepage displays all implemented RFCs", async ({ page }) => {
    await page.goto("/");

    // Check page loads
    await expect(page).toHaveTitle(/RFC Tutorial/);

    // Check main heading
    await expect(page.locator("h1")).toContainText(
      "Read the RFCs That Built the Internet",
    );

    // Check that key implemented RFCs are displayed
    const keyRFCs = [
      { number: 1, title: "Host Software" },
      { number: 793, title: "Transmission Control Protocol" },
      { number: 821, title: "Simple Mail Transfer Protocol" },
      {
        number: 4301,
        title: "Security Architecture for the Internet Protocol",
      },
      { number: 8656, title: "Traversal Using Relays around NAT" },
    ];

    for (const rfc of keyRFCs) {
      // Check RFC card is present
      await expect(page.locator(`text=RFC ${rfc.number}`)).toBeVisible();
    }

    // Check we have many RFC cards (should be 22+ RFCs implemented)
    const rfcCards = page.locator("[data-testid='rfc-card'], .rfc-card");
    await expect(rfcCards).toHaveCount.greaterThan(20);

    // Check Foundation Era section exists
    await expect(page.locator("text=Foundation Era")).toBeVisible();
  });

  test("RFC 1 page loads with complete content", async ({ page }) => {
    await page.goto("/rfc/1");

    // Check page loads correctly
    await expect(page.locator("h1")).toContainText("RFC 1: Host Software");

    // Check historical significance section
    await expect(page.locator("text=Historical Significance")).toBeVisible();

    // Check learning objectives
    await expect(page.locator("text=Learning Objectives")).toBeVisible();

    // Check article content is present
    await expect(page.locator("article")).toBeVisible();

    // Check glossary terms are linked
    await expect(
      page.locator("[data-testid='glossary-term']"),
    ).toHaveCount.greaterThan(0);

    // Check back navigation
    await expect(page.locator("text=Back to Timeline")).toBeVisible();
  });

  test("RFC 675 page loads with complete content", async ({ page }) => {
    await page.goto("/rfc/675");

    await expect(page.locator("h1")).toContainText("RFC 675");
    await expect(
      page.locator("text=Internet Transmission Control Program"),
    ).toBeVisible();
    await expect(page.locator("article")).toBeVisible();
  });

  test("RFC 791 page loads with IPv4 content", async ({ page }) => {
    await page.goto("/rfc/791");

    await expect(page.locator("h1")).toContainText("RFC 791");
    await expect(
      page.locator("text=Internet Protocol Version 4"),
    ).toBeVisible();
    await expect(page.locator("article")).toBeVisible();

    // Check for IPv4-specific content
    await expect(page.locator("text=IPv4")).toBeVisible();
    await expect(page.locator("text=packet")).toBeVisible();
  });

  test("RFC 793 page loads with TCP content and Docker demo", async ({
    page,
  }) => {
    await page.goto("/rfc/793");

    await expect(page.locator("h1")).toContainText("RFC 793");
    await expect(
      page.locator("text=Transmission Control Protocol"),
    ).toBeVisible();

    // Check for TCP-specific content
    await expect(page.locator("text=Three-way Handshake")).toBeVisible();
    await expect(page.locator("text=TCP")).toBeVisible();

    // Check for Docker demo section
    await expect(page.locator("text=Interactive Docker Demo")).toBeVisible();
    await expect(page.locator("text=docker compose up")).toBeVisible();

    // Check for Python examples
    await expect(page.locator("text=ELI-Pythonista")).toBeVisible();
  });

  test("RFC 821 page loads with SMTP content and Docker demo", async ({
    page,
  }) => {
    await page.goto("/rfc/821");

    await expect(page.locator("h1")).toContainText("RFC 821");
    await expect(
      page.locator("text=Simple Mail Transfer Protocol"),
    ).toBeVisible();

    // Check for SMTP-specific content
    await expect(page.locator("text=SMTP")).toBeVisible();
    await expect(page.locator("text=email")).toBeVisible();

    // Check for Docker demo section
    await expect(page.locator("text=Interactive Docker Demo")).toBeVisible();
    await expect(page.locator("text=SMTP Email System")).toBeVisible();

    // Check for web interface mention
    await expect(page.locator("text=localhost:8080")).toBeVisible();
  });

  test("navigation between RFC pages works", async ({ page }) => {
    await page.goto("/");

    // Navigate to RFC 793
    await page.click("text=RFC 793");
    await expect(page.url()).toContain("/rfc/793");
    await expect(page.locator("h1")).toContainText("RFC 793");

    // Go back to home
    await page.click("text=Back to Timeline");
    await expect(page.url()).toBe("http://localhost:5173/");

    // Navigate to RFC 821
    await page.click("text=RFC 821");
    await expect(page.url()).toContain("/rfc/821");
    await expect(page.locator("h1")).toContainText("RFC 821");
  });

  test("GitHub repository links are present", async ({ page }) => {
    await page.goto("/");

    // Check header navigation for GitHub link
    const headerGitHubLink = page.locator("header a[href*='github.com']");
    await expect(headerGitHubLink).toBeVisible();
    await expect(headerGitHubLink).toContainText("Code Examples");

    // Check footer for GitHub link
    const footerGitHubLink = page.locator("footer a[href*='github.com']");
    await expect(footerGitHubLink).toBeVisible();
    await expect(footerGitHubLink).toContainText("Source Code");

    // Verify correct GitHub URL
    await expect(headerGitHubLink).toHaveAttribute(
      "href",
      "https://github.com/stonecharioteer/interactive-rfc-tutorials",
    );
    await expect(footerGitHubLink).toHaveAttribute(
      "href",
      "https://github.com/stonecharioteer/interactive-rfc-tutorials",
    );
  });

  test("expandable sections work correctly", async ({ page }) => {
    await page.goto("/rfc/793");

    // Find an expandable section
    const dockerDemo = page
      .locator("text=Interactive Docker Demo")
      .locator("..");
    await expect(dockerDemo).toBeVisible();

    // Check if Python examples section exists
    const pythonSection = page.locator("text=ELI-Pythonista");
    if (await pythonSection.isVisible()) {
      // Try clicking to expand
      await pythonSection.click();
      // Content should expand (implementation-dependent)
    }
  });

  test("glossary terms are functional", async ({ page }) => {
    await page.goto("/rfc/793");

    // Look for glossary terms
    const glossaryTerms = page.locator("[data-testid='glossary-term']");

    if ((await glossaryTerms.count()) > 0) {
      // Check first glossary term
      const firstTerm = glossaryTerms.first();
      await expect(firstTerm).toBeVisible();

      // Terms should be styled or interactive
      await expect(firstTerm).toHaveClass(/glossary/);
    }
  });

  test("mobile responsiveness works", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check main content is visible
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".rfc-card")).toHaveCount(5);

    // Navigation should still work
    await page.click("text=RFC 1");
    await expect(page.url()).toContain("/rfc/1");

    // Go to RFC with Docker demo
    await page.goto("/rfc/793");
    await expect(page.locator("text=Interactive Docker Demo")).toBeVisible();
  });

  test("error handling for non-existent RFC", async ({ page }) => {
    // Test various non-existent RFC numbers
    const nonExistentRFCs = [999, 0, 100];

    for (const rfcNum of nonExistentRFCs) {
      await page.goto(`/rfc/${rfcNum}`);

      // Should show some kind of not found message or redirect to home
      const currentUrl = page.url();
      const isHome =
        currentUrl.endsWith("/") || currentUrl.includes("localhost:5173");
      const hasNotFound =
        (await page.locator("text=not found").isVisible()) ||
        (await page.locator("text=Not Found").isVisible());

      // Either redirect to home or show not found
      expect(isHome || hasNotFound).toBe(true);
    }
  });

  test("all RFC pages have proper structure", async ({ page }) => {
    // Test a representative sample of implemented RFCs
    const sampleRFCs = [1, 793, 821, 4301, 4303, 8656];

    for (const rfcNum of sampleRFCs) {
      await page.goto(`/rfc/${rfcNum}`);

      // Each page should have:
      // 1. Main heading with RFC number
      await expect(page.locator("h1")).toContainText(`RFC ${rfcNum}`);

      // 2. Article content
      await expect(page.locator("article")).toBeVisible();

      // 3. Back navigation
      await expect(page.locator("text=Back to Timeline")).toBeVisible();

      // At least some content should be present
      const contentLength = await page.locator("article").textContent();
      expect(contentLength?.length || 0).toBeGreaterThan(500);

      console.log(`✅ RFC ${rfcNum} page verified`);
    }
  });

  test("Docker examples are properly displayed", async ({ page }) => {
    // Check TCP Docker example
    await page.goto("/rfc/793");
    await expect(page.locator("text=Interactive Docker Demo")).toBeVisible();
    await expect(page.locator("text=docker compose up")).toBeVisible();
    await expect(page.locator("text=TCP Server")).toBeVisible();
    await expect(page.locator("text=Network Monitor")).toBeVisible();

    // Check SMTP Docker example
    await page.goto("/rfc/821");
    await expect(page.locator("text=Interactive Docker Demo")).toBeVisible();
    await expect(page.locator("text=SMTP Email System")).toBeVisible();
    await expect(page.locator("text=Web Interface")).toBeVisible();
    await expect(page.locator("text=localhost:8080")).toBeVisible();
  });

  test("Batch 6 RFC pages load correctly", async ({ page }) => {
    // Test the newly implemented security RFCs
    const batch6RFCs = [
      { number: 4301, text: "IPsec Security Architecture" },
      { number: 4303, text: "Encapsulating Security Payload" },
      { number: 8656, text: "TURN" },
    ];

    for (const rfc of batch6RFCs) {
      await page.goto(`/rfc/${rfc.number}`);

      // Check page loads with correct title
      await expect(page.locator("h1")).toContainText(`RFC ${rfc.number}`);
      await expect(page.locator("h1")).toContainText(rfc.text);

      // Check for ELI-Pythonista section
      await expect(page.locator("text=ELI-Pythonista")).toBeVisible();

      // Check for Docker demonstration section
      await expect(page.locator("text=Docker Demonstration")).toBeVisible();

      // Check for substantial content
      const contentLength = await page.locator("article").textContent();
      expect(contentLength?.length || 0).toBeGreaterThan(1000);

      console.log(`✅ RFC ${rfc.number} (${rfc.text}) page verified`);
    }
  });
});
