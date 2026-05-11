---
name: brand-artifact-builder
description: "Package an already-approved brand into production assets — logos, color/token packs, imagery crops, channel-specific exports, manifests. Use when the identity is fixed; use brand-builder to create it or brand-intelligence to research a third-party brand."
---

# Brand Artifact Builder

Turn an existing brand into reusable production assets for downstream builds.
This skill assumes the brand already exists in static form: `charter.json`,
`profile.json`, logos, guidelines, imagery, or equivalent approved source files.

## Boundary

Use this skill when the user wants to:

- extract website-ready brand assets from an existing brand
- normalize or export logo variants
- prepare favicons, social avatars, lockups, or app icons
- build imagery packs for PPTX, websites, PDFs, or email templates
- generate a PPTX asset pack (gradients, photo overlays, motif tiles) for the
  pptx skill to consume instead of runtime Sharp compositing
- package a brand for downstream skills without redefining the identity
- generate manifests, inventories, and preview boards for reusable brand assets

Do not use this skill when:

- the user needs to define, refresh, or rebrand the identity itself
- the brand is not fixed yet and requires choices on archetype, logo direction,
  colors, fonts, or messaging
- the task is to scrape or infer a company's brand from the public web with no
  trustworthy local source kit

Those are separate jobs:

- **Brand definition / refresh** belongs to `brand-builder`
- **Brand research / scraping** belongs to `brand-intelligence` (which produces
  a verified bundle this skill can then package)

## Inputs

Prefer canonical brand sources in this order:

1. `client-data/clients/<slug>/charter.json`
2. `client-data/clients/<slug>/profile.json`
3. `client-data/clients/<slug>/logos/`
4. `client-data/clients/<slug>/guidelines.md` or brand-book HTML
5. approved imagery or templates already living under the brand directory

If a consumer repo only has a local brand copy such as
`companies/<slug>/`, you may work there, but keep the folder logic and
file naming aligned with the canonical `client-data` structure.

Minimum viable inputs:

- brand slug or brand directory
- at least one trustworthy logo or wordmark source
- an approved palette source (`charter.json`, guidelines, or explicit user input)
- target surfaces to build for (`website`, `pptx`, `docx`, `pdf`, `email`,
  `social`, etc.)

If the brand inputs are incomplete, do not invent a new identity. Build the
partial pack that can be trusted, record the gaps, and surface the missing inputs
explicitly.

## Workflow

### 1. Audit The Source Brand

Before producing anything, inventory what is already present:

- canonical logos and variants
- approved colors and typography tokens
- imagery sources and usage rights/provenance
- motifs, patterns, dividers, icons, and texture assets
- templates or downstream consumers that already depend on specific paths

Classify each source as:

- **Canonical** — approved source of truth
- **Derived** — reusable asset derived from canonical inputs
- **Inferred** — best-effort fallback; must be labeled clearly
- **Missing** — required for the requested pack, not yet available

**Auto-detect wiring gaps** — after reading `charter.json`, flag any of these automatically:

| Check | Gap | Auto-fix |
|-------|-----|----------|
| `logos/logo-white.svg` exists but `charter.logo.white` absent | Logo white variant not wired | Add `logo.white` in Step 3 |
| `logos/logo-black.png` exists but `charter.logo.png` absent | Raster fallback not wired (DOCX/PDF need PNG) | Add `logo.png` in Step 3 |
| `charter.logo.primary` ends in `.svg` but no `charter.logo.png` | DOCX/PDF will fail to insert logo | Add `logo.png` in Step 3 |
| `charter.images.logoVariantOnImage` absent but white logo exists | Image slides will use wrong logo | Add field in Step 3 |
| `charter.presentation` absent | PPTX uses hardcoded margins | Add defaults in Step 3 |
| `tokens.css` absent | Website consumer missing token file | Generate in Step 3 |
| `images/` absent but photos present in approved bundle | No image catalog | Build catalog in Step 3 |

Report all detected gaps before building. Do not silently skip them.

If the gap is a brand-definition problem rather than an asset-production problem,
stop and say so plainly instead of silently inventing the brand.

### 2. Define The Pack Scope

Translate the user request into a concrete artifact list. Examples:

- **Website pack** — logo exports, favicon set, hero/background imagery, social
  share image base, token file, preview board
- **PPTX pack** — pre-rendered gradients (branded color transitions at slide
  dimensions), photo overlays (brand-tinted composites for cover/divider/closing
  roles), motif/pattern tiles, light/dark logo variants, presentation-safe color
  tokens. Assets promote to `pptx-assets/` in `client-data` and are referenced
  via the `pptxAssets` section of `charter.json`. The pptx skill consumes these
  directly, falling back to runtime Sharp compositing when unavailable.
- **Document pack** — document-safe logos, header/footer assets, monochrome marks,
  print-safe imagery, heading/token references
- **Social pack** — avatar, banner, post-safe crops, background textures, icon mark

Only build the requested surfaces plus anything clearly required to make them
usable. Do not turn every request into a full brand rebuild.

Read `references/output-contract.md` before writing stable outputs.
Read `references/downstream-handoffs.md` before updating downstream-facing paths or
instructions.

### 3. Build Reusable Assets

#### Logos

- Normalize filenames and variants without replacing the original source files
- Prefer SVG for canonical vector assets; PNG only as a fallback/export
- Produce surface-specific exports only when they are likely to be reused
- Never redraw or reinterpret the logo unless the user explicitly requests that

Typical outputs:

- primary / white / dark / icon variants
- favicon and app-icon exports
- horizontal / stacked / mark-only lockups
- transparent-background raster exports for downstream tools

#### Always-On: Logo Variant Wiring

Run this on every invocation before anything else. Read the existing `charter.json`,
then patch-merge any of these that are missing:

```json
{
  "logo": {
    "png":   "logos/logo-black.png",     // if file exists but field absent
    "white": "logos/logo-white.svg",     // if file exists but field absent
    "whitePng": "logos/logo-white.png",  // if PNG white variant exists
    "mark":  "logos/icon.svg"            // if file exists but field absent
  },
  "images": {
    "logoVariantOnImage": "white"        // if white logo exists
  }
}
```

Only add fields for files that actually exist on disk. Never invent variants.

#### Always-On: `tokens.css`

Generate from charter colors and fonts if `tokens.css` does not already exist:

```css
:root {
  --color-primary:        <charter.colors.primary>;
  --color-accent:         <charter.colors.accent>;
  --color-background:     <charter.colors.background>;
  --color-background-alt: <charter.colors.backgroundAlt>;
  --color-surface:        <charter.colors.surface>;
  --color-text:           <charter.colors.text>;
  --color-text-dark:      <charter.colors.textDark>;
  --color-text-on-accent: <charter.colors.textOnAccent>;
  --color-secondary:      <charter.colors.secondary>;
  --font-heading:         '<charter.fonts.heading.family>', <charter.fonts.heading.fallback>;
  --font-body:            '<charter.fonts.body.family>', <charter.fonts.body.fallback>;
  --font-mono:            '<charter.fonts.mono.family>', <charter.fonts.mono.fallback>;
}
```

If `tokens.css` exists, skip — do not overwrite without explicit user request.

#### Always-On: `charter.presentation` Defaults

If `charter.presentation` is absent, add sensible defaults (patch-merge only):

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

#### Color And Token Assets

- Pull colors from the approved charter/guidelines first
- Fill in missing implementation-level tokens only when they are already implied
  by the approved palette
- Keep implementation exports aligned with the brand; do not introduce new brand
  colors under the guise of utility tokens

Typical outputs:

- `tokens.css` (generated by Always-On above)
- JSON or TS token exports when the target repo expects them
- quick reference swatches in previews or manifests

#### Imagery, Catalog, And PPTX Assets

- **Audit the existing `images/` structure first.** brand-builder Phase 4 leaves a
  flat `images/` layout with a `manifest.json`. If that layout is already in place,
  extend it in place rather than restructuring. Only introduce surface-based
  subdirs when the user explicitly asks for reorganisation. Never move or rename
  files that downstream consumers already reference by path.
- Start from approved images (from brand-intelligence approved bundle or existing `images/`)
- Preserve aspect ratios and avoid destructive cropping of master sources

**If approved photos are present** (from brand-intelligence `approved/images/`):
1. Copy to `images/` in the brand directory, preserving the deterministic names
   (`photo-cover-01.jpg`, `photo-divider-01.jpg`, etc.)
2. Build or update `images/manifest.json`:
   ```json
   {
     "images": [
       { "file": "photo-cover-01.jpg", "roles": ["cover"], "mood": "bold",
         "orientation": "landscape", "source_url": "...", "confidence": "medium" }
     ]
   }
   ```
3. Wire `charter.images.catalog` entries to point at these paths (patch-merge)
4. Set `charter.images.overlay` and `charter.images.logoVariantOnImage` if absent

**PPTX assets — always build gradients, SVG motifs, and overlays when images exist:**

The pptx skill expects `pptxAssets.gradients`, `pptxAssets.motifs`, and `pptxAssets.overlays` as
pre-rendered PNGs. It cannot use raw SVGs or CSS at runtime — everything must be rasterised first.

**Gradients** (always buildable — no source images needed):
- Generate `pptx-assets/gradient-dark.png` (1920×1080) — primary → `#000000`
- Generate `pptx-assets/gradient-accent.png` (1920×1080) — accent → primary
- Use Python (Pillow linear gradient) or Node (Sharp compositing)

**SVG motifs** (always buildable when `motifs/` SVGs exist in the brand directory):
- The pptx skill explicitly requires motifs pre-rendered as PNG (line 215 of the pptx skill:
  "Pre-render ALL gradients, SVG motifs, and decorative elements as PNG via Sharp before use in HTML")
- For each `motifs/<name>.svg`, produce two renders:
  - `pptx-assets/motifs/<name>-on-dark.png` — 1920×1080, SVG scaled to ~700px, centred bottom-right,
    on `charter.colors.background` fill, SVG at **12% opacity**
  - `pptx-assets/motifs/<name>-on-light.png` — same but on `charter.colors.backgroundAlt` fill
- Use Python + cairosvg + Pillow, or Node + Sharp (sharp can render SVG via `sharp(Buffer.from(svgString))`)
- Approach with Pillow + cairosvg:
  ```python
  import cairosvg, io
  from PIL import Image
  # Render SVG to PNG at target size
  svg_png = cairosvg.svg2png(url=svg_path, output_width=700, output_height=700)
  motif = Image.open(io.BytesIO(svg_png)).convert("RGBA")
  # Apply opacity
  r,g,b,a = motif.split(); a = a.point(lambda x: int(x*0.12)); motif = Image.merge("RGBA",[r,g,b,a])
  # Composite onto brand background
  bg = Image.new("RGBA", (1920, 1080), bg_color)
  bg.paste(motif, (1920-750, 1080-750), motif)
  bg.convert("RGB").save(output_path, "PNG")
  ```
- If cairosvg is unavailable, fall back to Node: `npx sharp-cli` or a small Node script with `sharp`

**Photo overlays** (only when `images/` catalog exists):
- For each catalog image, composite `charter.images.overlay.color` at `charter.images.overlay.opacity`
  using Sharp: `sharp(imagePath).composite([{input: overlayBuffer, blend: 'over'}])`
- Output to `pptx-assets/overlays/<filename>-overlay.jpg`
- Wire into `charter.pptxAssets.overlays`

Example `charter.pptxAssets` patch after build:
```json
{
  "pptxAssets": {
    "gradients": {
      "dark": "pptx-assets/gradient-dark.png",
      "accent": "pptx-assets/gradient-accent.png"
    },
    "motifs": {
      "globe-on-dark":   "pptx-assets/motifs/globe-on-dark.png",
      "diamond-on-dark": "pptx-assets/motifs/diamond-on-dark.png",
      "globe-on-light":  "pptx-assets/motifs/globe-on-light.png"
    },
    "overlays": {
      "cover-01": "pptx-assets/overlays/photo-cover-01-overlay.jpg"
    }
  }
}
```

Typical outputs summary:

- `images/photo-*.jpg` — brand photography catalog
- `images/manifest.json` — catalog with roles/moods
- `pptx-assets/gradient-*.png` — branded gradient backgrounds
- `pptx-assets/overlays/*.jpg` — pre-composited photo overlays
- website hero/background crops (when requested)
- texture tiles, divider assets (when patterns found)

#### Metadata And Manifests

Every meaningful asset pack should leave behind a machine-readable or at least
systematic inventory of what was produced and what is still missing.

Record:

- source path or source URL
- canonical vs derived vs inferred status
- target surfaces
- dimensions / background / format
- approval or confidence notes

### 4. Preview And QA

Before promoting outputs, verify:

- logos are not stretched, clipped, or accidentally rasterized
- transparent assets are actually transparent
- light/dark variants are tested on realistic backgrounds
- colors match the approved brand sources
- image crops preserve focal points and aspect ratio
- all referenced paths exist and are usable by downstream skills
- inferred or provisional assets are labeled as such

Use preview artifacts in `_build/brand-artifact-builder/` for contact sheets,
review boards, and inventories. These are review assets, not canonical brand data.
Downstream consumers must never depend on `_build/brand-artifact-builder/` at
runtime.

### 5. Stage, Confirm, Then Promote

Before writing anything to canonical brand locations, present a promotion
manifest to the user and wait for explicit confirmation.

**Staging step (mandatory):**

1. List every file that will be written or updated in canonical folders
2. For each `charter.json` change, show the exact patch as a diff or JSON fragment
3. Identify any existing canonical files that will be replaced or removed
4. Present the manifest clearly, e.g.:

```
Brand artifact pack ready to promote:
  Adding:    logos/exports/website/logo-primary-white.svg (new)
             logos/exports/app/favicon-32.png (new)
             images/processed/hero-01-website.jpg (new)
  Updating:  charter.json  →  +pptxAssets.gradients, +logo.exports.website
  Unchanged: logos/logo.svg, tokens.css, guidelines.md

Proceed? [y/n]
```

Only proceed with file writes after the user confirms.

**Promotion rules:**

- Prefer extending existing folders over inventing a parallel storage tree
- Keep source assets distinct from exports and processed derivatives
- If no canonical location is obvious yet, keep the output under `_build/` and
  note the schema gap rather than improvising a permanent structure
- Update `charter.json` only when you are wiring paths/tokens that already exist
  in the approved brand, not when making new strategic brand decisions
- Apply `charter.json` updates as a **patch merge** — write only the new or
  changed keys, never overwrite the whole file. This prevents clobbering fields
  written by brand-builder phases.

### 6. Post-Promotion Housekeeping

After the user confirms and files are promoted:

1. **Update `.build-history/BUILD_LOG.md`** — if the file exists, append a dated
   entry under a new `## Brand Artifact Builder` section (or create one if absent).
   Record: what pack was built, which surfaces were targeted, which files were
   promoted, and any inferred or provisional assets that need follow-up. If no
   build log exists, note the gap but do not block the promotion.

2. **Verify `charter.json` consistency** — after patching, confirm that every path
   referenced in `charter.json` actually exists on disk. Remove or mark `TODO` any
   stale references left by previous runs.

3. **Clean `_build/brand-artifact-builder/`** — after a successful promotion, ask
   the user if they want to delete review artifacts from `_build/brand-artifact-builder/`.
   Do not auto-delete without confirmation.

## Output Rules

- Stable assets belong in the brand directory
- Preview artifacts belong in `_build/brand-artifact-builder/`
- Never overwrite or delete the only source logo/image to make room for an export
- Preserve a clear distinction between source, processed, and channel-specific assets
- Prefer deterministic filenames over creative naming
- If a downstream skill already expects a path pattern, keep compatibility unless
  the user explicitly wants a migration
- Never write the full `charter.json` — always read it first, then patch-merge
  only the new or changed keys

## Handoff Contract

This skill sits between brand definition and final deliverable generation:

- `brand-builder` establishes the brand system
- `brand-artifact-builder` turns that fixed system into reusable asset packs
- `website-builder`, PPTX, DOCX, PDF, and other format/domain skills consume those
  assets to build specific outputs

Hard rule:

- `_build/brand-artifact-builder/` is review-only and must never become a runtime
  dependency for websites, templates, plugins, or other downstream consumers

If the user only needs one specific deliverable and no reusable pack, the relevant
format skill may be sufficient on its own. Use this skill when packaging the brand
once will simplify repeated downstream work.

## Reference

- `references/output-contract.md` — stable-vs-preview storage rules, pack matrix,
  and manifest expectations
- `references/downstream-handoffs.md` — consumer audit for website, presentation,
  document, and plugin workflows
