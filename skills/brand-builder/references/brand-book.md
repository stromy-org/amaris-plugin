# Brand Book Reference (HTML-First)

## Overview

The brand book is a self-contained HTML file — the final, shareable deliverable that a designer, developer, or partner opens to understand the brand. It uses the brand's actual Google Fonts, inline SVG logos, live CSS motif demos, and brand imagery — producing visual fidelity that matches the other brand HTML deliverables (imagery guide, visual directions, brand exploration board).

An optional PDF can be generated from the HTML via Playwright's `page.pdf()` for print or offline distribution.

## Why HTML-First

| Dimension | HTML | reportlab PDF |
|-----------|------|---------------|
| Fonts | Real Google Fonts via CDN | System fonts only (Helvetica, Courier) |
| Logos | Inline SVG, crisp at any size | Rasterized or missing |
| Motif demos | Live CSS (repeating-linear-gradient, borders) | Static approximations |
| Images | `<img>` tags with brand-treated photos | Manual coordinate placement |
| Layout | CSS flow, grid, flexbox — no overlap risk | Manual Y-coordinate math, overlap-prone |
| Consistency | Matches all other brand HTML deliverables | Visually disconnected from the rest of the kit |

## Technical Requirements

- **Self-contained**: Single `.html` file with all CSS embedded (no external stylesheets)
- **Google Fonts**: Load display, body, and mono fonts via single `@import` in `<style>`
- **CSS variables**: Define all brand colors, fonts, spacing as custom properties at `:root`
- **Inline SVGs**: Embed logo SVGs directly in the HTML (not as external `<img>` references)
- **Images**: Reference brand imagery from `assets/images/` using relative paths. For self-contained brand books with base64-embedded images, pre-crop dark/architectural images to the interesting region (top 40%) and boost brightness 1.3x before encoding. See `imagery.md` § "HTML Image Display Rules" for the full checklist.
- **Image CSS**: Always use `object-position: center top` for dark/moody photography, never apply `filter: grayscale()` to already-B&W images, always set `background-repeat: no-repeat` on hero/cover backgrounds, and ensure `html, body { width: 100%; min-width: 100%; }` for full-width covers.
- **SVG logos**: Rasterize to PNG via Sharp before base64 embedding — inline SVGs with `width="100%"` overflow containers unpredictably.
- **Print stylesheet**: Include `@media print` rules with `page-break-before` / `page-break-after` for clean PDF conversion
- **Responsive**: Optimized for desktop (1200px+) but readable at narrower widths

## Document Structure

### Navigation

Sticky sidebar (left, 240px) with section links. Uses `scroll-behavior: smooth` and highlights the active section. Hidden in print.

### Sections (14-16 total)

| # | Section | Content |
|---|---------|---------|
| 1 | **Cover** | Dark background, centered logo (inline SVG), tagline, "Brand Guidelines", version/date, domains in accent |
| 2 | **Table of Contents** | Numbered section list with descriptions, linking to anchors |
| 3 | **Brand Foundation** | Archetype (primary + secondary), essence, positioning (tinted box with brand left-border), personality traits as tags, personality spectrums (5 CSS slider bars), tagline in display font, voice summary, origin story |
| 4 | **Logo — Primary** | 2x2 grid showing logo on dark/light/brand/mono backgrounds, with-tagline lockup, icon marks at descending sizes |
| 5 | **Logo — Rules** | Clear space diagram, color-by-background table, don'ts list |
| 6 | **Color Palette** | Primary swatches (large cards with hex, name, usage), color scales (50-900 as horizontal strips), usage rules in tinted boxes |
| 7 | **Color Combinations** | Approved combos (logo + tagline on different backgrounds), semantic colors (success/warning/error/info with light variants) |
| 8 | **Typography — Scale** | Type stack cards (3 fonts: display, body, mono with specimen), full type scale from Display XL to Micro with real brand copy |
| 9 | **Typography — Rules** | Report header simulations (dark/light side by side), hierarchy rules, weight restrictions |
| 10 | **Brand Motif** | Brand-color background page, motif variants table, live CSS demos at different scales, implementation code block |
| 11 | **Voice & Tone** | 3 do/don't pairs in side-by-side cards (green left-border for do, accent for don't), writing principles |
| 12 | **Imagery Direction** | Subject tags (accent-tinted), avoid tags (muted, strikethrough), processing recipe, composition principles |
| 13 | **Imagery Library** | Category cards with thumbnails from Phase 4 imagery, sourcing platforms, recommended search terms |
| 14 | **Templates Reference** | Card per template (PPTX, DOCX, letterhead, business cards, email sig) with filename and description |
| 15 | **Design Tokens** | Dark background section, CSS variables displayed in mono code blocks, organized by category |
| 16 | **Back Cover** | Dark background, centered logo + motif + tagline, domains, version + date |

### Design Patterns

These patterns ensure visual consistency with the other brand HTML deliverables:

**Section headers:**
```css
.section-header {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.5rem;
}
.section-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--dark);
}
```

**Card pattern:**
```css
.card {
  background: var(--white);
  border: 1px solid var(--n100);
  border-radius: 12px;
  padding: 2rem;
}
```

**Philosophy/callout boxes:**
```css
.callout {
  background: var(--n50);
  border-left: 4px solid var(--accent);
  border-radius: 0 12px 12px 0;
  padding: 1.5rem 2rem;
}
```

**Color swatches:**
```css
.swatch {
  border-radius: 12px;
  padding: 2rem;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.swatch-label { font-family: var(--font-mono); font-size: 0.75rem; }
```

**Brand motif (example — diagonal slash):**
```css
.motif-demo {
  background: repeating-linear-gradient(
    -8deg,
    transparent,
    transparent 3px,
    var(--accent) 3px,
    var(--accent) 4px
  );
}
```

**Grids:**
```css
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
```

## Data Sources

Pull brand book content from these Phase 1-5 outputs:

| Content | Source |
|---------|--------|
| Archetype, essence, positioning, personality, voice | `BRAND-Brand-Guidelines.md` (Phase 3) |
| Colors (hex values, names, scales) | `tokens.css` (Phase 3) + `charter.json` |
| Typography (font names, scale, weights) | `tokens.css` (Phase 3) |
| Logo SVGs | `logos/*.svg` (Phase 2) |
| Motif definition | `tokens.css` (Phase 3) — motif section |
| Imagery subjects, avoids, processing | `BRAND-Imagery-Guide.html` (Phase 4) |
| Brand images | `assets/images/*.jpg` (Phase 4) |
| Template list | `templates/` directory (Phase 5) |

## Optional PDF Conversion

After the HTML brand book is complete and QA'd, offer PDF conversion via Playwright:

```javascript
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle' });
await page.pdf({
  path: outputPdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' }
});
await browser.close();
```

The `@media print` CSS in the HTML handles:
- Hiding the sidebar navigation
- Page breaks between sections (`page-break-before: always`)
- Adjusting widths to fill the page (no sidebar offset)
- Background color printing (`-webkit-print-color-adjust: exact`)

## QA

After generating, open in browser and visually inspect:

1. **Font loading** — Do Google Fonts render correctly? Check display, body, and mono.
2. **Logo rendering** — Are inline SVGs crisp? Check on both dark and light backgrounds.
3. **Color accuracy** — Do swatches match the token values? Check contrast on all text.
4. **Motif demos** — Do live CSS motifs render? Check at different viewport widths.
5. **Wrapping and overlap** — Inspect headlines, taglines, labels, and motif overlays for awkward wraps or collisions.
6. **Family consistency** — If multiple motifs are present, do they feel like one authored system?
7. **Image loading** — Do brand images load from relative paths?
8. **Navigation** — Does sidebar scrolling work? Do section links jump correctly?
9. **Print preview** — Open print preview to verify page breaks and layout without sidebar.

## Important Notes

- **Self-contained first** — The HTML file should work when opened directly from the filesystem. Google Fonts load via CDN; everything else is embedded.
- **Match the brand HTML family** — The brand book should look like it belongs with the imagery guide, visual directions, and exploration board. Use the same CSS patterns, card styles, and section conventions.
- **Real content, not lorem ipsum** — Use actual brand copy, positioning statements, and taglines throughout. The brand book IS the brand.
- **Inline SVG, not `<img>`** — Logo SVGs must be inlined so they render without external file dependencies and can be styled with CSS.
- **Write directly** — No scaffold or build script needed. Write the HTML file directly, customizing all content from the brand data gathered in Phases 0-5.
