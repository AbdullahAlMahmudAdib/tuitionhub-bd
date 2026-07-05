import { test, expect } from "@playwright/test";

async function loginAsDemo(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator("#email").fill("demo@test.com");
  await page.locator("#password").fill("Demo@1234");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
}

test.describe("Verification Page", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto("/profile/verification");
  });

  test("should display the verification page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /^Verification$/ })).toBeVisible();
    await expect(page.getByText(/Verify your identity/i)).toBeVisible();
  });

  test("should display the verification step indicator", async ({ page }) => {
    await expect(page.getByText("Phone Verified").first()).toBeVisible();
    await expect(page.getByText("Documents Uploaded").first()).toBeVisible();
    await expect(page.getByText("Submitted").first()).toBeVisible();
    await expect(page.getByText("Under Review").first()).toBeVisible();
    await expect(page.getByText("Verified", { exact: true })).toBeVisible();
  });

  test("should display Phone Verification step", async ({ page }) => {
    await expect(page.getByText("Step 1: Verify Phone")).toBeVisible();
    await expect(page.getByPlaceholder(/\+8801/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Send OTP/i })).toBeVisible();
  });

  test("should validate Bangladesh phone format", async ({ page }) => {
    await page.getByPlaceholder(/\+8801/).fill("12345");
    await page.getByRole("button", { name: /Send OTP/i }).click();
    await expect(page.getByText(/valid BD number/i)).toBeVisible();
  });

  test("should send OTP for valid phone", async ({ page }) => {
    await page.getByPlaceholder(/\+8801/).fill("+8801712345678");
    await page.getByRole("button", { name: /Send OTP/i }).click();

    // Should show OTP input
    await expect(page.getByText(/Enter the 6-digit code/i)).toBeVisible({ timeout: 10000 });
  });

  test("should display Upload Documents step", async ({ page }) => {
    await expect(page.getByText("Step 2: Upload Documents")).toBeVisible();
    await expect(page.getByRole("button", { name: /Go to Documents/i })).toBeVisible();
  });

  test("should display Submit for Review step", async ({ page }) => {
    await expect(page.getByText("Step 3: Submit for Review")).toBeVisible();
    const submitBtn = page.getByRole("button", { name: /Submit for Verification/i });
    await expect(submitBtn).toBeVisible();
    // Submit button enables when phone is verified AND at least one doc is uploaded
    // The exact state depends on test order, so just verify the button is interactive
    await expect(submitBtn).toBeEnabled();
  });
});
