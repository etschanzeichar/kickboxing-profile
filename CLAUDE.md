# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static portfolio website for Eva Tschanz, a Swiss kickboxing champion. The site is a single-page HTML application located in `claude_take-1/index.html` with no build system or JavaScript framework.

## Architecture

- **Single HTML file**: All HTML, CSS, and JavaScript is contained in `claude_take-1/index.html`
- **No build process**: Site can be served directly by any static file server
- **Images**: Located in `images/` directory with web-optimized versions in `images/web/` and thumbnails in `images/thumbnails/`

## Development

To preview the site locally, serve the files with any static HTTP server:
```bash
python3 -m http.server 8000
# Then open http://localhost:8000/claude_take-1/
```

## Image Processing

Two shell scripts in `images/` handle image optimization (requires macOS `sips` command):

- `make_thumbnails.sh` - Creates 300px thumbnails in `images/thumbnails/`
- `optimize_for_web.sh` - Creates 1600px web-optimized images in `images/web/`

Run from the `images/` directory:
```bash
cd images && ./make_thumbnails.sh
cd images && ./optimize_for_web.sh
```

## Key Sections

The HTML file contains these main sections:
- Hero with animated stats
- About section with athlete bio
- Achievements timeline
- Photo gallery grid
- Sponsorship call-to-action
- Contact form

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
