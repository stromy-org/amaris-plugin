# Anti-Convergence Rules

Rules and mechanisms to prevent generated websites from looking alike.

## Banned Patterns (Hard Rules)

These patterns are **explicitly forbidden**:

| Category | Banned | Reason |
|----------|--------|--------|
| **Fonts** | Inter, Roboto, Open Sans, Poppins for headings | Most common AI-generated choices → sameness |
| **Colors** | Purple-on-white gradient hero | The canonical "AI-generated" look |
| **Layout** | Exact sequence: hero → 3-feature-cards → testimonials → pricing → CTA | The most statistically common AI layout |
| **Direction** | "Clean and modern" as aesthetic choice | Non-direction that produces median output |
| **Components** | Identical card grids on consecutive sections | Visual monotony |
| **Images** | Generic stock photography (handshakes, offices, laptops) | Must use brand imagery from charter catalog |

## Enforced Soft Rules

| Requirement | How | Severity |
|-------------|-----|----------|
| **Texture minimum** | Every site must have ≥1 non-solid background treatment | Enforced |
| **Typography contrast** | Heading and body fonts should come from different categories. Respected as-is from charter. | Recommended |
| **Section variety** | No page can have >2 consecutive sections with the same layout width | Enforced |
| **Color rhythm** | Dark/light section alternation follows `darkSectionFrequency` | Enforced |
| **Asymmetry minimum** | ≥1 section per page must break the grid (unless aesthetic is explicitly symmetric) | Enforced |
| **Brand motif integration** | Brand motif must appear in ≥2 locations (dividers, backgrounds, borders) | Enforced |
| **Imagery coverage** | ≥1 image per role in `charter.images.catalog` | Enforced (role-based) |

## Image Coverage: Role-Based, Not Exhaustive

Coverage is measured per **image role**, not per image file.

| Role | Minimum Usage | Where |
|------|--------------|-------|
| `cover` | ≥1 | Hero section, page headers |
| `divider` | ≥1 | Section breaks, background accents |
| `closing` | ≥1 | CTA section, footer area |
| `background` | ≥1 (if role exists) | Full-bleed section backgrounds |
| `portrait` | ≥1 (if role exists) | Team section, about page |

**Image selection within a role**: When multiple images share a role, select based on:
1. Description relevance to section context
2. Tonal fit (dark images for dark sections)
3. Variety — avoid reusing the same image twice (unless catalog ≤4 images)

## Variance Tracking

### Generated Sites Registry

`references/generated-sites-registry.md` records 7 tracked axes per site:

1. **Archetype** — which of 12 archetypes
2. **Aesthetic** — which of 15 aesthetics
3. **Hero variant** — which hero layout
4. **Card style** — which card component variant
5. **Nav variant** — which navigation component
6. **Typography expression** — heading style + scale
7. **Texture treatment** — background + surface + borders

### Forced Divergence Rules

1. New sites should differ on **≥4 of 7 tracked axes** from every previous site.
   This is a soft guideline — if the brand genuinely calls for a similar direction,
   note the overlap and ensure variance on remaining axes.

2. No two sites can share the **same homepage section sequence**. If a proposed
   sequence matches a previous generation, vary ≥2 sections (different types, not
   just different variants of the same type).

3. Before finalising Phase 1 style boards, read the registry and explicitly state:
   "Previous sites used [X hero, Y cards, Z nav]. Your boards will explore
   different combinations."

### Charter Completeness Check

During Phase 0, do NOT accept archetype-only with all other fields defaulted. Walk
the user through at least:
- Macro aesthetic
- Layout personality (density, symmetry, hero style)
- Typography expression (heading style, scale)
- Component variants (navigation, cards, buttons)

Even if the user confirms the archetype defaults for each, the goal is **conscious
confirmation** — not silent defaulting.

## Typography Contrast Note

The website-builder does NOT enforce cross-category typography contrast because font
choice is made upstream in the brand-builder. The correct place for that recommendation
is during brand creation, not website generation.

Existing brands (e.g., Duke Strategies with Montserrat/Montserrat) are respected as-is.
