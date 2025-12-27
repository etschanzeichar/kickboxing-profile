# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static portfolio website for Eva Tschanz, a Swiss kickboxing champion. The site is a single-page HTML application located in `index.html` with no build system or JavaScript framework.

## Architecture

- **Single HTML file**: All HTML, CSS, and JavaScript is contained in `index.html`
- **No build process**: Site can be served directly by any static file server
- **Images**: Located in `images/` directory with web-optimized versions in `images/web/` and thumbnails in `images/thumbnails/`

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
- `#kickboxing` - Kickboxing background
- `#education` - Education information
- `#achievements` - Achievements timeline
- `#gallery` - Photo gallery grid
- `#sponsorship` - Sponsorship call-to-action
- `#contact` - Contact form
- `#footer` - Footer

## CSS Architecture

- Uses CSS custom properties (variables) for theming (`--black`, `--red`, `--white`, etc.)
- Responsive breakpoints at 1024px (tablet), 768px (mobile), 380px (small phones)
- Print styles included for A4 portfolio export
- Mobile navigation with hamburger menu toggle

## JavaScript Features

- Scroll-based navbar background transition
- Mobile menu toggle with keyboard accessibility (Escape to close)
- Scroll-reveal animations for sections
- Smooth scroll for anchor links

## Images
Images are stored as follows:
- images/ - contains the original version, shouldn't be used in website, only for generating web and thumbnail verions
- images/web/ - the web-optimized images that should be used when adding images to the website
- images/thumbnails/ - a miniature version of the original folders.  The files are prefixed with thumb_.  To find the image to use, strip thumb_ from the file name and look in the images/web/ directory for the corresponding image

When looking for images to use for the website, look in the thumbnails folder for the small versions to analyze then add the web version to the website