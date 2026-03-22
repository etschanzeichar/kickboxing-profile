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

  test('gallery images should use thumbnails, lightbox should use web versions', async ({ page }) => {
    await page.goto('/');

    // Gallery items should use thumbnail images
    const galleryImages = page.locator('.gallery-item img');
    const count = await galleryImages.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const src = await galleryImages.nth(i).getAttribute('src');
      expect(src, `Gallery image ${i} should use thumbnails/`).toContain('images/thumbnails/');
    }

    // Click first gallery image to open lightbox
    await galleryImages.first().click();

    const lightbox = page.locator('#galleryLightbox');
    await expect(lightbox).toHaveClass(/active/);

    // Lightbox image should use web-optimized version
    const lightboxImg = page.locator('#lightboxImage');
    const lightboxSrc = await lightboxImg.getAttribute('src');
    expect(lightboxSrc, 'Lightbox should use images/web/').toContain('images/web/');
    expect(lightboxSrc, 'Lightbox should not use thumbnails').not.toContain('images/thumbnails/');
  });

  test('no images should reference non-optimized originals', async ({ page }) => {
    await page.goto('/');

    const allImages = page.locator('img[src^="images/"]');
    const count = await allImages.count();

    for (let i = 0; i < count; i++) {
      const src = await allImages.nth(i).getAttribute('src');
      const usesOptimized = src!.startsWith('images/web/') || src!.startsWith('images/thumbnails/') || src!.startsWith('images/svg/');
      expect(usesOptimized, `Image "${src}" should use images/web/, images/thumbnails/, or images/svg/`).toBe(true);
    }
  });
});
