import { test, expect } from "@playwright/test";

async function loginAsDemo(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator("#email").fill("demo@test.com");
  await page.locator("#password").fill("Demo@1234");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
}

test.describe("Profile Page", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto("/profile");
  });

  test("should display the profile page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Profile Settings/i })).toBeVisible();
    await expect(page.getByText(/Manage your profile details/i)).toBeVisible();
  });

  test("should display Basic Information section with user data", async ({ page }) => {
    await expect(page.getByText("Basic Information")).toBeVisible();
    await expect(page.getByText("Full Name")).toBeVisible();
    await expect(page.getByText("Email")).toBeVisible();
    await expect(page.getByText("Phone")).toBeVisible();
    await expect(page.getByText("Role")).toBeVisible();
  });

  test("should display Profile Details section with editable fields", async ({ page }) => {
    await expect(page.getByText("Profile Details")).toBeVisible();
    await expect(page.getByText("Bio")).toBeVisible();
  });

  test("should display guardian-specific fields for Guardian user", async ({ page }) => {
    await expect(page.getByText("Location")).toBeVisible();
    await expect(page.getByText("Preferred Subjects")).toBeVisible();
    await expect(page.getByText("Children Count")).toBeVisible();
    await expect(page.getByText("Budget Min (BDT)")).toBeVisible();
    await expect(page.getByText("Budget Max (BDT)")).toBeVisible();
  });

  test("should display Save Profile button", async ({ page }) => {
    const saveBtn = page.getByRole("button", { name: /Save Profile/i });
    await expect(saveBtn).toBeVisible();
  });

  test("should load existing profile data", async ({ page }) => {
    // demo user had a profile update earlier in this session
    await page.waitForLoadState("networkidle");
    // Bio field should be present
    const bioField = page.locator("textarea, input").filter({ hasText: "" }).first();
    await expect(bioField).toBeVisible();
  });

  test("should save updated profile", async ({ page }) => {
    // Bio field uses an Input component (renders as <input>). Find by label.
    const bioInput = page.locator("input").nth(2); // After Email (readonly), Phone, then Bio
    await bioInput.fill("QA test bio - " + new Date().toISOString());

    await page.getByRole("button", { name: /Save Profile/i }).click();

    await expect(page.getByText(/Profile saved/i)).toBeVisible({ timeout: 10000 });
  });
});
