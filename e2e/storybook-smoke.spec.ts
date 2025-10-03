import { expect, test } from "@playwright/test";

/**
 * Smoke test to verify Storybook is accessible and functioning
 * This basic test ensures the E2E infrastructure is working correctly
 */
test.describe("Storybook Smoke Test", () => {
  test("should load Storybook homepage", async ({ page }) => {
    // Navigate to Storybook
    await page.goto("/");

    // Wait for Storybook to be interactive
    await page.waitForLoadState("networkidle");

    // Verify the Storybook title is present
    await expect(page).toHaveTitle(/Storybook/);

    // Verify Storybook UI loaded by checking for the preview iframe
    const preview = page.locator("#storybook-preview-iframe");
    await expect(preview).toBeAttached();
  });

  test("should navigate to a component story", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find story links (links with path=/story/ in href)
    const storyLinks = page.locator('a[href*="path=/story/"]');
    const count = await storyLinks.count();

    // Verify at least one story exists
    expect(count).toBeGreaterThan(0);

    // Click the first available story
    const firstStory = storyLinks.first();
    await expect(firstStory).toBeVisible();
    await firstStory.click();

    // Wait for navigation and verify the story canvas iframe is still visible
    await page.waitForLoadState("networkidle");
    const canvas = page.locator("#storybook-preview-iframe");
    await expect(canvas).toBeVisible();
  });

  test("should have basic accessibility features", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify page has a meaningful title for screen readers
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe("Untitled");

    // Check for main landmark or navigation role
    const hasNavigation = await page
      .locator('[role="navigation"]')
      .count()
      .then((count) => count > 0);
    const hasMain = (await page.locator("main, [role='main']").count()) > 0;

    expect(hasNavigation || hasMain).toBe(true);

    // Verify Storybook canvas is accessible
    const canvas = page.locator("#storybook-preview-iframe");
    await expect(canvas).toBeAttached();
  });
});
