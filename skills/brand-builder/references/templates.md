# Templates Reference

## Before Building Any Template

1. Read the relevant skill: the `pptx` skill for presentations, the `docx` skill for documents
2. Dependencies are pre-installed in root `package.json`: `pptxgenjs`, `docx`, `react`, `react-dom`, `react-icons`, `sharp`
3. **Phase 4 imagery must be complete** before building templates — brand-treated images from `assets/images/` are integrated into slides and documents

## Report Template (DOCX)

Build with docx-js (Node.js). Script goes in `_build/build-docx-report.js` (ephemeral).

### Charter-Driven Colors & Theme Injection
Both DOCX builders (report + letterhead) read colors and fonts from `charter.json` at build time — no hardcoded brand constants. After `Packer.toBuffer()`, the scripts post-process the DOCX buffer to inject `templates/theme/theme1.xml` via `inject-theme.js`. This ensures:
- Word/LibreOffice apply the correct brand fonts and colors natively
- Theme colors propagate to charts, SmartArt, and other Office objects
- Users see the branded color picker when editing the document

### Document Structure

**Section 1: Cover page** (separate section for different margins)
- Large top margin (1.5–2" / 2160–2880 DXA)
- **Hero image** (2:1 crop from `images/heroes/*.hero-2x1.jpg`) — full content width, placed first for visual impact
- Overline: uppercase, wide-tracked (`characterSpacing: 120`), accent color, IBM Plex Mono 8pt
- Title: display serif (Fraunces), 28pt, primary brand color
- Subtitle: body font, muted color, describes report scope
- **Motif element**: two parallel border lines (primary + accent, offset) approximating the divider-short pattern — NOT a single line, always the branded two-line motif
- Metadata block: Date, Classification, Prepared for, Prepared by — each as a label:value pair in mono font
- Domain footer: all brand domains, mono, muted

**Section 2: TOC** (with header/footer)
- TableOfContents element with hyperlinks and `features.updateFields: true` on the Document
- Requires `outlineLevel` on heading paragraph styles (level 0/1/2 → H1/H2/H3)
- Use `StyleLevel` to map heading styles to TOC levels

**Section 3: Report body** (with header/footer)
- H1: serif, 20pt, with bottom border in primary brand color — **`pageBreakBefore: true`**
- H2: serif, 14pt, in primary brand color — can flow with content
- H3: sans bold, 12pt
- **Callout box variants** (3 styles, all using `border.left` + `shading`):
  - Info: mineral/green-tinted left border (12pt) + light mineral fill
  - Warning: accent left border (12pt) + light accent tint fill
  - Error: error-color left border + light error tint fill (optional third variant)
  - Each callout has a bold label prefix ("Note:", "Important:") in the border color
- **Pull quote**: large serif italic in primary brand color, accent left border (8pt), indented 0.5" both sides
- **Data tables**: primary-color header row with white text, alternating row fills (paper-alt), mono font for numeric columns
- **Figure captions**: centered italic body font, muted/pewter color, below figures
- **Source citations**: mono italic, muted color
- **Numbered lists**: use `numbering.config` with mono-styled numbers in accent color

### Header/Footer Pattern

**Header**: "BRANDNAME" in serif (8pt, tracked, muted) + `  ·` in accent mono — subtle bottom border in paper color
**Footer**: Primary-color top border + "Confidential" left (mono) + page number right (mono) — use tab stops (`TabStopType.RIGHT`, `TabStopPosition.MAX`)

### DOCX Critical Rules
- Use `WidthType.PERCENTAGE` for table widths (percentage works fine in docx-js v9+, DXA also acceptable)
- Use `ShadingType.CLEAR`, never SOLID — SOLID renders as solid black in some viewers
- Use `LevelFormat.DECIMAL` for ordered lists, `LevelFormat.BULLET` for unordered — never unicode bullets
- Set page size explicitly (A4: 11906 × 16838 DXA)
- Include `outlineLevel` on heading paragraph styles for TOC to work
- Use `convertInchesToTwip()` for margins — never raw DXA math
- Hero images: read as `Buffer` via `fs.readFileSync()`, pass to `ImageRun` with `type: 'jpg'`
- Set `features: { updateFields: true }` on the Document for TOC auto-population

## Letterhead (DOCX)

Build with docx-js (Node.js). Script goes in `_build/build-docx-letterhead.js` (ephemeral).

### Standard Letterhead (First Page)
Uses `titlePage: true` on section properties to enable a distinct first-page header:
- **Full branded header**: Brand name (serif, 14pt, tracked), tagline (body italic, muted), two-line motif (primary border + accent border, offset by indent)
- Date (right-aligned, mono)
- Recipient block (name bold, company/address muted)
- Subject line with "Re:" prefix in accent color
- Salutation
- Body placeholder with usage guidance
- Signature block (closing, spacing gap for signature, name bold, title muted)

### Continuation Page Variant
Automatic via `titlePage: true` — pages 2+ use the `default` header instead of `first`:
- Simplified header: "BRANDNAME" serif 8pt tracked + oxide dot — same pattern as report body header

### Footer (All Pages)
Three-column via tab stops: email left · domains center · page number right. Primary-color top border.

### Letterhead Design Rules
- First-page top margin: 1.8" (gives breathing room below the branded header)
- Continuation top margin: 1" (standard)
- The two-line motif in the header uses `border.bottom` on consecutive empty paragraphs — one in primary color, one in accent color with left indent to create the offset effect
- Never embed images in letterhead headers — use text and borders only for maximum portability

## Business Cards (HTML)

Build as a **two-stage system**, not a single four-option page:

1. **Review board** in `_build/` with **20 complete front/back concepts**
2. **Promoted production catalog** in `templates/html/` for the approved / recommended top concepts

### 20-concept system

Generate the full `5 x 4` authored concept set:

- **Front families (5)**: dark wordmark, light editorial, icon-led bold, motif-led minimal, image-led dramatic
- **Back families (4)**: contact ledger, tagline image, pattern field, minimal mono/contact

Every concept is a complete pair. Do not generate a random matrix or near-duplicates.

### Review artifact

- `_build/BRAND-Business-Cards-Review.html`
- Shows all 20 concepts with front/back preview, rationale, family tags, and production-candidate status
- Entire system should feel like a branded review deliverable, not a raw asset dump

### Production outputs

- `templates/html/business-cards.html` — promoted catalog of approved/recommended concepts
- `templates/print/cards/` — print-ready SVG exports
- `templates/pdf/cards/` — PDF exports when browser-backed conversion is available

Default pilot target:

- review all 20 concepts via **interactive selection board** (click-to-select, live counter, clipboard export)
- promote the **top 10** concepts to production (2 per front family for broad coverage)
- export each promoted concept in **EU 85x55mm** and **US 3.5x2in**

### Interactive Review Board
- **Click-to-select**: entire concept card toggles `.selected` on click (no checkboxes)
- **Live counter**: fixed bottom bar showing `Selected: N / 10 target`
- **Clipboard export**: button copies selected concept IDs (e.g., "c01, c06, c11") to clipboard
- **Sticky navigation**: horizontal nav with front family sections, IntersectionObserver for active tracking
- **Pre-selected**: recommended top-10 concepts start pre-selected with "Recommended" badge
- **Brand-styled**: uses charter.json palette and fonts

### Visual QA (optional)
Run with `--qa` flag to generate Playwright-based visual QA:
- Screenshots all 20 card fronts+backs at preview resolution
- Generates `_build/Phase5-QA-Report.html` with thumbnail grid and pass/fail indicators
- Requires Playwright to be installed

### Card Design Rules
- Review previews can be screen-scaled, but print outputs must respect real production sizing
- Use approved brand assets only: logo variants, icon, motif family, pattern tile, and processed imagery
- Keep line work at **0.5pt or thicker** and avoid motif strokes below the brand minimum
- Keep text at **8pt or larger** in print exports
- Keep key text inside safe area; backgrounds and image crops extend to bleed
- Use image-led backs selectively; prefer processed textural/material imagery over generic scenic hero shots
- Recommend **400gsm uncoated stock** in the production catalog unless the brand explicitly calls for something else
- **Personality layer**: archetype drives motif stroke weight, card spacing, name/title sizing, corner style, and motif prominence

## Email Signature (HTML)

Build as a **12-variant system** with:

- `3` densities: minimal, standard, extended
- `4` chrome behaviors: pure text, motif-led, rule-led, two-column/contact-led

Produce both:

- `_build/BRAND-Signatures-Review.html` — interactive review board with all 12 variants (click-to-select, counter `Selected: N / 4 target`, clipboard export, "Copy HTML" per variant)
- `templates/html/email-signature.html` — promoted catalog
- `templates/html/signatures/*.fragment.html` — one direct-pickup fragment per variant

### Email Client Compatibility Rules
- **Only `<table>` layout** — no `<div>`, no flexbox, no grid
- **Only inline styles** — no `<style>` blocks, no CSS classes
- **No images** — blocked or stripped by most email clients. Use text and border-based elements only
- **Safe fonts**: Arial, Helvetica, sans-serif for body; 'Courier New', Courier, monospace for mono. Brand web fonts won't load in email clients
- **Total height under 120px** — email signatures should be compact, not a marketing banner
- **Color values**: use hex (`#B96034`), never `rgb()` or CSS variables
- **Link styling**: `text-decoration: none` with brand accent color for URLs, muted color for email addresses

### Motif Element Construction
The brand's divider-short pattern adapted for email-safe markup:
1. Outer table with two cells: left cell (line container, ~180px) + right cell (registration block, 16px)
2. Left cell contains a nested table with two rows:
   - Row 1: `border-bottom: 2px solid {primary}` (the forest line)
   - Row 2: 6px spacer
   - Row 3: `border-bottom: 2px solid {accent}` with left margin/padding (the oxide line, offset)
3. Right cell: a mini table with `border: 2px solid {accent}` (the registration block)
4. Use `&nbsp;` in empty cells and explicit `font-size: 1px; line-height: 1px` to prevent cell collapse

### Variant system

Each density/chrome combination is a real variant. Do not collapse back to 3 outputs after defining the grid.

- **Minimal** keeps only essential lines and should stay suitable for compact/mobile use
- **Standard** is the default mid-density system
- **Extended** can add phone, additional domains, and right-column detail
- **Pure text** avoids motif blocks entirely
- **Motif-led** uses the two-line + registration block device
- **Rule-led** uses simpler horizontal rules rather than the full motif block
- **Two-column/contact-led** splits contact and brand/meta information with a vertical rule

### Wrapper HTML
The catalog page is a standalone HTML page with a header section (not part of signatures) that explains the system:
- Page background: brand paper color
- Each variant in a card container with rounded corners and label
- "COPY FROM HERE" / "END COPY" markers around each signature table
- Usage instructions at the bottom (how to paste into Outlook, Gmail, Apple Mail)

## Template QA Checklist

After building all templates, verify:

| Template | Check |
|----------|-------|
| PPTX assets | Gradients render at slide dimensions, overlays preserve source image quality, motif tiles are seamless |
| DOCX Report | Cover page, TOC links work, heading styles correct, callout boxes render |
| Letterhead | Header/footer balanced, recipient block aligned, signature position correct |
| Business Cards | All 20 concepts render in review, top 10 promoted concepts export in EU/US formats, interactive board works (click-to-select, counter, clipboard), print-safe sizing holds |
| Email Signature | All 12 variants render, fragment files remain table-only and inline-style only, links correct, compact heights hold |

Convert DOCX to images for visual inspection. Fix issues before presenting.

## Output Directory Convention

Templates are organized by format in subdirectories:

```
templates/
├── docx/
│   ├── BRAND-Report-Template.docx
│   └── BRAND-Letterhead.docx
├── print/
│   └── cards/
├── pdf/
│   └── cards/
└── html/
    ├── brand-business-cards.html
    ├── brand-email-signature.html
    └── signatures/
```

When promoting to client-data, rename to canonical names in format subdirectories:
- `BRAND-Report-Template.docx` → `templates/docx/default.docx`
- `BRAND-Letterhead.docx` → `templates/docx/letterhead.docx`
- `brand-business-cards.html` → `templates/html/business-cards.html`
- `brand-email-signature.html` → `templates/html/email-signature.html`
- `signature-variant.fragment.html` → `templates/html/signatures/<variant>.fragment.html`
- `brand-card-*.svg` → `templates/print/cards/`
- `brand-card-*.pdf` → `templates/pdf/cards/`
