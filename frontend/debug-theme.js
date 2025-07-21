const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log("Navigating to RFC 821 page...");
  await page.goto("http://localhost:15173/rfc/821");
  await page.waitForLoadState("networkidle");

  console.log("Taking screenshot in light mode...");
  await page.screenshot({ path: "light-mode.png", fullPage: true });

  console.log("Looking for theme toggle...");

  // Find theme toggle container
  const toggleContainer = await page.$(".flex.items-center.bg-gray-100");
  if (toggleContainer) {
    // Click the second button (dark mode)
    const buttons = await toggleContainer.$$("button");
    if (buttons.length >= 2) {
      console.log("Clicking dark mode button...");
      await buttons[1].click();
    }
  }

  // Wait for transition
  await page.waitForTimeout(1000);

  console.log("Taking screenshot in dark mode...");
  await page.screenshot({ path: "dark-mode.png", fullPage: true });

  // Check theme state
  const themeInfo = await page.evaluate(() => {
    return {
      htmlClasses: document.documentElement.className,
      dataTheme: document.documentElement.getAttribute("data-theme"),
      localStorage: localStorage.getItem("rfc-tutorial-theme"),
      bodyBg: getComputedStyle(document.body).backgroundColor,
    };
  });

  console.log("Theme info:", themeInfo);

  // Find elements with light backgrounds that should be dark
  const lightBgElements = await page.$$eval(
    '[class*="bg-"], .prose',
    (elements) => {
      return elements
        .map((el) => {
          const classes = el.className;
          const computedBg = getComputedStyle(el).backgroundColor;
          const tagName = el.tagName.toLowerCase();
          return {
            tagName,
            classes,
            computedBg,
            hasDarkClass: classes.includes("dark:"),
          };
        })
        .filter(
          (item) =>
            item.classes.includes("bg-") &&
            (item.computedBg.includes("255") ||
              item.computedBg.includes("white")),
        )
        .slice(0, 10); // First 10 problematic elements
    },
  );

  console.log("\\nElements with light backgrounds in dark mode:");
  lightBgElements.forEach((el, i) => {
    console.log(`${i + 1}. ${el.tagName}: ${el.classes}`);
    console.log(`   Background: ${el.computedBg}`);
    console.log(`   Has dark class: ${el.hasDarkClass}`);
    console.log("");
  });

  await browser.close();
})().catch(console.error);
