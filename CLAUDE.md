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

**Important:** Only web-optimized images and videos may be used in the website. Never reference originals from `images/`, `images/new.photos/`, `images/Cover vids/`, or any other non-web directory directly in HTML/CSS/JS.

Images are stored as follows:
- `images/` - contains original versions; these must NOT be referenced in the website
- `images/web/` - web-optimized images; these are the ONLY versions that should be used in the website
- `images/thumbnails/` - miniature versions prefixed with `thumb_`; use these to browse/analyze images, then reference the corresponding file from `images/web/`

### Creating web-optimized versions

Scripts for generating web-optimized images and thumbnails are in the `images/` directory:
- `images/optimize_for_web.sh` - creates web-optimized versions in `images/web/`
- `images/make_thumbnails.sh` - creates thumbnails in `images/thumbnails/`

**If an image or video does not have a web-optimized version in `images/web/`, create one using the optimization scripts before adding it to the website.**

### Workflow for adding images

1. Place the original image in `images/`
2. Run the optimization script to generate the web version
3. Reference only the `images/web/` version in HTML/CSS/JS
4. When browsing available images, look in `images/thumbnails/` for small previews, then use the corresponding `images/web/` file

## Deployment

GitHub Pages deployment is configured via `.github/workflows/deploy.yml`. Pushing to the `main` branch automatically triggers deployment.
