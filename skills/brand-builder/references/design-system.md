# Design System Reference

## CSS Token Structure

The design tokens file should be organized into these sections, in order:

```css
:root {
  /* -- Primary Palette --- */
  /* -- Color Scales --- */       /* 50-900 for each primary + neutral */
  /* -- Semantic Colors --- */    /* success, warning, error, info + light variants */
  /* -- Typography --- */         /* font families with fallback stacks */
  /* -- Type Scale --- */         /* display-xl through micro, in rem */
  /* -- Line Heights --- */       /* tight(1.15) through loose(1.8) */
  /* -- Letter Spacing --- */     /* tight(-0.02em) through widest(0.1em) */
  /* -- Font Weights --- */       /* regular(400), medium(500), bold(700) */
  /* -- Spacing --- */            /* 4px base: space-1(0.25rem) through space-32(8rem) */
  /* -- Border Radius --- */      /* sm(4px) through full(9999px) */
  /* -- Shadows --- */            /* sm through xl, subtle and editorial */
  /* -- Transitions --- */        /* ease curves + duration steps */
  /* -- Brand Motif --- */        /* motif-specific variables (line color, dot color, etc.) */
  /* -- Layout --- */             /* content-width, content-wide, content-max */
}
```

## Dark Mode

Always include dark mode overrides using `@media (prefers-color-scheme: dark)`. Define surface, text, and border semantic variables that switch between modes.

## Utility Classes

Include pre-built classes for:

### Typography
One class per type scale level: `.brand-display-xl` through `.brand-mono`. Each sets font-family, font-size, line-height, letter-spacing, and font-weight.

### Overline
`.brand-overline` — the small uppercase label used for section categories. Always includes text-transform, letter-spacing, and weight.

### Motif Component
`.brand-motif` (or a name matching the motif, like `.score-line`) — the repeatable brand element, implemented with `::before` and `::after` pseudo-elements.

Variants: `--short` (fixed width), `--light` (for dark backgrounds), `--minimal` (smallest size).

### Buttons
`.btn-primary` (brand color), `.btn-secondary` (outline), `.btn-accent` (accent color). All with hover transitions.

### Cards
`.card` (default surface), `.card--dark`, `.card--brand`. With border, radius, padding, and hover shadow.

### Badges
`.badge--brand`, `.badge--accent`, `.badge--neutral`. Mono font, small size.

### Data Table
`.data-table` with themed header row (brand color background), alternating row fills, and mono font for data cells.

## Brand Guidelines Markdown

The `.md` guidelines document should cover:
1. Brand foundation (essence, positioning, tagline, personality, voice)
2. Logo (anatomy, variants, color rules by background, clear space, don'ts)
3. Color palette (all hex values in tables, usage rules)
4. Typography (stack, scale, Google Fonts import snippet, pairing rules)
5. Motif system (variants table, CSS implementation)
6. Imagery (subjects, avoids, treatment recipe)
7. Iconography (style, weight, color rules)
8. Applications (report, slide, letterhead, email sig, website patterns)
9. File naming convention

## HTML Brand Book

The interactive HTML brand book serves as both documentation and live demo. It must embody the brand — use the actual fonts (via Google Fonts CDN), actual colors, actual motif.

Structure: hero section, foundation, logo grid, color swatches with scales, type specimen, motif system with usage examples, voice do/don't cards, imagery direction, tokens reference, footer.

Use CSS variables defined inline (not referencing the external tokens file) so the HTML is fully self-contained.
