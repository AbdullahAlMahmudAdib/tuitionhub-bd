import { test, expect } from "@playwright/test";

test.describe("Register Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("should display the registration form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Create Account/i })).toBeVisible();
    await expect(page.getByText(/Join TuitionHub BD today/i)).toBeVisible();
  });

  test("should have role selector with tutor and guardian options", async ({ page }) => {
    await expect(page.getByRole("button", { name: /I.m a Guardian/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /I.m a Tutor/i })).toBeVisible();
  });

  test("should default to Guardian role selected", async ({ page }) => {
    const guardianBtn = page.getByRole("button", { name: /I.m a Guardian/i });
    await expect(guardianBtn).toHaveClass(/bg-white text-primary/);
  });

  test("should allow switching to Tutor role", async ({ page }) => {
    await page.getByRole("button", { name: /I.m a Tutor/i }).click();
    const tutorBtn = page.getByRole("button", { name: /I.m a Tutor/i });
    await expect(tutorBtn).toHaveClass(/bg-white text-primary/);
  });

  test("should have all required form fields", async ({ page }) => {
    await expect(page.locator("#full-name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#phone")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("button", { name: /Create Account/i })).toBeVisible();
  });

  test("should have sign-in link for existing users", async ({ page }) => {
    const signInLink = page.getByRole("link", { name: /^sign in$/i });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute("href", /\/login/);
  });

  test("should successfully register a new guardian user", async ({ page }) => {
    const uniqueEmail = `test-guardian-${Date.now()}@test.com`;
    await page.locator("#full-name").fill("Test Guardian");
    await page.locator("#email").fill(uniqueEmail);
    await page.locator("#password").fill("Test@1234");
    await page.getByRole("button", { name: /Create Account/i }).click();

    // After successful registration, should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test("should reject registration with duplicate email", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());

    const dupEmail = `dup-${Date.now()}@test.com`;

    await page.goto("/register");
    await page.locator("#full-name").fill("First User");
    await page.locator("#email").fill(dupEmail);
    await page.locator("#password").fill("Test@1234");
    await page.getByRole("button", { name: /Create Account/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    await page.evaluate(() => localStorage.clear());

    await page.goto("/register");
    await page.locator("#full-name").fill("Duplicate User");
    await page.locator("#email").fill(dupEmail);
    await page.locator("#password").fill("Test@1234");
    await page.getByRole("button", { name: /Create Account/i }).click();

    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator("body")).toContainText(/already/i);
  });
});
