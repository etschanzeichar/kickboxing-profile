import { test, expect } from '@playwright/test';

test.describe('Achievement Modal', () => {
  test('clicking an achievement card opens the modal', async ({ page }) => {
    await page.goto('/');

    const modal = page.locator('#achievementModal');
    const firstCard = page.locator('.achievement-card').first();

    // Modal should not be active initially
    await expect(modal).not.toHaveClass(/active/);

    // Click the first achievement card
    await firstCard.click();

    // Modal should now be active
    await expect(modal).toHaveClass(/active/);
  });

  test('modal displays correct content from clicked card', async ({ page }) => {
    await page.goto('/');

    const firstCard = page.locator('.achievement-card').first();

    // Get the data from the card
    const expectedCategory = await firstCard.getAttribute('data-category');
    const expectedTitle = await firstCard.getAttribute('data-title');
    const expectedLocation = await firstCard.getAttribute('data-location');
    const expectedResult = await firstCard.getAttribute('data-result');

    // Click the card
    await firstCard.click();

    // Verify modal content matches card data
    await expect(page.locator('#modalCategory')).toHaveText(expectedCategory!);
    await expect(page.locator('#modalTitle')).toHaveText(expectedTitle!);
    await expect(page.locator('#modalLocation')).toHaveText(expectedLocation!);
    await expect(page.locator('#modalResult')).toHaveText(expectedResult!);
  });

  test('clicking close button closes the modal', async ({ page }) => {
    await page.goto('/');

    const modal = page.locator('#achievementModal');
    const firstCard = page.locator('.achievement-card').first();
    const closeButton = page.locator('#modalClose');

    // Open modal
    await firstCard.click();
    await expect(modal).toHaveClass(/active/);

    // Click close button
    await closeButton.click();

    // Modal should be closed
    await expect(modal).not.toHaveClass(/active/);
  });

  test('clicking outside modal content closes the modal', async ({ page }) => {
    await page.goto('/');

    const modal = page.locator('#achievementModal');
    const firstCard = page.locator('.achievement-card').first();

    // Open modal
    await firstCard.click();
    await expect(modal).toHaveClass(/active/);

    // Click on the modal backdrop (outside the modal content)
    await modal.click({ position: { x: 10, y: 10 } });

    // Modal should be closed
    await expect(modal).not.toHaveClass(/active/);
  });

  test('pressing Escape closes the modal', async ({ page }) => {
    await page.goto('/');

    const modal = page.locator('#achievementModal');
    const firstCard = page.locator('.achievement-card').first();

    // Open modal
    await firstCard.click();
    await expect(modal).toHaveClass(/active/);

    // Press Escape
    await page.keyboard.press('Escape');

    // Modal should be closed
    await expect(modal).not.toHaveClass(/active/);
  });

  test('each achievement card opens modal with its own content', async ({ page }) => {
    await page.goto('/');

    const cards = page.locator('.achievement-card');
    const cardCount = await cards.count();

    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const expectedTitle = await card.getAttribute('data-title');

      // Click the card
      await card.click();

      // Verify modal shows correct title
      await expect(page.locator('#modalTitle')).toHaveText(expectedTitle!);

      // Close modal
      await page.keyboard.press('Escape');
      await expect(page.locator('#achievementModal')).not.toHaveClass(/active/);
    }
  });
});
