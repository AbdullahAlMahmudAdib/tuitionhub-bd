import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

async function loginAsDemo(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator("#email").fill("demo@test.com");
  await page.locator("#password").fill("Demo@1234");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
}

test.describe("Documents Page", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto("/profile/documents");
  });

  test("should display the documents page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /^Documents$/ })).toBeVisible();
    await expect(page.getByText(/Upload verification documents/i)).toBeVisible();
  });

  test("should display upload section with type selector", async ({ page }) => {
    await expect(page.getByText("Upload Document")).toBeVisible();
    await expect(page.getByRole("button", { name: "NID Card" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Certificate" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Result Sheet" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Other" })).toBeVisible();
  });

  test("should display upload area", async ({ page }) => {
    await expect(page.getByText(/click to upload or drag and drop/i)).toBeVisible();
    await expect(page.getByText(/JPG, PNG, or PDF up to 5 MB/i)).toBeVisible();
  });

  test("should list uploaded documents", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Your Documents/i })).toBeVisible();
  });

  test("should upload a document successfully", async ({ page }) => {
    // Create a test image file
    const testFile = "/tmp/test-nid.png";
    const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    fs.writeFileSync(testFile, pngHeader);

    // Click NID type (already default but click to be safe)
    await page.getByRole("button", { name: "NID Card" }).click();

    // Upload the file
    const fileInput = page.locator("input[type=file]");
    await fileInput.setInputFiles(testFile);

    // Wait for upload to complete
    await expect(page.getByText(/Uploaded successfully/i)).toBeVisible({ timeout: 10000 });

    // Clean up
    fs.unlinkSync(testFile);
  });

  test("should reject files larger than 5MB", async ({ page }) => {
    // Create a fake 6MB file
    const testFile = "/tmp/test-large.png";
    const buffer = Buffer.alloc(6 * 1024 * 1024);
    fs.writeFileSync(testFile, buffer);

    await page.locator("input[type=file]").setInputFiles(testFile);

    await expect(page.getByText(/File too large/i)).toBeVisible({ timeout: 10000 });

    fs.unlinkSync(testFile);
  });
});
