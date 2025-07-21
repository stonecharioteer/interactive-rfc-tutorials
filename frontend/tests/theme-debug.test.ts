import { test, expect } from "@playwright/test";

test("debug dark theme tutorial panels", async ({ page }) => {
  // Set a longer timeout for this debugging test
  test.setTimeout(30000);
  // Navigate to an RFC page with tutorial content
  await page.goto("http://localhost:15173/rfc/821");

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  // Take screenshot in light mode first
  await page.screenshot({ path: "light-mode.png", fullPage: true });

  // Find and click the dark theme toggle
  // Look for the theme toggle buttons
  const themeToggle = page
    .locator("button")
    .filter({ hasText: /moon|dark/i })
    .or(page.locator('[title*="dark"]'))
    .or(
      page.locator("svg").locator("..").filter({ hasText: "" }), // Moon icon button
    )
    .first();

  // If that doesn't work, try finding the toggle container
  if (!(await themeToggle.isVisible())) {
    const toggleContainer = page.locator(".flex.items-center.bg-gray-100");
    const darkModeButton = toggleContainer.locator("button").nth(1); // Second button should be dark mode
    await darkModeButton.click();
  } else {
    await themeToggle.click();
  }

  // Wait for theme transition
  await page.waitForTimeout(500);

  // Take screenshot in dark mode
  await page.screenshot({ path: "dark-mode.png", fullPage: true });

  // Check if html has dark class
  const htmlClasses = await page.locator("html").getAttribute("class");
  console.log("HTML classes:", htmlClasses);

  // Check if body background changed
  const bodyBg = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  console.log("Body background:", bodyBg);

  // Check tutorial panel backgrounds - look for various panel types
  const panels = [
    ".prose", // Main article content
    ".bg-blue-50", // Blue info panels
    ".bg-gray-50", // Gray panels
    ".bg-green-50", // Green panels
    ".bg-yellow-50", // Yellow panels
    ".rfc-card", // RFC cards
    "article", // Article container
    '[class*="bg-"]', // Any element with bg- class
  ];

  for (const selector of panels) {
    const elements = page.locator(selector);
    const count = await elements.count();

    if (count > 0) {
      console.log(`\\nFound ${count} elements with selector: ${selector}`);

      for (let i = 0; i < Math.min(count, 3); i++) {
        // Check first 3 elements
        const element = elements.nth(i);
        const classes = await element.getAttribute("class");
        const computedBg = await element.evaluate(
          (el) => getComputedStyle(el).backgroundColor,
        );
        const computedColor = await element.evaluate(
          (el) => getComputedStyle(el).color,
        );

        console.log(`  Element ${i}: classes="${classes}"`);
        console.log(`    Background: ${computedBg}`);
        console.log(`    Color: ${computedColor}`);
      }
    }
  }

  // Look specifically for elements that should have dark backgrounds but don't
  const lightBgElements = page.locator(
    '[class*="bg-white"], [class*="bg-gray-50"], [class*="bg-blue-50"], [class*="bg-green-50"], [class*="bg-yellow-50"]',
  );
  const lightBgCount = await lightBgElements.count();

  console.log(
    `\\nFound ${lightBgCount} elements with light background classes`,
  );

  for (let i = 0; i < Math.min(lightBgCount, 5); i++) {
    const element = lightBgElements.nth(i);
    const classes = await element.getAttribute("class");
    const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
    const computedBg = await element.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );

    console.log(`  ${tagName}: classes="${classes}"`);
    console.log(`    Computed background: ${computedBg}`);

    // Check if it has corresponding dark classes
    const hasDarkClass = classes?.includes("dark:") || false;
    console.log(`    Has dark variant: ${hasDarkClass}`);
  }

  // Check if theme context is working
  const themeData = await page.evaluate(() => {
    return {
      localStorage: localStorage.getItem("rfc-tutorial-theme"),
      htmlDataTheme: document.documentElement.getAttribute("data-theme"),
      htmlClasses: document.documentElement.className,
    };
  });

  console.log("\\nTheme data:", themeData);
});
