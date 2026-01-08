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

## Images

Images are stored as follows:
- images/ - contains the original version, shouldn't be used in website, only for generating web and thumbnail versions
- images/web/ - the web-optimized images that should be used when adding images to the website
- images/thumbnails/ - a miniature version of the original folders. The files are prefixed with thumb_. To find the image to use, strip thumb_ from the file name and look in the images/web/ directory for the corresponding image

When looking for images to use for the website, look in the thumbnails folder for the small versions to analyze then add the web version to the website

## Deployment

GitHub Pages deployment is configured via `.github/workflows/deploy.yml`. Pushing to the `main` branch automatically triggers deployment.
