# Three-Tier CSS Token Architecture

The token system ensures brand consistency while enabling component flexibility.
Each tier builds on the previous one.

## Tier 1 — Brand Primitives

Generated from `charter.json` by `scripts/generate-tokens.ts`. These are the raw
brand values — never consumed directly by components.

```css
/* Auto-generated from charter.json — do not edit manually */
:root {
  /* Colors */
  --brand-primary: #FF7F66;
  --brand-secondary: #DFDFE0;
  --brand-accent: #FF7F66;
  --brand-background: #FFFFFF;
  --brand-background-alt: #F5F5F5;
  --brand-text: #807F83;
  --brand-text-light: #DFDFE0;
  --brand-success: #4CAF50;
  --brand-warning: #FFC107;
  --brand-error: #DC3545;

  /* Fonts */
  --brand-font-heading: 'Montserrat', Arial, Helvetica, sans-serif;
  --brand-font-body: 'Montserrat', Arial, Helvetica, sans-serif;
  --brand-font-mono: 'Space Mono', Courier New, monospace;
  --brand-font-heading-weight: 600;
  --brand-font-body-weight: 400;
}
```

## Tier 2 — Semantic Application

Design-intent tokens derived from `charter.website` settings. These map brand
primitives to purpose. Authored by Claude during Phase 2.

```css
:root {
  /* ─── Surfaces ─── */
  --surface-primary: var(--brand-background);
  --surface-secondary: var(--brand-background-alt);
  --surface-dark: var(--brand-primary);
  --surface-accent: var(--brand-accent);

  /* ─── Text ─── */
  --text-primary: var(--brand-text);
  --text-heading: var(--brand-primary);
  --text-on-dark: var(--brand-background);
  --text-muted: var(--brand-text-light);
  --text-accent: var(--brand-accent);

  /* ─── Layout (from charter.website.layout) ─── */
  --layout-max-width: 1400px;
  --section-gap: 8rem;          /* generous → 8rem, balanced → 5rem, tight → 3rem, dramatic → 12rem */
  --section-padding: 6rem 0;

  /* ─── Shape (from charter.website.texture) ─── */
  --radius-sm: 0;               /* sharp → 0, slight → 4px, moderate → 8px, rounded → 12px, pill → 999px */
  --radius-md: 0;
  --radius-lg: 0;
  --radius-pill: 999px;
  --shadow-sm: none;
  --shadow-md: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-lg: 0 4px 16px rgba(0,0,0,0.08);
  --border-width: 1px;
  --border-color: var(--brand-secondary);

  /* ─── Motion (from charter.website.motion) ─── */
  --transition-speed: 300ms;     /* snappy → 150ms, relaxed → 300ms, cinematic → 600ms */
  --ease: cubic-bezier(0.4, 0, 0.2, 1);

  /* ─── Typography (from charter.website.typography) ─── */
  --heading-scale: 1.4;
  --body-line-height: 1.7;
  --letter-spacing-heading: 0.05em;  /* wide */
  --letter-spacing-body: normal;
}
```

### Mapping Rules

| Charter Field | Token | Value Map |
|---------------|-------|-----------|
| `layout.sectionSpacing: tight` | `--section-gap` | `3rem` |
| `layout.sectionSpacing: balanced` | `--section-gap` | `5rem` |
| `layout.sectionSpacing: generous` | `--section-gap` | `8rem` |
| `layout.sectionSpacing: dramatic` | `--section-gap` | `12rem` |
| `texture.cornerRadius: sharp` | `--radius-sm/md/lg` | `0 / 0 / 0` |
| `texture.cornerRadius: slight` | `--radius-sm/md/lg` | `2px / 4px / 8px` |
| `texture.cornerRadius: moderate` | `--radius-sm/md/lg` | `4px / 8px / 16px` |
| `texture.cornerRadius: rounded` | `--radius-sm/md/lg` | `8px / 12px / 24px` |
| `texture.cornerRadius: pill` | `--radius-sm/md/lg` | `999px / 999px / 999px` |
| `texture.shadowDepth: none` | `--shadow-*` | all `none` |
| `texture.shadowDepth: subtle` | `--shadow-md` | `0 2px 8px rgba(0,0,0,0.06)` |
| `texture.shadowDepth: medium` | `--shadow-md` | `0 4px 12px rgba(0,0,0,0.10)` |
| `texture.shadowDepth: dramatic` | `--shadow-md` | `0 8px 24px rgba(0,0,0,0.16)` |
| `texture.shadowDepth: colored` | `--shadow-md` | `0 4px 16px color-mix(in srgb, var(--brand-primary) 20%, transparent)` |
| `motion.transitionSpeed: snappy` | `--transition-speed` | `150ms` |
| `motion.transitionSpeed: relaxed` | `--transition-speed` | `300ms` |
| `motion.transitionSpeed: cinematic` | `--transition-speed` | `600ms` |
| `typography.letterSpacing: tight` | `--letter-spacing-heading` | `-0.02em` |
| `typography.letterSpacing: normal` | `--letter-spacing-heading` | `0` |
| `typography.letterSpacing: wide` | `--letter-spacing-heading` | `0.05em` |
| `typography.letterSpacing: very-wide` | `--letter-spacing-heading` | `0.15em` |

## Tier 3 — Component-Specific

Consumed directly by components. Reference Tier 2 tokens.

```css
:root {
  /* ─── Navigation ─── */
  --nav-bg: var(--surface-primary);
  --nav-text: var(--text-primary);
  --nav-border: var(--border-color);
  --nav-height: 4rem;

  /* ─── Cards ─── */
  --card-bg: var(--surface-primary);
  --card-border: var(--border-color);
  --card-radius: var(--radius-md);
  --card-shadow: var(--shadow-sm);
  --card-padding: 2rem;

  /* ─── Buttons ─── */
  --btn-radius: var(--radius-pill);     /* from components.buttons */
  --btn-padding: 0.75rem 2rem;
  --btn-bg: var(--surface-accent);
  --btn-text: var(--text-on-dark);
  --btn-hover-transform: translateY(-2px);  /* from motion.hoverBehavior */

  /* ─── Hero ─── */
  --hero-min-height: 80vh;
  --hero-overlay: linear-gradient(135deg, rgba(255,127,102,0.55), transparent);
  --hero-text-align: left;              /* from layout.heroStyle: split */

  /* ─── Footer ─── */
  --footer-bg: var(--surface-dark);
  --footer-text: var(--text-on-dark);
  --footer-padding: 4rem 0;
}
```

## Key Insight

Swapping Tier 1 + Tier 2 completely transforms the site without touching any
component code. Two brands sharing identical components produce visually distinct
websites because the token indirection changes all visual properties.

## Tailwind v4 Integration

The `@theme` block in `global.css` must mirror the Tier 1 and key Tier 2 tokens
so Tailwind utility classes work:

```css
@theme {
  --color-primary: var(--brand-primary);
  --color-accent: var(--brand-accent);
  --color-background: var(--brand-background);
  --color-text: var(--brand-text);
  --font-heading: var(--brand-font-heading);
  --font-body: var(--brand-font-body);
  --font-mono: var(--brand-font-mono);
}
```

This enables: `bg-primary`, `text-accent`, `font-heading`, etc.
