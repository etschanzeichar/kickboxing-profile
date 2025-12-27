import { test, expect } from '@playwright/test';

const menuItems = [
  { label: 'About Me', targetId: 'about' },
  { label: 'Achievements', targetId: 'achievements' },
  { label: 'My Plan', targetId: 'budget' },
  { label: 'Contacts', targetId: 'contact' },
];

// Set mobile viewport for all sidebar navigation tests since hamburger menu is only visible at mobile breakpoints
test.use({ viewport: { width: 375, height: 667 } });

test.describe('Sidebar Navigation', () => {
  test('hamburger menu should be visible', async ({ page }) => {
    await page.goto('/');
    const menuToggle = page.locator('#menuToggle');
    await expect(menuToggle).toBeVisible();
  });

  test('clicking hamburger opens sidebar', async ({ page }) => {
    await page.goto('/');

    const menuToggle = page.locator('#menuToggle');
    const sidebar = page.locator('#sidebarNav');

    // Sidebar should not have active class initially
    await expect(sidebar).not.toHaveClass(/active/);

    // Click hamburger menu
    await menuToggle.click();

    // Sidebar should now have active class
    await expect(sidebar).toHaveClass(/active/);
  });

  test('clicking overlay closes sidebar', async ({ page }) => {
    await page.goto('/');

    const menuToggle = page.locator('#menuToggle');
    const sidebar = page.locator('#sidebarNav');
    const overlay = page.locator('#sidebarOverlay');

    // Open sidebar
    await menuToggle.click();
    await expect(sidebar).toHaveClass(/active/);
    await expect(overlay).toHaveClass(/active/);

    // Click overlay to close - click in the center-right area away from sidebar
    await overlay.click({ position: { x: 350, y: 300 } });

    // Sidebar should be closed
    await expect(sidebar).not.toHaveClass(/active/);
  });

  test('sidebar contains all navigation links', async ({ page }) => {
    await page.goto('/');

    // Open sidebar
    await page.locator('#menuToggle').click();
    const sidebar = page.locator('#sidebarNav');

    for (const item of menuItems) {
      const link = sidebar.locator(`a[href="#${item.targetId}"]`).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveText(item.label);
    }
  });

  for (const item of menuItems) {
    test(`clicking "${item.label}" navigates to #${item.targetId}`, async ({ page }) => {
      await page.goto('/');

      // Open sidebar
      await page.locator('#menuToggle').click();
      const sidebar = page.locator('#sidebarNav');
      await expect(sidebar).toHaveClass(/active/);

      // Click the sidebar link
      const link = sidebar.locator(`a[href="#${item.targetId}"]`).first();
      await link.click();

      // Sidebar should close after clicking a link
      await expect(sidebar).not.toHaveClass(/active/);

      // Wait for smooth scroll to complete
      await page.waitForTimeout(600);

      // Verify the target section is in view
      const section = page.locator(`#${item.targetId}`);
      await expect(section).toBeInViewport({ ratio: 0.1 });
    });
  }
});

test.describe('Keyboard Navigation', () => {
  test('pressing Escape closes the sidebar', async ({ page }) => {
    await page.goto('/');

    const menuToggle = page.locator('#menuToggle');
    const sidebar = page.locator('#sidebarNav');

    // Open sidebar
    await menuToggle.click();
    await expect(sidebar).toHaveClass(/active/);

    // Press Escape
    await page.keyboard.press('Escape');

    // Sidebar should be closed
    await expect(sidebar).not.toHaveClass(/active/);
  });
});

test.describe('Hero CTA Navigation', () => {
  test('Become a Sponsor link navigates to sponsorship section', async ({ page }) => {
    await page.goto('/');

    const ctaLink = page.locator('.hero-sponsor-link');
    await ctaLink.click();

    await page.waitForTimeout(600);

    const section = page.locator('#sponsorship');
    await expect(section).toBeInViewport({ ratio: 0.1 });
  });
});
