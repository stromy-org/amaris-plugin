# Amaris Consulting — Brand Guidelines

> Synthesized from amaris.com public brand surface · 2026-05-09

---

## Identity

**Name:** Amaris Consulting  
**Short name:** Amaris  
**Tagline:** *Make it happen, together.*  
**Mission:** Helping businesses grow is the reason we wake up every day  
**Parent group:** Mantu  
**Domain:** amaris.com · Twitter: @amaris

---

## Values

**Pioneer Spirit · Trust · Care · Performance · Independence**

---

## Colour Palette

### Primary colours

| Role | Hex | Name |
|------|-----|------|
| Primary | `#272674` | Navy Indigo |
| Secondary | `#f5e2da` | Warm Peach |
| Accent / Digital | `#4182ff` | Cornflower Blue |
| Body text | `#494951` | Dark Charcoal |
| Background | `#ffffff` | White |

### Sector accent colours

| Sector | Hex |
|--------|-----|
| Life Sciences | `#7ddeb8` |
| Engineering | `#b880ff` |
| Telecom | `#ffdd77` |
| IS & Digital | `#4182ff` |

### Gradient

**Midnight:** `linear-gradient(135deg, #020381 0%, #2874fc 100%)` — used on hero/slide backgrounds.

---

## Typography

**Primary typeface: Century Gothic** (system font — macOS default, Microsoft Office default on Windows)

| Weight | Use |
|--------|-----|
| Regular 400 | Body text, captions, sub-headings |
| Bold 700 | Headings, slide titles, CTAs, display/hero text |

Century Gothic ships with two weights only (Regular and Bold). Do not specify
Medium 500, Semibold 600, or other intermediate weights — they will silently
fall back to Regular in PowerPoint, Word, and most browsers. Use Bold (700)
wherever you need emphasis above body weight.

**Century Gothic cannot be embedded — Jost is the embeddable substitute.**
Century Gothic is a licensed system/Office font: present on the client's own
machines, but **not redistributable**, so server-side renders cannot embed it.
Since 2026-07-01 the embed stand-in is **Jost** (OFL, a Futura revival chosen as
a close geometric match), shipped at `fonts/ttf/Jost-*.ttf` and
`fonts/web/Jost-*.woff2`.

Which face a reader actually sees:

| Surface | Face |
|---|---|
| Client editing on a licensed machine | Century Gothic (resolves by name) |
| Server-rendered PPTX / DOCX / PDF (`render_*`) | Jost, embedded — self-contained everywhere |
| Web | Jost woff2 |

So a server-rendered deliverable is set in Jost, not Century Gothic. Say so when
the distinction matters. (Source of record: `charter.fonts.note` +
`charter.fonts.fontFiles`.)

CSS fallback stack: `'Century Gothic', 'CenturyGothic', 'Avenir Next', 'Futura', 'Apple SD Gothic Neo', sans-serif`.

**Secondary typeface: Quicksand** — used in select web Elementor blocks only; not a primary brand font for slides, docs, or PDFs.

**Legacy:** General Sans files in `fonts/web/` remain as historical assets but are no longer the brand font. New deliverables use Century Gothic.

**Base size:** 18px body · 48px h1 · 36px h2

---

## Logo

**Primary wordmark:** `logos/logo.svg`  
Uses `currentColor` stroke — automatically white on dark backgrounds, navy on light.

**On dark or image backgrounds, prefer `logos/logo-white.svg`.** `logo.svg` is
thin line-art and can read incomplete at large or video scale, so the solid
white wordmark is the correct mark for titles and covers over dark surfaces —
the `currentColor` trick is not a substitute for it. (Source of record:
`charter.logo.notes`.)

**Blue variant:** `logos/logo-blue.svg`  
Full-colour wordmark with "CONSULTING" tagline in fixed brand colours. Use for print and situations where CSS context is unavailable.

**PNG raster:** `logos/logo-black.png`  
For Microsoft Office, PDF, and tools that cannot render SVG.

**Minimum clear space:** 1× the wordmark height on all sides.

**Do not:** recolour, distort, add effects, or crop the logo. The SVG version scales freely — always prefer vector.

---

## Imagery

**None. Photography is removed from this brand's render path** (client instruction,
2026-09-22).

The styling source of truth contains no photography in any slide that works — the
two slides carrying stock photos and the two carrying stock persona clip-art are
visibly its weakest pages, and they are what prompted this revision. The previous
library of 11 scraped amaris.com photos, and the navy-scrim overlays derived from
them, have been retired; every entry survives in `images/manifest.json` under
`retired` with its original `source_url` and sha256, so the set is recoverable.

Reinstate only with imagery the client has chosen themselves.

Where a deliverable needs a visual, use — in this order:

1. a **diagram** (`render_diagram`) or a **chart** (`format-chart`), brand-themed;
2. an **icon tile** row (circular chip, hairline ring, one accent per icon);
3. a **tinted panel** carrying structured text;
4. the **circle field** alone, with generous whitespace.

An empty, well-set slide is on-brand. A stock photograph is not.

---

## Motif system

**Definition of record: `presentation-grammar.md`**, measured from
`.build-history/source-Amaris-Nespresso-Academy-styling-SoT.pptx` — the deck Amaris
themselves nominated as what "good" looks like. That file carries the full
composite set, the type scale and the grid; this is the summary.

The signature is the **circle field**: 2–3 soft accent circles per slide, one large
bleeding off a corner, always behind content.

| Mark | What it is | Where | Tokens / asset |
|------|------------|-------|----------------|
| **Circle field** | 2–3 circles; one large (2.4–7.0 in) bleeding off a corner at 15–25 %, one opposite, optionally one small (0.8–1.1 in) inside at 35–45 % | all surfaces | `--circle-1..4`, `--circle-opacity-{large,small}`; `assets/svg/circle-field{,-dark}.svg` (`.circle-field`) |
| **Hairline keyline** | 0.25 pt indigo outline around every card and panel — 89 occurrences in the source | all | `--keyline`, `--keyline-weight` |
| **Accent cap** | 4–6 pt solid accent bar across a card's top edge | content | `--accent-cap-height` |
| **Left rule** | 5–6 pt accent bar on an agenda row's left edge | content | `--left-rule-width` |
| **Ghost wordmark** | Oversized outline AMARIS bleeding off an edge at ≤10 % | content | `--motif-ghost-opacity`; `assets/svg/motif-wordmark-ghost.svg` |
| **Ambient arc** | Hairline arc, retained from the orbit motif but **demoted** to ambient | content | `--motif-line-weight`; `assets/svg/motif-orbit.svg` |

**Caps:** ≤3 circles per slide · one accent per circle, never repeated on a slide ·
≤2 ambient arcs · ghost wordmark ≤10 % opacity · circles always behind content,
never a container, never carrying text.

**Semantic vs. positional accent split.** The default in a deck is **positional
rotation** — item 01 blue, 02 purple, 03 mint, 04 yellow, carrying no sector claim.
The **sector mapping** (life-sciences mint, engineering purple, telecom yellow,
digital blue) applies only when the content is actually about those sectors.
Never both modes on one slide.

**Canvas.** Dark `--canvas-navy` **#002060** (cover, section divider, closing) —
this is *not* the brand indigo. Light `--canvas-light`, a vertical #ffffff → #fbf5f2
gradient, never flat white. Component gradients are retired: the light canvas is the
only gradient in the system.

**Ink vs. canvas.** **#272674** remains the canonical brand primary (confirmed
against live amaris.com); the source deck's **#272774** is a deck-internal rounding.
Either way it is **ink and keyline**, never a slide field.

### Retired 2026-09-22

Hero photography with a navy scrim · the 6 px blush top rule · the monospace footer
bar · "accents are never large colour blocks" (contradicted — solid accent header
bars and caps are core) · orbit arcs as the *primary* motif (demoted to ambient).

---

## Business lines

Life Sciences · IS & Digital · Telecom · Engineering · Centers of Excellence

## Industries served

Consumer & Retail · Energy, Resources & Utilities · Financial Services · Healthcare · Telecommunications, Media & Entertainment · Transportation & Defense

---

## Key statistics

7,600+ consultants · 60+ countries · 5 continents · 1,000+ clients

---

*Source: amaris.com — brand-intelligence run 2026-05-09. Assets are Tier 4–6 (high confidence) for colours and typography; Tier 8 (medium confidence, user-approved) for photography.*
