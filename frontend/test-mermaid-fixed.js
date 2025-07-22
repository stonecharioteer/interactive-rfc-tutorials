import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log("🧪 Testing Mermaid diagram contrast in RFC 821...");

  // Navigate to RFC 821
  await page.goto("http://localhost:15173/rfc/821");
  await page.waitForLoadState("networkidle");

  // Wait for Mermaid diagrams to load
  await page.waitForTimeout(3000);

  console.log("📸 Taking screenshot in light mode...");
  await page.screenshot({ path: "mermaid-light.png", fullPage: false });

  // Find and click the dark mode button more specifically
  console.log("🌙 Looking for theme toggle...");

  // Try to find the theme toggle container
  const themeToggles = await page
    .locator(".flex.items-center.bg-gray-100 button")
    .count();
  console.log(`Found ${themeToggles} theme toggle buttons`);

  if (themeToggles >= 2) {
    console.log("Clicking the second button (dark mode)...");
    await page.locator(".flex.items-center.bg-gray-100 button").nth(1).click();
  } else {
    // Alternative: look for moon icon
    const moonButton = page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .first();
    if (await moonButton.isVisible()) {
      await moonButton.click();
    }
  }

  // Wait longer for theme change and Mermaid re-render
  await page.waitForTimeout(5000);

  // Check theme state
  const htmlClasses = await page.locator("html").getAttribute("class");
  const isDarkMode = htmlClasses?.includes("dark") || false;
  console.log(`🎨 Theme after toggle: ${isDarkMode ? "Dark" : "Light"} mode`);

  // Force dark mode if toggle didn't work
  if (!isDarkMode) {
    console.log("⚡ Forcing dark mode with JavaScript...");
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("rfc-tutorial-theme", "dark");
    });
    await page.waitForTimeout(2000);
  }

  console.log("📸 Taking screenshot in dark mode...");
  await page.screenshot({ path: "mermaid-dark.png", fullPage: false });

  // Now analyze the first Mermaid diagram in dark mode
  const firstDiagram = page.locator(".mermaid-container").first();
  const svgExists = await firstDiagram.locator("svg").isVisible();

  if (svgExists) {
    console.log("✅ First Mermaid diagram found");

    // Get all text elements and analyze their contrast
    const textElements = await firstDiagram.locator("svg text").count();
    console.log(`📝 Found ${textElements} text elements in first diagram`);

    // Sample a few text elements for contrast analysis
    for (let i = 0; i < Math.min(textElements, 8); i++) {
      const textElement = firstDiagram.locator("svg text").nth(i);
      const textContent = await textElement.textContent();
      const fill = (await textElement.getAttribute("fill")) || "none";

      // Get the parent rect (background) if it exists
      const parentRect = textElement.locator("..").locator("rect").first();
      const rectFill = await parentRect
        .getAttribute("fill")
        .catch(() => "none");

      console.log(
        `Text "${textContent?.slice(
          0,
          20,
        )}...": fill=${fill}, parent_rect_fill=${rectFill}`,
      );
    }

    // Also check rect elements for background colors
    const rectElements = await firstDiagram.locator("svg rect[fill]").count();
    console.log(`🎨 Found ${rectElements} colored rectangles`);

    for (let i = 0; i < Math.min(rectElements, 8); i++) {
      const rect = firstDiagram.locator("svg rect[fill]").nth(i);
      const fill = await rect.getAttribute("fill");
      const stroke = (await rect.getAttribute("stroke")) || "none";
      console.log(`Rect ${i + 1}: fill=${fill}, stroke=${stroke}`);
    }
  } else {
    console.log("❌ No SVG found in Mermaid container");
  }

  console.log("✅ Contrast analysis completed!");
  console.log(
    "📁 Check mermaid-light.png and mermaid-dark.png for visual comparison",
  );

  await browser.close();
})().catch(console.error);
