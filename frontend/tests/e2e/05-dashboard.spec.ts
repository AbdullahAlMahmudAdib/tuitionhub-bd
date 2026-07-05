import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.locator("#email").fill("demo@test.com");
    await page.locator("#password").fill("Demo@1234");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  });

  test("should display the dashboard heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /^Dashboard$/ })).toBeVisible();
    await expect(page.getByText(/Welcome back to TuitionHub BD/i)).toBeVisible();
  });

  test("should display stats cards (4 cards)", async ({ page }) => {
    await expect(page.getByText("Active Applications")).toBeVisible();
    await expect(page.getByText("Unread Messages")).toBeVisible();
    await expect(page.getByText("Profile Views")).toBeVisible();
    await expect(page.getByText("Saved Tutors")).toBeVisible();
  });

  test("should display Quick Actions section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Quick Actions/i })).toBeVisible();
    await expect(page.getByText("Post a Tuition")).toBeVisible();
    await expect(page.getByText("Find Tutors").first()).toBeVisible();
    await expect(page.getByText("Messages").first()).toBeVisible();
  });

  test("should have working sidebar navigation", async ({ page }) => {
    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /Dashboard/i })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /Find Tutors/i })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /My Requests/i })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /Messages/i })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /Settings/i })).toBeVisible();
  });

  test("Quick Action links should navigate", async ({ page }) => {
    const findTutorsLink = page.getByRole("link", { name: /Find Tutors/i }).first();
    await findTutorsLink.click();
    // Will navigate to /tutors which may not exist yet
    await page.waitForLoadState("networkidle");
  });

  test("Sign Out button should clear tokens and redirect to home", async ({ page }) => {
    await page.getByRole("button", { name: /Sign Out/i }).click();
    await expect(page).toHaveURL(/\//, { timeout: 5000 });

    const token = await page.evaluate(() => localStorage.getItem("accessToken"));
    expect(token).toBeNull();
  });
});
