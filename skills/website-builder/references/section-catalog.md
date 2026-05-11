# Section Component Catalog

Complete catalog of available section types and their visual variants. Used during
Phase 0 (homepage composition) and Phase 3 (page generation).

## Hero Sections

| Variant | Description | Best For |
|---------|-------------|----------|
| `full-bleed` | Full-viewport image with overlay text | Dramatic brands (Hero, Outlaw, Magician) |
| `split` | Image left/right, content opposite | Professional brands (Ruler, Sage) |
| `minimal-text` | Large typography only, no image | Minimalist brands (Everyman, Innocent) |
| `video` | Background video with overlay | Dynamic brands (Explorer, Creator) |
| `collage` | Multiple images in creative arrangement | Creative brands (Creator, Jester) |
| `typographic` | Oversized display text as the hero element | Editorial brands (Sage, Ruler) |

### Implementation notes

- `full-bleed`: Use brand image with `cover` role. Apply `imageOverlayBehavior` from charter.
  Min height 80vh. Text centered or bottom-aligned.
- `split`: Two-column at desktop, stacked at mobile. Image side uses `cover` role image.
  Content side has heading, tagline, CTA button.
- `minimal-text`: No image. Heading uses `headingScale` × 1.5 for extra impact.
  Subtle background treatment from `texture.backgroundTreatment`.
- `video`: Requires video URL in charter or profile. Fallback to `full-bleed` with image.
- `collage`: 3-5 images in CSS grid with overlap. Uses multiple catalog images.
- `typographic`: Display heading fills the viewport width. Body text below.
  Works best with `oversized-serif` or `mono-caps` heading style.

## Service/Feature Sections

| Variant | Description |
|---------|-------------|
| `three-cards` | Classic grid (use sparingly — common AI pattern) |
| `alternating-rows` | Image-text pairs alternating left/right |
| `single-spotlight` | One feature large with supporting detail |
| `tabbed` | Tab interface switching between features |
| `accordion` | Expandable sections (good for dense content) |
| `icon-grid` | Icon + short description in grid |
| `bento-grid` | Asymmetric grid with varied card sizes |
| `timeline` | Features presented as a journey/process |

### Content source

Services come from `profile.json → services[]`. Each has `name`, `description`,
and `deliverables[]`.

## Value Proposition Sections

| Variant | Description |
|---------|-------------|
| `three-pillars` | Three key value props in columns |
| `numbered-list` | Numbered value propositions with descriptions |
| `icon-columns` | Icons with short value statements |
| `single-statement` | One bold statement with supporting text |

## Social Proof Sections

| Variant | Description |
|---------|-------------|
| `logo-strip` | Client/partner logos in a row |
| `stat-counters` | Animated number counters |
| `trust-badges` | Certification/award badges |
| `press-mentions` | "As seen in" media logos |
| `testimonial-cards` | Quote cards with photos |
| `testimonial-carousel` | Rotating testimonials |
| `case-study-highlight` | Single featured case study |
| `video-testimonial` | Embedded video testimonial |

### Content source

- Testimonials from `proposals/testimonials.json`
- Case studies from `proposals/case-studies.json`
- Stats from data file or profile.json credentials

## CTA Sections

| Variant | Description |
|---------|-------------|
| `full-width-band` | Full-width colored band with centered CTA |
| `split-cta` | Two-column with image and CTA |
| `minimal` | Simple text + button, lots of whitespace |
| `floating` | Sticky CTA that appears on scroll |
| `newsletter` | Email signup focused |
| `consultation` | Calendar booking / contact form |

## Contact Page Sections

| Variant | Description |
|---------|-------------|
| `split-form` | Split layout: info left (sticky), form + CTAs right |
| `inquiry-cards` | No form — categorized inquiry types with pre-filled mailto links |
| `embedded-calendar` | Calendly/Cal.com widget embedded directly |

### Implementation notes

- `split-form`: Primary pattern for B2B. Form card uses `--surface-elevated`,
  inputs use `--surface-primary` bg. See `references/contact-page-patterns.md`.
- `inquiry-cards`: Good for firms with distinct service lines (e.g., Duke Strategies).
  Each card pre-fills a mailto with subject and body template.
- `embedded-calendar`: Best when the primary goal is booking, not lead capture.
  Fallback to a link for Calendly if embed script fails.

## Team Sections

| Variant | Description |
|---------|-------------|
| `grid-with-hover` | Photo grid, details on hover |
| `carousel` | Scrollable team member cards |
| `leadership-spotlight` | Large cards for key leaders |
| `org-chart` | Hierarchical org visualization |
| `minimal-list` | Name + title list (no photos) |

### Content source

Team data follows the resolution chain:
1. `proposals/team-bios.json` — primary (photos, bios, expertise, education)
2. `people.json` — fallback (name, title, contact)
3. Neither — placeholder with TODO markers

## Content Sections (Blog, Case Studies)

| Variant | Description |
|---------|-------------|
| `card-grid` | Standard card grid layout |
| `list-view` | Full-width list with thumbnails |
| `masonry` | Pinterest-style varied-height grid |
| `featured-plus-grid` | One large featured + smaller grid |
| `magazine` | Editorial-style mixed layouts |

## Stats/Metrics Sections

| Variant | Description |
|---------|-------------|
| `ribbon` | Horizontal strip with key numbers (like stromy-website's StatsRibbon) |
| `large-numbers` | Big numbers with labels, full-width section |
| `infographic` | Visual data representation |
| `comparison` | Before/after or competitive comparison |

## Section Composition Rules

1. **No identical adjacent layouts**: Two consecutive sections cannot use the same
   layout width (e.g., two full-width sections with centered content).
2. **Section type uniqueness per page**: Each section type should appear at most once
   per page (e.g., don't have two hero sections).
3. **Dark/light rhythm**: Follow `darkSectionFrequency` — every Nth section gets a
   dark background treatment.
4. **Visual variety**: Mix card-based, text-based, and image-based sections.
5. **Brand image roles**: Ensure every image role in the catalog has at least one
   usage across the site.

## Homepage Composition Examples

See `page-composition-templates.md` for complete per-archetype compositions.
