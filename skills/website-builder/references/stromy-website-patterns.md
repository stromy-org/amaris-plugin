# stromy-website Patterns

Patterns extracted from the proven Stromy website (the baseline reference).

## Architecture

- **Framework**: Astro 6, MDX, Tailwind CSS 4, Preact (for interactive islands)
- **Token pipeline**: `charter.json` → `generate-tokens.ts` → `brand-tokens.css` + `tokens.ts`
- **Three-tier CSS tokens**: Tier 1 primitives in `@theme`, Tier 2 semantic in `:root`, Tier 3 component in `:root`
- **Content**: MDX collections with Zod schemas for blog, case-studies, capabilities
- **Routing**: File-based with dynamic `[slug].astro` for collections
- **Deployment**: GitHub Pages with custom domain
- **Dark mode**: `data-theme` attribute with FOUC prevention, localStorage + system preference

## Brand Identity

- Colors: Primary (#1D342B deep green), Secondary (#0F1310 near-black), Accent (#B96034 signal orange), Background (#ECE6DA parchment)
- Fonts: Fraunces (headings), Plus Jakarta Sans (body), IBM Plex Mono (mono/metrics)
- Visual identity: brutalist photography with brand overlay, score line dividers, editorial typography
- **Archetype**: Magician (dark-mode-native aesthetic with light/dark theme support)

## Component Organization

```
src/components/
├── layout/    → Header, Footer, Nav, ThemeToggle
├── ui/        → ScoreLine, Button, Card, StatBlock, Badge, Icon
├── sections/  → Hero, CapabilityGrid, StatsRibbon, CTABand, TechTeaser, CaseStudyCards
└── content/   → BlogCard, CaseStudyCard, ArticleLayout
```

## Three-Tier Token Architecture

### Tier 1 — Primitives (in `@theme` block)

Registered as Tailwind utilities. Generated from charter.json via `generate-tokens.ts`.

```css
@theme {
  --color-primary: #1D342B;
  --color-accent: #B96034;
  --color-background: #ECE6DA;
  --font-heading: "Fraunces", Georgia, serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
}
```

### Tier 2 — Semantic tokens (`:root` and `[data-theme="dark"]`)

Map primitives to purpose. NOT in a CSS layer (they're custom property declarations).

```css
:root {
  --surface-primary: var(--stromy-white, #F3EDE2);
  --surface-elevated: #fff;
  --text-heading: var(--stromy-neutral-950, #0F1310);
  --text-body: var(--stromy-neutral-900, #171611);
  --text-muted: var(--stromy-neutral-600, #6D665C);
}

[data-theme="dark"] {
  --surface-primary: var(--stromy-neutral-950, #0F1310);
  --text-heading: var(--stromy-neutral-50, #ECE6DA);
  --text-body: var(--stromy-neutral-300, #CDC2B3);
}
```

### Tier 3 — Component tokens

```css
:root {
  --nav-bg: var(--stromy-neutral-950);
  --card-bg: var(--surface-elevated);
  --card-border: var(--border-subtle);
  --card-shadow: 0 2px 8px rgba(15, 19, 16, 0.06);
  --btn-radius: 9999px;
}
```

## CSS Layer Structure (Tailwind v4)

**Critical**: All base element styles must be in `@layer base`, all component
classes in `@layer components`. Without this, unlayered styles override Tailwind
utilities due to CSS cascade priority rules.

```css
@layer base {
  body { font-family: var(--font-body); color: var(--text-body); }
  h1, h2, h3 { font-family: var(--font-heading); color: var(--text-heading); }
}

@layer components {
  .display-xl { font-size: clamp(3rem, 6vw, 5.5rem); }
  .section-kicker { font-family: var(--font-mono); }
  .surface-panel { background: var(--card-bg); }
  .dark-panel { background: var(--stats-bg); }
}
```

Scroll reveal rules (`.motion-ready .clip-reveal`) stay **unlayered** — they
must override utilities to control visibility.

## Dark Mode

- FOUC prevention: inline `<script>` in `<head>` sets `data-theme` before paint
- Toggle: `ThemeToggle.astro` with `data-theme-toggle` attribute (not `id`)
- Storage: `localStorage.setItem('stromy-theme', next)`
- System preference: `window.matchMedia('(prefers-color-scheme: dark)')`
- Re-init: `document.addEventListener('astro:after-swap', initThemeToggle)`
- Multiple instances: uses `querySelectorAll('[data-theme-toggle]')` because the
  component renders in both desktop nav and mobile menu

## Scroll Reveal

Uses synchronous above-fold check + IntersectionObserver for below-fold:

- `motion-ready` class gates all animations (progressive enhancement)
- Above-fold elements revealed immediately via `getBoundingClientRect()`
- Below-fold elements revealed by IntersectionObserver with `threshold: 0`
- Re-init on `astro:after-swap` for View Transitions
- `@media (prefers-reduced-motion: reduce)` disables all animations

## Homepage Section Sequence

```
Hero → CapabilityGrid → StatsRibbon → CaseStudyCards → TechTeaser → CTABand
```

This is the **Stromy-specific** sequence. New client sites MUST NOT replicate this
exact sequence.

## Score Line Motif

Stromy uses a distinctive "score line" — a thin horizontal line with a dot endpoint.
This is brand-specific. Other sites should develop their own section dividers per the
charter's `sectionDividers` setting.

## Contact Page

Split layout with Formspree form submission. Left column has headline, contact
details (email, LinkedIn, location), and trust signal. Right column has the form
card (`--surface-elevated`), discovery call CTA (`--surface-sunken`), and direct
email channel cards. Inquiry type select shows contextual hints via JS. Form
re-inits on `astro:after-swap`. See `references/contact-page-patterns.md` for
the full pattern.

## Token Generation Script

```typescript
// scripts/generate-tokens.ts
// Reads charter.json → generates brand-tokens.css + tokens.ts
// Outputs CSS custom properties: --stromy-*, --color-*, --font-*
```

The script is deterministic — same input always produces same output.

## Key Lessons from Building stromy-website

1. **Tailwind v4 `@layer` is mandatory**: Base and component styles MUST be in
   `@layer base`/`@layer components`, or they silently override Tailwind utilities
2. **Scroll reveal needs sync check**: IntersectionObserver alone leaves above-fold
   content invisible — always check with `getBoundingClientRect()` first
3. **Dark mode toggles: no duplicate IDs**: Components in both desktop and mobile
   nav must use `data-*` attributes, not `id` selectors
4. **ClientRouter re-init**: All `is:inline` scripts must re-query DOM on
   `astro:after-swap` — captured references go stale after page swap
5. **Astro 5+ content collections**: Use `glob` loader, `render()` function (not
   `entry.render()`)
6. **Generated files**: `brand-tokens.css` and `tokens.ts` are generated — never
   edit directly. Always run `npm run tokens` after charter changes.
7. **Formspree needs a form ID**: `formspree.io/f/{ID}` not `formspree.io/f/{email}`.
   For simple sites, prefer mailto over Formspree.
8. **Homepage data from collections**: CapabilityGrid and CaseStudyCards read from
   content collections, not hardcoded arrays.
