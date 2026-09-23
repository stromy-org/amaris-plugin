# Amaris — presentation grammar (styling source of truth)

**Definition of record for how an Amaris deliverable looks.** Recovered 2026-09-22, re-extracted
across every OOXML layer 2026-09-23, from the deck the client themselves nominated as the styling
source of truth:

| | |
|---|---|
| Source | `.build-history/source-Amaris-Nespresso-Academy-styling-SoT.pptx` |
| SHA-256 | `1ef791c6fb282e0259129645bda4bb8e0278b5725db6ae24f738148cbab1e4e9` |
| Supplied by | Amaris (an internal author), via William, 2026-09-22 |
| Extent | 1 master · **34 layouts** · 23 slides · **721 shapes** · 394 text runs |
| Theme | `Gallery` · colour scheme `Custom 6` · font scheme `AC` |

This supersedes the presentation half of the grammar previously derived from
`.build-history/source-Amaris-Consulting-Template.pptx` (the corporate blank). That file stays
valid for the *logo lockups and the corporate palette*; it was never a composed deck, so the
composition rules inferred from it — hero photography, the blush top rule, the monospace footer —
were inference, not evidence.

> **Why this document was rewritten (2026-09-23).** The first pass walked the 23 **slides** only —
> 419 shapes. The motif system is authored one layer up, in the 34 **layouts**: 302 further shapes,
> including **120 of the deck's 164 circles**. A grammar written from the slides alone samples ~27%
> of its own subject, and it showed: v1 stated "2–3 circles per slide, never four" against a layout
> layer whose per-surface counts run 1–5, and it called the hairline arcs a secondary motif when
> they are the *same* circle system drawn as a ring instead of a wash. **Extract every layer, or
> you are measuring a sample and calling it a rule.**

---

## 0. How to read this document

This is **not** a template catalogue. A fixed list of composites is a list of cages: an authoring
model either copies one or leaves the system, and both outcomes are wrong — one produces twenty
near-identical slides, the other produces off-brand ones.

What follows is a **vocabulary** (§4, the primitives) crossed with **axes** (§5, the independent
choices) inside a **budget** (§6, how much variety one surface carries). Every combination those
three permit is one the source authorises. Layout — what sits where, in what proportion, in what
order — is deliberately **left to the authoring model**. It is the part that should respond to the
content, and the source itself never repeats a layout twice.

Consequently the **prohibitions are short and each one is evidenced** (§11). A false prohibition is
more damaging than a missing feature, because it steers confidently away from something the
client's own deck does — v1 forbade large accent colour blocks, which are core to this system.

Everything below is measured. Where a number is a range, the range is what the source contains.

---

## 1. Canvas

Slide is **13.333 × 7.5 in** (16:9, 1280 × 720 pt). Two canvases, and only two:

| canvas | value | instances | used for |
|---|---|---|---|
| **Light** (default) | vertical gradient `#FFFFFF` 0% → `#FBF5F2` 100% | 17 | every content surface |
| **Dark** | flat `#002060` | 4 | cover, section dividers, closing |

There is **no flat-white canvas** and no accent-filled canvas in the source.

Two corrections this forces on the pre-2026-09-22 grammar:

- The dark canvas is **`#002060`**, a deeper and cooler navy than the brand indigo.
  `#272774`/`#272674` is the **ink and keyline** colour, not the canvas.
- The light canvas is never flat white. It is white falling to a *whisper* of blush — `#FBF5F2`,
  not the full `#F5E2DA`. (The master carries `#F5E2DA` at 35% alpha, which resolves to the same
  value. LibreOffice drops that alpha and renders the blush at full strength; PowerPoint, and
  therefore the client, sees the subtle one.)

---

## 2. The ambient layer — one circle system, two treatments

The thing that makes these surfaces read as this deck. **164 ellipses**, of which **75 are
ambient** (bleeding off-frame or ≥ 2.0 in) and **89 are functional** (§4). The ambient ones appear
on **31 of the 34 layouts**.

The single most important correction to v1: the "circle field" and the "hairline arcs" are **not
two motifs**. They are one geometry with two treatments, and the *ring* is the more common of them.

| treatment | n | diameter | colour | weight / opacity |
|---|---|---|---|---|
| **Ring** (hairline, unfilled) | 44 | **2.2 – 12.1 in** | `#272774` @ 25% · `#FFFFFF` @ 25–50% | hairline, up to 1.0 pt |
| **Wash** (soft fill) | 25 | 2.0 – 7.0 in | white · blue · purple · mint · yellow | **10 – 35%** |
| **Dot** (saturated) | 7 of the 25 | 0.8 – 1.1 in | one accent, solid | 100% |

Construction rules that hold across all 31 layouts:

- **1–5 ambient circles per surface.** Distribution across layouts: 1 (×14), 2 (×13), 3 (×1),
  4 (×1), 5 (×2). *There is no "never four".*
- **They bleed.** The large ones originate outside the frame — negative `x`/`y`, or past
  13.333/7.5. The 12.1 in rings are near-slide-scale sweeps whose arc is all you see; that is the
  "arc" of the old grammar.
- **All four corners are used**, roughly evenly (bottom-right 25, top-right 22, top-left 15,
  bottom-left 13). No corner is reserved.
- **Rings and washes combine** on one surface. A ring sweeping behind a wash is normal.
- **Strictly behind content**, always. An ambient circle never contains anything.

The alpha ramp and the tint ramp are the **same ramp** — an accent at 20% over white is
byte-identical to PowerPoint's "Lighter 80%" of that accent (`#4182FF` → `#D9E6FF` both ways). That
is what lets a wash and a card tint sit on the same surface without clashing.

**The ghost wordmark** is the third ambient element: an oversized outline AMARIS lockup, bleeding
off a lower corner at very low contrast, on most light content layouts. It belongs to this layer,
not to the footer.

---

## 3. Keylines and elevation

**Structure is carried by line, not by shadow.** Shadows are near-absent — a soft, tight one on
stacked cards only.

| weight | n | use |
|---|---|---|
| **0.25 pt** | 31 | the default card/panel hairline |
| **1.0 pt** | 21 | container and emphasis — nearly as common as the hairline |
| 0.75 pt | 17 | mid emphasis |
| 0.5 pt | 10 | keyline on dark |
| 1.5 – 2.5 pt | 6 | rare: a single highlighted element, the divider rule under a section title |

| colour | n | use |
|---|---|---|
| `#272774` solid | 95 | the default keyline |
| `#002060` solid | 29 | on or against the dark canvas |
| **`#272774` @ 25%** | 20 | the *faint* hairline — ambient rings, soft dividers |
| `#FFFFFF` @ 20 / 25 / 50% | 33 | keylines on dark |
| `#4182FF` solid | 4 | the accented rule |

v1 called 0.25 pt "the default" and 0.75–1.0 pt "emphasis". The truth is flatter: **0.25 pt and
1.0 pt are both first-class**, and there is a third register — indigo at 25% — that v1 missed
entirely and that does most of the quiet work.

---

## 4. The primitives

The vocabulary an authoring model composes from. Each is a *part*, not a slide.

| primitive | what it is | measured |
|---|---|---|
| **card** | keylined container, usually white or `#FDF9F7` | radius 8.6 pt; padding 0.20–0.30 in |
| **cap** | solid accent bar across a card's top edge | 4–6 pt tall, full card width |
| **header-bar** | solid accent block *as* the card's header, text inside it | full width, ~0.6–0.9 in |
| **left-rule** | accent bar on a row's left edge | 5–6 pt wide, full row height |
| **badge** | small square holding a numeral | solid accent *or* tint-60; white or accent numeral |
| **chip** | small rounded tag, tint or solid | radius 2.2–7.2 pt, or fully rounded (pill) |
| **medallion** | circle holding an icon | **0.37 – 1.97 in**, accent tint or `#F6EEF7` lilac |
| **rule** | divider line inside or under content | 0.25–2.0 pt; accent rule under a section title |
| **panel** | tint-filled container that **nests** cards and chips | radius 13.9–17.1 pt |
| **phrase-bar** | full-width strip at the foot: tint, or solid navy | centred bold *italic*, 12–16 pt |
| **statement** | one large sentence, load-bearing words bold | 24–30 pt, line-height to 150% |
| **numeral** | oversized figure in an accent | 29–36 pt in-card; 106 pt ghost on dividers |
| **eyebrow** | small tracked uppercase label | 10–12 pt bold, tracking 0.67–2.0 pt |
| **watermark** | oversized low-contrast shape low in a card | single accent tint, no detail |
| **spot** | oversized flat single-tint illustration **slot** | can occupy a whole column |
| **connector** | dashed indigo axis, or a circular badge straddling a gutter | 2 pt dashed |
| **ambient circle** | §2 — ring, wash, or dot | behind everything |
| **ghost wordmark** | §2 — outline lockup bleeding off a corner | very low contrast |

`watermark` and `spot` are **slots, not assets** (§9).

---

## 5. The axes

Independent choices. An authoring model picks one value per axis; the cross-product is the
system's real range, and every cell in it is evidenced.

| axis | values |
|---|---|
| **A · canvas** | `light-gradient` · `dark-navy` |
| **B · ambient treatment** | `ring` · `wash` · `both` · `none` (+ `ghost-wordmark` on/off) |
| **C · ambient count** | `0` · `1` · `2` · `3` · `4` · `5` |
| **D · accent mode** | `rotate` (positional, the default) · `paired` (two accents in opposition) · `monochrome-tonal` (one hue at three depths) · `neutral` (white/indigo only) |
| **E · structure** | `single` · `2-up` · `3-up` · `4-up` · `asymmetric-split` · `row-stack` · `axis/timeline` · `comparison` |
| **F · surface polarity** | `light-on-light` (default) · `inverted-block` (a dark card on the light canvas) · `mixed-pair` (one dark card beside its light twin) |
| **G · emphasis** | `none` · `phrase-bar` · `statement` · `watermark` |
| **H · density** | `airy` · `regular` · `dense` |

Notes on the two that v1 got wrong:

- **D · accent mode.** v1 said "one accent per circle; never the same accent twice on a slide" and
  made positional rotation the only mode. Measured: **1–4 distinct accents per slide** (mode 3),
  and one slide is fully **monochrome-tonal** — white card, tint-80 panel, tint-60 chips nested
  inside it, three depths of a single blue. Rotation is the default, not the rule.
- **F · surface polarity.** v1 reserved dark for cover/divider/closing. The source puts a solid
  indigo card on a light canvas beside its blush twin (identical layout, inverted colour), and uses
  a solid navy phrase-bar twice. **Three instances** — genuinely rare, so treat `inverted-block` as
  a deliberate accent, not a default. It is available; it is not free.

**Text polarity on a solid accent is a choice, not a formula.** The source puts white on mint in
one composite and navy ink on mint in another. Do not derive it from luminance — decide it, and
keep ≥ 4.5:1 against the fill.

---

## 6. The variety budget

What one surface carries, and what a deck carries. These are the caps; below them the model is
free.

**Per surface**

- Ambient circles: **0–5** (typically 1–2).
- Distinct accents: **1–4** (typically 2–3).
- Phrase-bar: **at most one**, and only when there is a real takeaway.
- Statement: at most one, and it is then the whole slide.
- Inverted block: at most one region.
- Never mix positional and sector accent semantics (§7).

**Per deck**

- No two consecutive content surfaces take the same value on **E · structure**.
- The accent rotation advances across surfaces, so item colour stays legible as sequence.
- At most ~1 in 5 content surfaces uses `inverted-block` or `statement`; they read as punctuation.

---

## 7. Colour

### Ink ramp

| token | hex | role |
|---|---|---|
| `--ink-title` | `#1E1E5E` | slide titles |
| `--ink-primary` | `#272774` | headings, labels, emphasis |
| `--ink-deep` | `#1C1C3A` | densest ink — headings on light, 21 runs |
| `--ink-body` | `#3A3A52` | body on light |
| `--ink-body-alt` | `#494951` | secondary body, italic subtitles |
| `--ink-muted` | `#4A4A7A` | captions, sub-labels |
| `--ink-meta` | `#6C757D` | meta, footers |

### Accents and their ramp

Four accents, rotating in this order: **blue → purple → mint → yellow**.

| accent | solid | tint-80 (20%) | tint-60 (40%) |
|---|---|---|---|
| blue | `#4182FF` | `#D9E6FF` | `#8DB4FF` |
| purple | `#B880FF` | `#F1E6FF` | `#D4B3FF` |
| mint | `#7DDEB8` | `#E5F8F1` | `#B1EBD4` |
| yellow | `#FFDD77` | `#FFF8E4` | `#FFEBAD` |
| indigo | `#272774` | `#CACAED` | `#6060C9` |

The theme also defines **`#EBC4B4`** (a warm peach, `accent2`). It appears in no slide and no
layout — recorded as available, deliberately **not** in the rotation.

Surfaces: `#FFFFFF` · `#FDF9F7` (warm off-white) · `#F6EEF7` (icon-chip lilac) · `#FAF0EC` (blush
card) · `#F5E2DA` (blush, on dark only).

**Accents carry text too** — 30 runs are set in a solid accent (blue 9, mint 9, yellow 6, purple 6):
step labels, in-card numerals, row labels keyed to their card's accent.

### Accent semantics — the precedence rule

The accents carry **two** meanings:

1. **Positional rotation is the default.** Accent *n* means "the *n*-th item" — step 01 blue, 02
   purple, 03 mint, 04 yellow. Decorative; carries no sector claim.
2. **The sector mapping** (life-sciences mint, engineering purple, telecom yellow, digital blue)
   applies **only when the content is actually about those sectors** — a data series, a tag, a
   capability table.

Never mix the two modes on one surface.

---

## 8. Type

**Century Gothic, one family, two weights (400 / 700).** 217 runs name it explicitly; the rest
inherit it from the theme. There is no second family — no monospace, no serif, nothing.

| role | size | weight | notes |
|---|---|---|---|
| cover title | 80 pt | 700 | typed uppercase, white |
| ghost numeral (divider) | 106 pt | 700 | white at low opacity |
| closing | 96 pt | 700 | white |
| divider title | 66 pt | 700 | white |
| slide title | **32 pt** (30–40) | 700 | `#1E1E5E` / `#272774` |
| statement | 24–30 pt | 400 | load-bearing words 700; line-height 105–150% |
| big index numeral | 29–36 pt | 700 | in the rotating accent |
| card heading | 15–19 pt | 700 | |
| badge numeral | 14–21 pt | 700 | white on solid accent, or accent on tint |
| body | **12–14.5 pt** | 400 | line-height 104–118% |
| eyebrow / caption | 10–12 pt | 700 | uppercase, tracked |
| subtitle | 11–18 pt | 400 *italic* | `#494951`, or the card's accent |

Measured sizes run continuously from **7.5 pt to 106.66 pt** — the table is the rhythm, not a
whitelist. 149 of 394 runs are bold; 11 are italic (subtitles and phrase-bars only).

**Uppercase is typed, never an auto-caps attribute** — the file contains zero `cap="all"`, and 60
runs are typed in caps. Tracking: **0.67 / 1.33 / 2.0 pt**, plus a wide **6.0 pt** register (7 runs)
for small standalone labels.

**Mixed weight within one block is a device** — a statement alternating 700 and 400 across its own
words, used at large sizes.

---

## 9. Imagery — slots, never shipped assets

**The source contains no photography in any slide that works.** Two slides carry stock photos and
two carry stock persona clip-art; they are visibly the weakest pages in the file, and they are the
reason the client raised this.

**No image from the source deck is reused.** Photography is removed from the Amaris render path
(client instruction, 2026-09-22), and the imagery *devices* below are **placeholder slots** — a
shape, a tint and a reserved area that the authoring model fills with real content or leaves as a
sized, on-brand void. Nothing here ships a picture.

| slot | what it is | how it renders empty |
|---|---|---|
| **spot** | oversized flat single-tint illustration area, often a whole column | tint-80 panel at the slot's dimensions, keylined |
| **watermark** | oversized low-contrast mark low inside a card | absent — the card simply has more whitespace |
| **medallion** | circle awaiting an icon | tint or lilac circle with a hairline ring, empty |
| **visual block** | the "image would go here" region | solid navy or tint-80 block, no caption |

Where a surface needs a real visual, use — in this order:

1. a **diagram** (`render_diagram`) or a **chart** (`format-chart`), brand-themed;
2. a **medallion row**;
3. a **tinted panel** carrying structured text;
4. the **ambient layer** alone, with generous whitespace.

An empty, well-set surface is on-brand. A stock photograph is not.

The retired library is recorded in `images/manifest.json` under `retired` with every original
`source_url`, so it is recoverable if the client later supplies imagery they have chosen
themselves.

---

## 10. Grid

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

`asymmetric-split` is measured at roughly **60/40**, list-side left.

---

## 11. The prohibitions — all four are evidenced

Deliberately short. Anything not forbidden here is available.

| never | evidence |
|---|---|
| **Photography** | §9 — client instruction, and no working slide in the source uses it |
| **An accent filling a whole canvas** | 21 full-bleed canvases: 17 light gradient, 4 navy. Zero accent |
| **More than one phrase-bar on a surface** | no source surface carries two |
| **Mixing positional and sector accent semantics** | §7 — they are different claims about the same colour |

---

## 12. What this retires

| retired | why |
|---|---|
| Hero photography with a navy scrim | §9 — no photography in the source of truth |
| The 6 px blush rule on the cover's top edge | absent from all 23 slides and all 34 layouts |
| The monospace footer bar | no second font family exists in the source |
| "Accents are never large colour blocks" | contradicted — solid accent caps and header-bars are core (§4) |
| "Orbit arcs are a separate, secondary motif" | they are the ring treatment of the circle system (§2) |
| "2–3 circles per slide, never four" | measured 1–5 per layout across 31 layouts (§2) |
| "A circle is never a container" | 89 of 164 circles are functional medallions and badges (§4) |
| "Dark canvas is cover/divider/closing only" | the inverted card and the navy phrase-bar are content devices (§5 · F) |
| A fixed catalogue of nine composites | replaced by primitives × axes × budget (§0) |
