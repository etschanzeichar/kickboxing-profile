# Eva Tschanz-Eichar Portfolio Website

A static portfolio website for Eva Tschanz, a Swiss kickboxing champion.

## Project Setup

### Prerequisites

- Node.js (v18 or later recommended)
- Python 3 (for local development server)

### Installation

1. **Install Node dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install chromium
   ```

3. **Install Claude Code plugins** (optional, for Claude Code users):
   ```bash
   # Add the official plugins marketplace
   /plugin marketplace add anthropics/claude-code

   # Install the frontend-design plugin
   /plugin install frontend-design@claude-code-plugins
   ```

4. **Verify setup by running tests:**
   ```bash
   npm test
   ```

## Development

To preview the site locally, serve the files with any static HTTP server:
```bash
python3 -m http.server 8000
# Then open http://localhost:8000/
```

## Testing

Run tests after every change and fix any failures before considering work complete.

```bash
npm test             # Run all tests headlessly
npm run test:headed  # Run with visible browser
npm run test:ui      # Interactive UI mode for debugging
```

Tests are located in `tests/` and use Playwright. The test configuration automatically starts a local server on port 8000.

## Image Processing

Two shell scripts in `images/` handle image optimization (requires macOS `sips` command):

- `make_thumbnails.sh` - Creates 300px thumbnails in `images/thumbnails/`
- `optimize_for_web.sh` - Creates 1600px web-optimized images in `images/web/`

Run from the `images/` directory:
```bash
cd images && ./make_thumbnails.sh
cd images && ./optimize_for_web.sh
```

## Architecture

- **Single HTML file**: All HTML, CSS, and JavaScript is contained in `index.html`
- **No build process**: Site can be served directly by any static file server
- **Images**: Located in `images/` directory with web-optimized versions in `images/web/` and thumbnails in `images/thumbnails/`

## Page Sections

The website includes the following sections, each with an anchor for direct linking:

| Section | Anchor |
|---------|--------|
| Hero | `#hero` |
| About | `#about` |
| Kickboxing | `#kickboxing` |
| Education | `#education` |
| Achievements | `#achievements` |
| Gallery | `#gallery` |
| Sponsorship | `#sponsorship` |
| Contact | `#contact` |
| Footer | `#footer` |
