# Eva Tschanz-Eichar Portfolio Website

A static portfolio website for Eva Tschanz, a Swiss kickboxing champion.

## Project Structure

```
kickboxing-profile/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All CSS styles
├── js/
│   └── main.js             # JavaScript functionality
├── images/
│   ├── svg/
│   │   └── timeline.svg    # Timeline graphic (loaded via JS)
│   ├── web/                # Web-optimized images (used in site)
│   └── thumbnails/         # Thumbnail previews
├── tests/                  # Playwright test files
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

## Prerequisites

- Node.js (v18 or later recommended)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jesseeichar/kickboxing-profile.git
   cd kickboxing-profile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers (for testing):**
   ```bash
   npx playwright install chromium
   ```

## Development

### Start Local Server

Run a local development server on port 3000:

```bash
npm start
```

Then open http://localhost:3000 in your browser.

### View the Site

After starting the server, navigate to:
- http://localhost:3000 - Main page
- http://localhost:3000/#about - About section
- http://localhost:3000/#achievements - Achievements section
- etc.

## Testing

Run tests after every change and fix any failures before considering work complete.

```bash
npm test             # Run all tests headlessly
npm run test:headed  # Run with visible browser
npm run test:ui      # Interactive UI mode for debugging
```

Tests are located in `tests/` and use Playwright.

## Deployment

### GitHub Pages (Automatic)

The site automatically deploys to GitHub Pages when you push to the `main` branch.

**Setup (one-time):**
1. Go to your repository Settings → Pages
2. Under "Build and deployment", select **Source: GitHub Actions**
3. Push to `main` branch - the workflow will deploy automatically

**Manual deployment:**
You can also trigger a deployment manually from the Actions tab → "Deploy static content to Pages" → "Run workflow"

### Manual Deployment

Since this is a static site with no build step, you can deploy to any static hosting:

1. Copy all files (index.html, css/, js/, images/) to your hosting provider
2. Ensure the server serves `index.html` as the default document

## Image Processing

Two shell scripts in `images/` handle image optimization (requires macOS `sips` command):

- `make_thumbnails.sh` - Creates 300px thumbnails in `images/thumbnails/`
- `optimize_for_web.sh` - Creates 1600px web-optimized images in `images/web/`

Run from the `images/` directory:
```bash
cd images && ./make_thumbnails.sh
cd images && ./optimize_for_web.sh
```

## Page Sections

The website includes the following sections, each with an anchor for direct linking:

| Section | Anchor |
|---------|--------|
| Hero | `#hero` |
| About | `#about` |
| Achievements | `#achievements` |
| Journey/Timeline | `#journey` |
| Budget | `#budget` |
| Education | `#education` |
| Kickboxing | `#kickboxing` |
| Values | `#values` |
| Gallery | `#gallery` |
| Sponsorship | `#sponsorship` |
| Partners | `#partners` |
| Contact | `#contact` |
| Footer | `#footer` |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start local development server on port 3000 |
| `npm test` | Run Playwright tests (headless) |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:ui` | Run tests in interactive UI mode |
