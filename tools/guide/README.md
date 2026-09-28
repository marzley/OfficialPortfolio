# User guide (PDF)

Branded user guide for the website, client portal and learning hub.

1. Start the local test server, then take fresh screenshots: `node shots.js` (run inside this folder).
2. Copy `img/brand/logo-256.webp`, `img/brand/marzley-logo.webp` and `img/kelvin/headshot.jpg` here.
3. Build the PDFs: `node pdf.js` → `Marzley-Tech-User-Guide.pdf`, `node devpdf.js` → `Marzley-Tech-Developer-Guide.pdf` (from `dev.html`).

Needs Node and Playwright (Chromium). Screenshots and the PDF are not committed.
