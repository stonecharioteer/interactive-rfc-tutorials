import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log("🧪 Testing Mermaid diagram contrast in RFC 821...");

  // Navigate to RFC 821
  await page.goto("http://localhost:15173/rfc/821");
  await page.waitForLoadState("networkidle");

  console.log("📸 Taking screenshot in light mode...");
  await page.screenshot({ path: "mermaid-light.png", fullPage: false });

  // Switch to dark mode
  console.log("🌙 Switching to dark mode...");
  const darkModeButton = page
    .locator("button")
    .filter({ hasText: "" })
    .or(page.locator('[title*="dark"]'))
    .or(
      page.locator(".flex.items-center.bg-gray-100 button").nth(1), // Second button should be dark
    )
    .first();

  if (await darkModeButton.isVisible()) {
    await darkModeButton.click();
  } else {
    // Try alternative selector
    await page
      .click('[data-theme-toggle="dark"]', { timeout: 5000 })
      .catch(() => {
        console.log("Could not find dark mode button, trying alternative...");
      });
  }

  // Wait for theme change and diagrams to re-render
  await page.waitForTimeout(2000);

  console.log("📸 Taking screenshot in dark mode...");
  await page.screenshot({ path: "mermaid-dark.png", fullPage: false });

  // Check if Mermaid diagrams are present
  const mermaidContainers = await page.locator(".mermaid-container").count();
  console.log(`Found ${mermaidContainers} Mermaid diagram containers`);

  // Check for specific elements in the email architecture diagram
  const mermaidElements = await page
    .locator(".mermaid-container svg")
    .first()
    .isVisible()
    .catch(() => false);

  if (mermaidElements) {
    console.log("✅ Mermaid diagrams are rendered");

    // Get the SVG content to analyze
    const svgContent = await page
      .locator(".mermaid-container svg")
      .first()
      .innerHTML();
    console.log("📊 Checking SVG content for text elements...");

    // Count text elements in the diagram
    const textElements = await page
      .locator(".mermaid-container svg text")
      .count();
    console.log(`Found ${textElements} text elements in the diagram`);

    // Get some sample text elements and their computed styles
    for (let i = 0; i < Math.min(textElements, 5); i++) {
      const textElement = page.locator(".mermaid-container svg text").nth(i);
      const textContent = await textElement.textContent();
      const fill = await textElement.getAttribute("fill");
      const styles = await textElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          fill: computed.fill,
          backgroundColor: computed.backgroundColor,
        };
      });

      console.log(
        `Text ${i + 1}: "${textContent}" - fill: ${fill}, styles:`,
        styles,
      );
    }

    // Check for rect elements (boxes) and their colors
    const rectElements = await page
      .locator(".mermaid-container svg rect")
      .count();
    console.log(`Found ${rectElements} rectangle elements (boxes)`);

    for (let i = 0; i < Math.min(rectElements, 5); i++) {
      const rectElement = page.locator(".mermaid-container svg rect").nth(i);
      const fill = await rectElement.getAttribute("fill");
      const stroke = await rectElement.getAttribute("stroke");

      console.log(`Box ${i + 1}: fill: ${fill}, stroke: ${stroke}`);
    }
  } else {
    console.log("❌ No Mermaid diagrams found or not rendered properly");
  }

  // Check the theme state
  const htmlClasses = await page.locator("html").getAttribute("class");
  const isDarkMode = htmlClasses?.includes("dark") || false;
  console.log(`🎨 Current theme: ${isDarkMode ? "Dark" : "Light"} mode`);

  console.log("📱 Screenshots saved as mermaid-light.png and mermaid-dark.png");
  console.log("✅ Test completed!");

  await browser.close();
})().catch(console.error);
