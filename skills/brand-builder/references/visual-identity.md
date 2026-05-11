# Visual Identity Reference

## Moodboards / Stylescapes

Before jumping to logo concepts, generate **4-5 stylescapes** as HTML pages. Each is a visual collage of colors, textures, typography samples, imagery references, and mood words that captures a radically different aesthetic direction.

### Stylescape Construction

Each stylescape HTML page should include:
- A dominant color strip (3-5 colors as large swatches)
- 2-3 typography samples with real brand copy (pull from Google Fonts CDN)
- Textural references (describe the materials: concrete, marble, linen, brushed steel)
- Mood words (5-7 adjectives arranged as a word cloud or scattered)
- A brief one-line aesthetic summary

### Stylescape Naming

Use evocative 2-word names from a **shuffled pool**. Never present the same set twice:

**Pool A (material):** Midnight Authority, Copper Industrial, Slate Craft, Marble Precision, Carbon Edge, Obsidian Core, Brass Heritage, Concrete Brutal, Velvet Command, Iron Resolve

**Pool B (organic):** Sage Minimal, Amber Heritage, Olive Reserve, Driftwood Calm, Moss Depth, Cedar Warmth, Clay Ground, Stone Steady, Linen Light, Birch Clean

**Pool C (chromatic):** Crimson Pulse, Cobalt Focus, Ivory Tower, Neon Logic, Indigo Night, Emerald Signal, Coral Modern, Saffron Bold, Teal System, Azure Clear

**Pool D (abstract):** Sharp Geometry, Quiet Power, Signal Noise, Raw Elegance, Open Grid, Dense Minimal, Bright Tension, Soft Machine, Hard Light, Clean Edge

Pick 4-5 names across pools. Shuffle pools before selecting. Present to user for gut-reaction: "Which 2-3 resonate? Which feel wrong?"

## Logo Development

### 7 Concept Strategies

When generating 3 visual directions, each MUST use a **different** logo type:

| Strategy | What it does | Best for |
|----------|-------------|----------|
| **Wordmark + motif** | Name in custom type with a small visual accent | Most brands — versatile, scales well |
| **Lettermark + icon** | Initial(s) in a distinctive container | Brands with long names or strong initials |
| **Abstract mark** | Geometric or organic shape + wordmark | Tech brands, brands seeking universal recognition |
| **Typographic pure** | Wordmark only, distinctive through type choice | Luxury, editorial, consulting brands |
| **Combination mark** | Text + symbol together, lockup | All-round safe choice, can separate for small uses |
| **Emblem** | Text inside a symbol, badge, or crest | Heritage, authority, institutions, education |
| **Mascot** | Illustrated character or figure + wordmark | Approachable brands, family-oriented, animation potential |

**Selection heuristic:** Don't always default to "wordmark + motif." Let the brand archetype guide:
- Ruler/Sage → Emblem, Typographic pure, Lettermark
- Creator/Rebel → Abstract mark, Combination mark, Mascot
- Hero/Explorer → Combination mark, Abstract mark, Wordmark + motif
- Caregiver/Everyman → Mascot, Combination mark, Wordmark + motif
- Magician/Lover → Abstract mark, Typographic pure, Emblem

### Wordmark Typography

- **Serif** (editorial authority): Instrument Serif, Playfair Display, EB Garamond, Cormorant Garamond, Libre Baskerville
- **Geometric sans** (modern precision): DM Sans, Inter, Outfit, Plus Jakarta Sans
- **Humanist sans** (approachable): Source Sans 3, Nunito Sans, Work Sans, Lato
- **Display/distinctive**: Syne, Space Grotesk, Clash Display, Cabinet Grotesk

### Logo Technical Requirements

For each concept, show:
1. Primary lockup on dark background
2. Primary lockup on light background
3. Primary lockup on brand-color background
4. Monochrome / watermark version
5. With-tagline variant
6. Icon mark at 48px, 32px, 20px, 16px
7. Scale test from hero to minimum size

Render all logo concepts as SVG within HTML documents.

### SVG Production Quality

Logo and motif SVGs must meet these production standards:

1. **Text to paths** — All text in final logo SVGs must be converted to `<path>` outlines. Never ship logos with `<text>` elements that depend on font availability. During the design phase, `<text>` is acceptable for iteration speed, but mark it as a TODO for production conversion.

2. **Minimum stroke weight** — Never use strokes thinner than 1.8px in logo or motif SVGs. At 2.0-2.4px, elements remain visible at small sizes and feel deliberate. Below 1.5px, lines disappear on most screens.

3. **Scale-adaptive design** — Design icons to work at 16px, 20px, 32px, 48px, and 64px+. At smaller sizes, the mark needs bolder strokes, larger nodes, and fewer details. Consider creating a simplified variant for 16px if the full mark has too much detail.

4. **Node presence** — Junction nodes, checkpoint dots, and registration marks must be large enough to register as intentional design elements, not rendering artifacts. Minimum radius: 3px at 48px viewBox scale.

5. **Color encoding** — Always use the exact brand hex values. Never approximate. Include both dark-background and light-background variants of every mark.

6. **ViewBox padding** — Add 8-12% padding in the viewBox to prevent edge-clipping. Account for stroke-width extending beyond path coordinates.

### Symbol Mark Construction Principles

When designing standalone symbol marks (icons, favicons, app marks), apply these principles from professional logo/icon design practice:

**Grid construction:**
- Establish a base grid unit (8px recommended). All strokes, radii, spacing, and element placement should snap to grid multiples.
- Use a primary grid for structural divisions and sub-grid for fine detail.
- Define a safe area (padding = stroke weight) inside the viewBox edges.

**Geometric consistency:**
- Pick ONE stroke weight and use it everywhere in the mark (e.g., 2.2px). No mixing.
- Pick ONE linecap style (`round` or `butt`) and ONE linejoin style — apply consistently.
- All angles should be grid-aligned: 45° and 90° increments. Arbitrary angles read as messy at small sizes.
- Build from geometric primitives (circles, arcs, straight segments) — the construction geometry should be reproducible.

**Node and junction design:**
- Node diameter = 2× stroke weight (e.g., 2.2px stroke → 4.4px diameter nodes). This creates proper hierarchy without looking like rendering artifacts.
- Use a two-tier node system: primary nodes (larger, accent fill) and secondary nodes (smaller, secondary color).
- Avoid "circle-on-a-line" — make junctions integral to the path geometry. Nodes should feel like endpoints or decision points, not decorations.
- Where multiple paths meet, use boolean union or deliberate overlap, not stacked circles.

**Spacing and negative space:**
- Minimum gap between any two strokes must equal or exceed the stroke weight. If stroke = 2.2px, no internal gap < 2.2px.
- Keep internal counters (enclosed spaces) open and proportional — they collapse at small sizes if too narrow.
- Negative space channels must survive at 16px. If they fill in, the mark has too much detail.

**Optical corrections:**
- Curves appear thinner than straight lines at equal weight — thicken curves ~2-3%.
- Pointed shapes appear shorter — extend ~3-4% past the baseline.
- Center by visual mass (centroid), not bounding box. Asymmetric marks need deliberate offset.
- Light-on-dark versions appear to expand (irradiation effect) — consider thinning slightly.

**Multi-size optical variants (mandatory):**
- Design the 16px favicon variant as a **separate optical size**, not a scaled-down copy.
- At 16px: reduce to silhouette-level recognition. Strip to 1-2 elements max. Thicken strokes proportionally.
- At 32px: simplify junctions, merge closely-spaced parallel strokes.
- At 48px+: full detail with all nodes and terminals.
- Ship 2-3 optical sizes (favicon, nav icon, hero mark) rather than one SVG for all contexts.

**Monochrome-first testing:**
- Design and test every mark in pure black-on-white first. If the geometry doesn't carry without color, the mark is too dependent on color coding.
- Verify the mark reads correctly in: paper on obsidian, obsidian on paper, forest on paper, paper on forest, pure monochrome.

**Quality checklist before finalizing:**
1. Single stroke weight throughout? ✓
2. All angles on grid (45°/90°)? ✓
3. Node sizes follow 2× stroke rule? ✓
4. All gaps ≥ stroke weight? ✓
5. Monochrome version works? ✓
6. Favicon (16px) variant designed separately? ✓
7. Tested against dark, light, and brand-color backgrounds? ✓

### Motif Extraction

After the user picks a logo direction, identify the repeatable motif:

- A distinctive line or rule (score line, double rule, angled slash)
- A dot or geometric accent
- A border treatment (thick left border, corner mark)
- A typographic element (the initial letter, a ligature)
- A shape from the logo (extracted geometric element)
- A pattern derived from the mark (tessellation, rotation)

The motif should work at any scale: section dividers, footer rules, bullet replacement, decorative accents, loading indicators, slide backgrounds.

### Motif System Principles

Treat motifs as **signature systems**, not decorative fragments.

Strong motif systems usually share these traits:

- **Simple and distinctive** — the base move is easy to recognize and hard to confuse with a generic UI flourish
- **Relevant** — the construction logic connects back to the brand's archetype, name origin, logo geometry, or type anatomy
- **Repeatable** — the motif can be reused through repetition, rhythm, spacing, and scale change without losing identity
- **Structural** — it helps organize layouts, not just decorate them
- **Cross-contextual** — it works in website chrome, reports, slides, cards, charts, favicons, loading states, and image crops

When in doubt, prefer:

- alignment over ornament
- repetition over isolated novelty
- one strong primitive over several weak ones
- an identifiable visual rule over a one-off shape

Avoid:

- arbitrary diagonals, arcs, dots, or corner cuts with no governing logic
- motifs that only work as a hero flourish and fail at small sizes
- logo-ish mini illustrations that cannot scale into a broader system
- patterns that overwhelm typography or compete with the content hierarchy

### Shape Psychology for Motifs

The emotional read of the base geometry matters:

- **Squares / rectangles** suggest trust, control, order, ledgers, frames, and institutions
- **Circles / nodes** suggest connection, checkpoints, focus, and orchestration points
- **Triangles / diagonals** suggest motion, momentum, emphasis, and directional force
- **Curves / arcs** suggest resonance, flow, continuity, and softer orchestration

Choose geometry that matches the archetype:

- Sage / Ruler: ledgers, frames, modular grids, indexing, ruled systems
- Creator: ligatures, asymmetric crops, modular patterns, distinctive typographic cuts
- Magician: phase shifts, echoes, waveforms, veils, reveal masks
- Hero / Explorer: directionals, pathways, vectors, staged momentum

### Motif Families To Explore

When generating motif options, cover multiple families. Do not present 6 near-identical line treatments.

1. **Rule Systems** — score lines, double rules, measured offsets, orchestration bars
2. **Ledger Systems** — frames, registration marks, grid offsets, index blocks, corner coordinates
3. **Typographic Systems** — extracted serifs, ligatures, notches, stems, counters, bracket shapes
4. **Module Systems** — tiles, tessellations, repeated cells, staggered blocks derived from the logo
5. **Pathway Systems** — nodes, routes, tracks, switch points, signal paths
6. **Crop Systems** — image masks, clipped corners, controlled reveals, inset windows
7. **Resonance Systems** — echoes, repeats, offsets, shadows, phase lines
8. **Data Annotation Systems** — ticks, callout stems, index dots, coordinate marks, legend-like accents

### Construction Workflow

Build motifs in this order:

1. Identify the primitive:
   - line
   - node
   - corner
   - cell
   - stem
   - arc
2. Identify the governing rule:
   - repeat
   - offset
   - crop
   - rotate
   - mirror
   - extend
   - index
3. Identify the spatial behavior:
   - anchored to an edge
   - centered as a divider
   - repeated in a field
   - clipped into images
   - wrapping content modules
4. Test in context before declaring success

### Exploration Board Motif Requirements

In a Brand Exploration Board, motif options must be shown as **systems in use**.

For each motif option, render:

- dark divider treatment
- light divider treatment
- card or pull-quote accent
- image crop or frame treatment
- repeated or tiled background behavior
- micro-scale usage such as bullet, data annotation, favicon-sized mark, or footer cue
- mini website or slide composition

Label each motif with:

- family
- construction logic
- intended emotional read
- recommended use cases
- risk note, if any

### Motif Evaluation Rubric

Use this rubric before presenting motifs:

| Criterion | Question |
|-----------|----------|
| Distinctiveness | Could this belong to many brands, or does it feel tied to this one? |
| System behavior | Does it create a family of applications, not just one visual? |
| Scale range | Does it survive from 16px to hero size? |
| Layout value | Does it improve hierarchy, framing, navigation, or rhythm? |
| Restraint | Can it coexist with typography instead of fighting it? |
| Production realism | Could a strong designer actually implement this across brand assets? |

Reject any motif that fails 2 or more criteria.

### Motif Family Alignment

When the user wants to retain multiple motifs, treat them as one coordinated family.

Requirements:

- shared stroke weights or proportional weight logic
- shared corner behavior (sharp, soft, bracketed, squared)
- shared spacing cadence
- shared color logic across dark and light contexts
- shared compositional discipline so the family feels authored by one system

Good multi-motif families usually mix roles, not aesthetics:

- one motif for headers and dividers
- one motif for layout framing and image crops
- one motif for data or annotation
- one motif for transitions or background rhythm

Avoid keeping multiple motifs that all compete for the same job.

### Symbol Mark ↔ Motif Family Coherence

The standalone symbol mark (icon) and the motif family must share visual DNA:

- **Same stroke logic** — if the symbol uses 2.4px rounded strokes, the motifs should use 2.0-2.4px rounded strokes
- **Same node treatment** — if the symbol uses oxide-filled circles as orchestration nodes, the motifs should use the same node vocabulary
- **Same color DNA** — symbol and motifs pull from the same 3-4 color subset of the brand palette
- **Same geometry family** — if the symbol is curve-based, at least one motif should echo curves; if grid-based, at least one motif should echo grids

The symbol mark is NOT a motif — it should never be used as a decorative repeating element. But it should feel like it was born from the same design system. When a viewer sees the icon at favicon size and then sees a Tempo Ledger divider in a report, they should feel an unconscious family connection.

### Visual QA Protocol

Before presenting any board, direction page, brand book, or template preview, run a visual QA pass focused on both layout correctness and aesthetic polish.

Check for:

- overlapping text and decorative elements
- unintended line wraps in headlines, taglines, labels, or captions
- motif collisions with wordmarks, body copy, or CTAs
- inconsistent spacing between repeated modules
- weak contrast on dark or light surfaces
- visual drift between motif options that are supposed to feel like one family
- cards that are technically valid but visibly cramped, awkward, or unbalanced

Recommended workflow:

1. Review in browser at desktop width
2. Review at a narrower width to catch wrap failures
3. Inspect screenshots with computer vision or image review, not just DOM code
4. If OCR tooling is available locally, use it on screenshots to catch clipped or garbled text
5. Manually fix any layout that looks even slightly unresolved

Do not present "almost right" visual work. If a card, route, or motif demo feels cramped, overlapping, or amateur, refine it before showing it to the user.

## Color Palette Construction

### Harmony Methods

Instead of always building the palette the same way, **randomly select** one of these as the primary method for each visual direction. Present 3-4 palette options using different methods.

| Method | Description | Best for | Result |
|--------|------------|----------|--------|
| **Complementary** | Two colors opposite on the wheel + neutrals | High-impact, energetic brands | Strong contrast, bold feel |
| **Analogous** | 3 adjacent colors on the wheel | Harmonious, natural brands | Cohesive, calming feel |
| **Triadic** | 3 colors equally spaced on the wheel | Vibrant, balanced brands | Rich, diverse palette |
| **Split-complementary** | Base + two adjacent to its complement | Nuanced contrast, sophisticated brands | Interesting tension without harshness |
| **Monochromatic** | One hue, multiple shades/tints | Sophisticated, cohesive brands | Elegant, unified feel |
| **Image-extracted** | Extract palette from a reference image or moodboard | Brands with strong visual references | Organic, contextual feel |

### Interactive Palette Presentation

For each palette option, render in context:
- Logo rendered in the palette colors
- A slide mockup using the palette
- Color swatches with hex values
- A simple "light mode / dark mode" toggle showing the palette in both contexts

Let the user pick their preferred palette, then build the full system.

### Step 1: Primary Palette (3 colors)

| Role | Purpose | Selection criteria |
|------|---------|-------------------|
| **Dark** | Backgrounds, primary text | Near-black or very dark brand color. Never pure #000000 — always warm (#0B0B0B) or cool (#0A0F14) |
| **Brand** | Identity, headers, buttons | The core brand color. Must work as both bg and text |
| **Accent** | CTAs, highlights, alerts | High contrast against both dark and brand colors. Used sparingly |

### Step 2: Extended Scales (per primary color)

Build 6-7 stops per color: 50 (lightest) to 900 (darkest):
- **50**: Light backgrounds, subtle tints
- **100-200**: Tags, badges, hover states
- **300**: Secondary text on dark, links
- **500**: The primary shade (= brand color)
- **700**: Buttons, headers, strong elements
- **900**: Text on light fills, darkest shade

### Step 3: Neutral Scale

8 stops from near-black to near-white. Always warm (#F2F0EA parchment) or cool (#F0F2F5 ice) — never pure #FFFFFF or #000000.

### Step 4: Semantic Colors

- **Success**: Derived from brand green, or a complementary green
- **Warning**: Derived from accent if warm, otherwise amber
- **Error**: Red that works with the palette (not generic #FF0000)
- **Info**: Blue that works with the palette

### Color Rules to Codify

Always define explicit usage rules. Common patterns:
- "Accent is never a background" (if accent is strong)
- "[Warm color] replaces pure white" (for editorial brands)
- "[Dark color] replaces pure black" (for refined brands)
- "Green-on-black is the signature combination"
- "60-30-10 rule: 60% dark/neutral, 30% brand, 10% accent"

## Typography System

### Type Stack (always 3 typefaces)

| Role | When to use | Selection criteria |
|------|------------|-------------------|
| **Display** | Headlines, titles, hero | Distinctive, high personality. Sets the brand's typographic tone |
| **Body** | Everything else | Neutral, high readability, many weights available |
| **Mono** | Data, code, metadata | Clean, even spacing. Used for technical credibility |

### Font Energy Pools

Instead of always selecting from the same archetype table, divide fonts into **energy pools**. When building 3 directions, **randomly select** the starting pool for each direction, then pick fonts within:

**CALM pool** (editorial, measured, trustworthy):
- Display: Instrument Serif, Libre Baskerville, EB Garamond, Newsreader, Literata, Crimson Pro, Charter, Merriweather
- Body: DM Sans, Inter, Source Sans 3, Lato, Albert Sans, Noto Sans
- Mono: IBM Plex Mono, Source Code Pro, Roboto Mono, DM Mono

**WARM pool** (approachable, human, friendly):
- Display: Lora, Fraunces, Brygada 1918, Cormorant Garamond, Spectral
- Body: Work Sans, Nunito Sans, Karla, Figtree, Outfit, Manrope, Nunito, Quicksand
- Mono: JetBrains Mono, Fira Code, Space Mono

**BOLD pool** (assertive, distinctive, modern):
- Display: Syne, Clash Display, Bodoni Moda, Red Hat Display, Bricolage Grotesque, Oswald
- Body: Space Grotesk, Barlow, Epilogue, Darker Grotesque, Archivo, Barlow Condensed
- Mono: Martian Mono, Space Mono, Fira Code

**REFINED pool** (elegant, sophisticated, premium):
- Display: Playfair Display, Cormorant Garamond, Noto Serif Display, Bodoni Moda, Fraunces
- Body: Inter, Plus Jakarta Sans, Urbanist, Lexend, Raleway, Montserrat
- Mono: IBM Plex Mono, DM Mono, Source Code Pro

**Volatility mechanism:** Shuffle the pool assignment for each direction. The same brief won't always get Calm→Warm→Bold — it might get Refined→Bold→Calm.

### Font Repertoire (100+ fonts)

#### Serif — Editorial (classic authority, journalism, consulting)
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| Instrument Serif | Clean editorial, modern newspaper | Consulting, media, editorial | No |
| Playfair Display | High-contrast, elegant, traditional | Law, finance, luxury | No |
| Libre Baskerville | Classic book typography, warm | Publishing, education, legal | No |
| EB Garamond | Scholarly, refined, old-world | Academia, heritage, NGOs | Yes |
| Lora | Warm contemporary serif | Healthcare, education, nonprofits | Yes |
| Newsreader | Newspaper-inspired, sharp | Media, journalism, think tanks | Yes |
| Crimson Pro | Versatile text serif, humanist | Reports, long-form, editorial | Yes |
| Spectral | Modern text serif, readable | Tech docs, research | Yes |
| Literata | Warm intellectual, Google-designed | Tech, education, accessibility | Yes |

#### Serif — Display (statement-making, high contrast)
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| Fraunces | Quirky old-style with personality | Creative agencies, artisanal | Yes |
| Bodoni Moda | Ultra high-contrast, fashion | Luxury, fashion, high-end | Yes |
| Cormorant Garamond | Tall, thin, elegant | Luxury, wine, premium | No |
| Noto Serif Display | Broad, authoritative, global | International, government | Yes |
| Brygada 1918 | Historical character, strong | Heritage, institutions | No |

#### Serif — Transitional & Slab
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| Merriweather | Readable screen serif, friendly | Web content, blogs | No |
| Charter | Clean transitional, compact | Reports, documentation | No |
| PT Serif | Professional, web-optimized | Corporate, government | No |
| Noto Serif | Universal coverage, clean | International, multilingual | Yes |
| Roboto Slab | Clean modern slab | Tech, startups, data | No |
| Zilla Slab | Friendly, Mozilla-designed | Open source, tech, education | No |
| Bitter | Comfortable reading slab | Blogs, content platforms | No |

#### Sans-serif — Geometric (modern, precise, structured)
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| DM Sans | Clean, balanced, invisible | Corporate, SaaS, consulting | No |
| Inter | Swiss-inspired, versatile | Tech, SaaS, dashboards | Yes |
| Plus Jakarta Sans | Geometric, friendly, modern | Startups, SaaS, fintech | Yes |
| Outfit | Round geometric, approachable | Consumer, health, wellness | Yes |
| Albert Sans | Clean geometric, compact | Corporate, finance, government | Yes |
| Urbanist | Low-contrast, modern | Architecture, design, real estate | Yes |
| Lexend | Designed for readability, wide | Accessibility-first, education | Yes |
| Figtree | Friendly geometric, Google-designed | Consumer apps, marketplaces | Yes |
| Onest | Modern geometric, distinctive | Tech startups, creative agencies | No |

#### Sans-serif — Humanist (warm, approachable, human)
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| Source Sans 3 | Adobe workhorse, readable | Government, enterprise, reports | Yes |
| Work Sans | Warm, functional, versatile | Agencies, nonprofits, publishing | Yes |
| Nunito Sans | Rounded, friendly, soft | Healthcare, education, consumer | Yes |
| Lato | Serious but warm | Corporate, finance, government | No |
| Karla | Quirky grotesque, personality | Creative agencies, design studios | No |
| Barlow | Semi-condensed, efficient | Data-heavy, dashboards, fintech | Yes |
| Manrope | Modern humanist, semi-rounded | SaaS, fintech, consulting | Yes |

#### Sans-serif — Grotesque/Neo-grotesque (strong, distinctive)
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| Space Grotesk | Technical, geometric-grotesque | Tech, engineering, data | Yes |
| Red Hat Display | Corporate but distinctive | Enterprise | No |
| Bricolage Grotesque | Variable, expressive | Creative agencies, bold brands | Yes |
| Epilogue | Contemporary, neutral-distinctive | Corporate, publishing | Yes |
| Darker Grotesque | Narrow, dark, moody | Fashion, nightlife, premium | No |
| Familjen Grotesk | Sharp, Scandinavian | Design, architecture, minimalism | No |
| Schibsted Grotesk | Nordic clarity, news-inspired | Media, news | No |

#### Sans-serif — Rounded
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| Nunito | Rounded, friendly | Children, education, wellness | Yes |
| Quicksand | Light, airy, round | Lifestyle, wellness, consumer | Yes |
| Comfortaa | Very rounded, soft | Casual brands, consumer apps | No |
| Varela Round | Simple rounded | Friendly tech, consumer | No |

#### Sans-serif — Condensed
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| Barlow Condensed | Efficient, compact | Headlines, data-heavy, fintech | Yes |
| Oswald | Strong condensed, impactful | Headlines, posters, bold brands | Yes |
| Pathway Gothic One | Tall, narrow, editorial | Magazine headlines, fashion | No |
| Fjalla One | Bold condensed, impact | Headlines, callouts | No |

#### Sans-serif — Neo-humanist (modern, versatile)
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| Poppins | Geometric, widely used | Startups, consumer tech | No |
| Raleway | Elegant thin weights, wide | Fashion, luxury, creative | No |
| Montserrat | Urban geometric, classic | Marketing, agencies | Yes |
| Rubik | Rounded square, playful-professional | Apps, consumer brands | Yes |
| Be Vietnam Pro | Clean, Vietnamese-inspired | International, SaaS | No |
| Archivo | Grotesque, high-density | News, data, dashboards | Yes |

#### Display / Distinctive (high personality, use as display only)
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| Syne | Bold geometric, futuristic | Tech disruptors, creative agencies | Yes |
| Clash Display | Sharp, contemporary, striking | Fashion, bold brands, agencies | Yes |
| Cabinet Grotesk | Warm grotesque, distinctive | Premium brands, design studios | Yes |

#### Display — Handwritten/Script (use sparingly, accent only)
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| Caveat | Casual handwriting | Annotations, personal brands | No |
| Satisfy | Flowing script | Hospitality, lifestyle, food | No |
| Dancing Script | Elegant script | Events, feminine brands | Yes |
| Pacifico | Retro script | Fun brands, food, beach | No |

**Note:** Script fonts should only be used as accent elements (taglines, signatures), never as primary display fonts.

#### Monospace (data, code, metadata)
| Font | Personality | Best for | Variable? |
|------|------------|----------|-----------|
| IBM Plex Mono | Corporate, structured | Enterprise, consulting, finance | No |
| JetBrains Mono | Developer-loved, clear | Tech, engineering, SaaS | No |
| Space Mono | Geometric, quirky | Creative tech, editorial | No |
| Fira Code | Ligatures, coding-focused | Developer tools, tech brands | No |
| Source Code Pro | Adobe, clean, versatile | Government, enterprise | No |
| Roboto Mono | Google, neutral | Dashboards, data, SaaS | Yes |
| DM Mono | Compact, clean | Minimal brands, consulting | No |
| Martian Mono | Wide, futuristic | Innovative tech, space-adjacent | Yes |

### Variable Font Awareness

When a font has a variable version (marked "Yes" above), prefer it:
- Single file contains all weight/width variations
- Up to 88% smaller file size, 30% faster page loads
- Enables fluid typography with CSS `clamp()`
- Works across all modern browsers

### Building Direction-Specific Pairings

When creating 3 visual directions, select pairings that create **maximum contrast** between directions. Start by picking a different energy pool for each.

| Archetype | Display | Body | Mono | Feel | Pool |
|-----------|---------|------|------|------|------|
| Editorial Authority | Instrument Serif | DM Sans | IBM Plex Mono | Clean, newspaper-like | Calm |
| Bold Sophistication | Fraunces | Space Grotesk | Source Code Pro | Quirky + technical | Bold |
| Classic Prestige | Playfair Display | Manrope | JetBrains Mono | Contrast serif, modern body | Refined |
| Modern Editorial | Newsreader | Figtree | Roboto Mono | Sharp + friendly | Calm |
| Refined Elegance | Cormorant Garamond | Inter | Fira Code | Tall luxury, Swiss body | Refined |
| Bold Disruptor | Syne | Work Sans | Space Mono | Geometric, warm | Bold |
| High Fashion | Bodoni Moda | Albert Sans | IBM Plex Mono | Ultra-contrast, clean | Refined |
| Warm Intellectual | Literata | Urbanist | JetBrains Mono | Readable serif, modern | Warm |
| Readable Authority | Libre Baskerville | Lexend | Roboto Mono | Classic, high readability | Calm |
| Nordic Minimal | Familjen Grotesk | Source Sans 3 | DM Mono | Sharp Scandi, functional | Bold |
| Heritage Professional | EB Garamond | Barlow | Source Code Pro | Scholarly, data-efficient | Calm |
| Creative Confidence | Bricolage Grotesque | Karla | Martian Mono | Expressive, distinctive | Bold |
| Friendly Modern | Outfit | Nunito Sans | JetBrains Mono | Round, approachable | Warm |
| Premium Craft | Fraunces | Plus Jakarta Sans | DM Mono | Quirky display, geometric | Refined |
| Data Authority | Oswald | Barlow Condensed | IBM Plex Mono | Impact headlines, dense data | Bold |

**Pairing rules:**
- Never pair two fonts from the same sub-category
- Display and body should contrast (serif+sans or distinctive+neutral)
- Mono should complement body font's vibe
- Each of the 3 directions must use a DIFFERENT energy pool
- When presenting, **randomize the order** — don't always show the serif direction first

### Type Scale

Define sizes for these roles (all in px with rem equivalents):

```
Display XL:  48px / 3rem      — hero text, cover pages
Display LG:  36px / 2.25rem   — report titles
Display MD:  24px / 1.5rem    — section titles
Display SM:  20px / 1.25rem   — card titles
Heading:     18px / 1.125rem  — content headings
Body:        15px / 0.9375rem — paragraphs
Body SM:     13px / 0.8125rem — captions, secondary
Overline:    11px / 0.6875rem — section labels (uppercase)
Micro:       10px / 0.625rem  — legal, fine print
```

### Weight Restrictions

Most brands should use only 3 weights:
- **Regular (400)** — body text
- **Medium (500)** — headings, UI labels
- **Bold (700)** — emphasis, callouts (use sparingly)

Never use thin/light (too fragile) or black/heavy (too aggressive) unless the brand personality demands it.

## Visual Direction Presentation

### Direction Naming

Each direction gets an evocative 2-word name drawn from a **shuffled** pool. Never reuse names across sessions.

### Direction Content

Each direction presented in the HTML comparison page must include:
1. Direction name and 1-line personality description
2. Logo concept on dark + light backgrounds
3. Section divider slide mockup
4. Font specimens with real brand copy (not lorem ipsum)
5. Wordmark rendered in the direction's fonts
6. **Mini brand page mockup** — a webpage hero section showing how the direction looks in context

### Presentation Rules

- Show all 3 directions in **randomized order** (not always serif first)
- Each direction uses a DIFFERENT logo type, energy pool, and color harmony method
- The user picks a direction, not individual pieces
- After selection, offer font comparison (6-9 alternatives within style) and color exploration (same palette, different harmony methods)
