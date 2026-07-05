import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the hero heading and tagline", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Find Your Perfect");
    await expect(h1).toContainText("Tuition");
  });

  test("should have working CTA buttons in hero", async ({ page }) => {
    const findTutorBtn = page.getByRole("link", { name: /^find a tutor$/i }).first();
    await expect(findTutorBtn).toBeVisible();
    await expect(findTutorBtn).toHaveAttribute("href", /\/register/);

    const becomeTutorBtn = page.getByRole("link", { name: /become a tutor/i }).first();
    await expect(becomeTutorBtn).toBeVisible();
    await expect(becomeTutorBtn).toHaveAttribute("href", /\/register/);
  });

  test("should display the features section with 3 cards", async ({ page }) => {
    const featuresHeading = page.getByRole("heading", { name: /Why Choose TuitionHub/i });
    await featuresHeading.scrollIntoViewIfNeeded();
    await expect(featuresHeading).toBeVisible();

    const features = page.locator("section").filter({ hasText: "Why Choose TuitionHub" });
    await expect(features.getByText("Verified Tutors")).toBeVisible();
    await expect(features.getByText("Smart Matching")).toBeVisible();
    await expect(features.getByText("Secure Payments")).toBeVisible();
  });

  test("should display stats section with 4 stats", async ({ page }) => {
    const stats = page.locator("section").filter({ hasText: "500+" });
    await stats.scrollIntoViewIfNeeded();
    await expect(stats.getByText("500+").first()).toBeVisible();
    await expect(stats.getByText("1000+").first()).toBeVisible();
    await expect(stats.getByText("50+").first()).toBeVisible();
    await expect(stats.getByText("Qualified Tutors")).toBeVisible();
    await expect(stats.getByText("Students Matched")).toBeVisible();
    await expect(stats.getByText("Areas Covered")).toBeVisible();
  });

  test("should display how-it-works section with 4 steps", async ({ page }) => {
    const howItWorks = page.locator("section").filter({ hasText: "Create an Account" });
    await howItWorks.scrollIntoViewIfNeeded();
    await expect(howItWorks.getByRole("heading", { name: "How It Works" })).toBeVisible();
    await expect(howItWorks.getByText("Create an Account")).toBeVisible();
    await expect(howItWorks.getByText("Find or Post")).toBeVisible();
    await expect(howItWorks.getByText("Connect & Verify")).toBeVisible();
    await expect(howItWorks.getByText("Start Learning")).toBeVisible();
  });

  test("should display testimonials section", async ({ page }) => {
    const testimonials = page.locator("section").filter({ hasText: "What Our Users Say" });
    await testimonials.scrollIntoViewIfNeeded();
    await expect(testimonials.getByText("Fatima Rahman")).toBeVisible();
    await expect(testimonials.getByText("Rafiq Hasan")).toBeVisible();
    await expect(testimonials.getByText("Nusrat Jahan")).toBeVisible();
  });

  test("should display final CTA section", async ({ page }) => {
    const cta = page.locator("section").filter({ hasText: "Ready to Get Started" });
    await cta.scrollIntoViewIfNeeded();
    await expect(cta.getByText("Ready to Get Started")).toBeVisible();
    const joinBtn = cta.getByRole("link", { name: /Join TuitionHub Today/i });
    await expect(joinBtn).toBeVisible();
    await expect(joinBtn).toHaveAttribute("href", /\/register/);
  });

  test("should have a footer with 4 columns", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer.getByText(/For Tutors/i)).toBeVisible();
    await expect(footer.getByText(/For Guardians/i)).toBeVisible();
    await expect(footer.getByText(/Contact/i)).toBeVisible();
  });

  test("navbar Sign In link should navigate to /login", async ({ page }) => {
    const signIn = page.getByRole("link", { name: /^sign in$/i });
    await expect(signIn).toBeVisible();
    await signIn.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("navbar Get Started button should navigate to /register", async ({ page }) => {
    const getStarted = page.getByRole("link", { name: /get started/i });
    await expect(getStarted).toBeVisible();
    await getStarted.click();
    await expect(page).toHaveURL(/\/register/);
  });
});
