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

    // Verify the sidebar navigation is visible
    const sidebar = page.locator('[role="navigation"]').first();
    await expect(sidebar).toBeVisible();
  });

  test("should navigate to a component story", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify at least one story exists in the sidebar
    const storyLinks = page.locator('[role="navigation"] a[data-item-id]');
    await expect(storyLinks).not.toHaveCount(0);

    // Click the first available story
    const firstStory = storyLinks.first();
    await expect(firstStory).toBeVisible();
    await firstStory.click();

    // Verify the story canvas is visible
    const canvas = page.locator("#storybook-preview-iframe");
    await expect(canvas).toBeVisible();
  });
});
