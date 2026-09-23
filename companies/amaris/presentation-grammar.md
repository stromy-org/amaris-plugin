# Amaris — presentation grammar (styling source of truth)

**Definition of record for how an Amaris deliverable looks.** Recovered 2026-09-22 by
OOXML + visual extraction from the deck the client themselves nominated as the styling
source of truth:

| | |
|---|---|
| Source | `.build-history/source-Amaris-Nespresso-Academy-styling-SoT.pptx` |
| SHA-256 | `1ef791c6fb282e0259129645bda4bb8e0278b5725db6ae24f738148cbab1e4e9` |
| Supplied by | Amaris (an internal author), via William, 2026-09-22 |
| Extent | 23 slides · 34 layouts · 425 shapes · 217 text runs |
| Theme | `Gallery` · colour scheme `Custom 6` · font scheme `AC` |

This supersedes the presentation half of the grammar previously derived from
`.build-history/source-Amaris-Consulting-Template.pptx` (the corporate blank). That
file stays valid for the *logo lockups and the corporate palette*; it was never a
composed deck, so the composition rules inferred from it — hero photography, the blush
top rule, the monospace footer — were inference, not evidence. This deck is evidence:
it is finished work an Amaris author made and put forward as what "good" means.

Everything below is measured, not estimated. Where a number is a range, the range is
what the source actually contains.

---

## 1. Canvas

Slide is **13.333 × 7.5 in** (16:9, 1280 × 720 pt).

| canvas | value | used for |
|---|---|---|
| **Light** (default) | vertical gradient `#FFFFFF` 0% → `#FBF5F2` 100% | every content slide |
| **Dark** | flat `#002060` | cover, section dividers, closing |
| Accent | *none* | an accent never fills a whole slide |

Two corrections this forces on the earlier grammar:

- The dark canvas is **`#002060`**, a deeper and cooler navy than the brand indigo.
  `#272774`/`#272674` is the **ink and keyline** colour, not the canvas.
- The light canvas is never flat white. It is white falling to a *whisper* of blush —
  `#FBF5F2`, not the full `#F5E2DA`. (The master carries `#F5E2DA` at 35 % alpha, which
  resolves to the same value. LibreOffice drops that alpha and renders the blush at full
  strength; PowerPoint, and therefore the client, sees the subtle one.)

## 2. The circle field — the signature motif

The one thing that makes these slides read as this deck. **44 ellipses across 23 slides**,
and the construction never varies:

- **2–3 circles per slide.** Never four.
- **One large circle bleeding off a corner** — diameter 2.4–7.0 in, origin outside the
  frame (negative `x`/`y`, or `x + w` past 13.333).
- **One more, opposite corner, also bleeding.** Usually smaller.
- **Optionally one small circle fully inside**, 0.8–1.1 in, upper-right, at higher opacity —
  the "accent dot".
- **One accent per circle; never the same accent twice on a slide.**
- Strictly behind content. They are never a container and never carry text.

Opacity is where the restraint lives:

| role | diameter | opacity |
|---|---|---|
| large / bleeding | 2.4–7.0 in | **15–25 %** |
| small / inside | 0.8–1.1 in | **35–45 %** |
| on dark canvas | any | 18–35 %, plus white at 8–10 % |

The alpha ramp and the tint ramp are the **same ramp** — accent at 20 % over white is
byte-identical to PowerPoint's "Lighter 80 %" of that accent (`#4182FF` → `#D9E6FF` both
ways). That is what lets a circle and a card tint sit on the same slide without clashing.

> **Relation to the old "orbit + stepping-stone" motif.** Hairline arcs *do* survive — faint
> line-art curves appear top-right and bottom-left on several content slides — but they are
> ambient, secondary, and easy to miss. The circle field is the primary motif. Demote the
> arcs; do not delete them.

## 3. Keylines

The most repeated atom in the file: **89 outlines, almost all hairline indigo.**

| weight | colour | use |
|---|---|---|
| **0.25 pt** | `#272774` | default card and panel keyline |
| 0.75–1.0 pt | `#272774` / `#002060` | emphasis, outer container |
| 0.5 pt | `#FFFFFF` @ 20 % | keyline on dark canvas |
| 2.0 pt | `#4182FF` | rare — a single highlighted element |

Shadows are near-absent: a soft, tight shadow on stacked cards only. Elevation is
expressed by the keyline, not by shadow.

## 4. Corner radii

| radius | in | use |
|---|---|---|
| **8.6 pt** | 0.12 | **the card radius** — 23 of 51 rounded shapes |
| 6.0–7.2 pt | 0.083–0.10 | small chips, badges |
| 2.2–4.5 pt | 0.031–0.063 | inline tags |
| 13.9–17.1 pt | 0.193–0.238 | large panels |
| full | — | pills (label chips) |

## 5. Colour

### Ink ramp (text)

| token | hex | role |
|---|---|---|
| `--ink-title` | `#1E1E5E` | slide titles |
| `--ink-primary` | `#272774` | headings, labels, emphasis |
| `--ink-body` | `#3A3A52` | body on light |
| `--ink-body-alt` | `#494951` | secondary body |
| `--ink-muted` | `#4A4A7A` | captions, sub-labels |
| `--ink-meta` | `#6C757D` | meta, footers |

### Accents and their ramp

Four accents, rotating in this order: **blue → purple → mint → yellow**.

| accent | solid | tint-80 (20 %) | tint-60 (40 %) |
|---|---|---|---|
| blue | `#4182FF` | `#D9E6FF` | `#8DB4FF` |
| purple | `#B880FF` | `#F1E6FF` | `#D4B3FF` |
| mint | `#7DDEB8` | `#E5F8F1` | `#B1EBD4` |
| yellow | `#FFDD77` | `#FFF8E4` | `#FFEBAD` |
| indigo | `#272774` | `#CACAED` | `#6060C9` |

Surfaces: `#FFFFFF` · `#FDF9F7` (warm off-white) · `#F6EEF7` (icon-chip lilac) ·
`#F5E2DA` (blush, on dark only).

### Accent semantics — the precedence rule

The accents carry **two** meanings and the earlier grammar recorded only one.

1. **Positional rotation is the default.** In a deck, accent *n* means "the *n*-th item" —
   step 01 is blue, 02 purple, 03 mint, 04 yellow. This is decorative and carries no
   sector claim.
2. **The sector mapping** (life-sciences mint, engineering purple, telecom yellow,
   digital blue) applies **only when the content is actually about those sectors** —
   a data series, a tag, a capability table.

Never mix the two modes on one slide.

## 6. Type

**Century Gothic, one family, two weights (400 / 700).** 209 of 217 runs name it
explicitly; the remaining 8 inherit it from the theme. There is no second family — no
monospace, no serif, nothing.

| role | size | weight | notes |
|---|---|---|---|
| cover title | 80 pt | 700 | typed uppercase, white |
| ghost numeral (divider) | 106 pt | 700 | white at low opacity |
| closing | 96 pt | 700 | white |
| divider title | 66 pt | 700 | white |
| slide title | **32 pt** (30–40) | 700 | `#1E1E5E` / `#272774` |
| statement | 24–30 pt | 400 | centred, line-height 105–150 % |
| big index numeral | 29–36 pt | 700 | in the rotating accent |
| card heading | 15–19 pt | 700 | |
| badge numeral | 14–21 pt | 700 | white on a solid accent square |
| body | **12–14.5 pt** | 400 | line-height 104–118 % |
| eyebrow / caption | 10–12 pt | 700 | uppercase, tracked |
| subtitle | 11–18 pt | 400 *italic* | `#494951` |

**Uppercase is typed, never an auto-caps attribute** — the file contains zero `cap="all"`.
Tracked labels use **0.67 / 1.33 / 2.0 pt** letter-spacing (≈ 0.06 / 0.11 / 0.18 em).

## 7. Grid

| | |
|---|---|
| side margins | **0.53–0.62 in** (38–45 pt), symmetric |
| title band | top 0.5–0.9 in |
| content band | starts 1.33–1.92 in |
| card inner padding | 0.20–0.30 in (14–22 pt) |

Gutters, by column count — they tighten as the count rises:

| columns | gutter |
|---|---|
| 2 | 0.50 in |
| 3 | 0.36–0.42 in |
| 4 | 0.20 in |
| 5 | 0.30 in |

## 8. The component set

Nine composites carry the whole deck. An Amaris slide should be one of these, or a
deliberate variation on one.

1. **Cover** — dark canvas, 2–3 bleeding circles, a *pill label* (fully-rounded chip,
   solid yellow, 10.5 pt bold indigo, uppercase), 80 pt title, 18.7 pt blush tagline,
   logo lockup top-right.
2. **Section divider** — dark canvas, 106 pt ghost numeral, 66 pt title, a 2 pt blue rule
   under it, 18.7 pt blush subtitle.
3. **Accent-capped card** — a 4–6 pt solid accent bar across the card's top edge; body
   white or `#FDF9F7`; 0.25 pt indigo keyline; 8.6 pt radius. The accent rotates.
4. **Header-bar card** — a solid accent block as the card's header with white bold text
   inside it; keylined white body below.
5. **Left-rule row** (agenda / takeaways) — full-width white row, indigo keyline, a 5–6 pt
   accent bar on the left edge, a 29–36 pt accent numeral, bold indigo label, grey meta line.
6. **Numbered step card** — accent-capped card plus a solid accent square badge carrying a
   white numeral, and a step label in the matching accent.
7. **Icon tile** — rounded keylined white card, a circular chip (`#F6EEF7` or accent
   tint-80) with a hairline ring holding a single-accent icon, phrase alongside.
8. **Phrase / takeaway bar** — full-width bar at the slide foot, 8.6 pt radius, filled with
   a tint (yellow, lavender) or solid navy; text **centred, bold italic**, 12–16 pt.
   **At most one per slide**, and only when there is a real takeaway.
9. **Centred statement** — light canvas, two bleeding circles, one sentence at 24–30 pt
   with the load-bearing words in bold, line-height up to 150 %. Nothing else.

## 9. Photography — none

**The source of truth contains no photography in any slide that works.** Two slides carry
stock photos and two carry stock persona clip-art; they are visibly the weakest pages in
the file, and they are the reason the client raised this.

Photography is therefore **removed from the Amaris render path** (client instruction,
2026-09-22). The retired library is recorded in `images/manifest.json` under `retired`
with every original `source_url`, so it is recoverable if the client later supplies
imagery they have chosen themselves.

Where a slide needs a visual, use — in this order:

1. a **diagram** (`render_diagram`) or a **chart** (`format-chart`), brand-themed;
2. an **icon tile** row;
3. a **tinted panel** carrying structured text;
4. the **circle field** alone, with generous whitespace.

An empty, well-set slide is on-brand. A stock photograph is not.

## 10. What this retires

| retired | why |
|---|---|
| Hero photography with a navy scrim | §9 — no photography in the source of truth |
| The 6 px blush rule on the cover's top edge | absent from all 23 slides |
| The monospace footer bar | no second font family exists in the source |
| "Accents are never large colour blocks" | contradicted — solid accent header bars and caps are core (§8.3, §8.4) |
| Orbit arcs as the *primary* motif | demoted to ambient; the circle field is primary (§2) |
