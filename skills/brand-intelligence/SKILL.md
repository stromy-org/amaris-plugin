---
name: brand-intelligence
description: "Scrape and stage a brand kit for a third-party company — press kits, web manifest, computed CSS, head metadata, logos — provenance-tagged for brand-artifact-builder. Use when researching a brand we don't maintain in client-data; use brand-builder to create or brand-artifact-builder to package an existing one."
---

# Brand Intelligence

Source a minimum-viable, **trustworthy** brand kit for a third-party company by
inspecting their own published surface. The output is a verified bundle that
`brand-artifact-builder` can package into reusable assets.

## Pipeline Position

```
brand-builder           — invents a brand from scratch (producer-tier clients)
brand-intelligence      — discovers an existing brand from public sources (this skill)
brand-artifact-builder  — packages a fixed brand into reusable production assets
```

This skill is the upstream of `brand-artifact-builder`, not a replacement. It
stops at "verified bundle staged in `_build/`". Promotion to `client-data/` and
production-asset generation are separate steps.

## Boundary

Use this skill when:

- the user asks for a brand kit for a company **not already in `client-data/`**
- a client charter exists but is empty/stub and needs to be populated from public sources
- the user explicitly wants to scrape, research, extract, or "look up" a brand

Do **not** use this skill when:

- the brand is already approved and packaged in `client-data/<slug>/` — use
  `brand-artifact-builder`
- the user wants a *new* identity invented (logo design, palette choice, naming)
  — use `brand-builder`
- the goal is competitor research, market analysis, or brand strategy critique
  — out of scope; flag and stop

## Source Trust Hierarchy

Sources are tried in priority order. **Higher tiers are trusted more and
allowed to populate `charter.json` with `confidence: high`.**

| Tier | Source | Provenance label | Default confidence |
|------|--------|-----------------|-------------------|
| 1 | Official press / brand kit page (`/press`, `/brand`, `/media-kit`, `/brand-assets`, `/about/brand`) | `press_kit` | high |
| 2 | Web app manifest (`/site.webmanifest`, `/manifest.json`) | `web_manifest` | high |
| 3 | HTML head — `apple-touch-icon`, `og:image`, `theme-color`, `<meta name=…>` | `html_head` | high |
| 4 | CSS custom properties on `:root` (real brand tokens) | `css_vars` | high |
| 5 | Computed styles on semantic elements (header, footer, primary CTA, h1) | `computed_style` | medium |
| 6 | Inline SVGs / `<img>` files referenced from header/footer of homepage | `dom_asset` | medium |
| 7 | Generic site scrape, sampled from arbitrary divs | `generic_scrape` | low — flagged for manual review |
| 8 | Brand photography scraped from image-rich pages (`/work`, `/about`, `/insights`) | `scraped_photo` | medium — requires user approval before use in deliverables |

Tier 7 results **must never** be promoted without explicit user approval. The
review board (Phase 5) shows the tier of every finding. Tier 8 photography is
always treated as **candidate only** — the review board is the mandatory approval
gate before any image enters `charter.images.catalog`.

## Workflow

### Phase 0 — Frame The Job

Before fetching anything:

1. Confirm target identity with the user
   - Brand slug (folder name in `client-data/clients/<slug>/`)
   - Canonical domain (the brand's *own* site, not a parent group's marketing page)
   - Disambiguate multi-brand parents (e.g. WPP owns Burson, Ogilvy, Hill+Knowlton — pick one)
2. Check for existing `client-data/clients/<slug>/charter.json`
   - If present and populated, ask whether this is a **refresh** (overwrite candidates flagged) or a **fill-gaps** run (only empty fields populated)
3. Decide pack scope (mirrors `brand-artifact-builder`): `tier-1 producer` vs `tier-2 output`
   - Most brand-intelligence runs target tier-2: just charter + logos is enough

Stop and clarify rather than guessing on any of these.

### Phase 1 — Recon

Build the target URL list before any heavy fetching.

1. **Probe canonical brand pages** (Tier 1) — try each path on the canonical domain:
   ```
   /press
   /brand
   /brand-assets
   /brand-guidelines
   /media-kit
   /media
   /about/brand
   /press-kit
   /newsroom
   ```
   Use `WebFetch` with prompt "is this a brand assets / press kit page? if yes, list every downloadable logo or brand-asset URL"

2a. **Probe image-rich pages for varied assets** (Tier 8) — fetch in parallel alongside brand page probing.
   Goal: collect assets that serve **different downstream purposes** — not just hero photos, but also
   abstract/graphic images for dividers, simple pattern-like images for backgrounds, values/typographic
   cards for section slides, and decorative motifs. Variety matters more than quantity.

   Probe these pages in parallel:
   ```
   /work              /our-work          /case-studies      → bold editorial (cover role)
   /about             /about-us          /who-we-are        → aspirational (closing role)
   /insights          /thinking          /blog              → calmer/abstract (divider role)
   /people            /team              /leadership        → human/relatable (closing role)
   /careers                                                  → graphic/values cards, abstract BGs
   /expertise         /services          /solutions         → graphic/infographic (section role)
   ```

   Use `WebFetch` with prompt "List every image URL (img src, srcset) on this page — include editorial
   photos, abstract graphics, values cards, pattern tiles, SVG files, and any decorative imagery.
   Skip tiny icons (<100px) and logos. Return full URLs only."
   Record source page per URL — this becomes the `role_hint`.

2b. **Probe for design-system motifs** (Tier 6) — look for SVG groups and graphic shapes used as
   decorative elements in the site's hero/carousel/animation:
   - Probe the main CSS file (`/_next/static/css/*.css`, `/assets/css/*.css`) — extract all `url()` references
   - From homepage DOM sweep (Phase 2), check for SVG `<g>` elements in hero/banner sections that are
     clearly decorative shapes (not logos or icons)
   - Check for SVG files referenced from `img` tags or CSS in `/assets/` CDN with names like
     `Group-*.svg`, `Shape-*.svg`, `Pattern-*.svg`, `Motif-*.svg`
   - Download any found and classify as `motif-shape` bucket — these do **not** require user approval
     since they are pure brand-derived geometry, but show them in the review board

   Record which page each URL came from — this becomes the `role_hint` (e.g. `/work` → `section`, `/about` → `closing`).
2. **Fetch web manifest** (Tier 2) — `GET /site.webmanifest`, `/manifest.json`, and any `<link rel="manifest">` discovered in the homepage head
3. **Parse homepage `<head>`** (Tier 3) — pull favicons, apple-touch-icons, OG image, theme-color, twitter:image
4. Save the recon manifest to `_build/brand-intelligence/<slug>/recon.json`:
   ```json
   {
     "domain": "...",
     "fetched_at": "ISO8601",
     "sources": [
       {"tier": 1, "url": "...", "kind": "press_kit_page", "asset_urls": [...]},
       {"tier": 2, "url": "...", "kind": "web_manifest", "icons": [...]},
       {"tier": 3, "url": "...", "kind": "html_head", "fields": {...}}
     ]
   }
   ```

### Phase 2 — Inspect (Playwright)

This is where dev-tools-level inspection happens. Use the `playwright` MCP, not
HTML scraping, for everything in this phase.

1. **Open homepage** (`browser_navigate`)
2. **Take a snapshot** (`browser_snapshot`) — keep for the review board
3. **Dump CSS custom properties** (Tier 4) — `browser_evaluate`:
   ```js
   () => {
     const root = getComputedStyle(document.documentElement);
     const props = {};
     for (let i = 0; i < root.length; i++) {
       const name = root[i];
       if (name.startsWith('--')) props[name] = root.getPropertyValue(name).trim();
     }
     return props;
   }
   ```
4. **Sample computed styles on semantic elements** (Tier 5) — `browser_evaluate`:
   ```js
   () => {
     const pick = (sel) => {
       const el = document.querySelector(sel);
       if (!el) return null;
       const cs = getComputedStyle(el);
       return {
         color: cs.color, background: cs.backgroundColor,
         font: cs.fontFamily, weight: cs.fontWeight, size: cs.fontSize,
       };
     };
     return {
       body: pick('body'), h1: pick('h1'), h2: pick('h2'),
       header: pick('header'), footer: pick('footer'),
       cta: pick('a.button, button.primary, .cta, [class*=button]'),
     };
   }
   ```
5. **Enumerate logo candidates** (Tier 6) — `browser_evaluate`:
   ```js
   () => {
     const candidates = [];
     document.querySelectorAll('header img, header svg, footer img, footer svg, a[href="/"] img, a[href="/"] svg, [class*=logo] img, [class*=logo] svg, img[alt*=logo i], img[src*=logo i]').forEach(el => {
       candidates.push({
         tag: el.tagName.toLowerCase(),
         src: el.src || el.getAttribute('href') || null,
         alt: el.alt || null,
         outerHTML: el.tagName === 'SVG' ? el.outerHTML.slice(0, 4000) : null,
         rect: el.getBoundingClientRect().toJSON(),
         parent_class: el.parentElement?.className || null,
       });
     });
     return candidates;
   }
   ```
6. **Photography sweep** (Tier 8) — after visiting each image-rich page found in Phase 1 step 2a, run this sweep on each:
   ```js
   () => {
     const imgs = [];
     document.querySelectorAll('img, [style*="background-image"]').forEach(el => {
       const src = el.src || el.currentSrc ||
         (getComputedStyle(el).backgroundImage.match(/url\(["']?(.+?)["']?\)/) || [])[1];
       if (!src || src.startsWith('data:') || src.includes('logo') || src.includes('icon')) return;
       const rect = el.getBoundingClientRect();
       if (rect.width * rect.height < 40000) return; // skip < ~200×200px
       imgs.push({
         src, width: Math.round(rect.width), height: Math.round(rect.height),
         alt: el.alt || null,
         orientation: rect.width > rect.height * 1.3 ? 'landscape' : rect.height > rect.width * 1.3 ? 'portrait' : 'square',
         above_fold: rect.top < window.innerHeight,
       });
     });
     return imgs;
   }
   ```
   Collect results tagged with source page URL. Run on homepage + any image-rich pages that returned results in Phase 1 step 2a. Cap at 20 candidate images total — prefer largest area, above-fold first.

7. **Repeat steps 3–5 for the press page** if discovered in Phase 1. Press pages
   often have higher-resolution logos and explicit color tokens.
8. **Take screenshots** (`browser_take_screenshot`) of homepage, header crop,
   footer crop, press page — saved as verification artifacts.

Save raw inspection output to `_build/brand-intelligence/<slug>/inspect/`.

### Phase 3 — Download & Classify

1. For every URL collected in Phases 1–2, download the asset (Bash + `curl -sSLo`)
   to `_build/brand-intelligence/<slug>/raw/<original-filename>`
2. Preserve original filenames — no renaming yet
3. Classify each asset by inspection + heuristics:

   | Bucket | Heuristic |
   |--------|-----------|
   | `logo-primary` | SVG or transparent PNG, found in homepage header, larger than 60px in either dimension, alt/filename mentions "logo" |
   | `logo-mark` | Square aspect ratio, ≤ 256px, found in favicon set or apple-touch-icon |
   | `favicon` | From `<link rel="icon">` or `/favicon.ico` |
   | `app-icon` | apple-touch-icon, or PNG referenced in webmanifest `icons[]` |
   | `og-image` | From `og:image` or `twitter:image` |
   | `photo-cover` | Large landscape image (≥ 800×400px), above fold or from `/work`, `/case-studies` — bold, full-bleed feel |
   | `photo-divider` | Large image from `/insights`, `/blog`, abstract/textural, or calmer feel — section break use |
   | `photo-closing` | Large image from `/about`, `/people`, `/team`, `/careers` — aspirational, human |
   | `photo-section` | Large image from interior content, not fitting above roles — inset/supporting use |
   | `graphic-values` | Square or tall graphic cards (PNG/JPG) from `/careers` or about pages — typographic/brand values, bold colors — section slide use |
   | `graphic-abstract` | Abstract, non-photographic PNG/JPG imagery (careers animation, brand concept visuals) — background/texture use |
   | `motif-shape` | SVG decorative geometry from site design system (Group-*.svg, Shape-*.svg, pattern tiles) — slide background motif use. Does NOT require user photo-approval; shown in review board as informational |
   | `pattern` | Tiled or repeating asset from CSS background-image (best-effort) |
   | `unknown` | Anything else — flagged for manual review |

   Photography role-hint mapping from source page:

   | Source page | Default role |
   |-------------|-------------|
   | `/` (homepage, above fold) | `photo-cover` |
   | `/work`, `/case-studies`, `/our-work` | `photo-cover` or `photo-section` |
   | `/insights`, `/thinking`, `/blog` | `photo-divider` |
   | `/about`, `/people`, `/team`, `/leadership`, `/careers` | `photo-closing` |
   | Other interior pages | `photo-section` |

4. Compute a content hash for each file (Bash: `shasum -a 256`) and dedupe.
   Keep both copies if hashes differ but classification matches — they may be
   variants (light/dark, etc.).

5. Save the classification table to `_build/brand-intelligence/<slug>/assets.json`:
   ```json
   {
     "assets": [
       {
         "path": "raw/burson-logo.svg",
         "bucket": "logo-primary",
         "source_tier": 1,
         "source_url": "https://...",
         "fetched_at": "ISO8601",
         "sha256": "...",
         "confidence": "high",
         "notes": "..."
       }
     ]
   }
   ```

### Phase 4 — Synthesize Charter Candidate

Build a candidate `charter.json` from the highest-confidence sources available.

**Rules:**

- Each charter field carries a sibling `_provenance` entry: `{tier, source_url, method, confidence}`
- If multiple sources disagree, pick the highest-tier value and record the alternatives in `_provenance.alternatives[]`
- Never invent values. If a field has no source, leave it `null` and add to `gaps[]`
- For colors: prefer Tier 4 (CSS vars) over Tier 5 (computed styles). Drop any color that appears only on tracking/ad iframes
- For fonts: take the **first non-fallback** family in computed `fontFamily`. Record the full stack in provenance
- For typography sizes: do not extract; these are design decisions, not brand identity. Leave for `brand-builder` if needed
- **`charter.images` candidate** — if any `photo-*` assets were collected in Phase 3, synthesise a candidate block:
  ```json
  {
    "images": {
      "overlay": { "color": "primary", "opacity": 0.55 },
      "logoVariantOnImage": "white",
      "catalog": [
        {
          "file": "images/photo-cover-01.jpg",
          "roles": ["cover"],
          "mood": "bold",
          "orientation": "landscape",
          "source_url": "https://...",
          "source_page": "/work",
          "confidence": "medium"
        }
      ]
    }
  }
  ```
  Overlay color defaults to `primary`; opacity 0.55 (sufficient for text legibility without destroying the photo). Both are review-board items. `logoVariantOnImage` defaults to `"white"` when a white logo variant was found. If no photos were collected, omit the `images` block entirely and add to `gaps[]`.
- **`charter.presentation` candidate** — always include with brand-derived defaults:
  ```json
  {
    "presentation": {
      "aspectRatio": "16:9",
      "slideMargin": "40pt",
      "titleMargin": "60pt",
      "contentMargin": "40pt"
    }
  }
  ```

Write to `_build/brand-intelligence/<slug>/charter.candidate.json` plus a sibling
`charter.candidate.provenance.json` if provenance bloats the main file.

### Phase 5 — Verify (Mandatory Human Review)

Build an HTML review board at `_build/brand-intelligence/<slug>/review.html`
that the user opens before any promotion. The board must show:

- **Header**: target brand, domain, run timestamp, source-tier counts
- **Logo candidates** — every classified `logo-*` asset rendered side by side, on
  both light and dark backgrounds, with source URL + confidence label below
- **Palette** — every extracted color as a swatch with source-tier badge, source
  URL on hover, hex/rgb values
- **Typography** — font family samples (heading + body) with the source element
  noted
- **Page screenshots** — homepage + press page + header crop + footer crop, as
  visual confirmation that the source is what we think it is
- **Photography candidates** — every `photo-*` asset rendered as a thumbnail strip,
  each with: role badge (cover/divider/closing/section), source page, dimensions,
  orientation tag, and a side-by-side preview with the brand primary color overlaid
  at 55% opacity. This is the mandatory approval gate — no photo enters
  `charter.images.catalog` without explicit user sign-off here.
- **Charter diff** — if an existing `charter.json` exists in `client-data`, show
  the proposed patch as a diff (added/changed/unchanged); flag any field where
  the new candidate has lower confidence than the existing value
- **Gaps** — explicit list of fields that came back empty
- **Per-asset action** — checkbox UI mockup is fine; the actual approval happens
  conversationally with the user reading the board

After rendering, **stop** and present the user with:

```
Brand intelligence run complete for <slug>:
  Logo candidates:    N (M high-confidence)
  Palette colors:     N (tier breakdown: ...)
  Typography:         heading=<family>, body=<family>
  Gaps:               [list]
  Review board:       _build/brand-intelligence/<slug>/review.html

Open the review board, then tell me which assets to keep and we'll hand off to
brand-artifact-builder for packaging.
```

Do not proceed to Phase 6 without explicit per-asset approval.

### Phase 6 — Handoff to brand-artifact-builder

Once the user approves:

1. Stage the approved bundle at `_build/brand-intelligence/<slug>/approved/`
   - `charter.json` (provenance stripped or moved to a sidecar)
   - `logos/` (renamed to canonical names: `logo.svg`, `logo-white.svg`, `icon.svg`)
   - `images/` — approved photos, renamed to deterministic names:
     `photo-cover-01.jpg`, `photo-cover-02.jpg`, `photo-divider-01.jpg`, `photo-closing-01.jpg`, etc.
   - `manifest.json` — full provenance record for audit, including image source URLs and approval status
2. Print the handoff:
   ```
   Bundle ready at _build/brand-intelligence/<slug>/approved/.
   Next step: invoke brand-artifact-builder with:
     - source: _build/brand-intelligence/<slug>/approved/
     - target: client-data/clients/<slug>/
     - tier: <tier-2-output | tier-1-producer>
   ```
3. **Do not write to `client-data/`** from this skill. Promotion to canonical
   storage is `brand-artifact-builder`'s job — that skill owns the user
   confirmation gate for canonical writes.

## Output Rules

- All work happens under `_build/brand-intelligence/<slug>/` — never write
  outside this tree
- Raw downloaded assets keep their original filenames
- Every output carries provenance — the bundle must be auditable months later
- The skill never modifies `client-data/`, plugins, or any consumer repo
- If a phase fails (no press kit, JS-rendered SPA blocks playwright, etc.),
  record the failure in `recon.json` and continue — partial bundles are fine
  as long as the gaps are explicit

## Failure Modes

See `references/failure-modes.md` for detailed handling. Quick summary:

| Symptom | Handling |
|---------|----------|
| Site is JS-rendered SPA | Playwright handles it (already a real browser) |
| Logo only available baked into a hero PNG | Flag bucket as `unknown`, do not claim it as a logo |
| Multiple subsidiary brands on one corporate site | Stop in Phase 0 — require explicit `--brand` slug |
| Robots.txt disallows scraping | Stop. Brand assets are public but respecting robots.txt is non-negotiable |
| Press page is gated / requires login | Record the gate in `recon.json`, downgrade to Tier 4–6 sources |
| Site colors come from a CSS-in-JS framework with no `:root` vars | Fall back to Tier 5 computed styles, mark all colors as medium confidence |
| Brand has a public Brandfetch / Brand.dev entry | Note it in `recon.json` and ask user whether to add a paid API source as Tier 0 in a future run |

## Provenance Contract

See `references/provenance-schema.md` for the full schema. Every persisted
field, asset, and decision must be traceable to:

- a source URL
- a fetch timestamp
- an extraction method (one of the seven tier labels)
- a confidence rating

This is what makes the difference between brand intelligence and scraping:
**every claim is auditable**.

## Reference

- `references/extraction-methods.md` — Playwright JS snippets, fetch patterns, classification heuristics
- `references/provenance-schema.md` — provenance field schema and confidence rubric
- `references/failure-modes.md` — recovery for common scrape failures
- `references/handoff-contract.md` — exact bundle shape handed to `brand-artifact-builder`
