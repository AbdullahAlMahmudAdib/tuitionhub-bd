import { test, expect } from "@playwright/test";

test.describe("Hydration - RED tests", () => {
  test("home page must render landing content when body has extension-injected attribute", async ({ page }) => {
    await page.addInitScript(() => {
      const injectAttr = () => {
        if (document.body && !document.body.hasAttribute("cz-shortcut-listen")) {
          document.body.setAttribute("cz-shortcut-listen", "true");
        }
      };
      const interval = setInterval(injectAttr, 1);
      setTimeout(() => clearInterval(interval), 5000);
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Find Your Perfect");

    const errorOverlay = page.locator("text=/hydration|server rendered|did not match/i");
    await expect(errorOverlay).toHaveCount(0);
  });

  test("login page must render form when body has extension-injected attribute", async ({ page }) => {
    await page.addInitScript(() => {
      const injectAttr = () => {
        if (document.body && !document.body.hasAttribute("cz-shortcut-listen")) {
          document.body.setAttribute("cz-shortcut-listen", "true");
        }
      };
      const interval = setInterval(injectAttr, 1);
      setTimeout(() => clearInterval(interval), 5000);
    });

    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const signInButton = page.getByRole("button", { name: /sign in/i });
    await expect(signInButton).toBeVisible();
  });
});
