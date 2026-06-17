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

No font files need to be embedded or distributed: Century Gothic is preinstalled
on macOS and on Windows machines with any Office install. PDFs and PPTX files
created with Century Gothic render identically on the presenter's machine
without any setup.

CSS fallback stack: `'Century Gothic', 'CenturyGothic', 'Avenir Next', 'Futura', 'Apple SD Gothic Neo', sans-serif`.

**Secondary typeface: Quicksand** — used in select web Elementor blocks only; not a primary brand font for slides, docs, or PDFs.

**Legacy:** General Sans files in `fonts/web/` remain as historical assets but are no longer the brand font. New deliverables use Century Gothic.

**Base size:** 18px body · 48px h1 · 36px h2

---

## Logo

**Primary wordmark:** `logos/logo.svg`  
Uses `currentColor` stroke — automatically white on dark backgrounds, navy on light. No separate white logo file is needed.

**Blue variant:** `logos/logo-blue.svg`  
Full-colour wordmark with "CONSULTING" tagline in fixed brand colours. Use for print and situations where CSS context is unavailable.

**PNG raster:** `logos/logo-black.png`  
For Microsoft Office, PDF, and tools that cannot render SVG.

**Minimum clear space:** 1× the wordmark height on all sides.

**Do not:** recolour, distort, add effects, or crop the logo. The SVG version scales freely — always prefer vector.

---

## Imagery

11 approved photos across four roles:

| Role | Files | Use |
|------|-------|-----|
| Cover | `photo-cover-01` – `05` | Hero/title slide backgrounds, full-bleed |
| Closing | `photo-closing-01` | Final slide, about-us contexts |
| Divider | `photo-divider-01` | Section break slides |
| Section | `photo-section-01` – `03` | Interior content, inset use |

**Overlay:** Apply `#272674` at 55% opacity over any photo before placing white text. Pre-composited overlays available in `pptx-assets/overlays/`.

**Logo on image:** Use the white (inverted) logo variant.

---

## Motif system

The recovered signature layer from the official PowerPoint master — the literal
visual of the tagline *"Your stepping stone."* It is a **grammar**, not a fixed
template: composed freshly per deck within the caps below, never reproducing the
source layout. Two motif families coexist with bounded discipline (no third
family):

| Mark | What it is | Where | Tokens / asset |
|------|------------|-------|----------------|
| **Orbit arc** | Hairline arc on a large off-canvas radius, sweeping across the slide | cover, section-divider, closing | `--motif-line-weight`, `--motif-arc-color-{dark,light}`; `assets/svg/motif-orbit.svg` (`.orbit-layer`) |
| **Stepping-stone dot** | Solid accent-colour circle sitting *on* an arc, soft glow | cover, section-divider | `--orbit-dot-1..4`, `--orbit-dot-glow`; `assets/svg/motif-stepping-stones.svg` (`.stepping-stone`) |
| **Ghost wordmark** | Oversized outline AMARIS bleeding off the right edge | content | `--motif-ghost-opacity`; `assets/svg/motif-wordmark-ghost.svg` (`.ghost-wordmark`) |
| **Ring bullet** | Outline ring with navy numeral for numbered lists | content, DOCX | `assets/svg/bullet-ring.svg` (`.ring-bullet`) |
| **Blush rule** | The original thin blush/peach top rule | all | `--color-secondary` (`.accent-rule`) |

**Caps (enforced as the bounded-ornament rule):** ≤2 orbit arcs + ≤3 stepping-stone
dots per slide; ghost wordmark ≤10 % opacity; dots ≤0.8 in diameter.

**Semantic vs. decorative accent split.** Sector accent colours keep their
semantic meaning **only in data/UI tag contexts** (life-sciences green,
engineering purple, telecom yellow, digital blue). The stepping-stone dots use
the *same* palette **decoratively** — rotating, non-semantic — and are exempt
from the "accent = tags only" rule. They are never a background field.

**Canvas gradients.** Dark canvas `--gradient-dark` (#272674 → #000); light canvas
`--gradient-canvas-light` (#fff → #f5e2da). Two extra source-deck accents are
available for motif art: warm `--accent-warm` (#FBAE40) and coral `--accent-coral`
(#F26B43).

The canonical brand-primary is **#272674** (confirmed against live amaris.com).
The source PPTX's `#272774` is a deck-internal rounding, not the canonical value.

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
