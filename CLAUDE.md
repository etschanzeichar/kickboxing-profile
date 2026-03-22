# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static portfolio website for Eva Tschanz, a Swiss kickboxing champion. The site is a single-page application with no build system or JavaScript framework.

## Architecture

- **HTML**: `index.html` - Main page structure and content
- **CSS**: `css/styles.css` - All styles extracted to separate file
- **JavaScript**: `js/main.js` - All scripts extracted to separate file
- **SVG**: `images/svg/timeline.svg` - Timeline graphic (loaded dynamically via JS)
- **No build process**: Site can be served directly by any static file server
- **Images**: Located in `images/` directory with web-optimized versions in `images/web/` and thumbnails in `images/thumbnails/`

## Development

Start a local server with:
```bash
npm start
```
This runs `serve` on port 3000.

## Testing

**Important:** Run tests after every change and fix any failures before considering work complete.
After each change, if there was a functional change, ask the user if new tests should be added to test the new functionality

```bash
npm test
```

## Key Sections

The HTML file contains these main sections (each with an anchor ID):
- `#hero` - Hero with animated stats
- `#about` - About section with athlete bio
- `#achievements` - Achievements cards
- `#journey` - Interactive timeline
- `#budget` - Budget breakdown
- `#education` - Education information
- `#kickboxing` - Kickboxing background
- `#values` - Core values
- `#gallery` - Photo gallery grid
- `#sponsorship` - Sponsorship call-to-action
- `#partners` - Current partners
- `#contact` - Contact links
- `#footer` - Footer

## CSS Architecture

Located in `css/styles.css`:
- Uses CSS custom properties (variables) for theming (`--black`, `--red`, `--white`, etc.)
- Responsive breakpoints at 1024px (tablet), 768px (mobile), 380px (small phones)
- Print styles included for A4 portfolio export
- Mobile navigation with hamburger menu toggle

## JavaScript Features

Located in `js/main.js`:
- Scroll-based navbar background transition
- Mobile menu toggle with keyboard accessibility (Escape to close)
- Scroll-reveal animations for sections
- Smooth scroll for anchor links
- Timeline zoom/navigation functionality
- Achievement modal popups
- Partner card modal

## Images and Media

**Important:** Only optimized images may be used in the website. Never reference originals from `images/`, `images/new.photos/`, `images/Cover vids/`, or any other non-optimized directory directly in HTML/CSS/JS.

There are two sizes of optimized images, and the correct one depends on display context:

- `images/web/` - full web-optimized images (max 1600px). Use for **large display contexts**: hero images, about section, education, kickboxing, sponsorship sections, and any image displayed at or near full width.
- `images/thumbnails/` - gallery-optimized images (max 800px, suitable for 2x retina at 350px). Use for **smaller display contexts**: gallery items, video thumbnails, and partner card images.
- `images/` - contains original versions; these must NOT be referenced in the website.

Both `web/` and `thumbnails/` mirror the source directory structure (e.g., `images/new.photos/foo.jpg` → `images/web/new.photos/foo.jpg` and `images/thumbnails/new.photos/foo.jpg`).

### Creating optimized versions

Scripts for generating optimized images are in the `images/` directory:
- `images/optimize_for_web.sh` - creates full web-optimized versions in `images/web/` (1600px max)
- `images/make_thumbnails.sh` - creates gallery-sized versions in `images/thumbnails/` (800px max)

Both scripts recurse into subdirectories and preserve the directory structure in the output.

**If an image does not have optimized versions, run both scripts before adding it to the website.**

### Workflow for adding images

1. Place the original image in `images/` (in the appropriate subdirectory)
2. Run both optimization scripts to generate web and thumbnail versions
3. Choose the correct optimized version based on display size:
   - Large/full-width display → `images/web/`
   - Gallery, video thumbnail, partner card → `images/thumbnails/`
4. When browsing available images, look in `images/thumbnails/` for previews

## Deployment

GitHub Pages deployment is configured via `.github/workflows/deploy.yml`. Pushing to the `main` branch automatically triggers deployment.
