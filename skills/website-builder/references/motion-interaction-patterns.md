# Motion & Interaction Patterns

Reference for optional decorative motion in `website-builder`. This layer is
**opt-in**. The default brochure-site posture is restrained reveal/hover behavior,
not persistent ambient animation.

## Best-practice baseline

- **Localize ambient effects**. Decorative motion should live in the hero, branded
  accent bands, or specific atmospheric surfaces. Avoid site-wide cursor chasing.
- **Gate pointer-reactive effects to suitable devices**. Use `hover` / `pointer`
  media queries so mouse-style interactions do not leak onto coarse-touch devices.
- **Respect reduced motion**. Decorative motion must disable or simplify when the
  user expresses reduced-motion preference.
- **Prefer performant properties**. Use `transform` and `opacity` first. Treat
  `will-change` as a last resort and only on targeted elements.
- **Tie motion to user progress when possible**. Scroll-driven and in-view motion
  is usually more stable and less distracting than continuous autonomous movement.
- **Keep dense UI calm**. Forms, nav bars, body-copy sections, and data-heavy cards
  should not sit on top of reactive motion layers.

## Recommended optional patterns

### 1. `scroll-linked`

Best for premium brochure sites that need movement without gimmickry.

- Progress line or sectional accent that advances with scroll
- Hero gradient/grid drift linked to scroll progress
- Section divider or image mask that reveals as it enters view

Use when:
- the brand wants polish more than playfulness
- the site is content-led and should stay calm on desktop and mobile

### 2. `pointer-local`

Best for atmospheric hero zones or branded color fields.

- Localized grid drift inside hero backdrop only
- Accent glow following the cursor inside a green/branded band
- Decorative parallax response isolated to a visual panel

Use when:
- the effect is clearly decorative
- it can be clipped to a bounded container
- there is a clean non-pointer fallback

Avoid when:
- the effect would sit beneath paragraphs, forms, or busy navigation
- the brand tone is highly conservative and the motion reads as novelty

### 3. `hover-focus`

Best for tactility rather than spectacle.

- Cards sharpen or lift slightly on hover/focus
- Underlines or accents slide into place
- CTA surfaces brighten or tighten on intent

Use when:
- you want interaction feedback without ambient motion
- accessibility and keyboard parity matter more than atmosphere

### 4. `mixed`

Use sparingly. The usual successful mix is:

- scroll-linked section accents
- hover/focus component feedback
- one localized pointer-reactive decorative surface in the hero or a branded band

## Recommended schema choices

Use these `website.motion` values to keep implementations bounded:

- `interactionMode`
  - `none`
  - `scroll-linked`
  - `pointer-local`
  - `hover-focus`
  - `mixed`
- `ambientScope`
  - `none`
  - `hero-only`
  - `accent-surfaces`
  - `section-bands`
  - `site-wide`
- `reducedMotionPolicy`
  - `auto-disable-decorative`
  - `simplify`
  - `static-fallback`

## Implementation guidance

### CSS-first defaults

- Use CSS scroll/view timelines where support is acceptable and the effect can be
  progressive-enhanced.
- Use CSS hover/focus states for simple interaction feedback.

### JS-only when necessary

Use JavaScript when you need:

- container-local pointer coordinates
- dynamic clamping / easing
- visibility-aware activation for bounded scenes

When using JS:

- drive frame updates with `requestAnimationFrame`
- stop work when hidden or inactive
- update only the active decorative zone

### Zone isolation

When implementing `pointer-local`:

- attach the listener to the decorative container, not `window`
- clip the effect to the container
- suspend or hide the layer when the pointer leaves
- place the layer behind content and disable it over controls if readability suffers

## Default decision rule

If the user says motion sounds interesting but wants it subtle, prefer:

- `interactionMode: scroll-linked` or `mixed`
- `ambientScope: hero-only` or `accent-surfaces`
- `reducedMotionPolicy: auto-disable-decorative`

Reserve `site-wide` or strongly pointer-led motion for brands that explicitly ask
for a more experimental interface language.
