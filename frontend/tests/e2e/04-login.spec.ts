import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login form with all fields", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Welcome Back/i })).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should have register link for new users", async ({ page }) => {
    const registerLink = page.getByRole("link", { name: /^register$/i });
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute("href", /\/register/);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.locator("#email").fill("nonexistent@test.com");
    await page.locator("#password").fill("WrongPassword123");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should show error message and stay on login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("body")).toContainText(/invalid|incorrect|wrong|not found/i);
  });

  test("should successfully log in an existing user", async ({ page }) => {
    await page.locator("#email").fill("demo@test.com");
    await page.locator("#password").fill("Demo@1234");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test("should store tokens in localStorage after successful login", async ({ page }) => {
    await page.locator("#email").fill("demo@test.com");
    await page.locator("#password").fill("Demo@1234");
    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    const accessToken = await page.evaluate(() => localStorage.getItem("accessToken"));
    const refreshToken = await page.evaluate(() => localStorage.getItem("refreshToken"));
    const userId = await page.evaluate(() => localStorage.getItem("userId"));

    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    expect(userId).toBeTruthy();
  });

  test("should redirect unauthenticated users from /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
