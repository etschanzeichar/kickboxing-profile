import { test, expect } from '@playwright/test';

test.describe('Page Load', () => {
  test('should load the page with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Eva Tschanz-Eichar | Swiss Kickboxing Champion');
  });

  test('should display the hero section', async ({ page }) => {
    await page.goto('/');

    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Eva Lina');
    await expect(heroTitle).toContainText('Tschanz-Eichar');

    const heroTagline = page.locator('.hero-tagline');
    await expect(heroTagline).toBeVisible();
  });

  test('should display all main sections', async ({ page }) => {
    await page.goto('/');

    // Check that each section exists and is visible
    const sections = [
      { id: 'hero', name: 'Hero' },
      { id: 'about', name: 'About' },
      { id: 'kickboxing', name: 'Kickboxing' },
      { id: 'education', name: 'Education' },
      { id: 'achievements', name: 'Achievements' },
      { id: 'gallery', name: 'Gallery' },
      { id: 'sponsorship', name: 'Sponsorship' },
      { id: 'contact', name: 'Contact' },
      { id: 'footer', name: 'Footer' },
    ];

    for (const section of sections) {
      const element = page.locator(`#${section.id}`);
      await expect(element, `${section.name} section should exist`).toBeAttached();
    }
  });

  test('should display navigation', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('#navbar');
    await expect(nav).toBeVisible();

    const logo = page.locator('.logo');
    await expect(logo).toBeVisible();
  });

  test('should display footer', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('#footer');
    await expect(footer).toBeAttached();
  });
});

test.describe('Anchor Navigation', () => {
  const anchors = [
    { id: 'hero', name: 'Hero' },
    { id: 'about', name: 'About' },
    { id: 'kickboxing', name: 'Kickboxing' },
    { id: 'education', name: 'Education' },
    { id: 'achievements', name: 'Achievements' },
    { id: 'gallery', name: 'Gallery' },
    { id: 'sponsorship', name: 'Sponsorship' },
    { id: 'contact', name: 'Contact' },
    { id: 'footer', name: 'Footer' },
  ];

  for (const anchor of anchors) {
    test(`direct navigation to #${anchor.id} should scroll to ${anchor.name} section`, async ({ page }) => {
      await page.goto(`/#${anchor.id}`);

      // Wait for any scroll animation
      await page.waitForTimeout(600);

      const section = page.locator(`#${anchor.id}`);
      await expect(section).toBeInViewport({ ratio: 0.1 });
    });
  }
});
