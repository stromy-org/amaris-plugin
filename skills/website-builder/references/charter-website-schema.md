# Charter Website Schema Reference

Complete documentation of the `charter.website` section added to `charter.json`.

## Schema Overview

The `website` section is **fully optional** in charter.json. When absent, the builder
runs guided Q&A (Phase 0) to populate it. When partially specified, the archetype
resolves all missing values.

## Fields

### Identity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `archetype` | string | Yes | One of 12 Jungian archetypes. Drives ALL defaults. |

**Valid archetypes**: `ruler`, `hero`, `explorer`, `creator`, `sage`, `innocent`,
`jester`, `magician`, `lover`, `caregiver`, `everyman`, `outlaw`

### Macro Aesthetic

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `aesthetic` | string | archetype-driven | Fundamental design direction |

**Valid values** (15 options):
`brutalist` | `minimalist` | `maximalist` | `retro-futuristic` | `organic` |
`luxury` | `editorial-magazine` | `art-deco` | `industrial` | `playful` |
`neo-classical` | `swiss-international` | `deconstructivist` | `memphis` |
`dark-mode-native`

### Layout Personality

All fields under `website.layout`:

| Field | Type | Default | Options |
|-------|------|---------|---------|
| `density` | string | archetype | `airy` \| `balanced` \| `dense` |
| `symmetry` | string | archetype | `symmetric` \| `asymmetric` \| `broken-grid` |
| `flowDirection` | string | archetype | `linear` \| `diagonal` \| `overlap` \| `staggered` |
| `heroStyle` | string | archetype | `full-bleed` \| `split` \| `minimal-text` \| `video` \| `collage` \| `typographic` \| `none` |
| `gridSystem` | string | archetype | `12col-centered` \| `asymmetric-2col` \| `masonry` \| `single-column` \| `alternating-wide-narrow` |
| `maxWidth` | string | `"1400px"` | Any CSS value |
| `sectionSpacing` | string | archetype | `tight` \| `balanced` \| `generous` \| `dramatic` |
| `sectionDividers` | string | archetype | `none` \| `thin-line` \| `thick-bar` \| `brand-motif` \| `gradient-fade` \| `geometric` |
| `footerStyle` | string | archetype | `minimal` \| `mega-footer` \| `split` \| `branded-band` |
| `whitespaceStrategy` | string | archetype | `compact` \| `balanced` \| `breathing` \| `dramatic` |

### Visual Texture

All fields under `website.texture`:

| Field | Type | Default | Options |
|-------|------|---------|---------|
| `backgroundTreatment` | string | archetype | `solid` \| `gradient-mesh` \| `noise-grain` \| `geometric-pattern` \| `photo-bleed` \| `duotone` \| `halftone` |
| `surfaceFinish` | string | archetype | `matte` \| `glossy` \| `textured` \| `frosted-glass` |
| `borderStyle` | string | archetype | `none` \| `thin-line` \| `heavy` \| `decorative` \| `dashed` \| `double` |
| `shadowDepth` | string | archetype | `none` \| `subtle` \| `medium` \| `dramatic` \| `colored` |
| `cornerRadius` | string | archetype | `sharp` (0) \| `slight` (4px) \| `moderate` (8px) \| `rounded` (12px) \| `pill` (999px) |
| `overlayStyle` | string | archetype | `none` \| `brand-tint` \| `gradient` \| `grain` \| `mesh` |
| `patternDensity` | string | archetype | `none` \| `sparse` \| `moderate` \| `dense` |

### Typography Expression

All fields under `website.typography`:

| Field | Type | Default | Options |
|-------|------|---------|---------|
| `headingStyle` | string | archetype | `standard` \| `oversized-serif` \| `mono-caps` \| `tight-sans` \| `display-script` \| `stacked` \| `mixed-weight` |
| `headingScale` | number | archetype | Multiplier: 0.8 compact, 1.0 standard, 1.4 oversized, 2.0 statement |
| `bodyLineHeight` | number | archetype | 1.4 tight, 1.6 standard, 1.8 airy, 2.0 very open |
| `letterSpacing` | string | archetype | `tight` (-0.02em) \| `normal` \| `wide` (0.05em) \| `very-wide` (0.15em) |
| `textTransform` | string | archetype | `none` \| `uppercase-headings` \| `uppercase-labels` \| `all-caps-hero` |
| `pullQuoteStyle` | string | archetype | `bordered-left` \| `oversized-italic` \| `centered-display` \| `background-block` |
| `listStyle` | string | archetype | `standard` \| `branded-bullets` \| `numbered-accent` \| `icon-list` \| `dash-minimal` |

### Motion & Interaction

All fields under `website.motion`:

| Field | Type | Default | Options |
|-------|------|---------|---------|
| `intensity` | string | archetype | `none` \| `subtle` \| `moderate` \| `dramatic` \| `cinematic` |
| `revealStyle` | string | archetype | `none` \| `fade` \| `stagger-up` \| `slide-in` \| `scale` \| `clip-reveal` \| `parallax` |
| `scrollBehavior` | string | archetype | `instant` \| `smooth` \| `parallax-layers` |
| `hoverBehavior` | string | archetype | `none` \| `lift` \| `glow` \| `scale` \| `color-shift` \| `underline-slide` \| `image-zoom` |
| `transitionSpeed` | string | archetype | `instant` \| `snappy` (150ms) \| `relaxed` (300ms) \| `cinematic` (600ms) |
| `loadingAnimation` | string | archetype | `none` \| `skeleton` \| `pulse` \| `stagger-fade` |
| `cursorStyle` | string | `"default"` | `default` \| `custom-branded` \| `dot-follower` |
| `interactionMode` | string | `"none"` | `none` \| `scroll-linked` \| `pointer-local` \| `hover-focus` \| `mixed` |
| `ambientScope` | string | `"none"` | `none` \| `hero-only` \| `accent-surfaces` \| `section-bands` \| `site-wide` |
| `reducedMotionPolicy` | string | `"auto-disable-decorative"` | `auto-disable-decorative` \| `simplify` \| `static-fallback` |

Decorative ambient or cursor-reactive motion is **opt-in**. For most brochure
sites, keep the default interaction posture restrained. When enabled, prefer
localized decorative zones over site-wide motion and follow
`references/motion-interaction-patterns.md`.

### Component Variants

All fields under `website.components`:

| Field | Type | Default | Options |
|-------|------|---------|---------|
| `navigation` | string | archetype | `sticky-minimal` \| `hamburger-full` \| `sidebar` \| `top-bar-expanded` \| `transparent-hero` \| `mega-menu` |
| `cards` | string | archetype | `shadow` \| `bordered` \| `flat` \| `glass` \| `elevated` \| `outlined` \| `gradient-border` |
| `buttons` | string | archetype | `square` \| `rounded` \| `pill-filled` \| `ghost` \| `underline` \| `icon-only` \| `split` |
| `forms` | string | archetype | `standard` \| `minimal-underline` \| `floating-label` \| `bordered-accent` |
| `imagePresentation` | string | archetype | `rectangular` \| `rounded` \| `masked` \| `full-bleed` \| `polaroid` \| `circular` \| `parallax` |
| `testimonials` | string | archetype | `simple-quote` \| `card-with-photo` \| `carousel` \| `sidebar-pull` \| `video` |
| `ctaStyle` | string | archetype | `inline` \| `full-width-band` \| `floating` \| `corner-sticky` \| `modal` |
| `socialProof` | string | archetype | `logo-strip` \| `stat-counters` \| `trust-badges` \| `press-mentions` \| `none` |
| `codeBlocks` | string | archetype | `default` \| `dark-branded` \| `terminal-style` \| `line-numbered` \| `copy-enabled` |

### Color Application

All fields under `website.colorApplication`:

| Field | Type | Default | Options |
|-------|------|---------|---------|
| `darkSections` | boolean | `true` | Alternate between light and dark section backgrounds |
| `darkSectionFrequency` | number | `3` | Every Nth section gets dark treatment |
| `accentUsage` | string | archetype | `liberal` \| `balanced` \| `sparring` |
| `gradientDirection` | string | archetype | `none` \| `horizontal` \| `vertical` \| `diagonal` \| `radial` |
| `colorBlockSections` | boolean | archetype | Full-width color blocks behind certain sections |
| `imageOverlayBehavior` | string | archetype | `none` \| `brand-tint` \| `gradient-fade` \| `brand-duotone` \| `dark-vignette` |

### Page Configuration

Under `website.pages`. Each page key contains:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | boolean | Yes | Whether the page is generated |
| `layout` | string | No | Page-specific layout variant |
| `sections` | array | No | Homepage section composition (home only) |

**Section entry format** (for `pages.home.sections`):
```json
{ "type": "hero", "variant": "split" }
```

**Available page keys**: `home`, `about`, `services`, `case-studies`, `blog`,
`contact`, `careers`, `resources`

### Deployment

All fields under `website.deployment`:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `platform` | string | `"github-pages"` | `github-pages` \| `vercel` \| `netlify` \| `cloudflare-pages` |
| `domain` | string | — | Custom domain (e.g., `dukestrategies.com`) |
| `analytics` | string | `"none"` | `none` \| `plausible` \| `umami` \| `google-analytics` |
| `contactForm` | string | `"mailto"` | `mailto` \| `none` \| `formspree` \| `netlify-forms` \| `custom-api` |

**Compatibility rules**: See `deployment-configs.md` for the full compatibility matrix.
Key constraint: `netlify-forms` only valid with `netlify` platform; `custom-api` not
available on `github-pages`. `mailto` is the preferred default for simple static
brochure sites, especially on `github-pages`.

### Optional Features

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `website.features.darkMode` | object\|false | `false` | Dark mode toggle configuration |

When `darkMode` is an object:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `false` | Show dark mode toggle in nav bar |
| `iconLight` | string | `"lightbulb"` | Left-side icon in sliding toggle (brand-specific) |
| `iconDark` | string | `"star-4"` | Right-side icon in sliding toggle (brand-specific) |
| `thumbColorLight` | string | accent color | Thumb color when in light mode |
| `thumbColorDark` | string | `"#F0F0F2"` | Thumb color when in dark mode |
| `respectSystemPreference` | boolean | `true` | Use `prefers-color-scheme` as default |

Implementation: `[data-theme="dark"]` on `<html>` overrides semantic CSS tokens (Tier 2/3).
Inline `<script>` in `<head>` reads `localStorage` + system preference before first paint
(prevents FOUC). Toggle persists to `localStorage`.

### Internationalization (optional)

All fields under `website.i18n`. **Entirely optional.** When absent or
`enabled: false`, the site is single-language and no i18n tooling is generated.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `false` | Master switch. When false, all other i18n fields are ignored. |
| `defaultLocale` | string | `"en"` | BCP-47 code for the default language |
| `locales` | string[] | `["en"]` | All supported locales including the default |
| `labels` | object | — | Map of locale code → display name (e.g., `{"fr": "Français"}`) |
| `routing` | string | `"prefix-non-default"` | `prefix-default` (every locale in URL) \| `prefix-non-default` (default at `/`) |
| `fallbackLocale` | string | `defaultLocale` | Rendered when a translation is missing |
| `localeDetection` | boolean | `false` | Server-side redirect based on `Accept-Language`. Disable on static hosts. |
| `translationWorkflow` | string | `"llm"` | `llm` (skill-driven, default) \| `inline` (edit in repo) \| `tms` (Lokalise/Crowdin/Phrase sync) |
| `translateContentCollections` | boolean | `true` | Mirror `/blog`, `/case-studies` folders per locale |
| `glossaryFile` | string | `"src/i18n/glossary.md"` | Path to no-translate terms + preferred equivalents |
| `brandVoiceFile` | string | `"src/i18n/brand-voice.md"` | Path to archetype/register/tone translation guide |
| `ledgerFile` | string | `".i18n/translation-ledger.json"` | Path to translation cache (source hash → approved output) |

See `i18n-patterns.md` for the full implementation guide and
`llm-translation-workflow.md` for the default LLM translation pipeline.
