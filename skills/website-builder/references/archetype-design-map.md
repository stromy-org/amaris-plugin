# Archetype → Design Defaults Map

When `charter.website` fields are absent or partially specified, the archetype resolves
all missing values. This is the **core variance mechanism** — each archetype produces
a fundamentally different website.

## Complete Default Map

### Ruler

```yaml
aesthetic: luxury
layout:
  density: dense
  symmetry: symmetric
  flowDirection: linear
  heroStyle: split
  gridSystem: 12col-centered
  sectionSpacing: dramatic
  sectionDividers: thin-line
  footerStyle: mega-footer
  whitespaceStrategy: dramatic
texture:
  backgroundTreatment: solid
  surfaceFinish: matte
  borderStyle: thin-line
  shadowDepth: subtle
  cornerRadius: sharp
  overlayStyle: brand-tint
  patternDensity: none
typography:
  headingStyle: oversized-serif
  headingScale: 1.4
  bodyLineHeight: 1.7
  letterSpacing: wide
  textTransform: uppercase-labels
  pullQuoteStyle: oversized-italic
  listStyle: dash-minimal
motion:
  intensity: subtle
  revealStyle: fade
  scrollBehavior: smooth
  hoverBehavior: lift
  transitionSpeed: cinematic
  loadingAnimation: skeleton
  cursorStyle: default
components:
  navigation: mega-menu
  cards: elevated
  buttons: ghost
  forms: minimal-underline
  imagePresentation: rectangular
  testimonials: simple-quote
  ctaStyle: full-width-band
  socialProof: trust-badges
  codeBlocks: dark-branded
colorApplication:
  darkSections: true
  darkSectionFrequency: 3
  accentUsage: sparring
  gradientDirection: none
  colorBlockSections: true
  imageOverlayBehavior: brand-tint
```

### Hero

```yaml
aesthetic: brutalist
layout:
  density: dense
  symmetry: asymmetric
  flowDirection: linear
  heroStyle: full-bleed
  gridSystem: asymmetric-2col
  sectionSpacing: tight
  sectionDividers: thick-bar
  footerStyle: minimal
  whitespaceStrategy: compact
texture:
  backgroundTreatment: noise-grain
  surfaceFinish: textured
  borderStyle: heavy
  shadowDepth: dramatic
  cornerRadius: sharp
  overlayStyle: grain
  patternDensity: moderate
typography:
  headingStyle: tight-sans
  headingScale: 1.6
  bodyLineHeight: 1.5
  letterSpacing: tight
  textTransform: all-caps-hero
  pullQuoteStyle: background-block
  listStyle: dash-minimal
motion:
  intensity: dramatic
  revealStyle: clip-reveal
  scrollBehavior: smooth
  hoverBehavior: scale
  transitionSpeed: snappy
  loadingAnimation: none
  cursorStyle: default
components:
  navigation: hamburger-full
  cards: flat
  buttons: square
  forms: bordered-accent
  imagePresentation: full-bleed
  testimonials: simple-quote
  ctaStyle: full-width-band
  socialProof: stat-counters
  codeBlocks: terminal-style
colorApplication:
  darkSections: true
  darkSectionFrequency: 2
  accentUsage: liberal
  gradientDirection: none
  colorBlockSections: true
  imageOverlayBehavior: dark-vignette
```

### Explorer

```yaml
aesthetic: organic
layout:
  density: airy
  symmetry: broken-grid
  flowDirection: staggered
  heroStyle: full-bleed
  gridSystem: masonry
  sectionSpacing: generous
  sectionDividers: gradient-fade
  footerStyle: split
  whitespaceStrategy: breathing
texture:
  backgroundTreatment: noise-grain
  surfaceFinish: textured
  borderStyle: none
  shadowDepth: medium
  cornerRadius: rounded
  overlayStyle: gradient
  patternDensity: sparse
typography:
  headingStyle: mixed-weight
  headingScale: 1.2
  bodyLineHeight: 1.8
  letterSpacing: normal
  textTransform: none
  pullQuoteStyle: centered-display
  listStyle: icon-list
motion:
  intensity: moderate
  revealStyle: slide-in
  scrollBehavior: parallax-layers
  hoverBehavior: image-zoom
  transitionSpeed: relaxed
  loadingAnimation: stagger-fade
  cursorStyle: default
components:
  navigation: transparent-hero
  cards: shadow
  buttons: rounded
  forms: floating-label
  imagePresentation: rounded
  testimonials: card-with-photo
  ctaStyle: inline
  socialProof: press-mentions
  codeBlocks: default
colorApplication:
  darkSections: true
  darkSectionFrequency: 4
  accentUsage: balanced
  gradientDirection: diagonal
  colorBlockSections: false
  imageOverlayBehavior: gradient-fade
```

### Creator

```yaml
aesthetic: maximalist
layout:
  density: dense
  symmetry: asymmetric
  flowDirection: overlap
  heroStyle: collage
  gridSystem: masonry
  sectionSpacing: balanced
  sectionDividers: geometric
  footerStyle: mega-footer
  whitespaceStrategy: compact
texture:
  backgroundTreatment: gradient-mesh
  surfaceFinish: glossy
  borderStyle: decorative
  shadowDepth: colored
  cornerRadius: moderate
  overlayStyle: mesh
  patternDensity: dense
typography:
  headingStyle: display-script
  headingScale: 1.6
  bodyLineHeight: 1.6
  letterSpacing: normal
  textTransform: none
  pullQuoteStyle: oversized-italic
  listStyle: branded-bullets
motion:
  intensity: dramatic
  revealStyle: scale
  scrollBehavior: smooth
  hoverBehavior: color-shift
  transitionSpeed: relaxed
  loadingAnimation: pulse
  cursorStyle: dot-follower
components:
  navigation: sidebar
  cards: gradient-border
  buttons: split
  forms: bordered-accent
  imagePresentation: masked
  testimonials: carousel
  ctaStyle: floating
  socialProof: logo-strip
  codeBlocks: line-numbered
colorApplication:
  darkSections: true
  darkSectionFrequency: 2
  accentUsage: liberal
  gradientDirection: radial
  colorBlockSections: true
  imageOverlayBehavior: brand-duotone
```

### Sage

```yaml
aesthetic: editorial-magazine
layout:
  density: balanced
  symmetry: symmetric
  flowDirection: linear
  heroStyle: typographic
  gridSystem: asymmetric-2col
  sectionSpacing: generous
  sectionDividers: thin-line
  footerStyle: split
  whitespaceStrategy: breathing
texture:
  backgroundTreatment: solid
  surfaceFinish: matte
  borderStyle: thin-line
  shadowDepth: none
  cornerRadius: sharp
  overlayStyle: none
  patternDensity: none
typography:
  headingStyle: oversized-serif
  headingScale: 1.4
  bodyLineHeight: 1.8
  letterSpacing: wide
  textTransform: uppercase-labels
  pullQuoteStyle: bordered-left
  listStyle: numbered-accent
motion:
  intensity: subtle
  revealStyle: fade
  scrollBehavior: smooth
  hoverBehavior: underline-slide
  transitionSpeed: relaxed
  loadingAnimation: skeleton
  cursorStyle: default
components:
  navigation: sticky-minimal
  cards: bordered
  buttons: underline
  forms: minimal-underline
  imagePresentation: rectangular
  testimonials: sidebar-pull
  ctaStyle: inline
  socialProof: press-mentions
  codeBlocks: line-numbered
colorApplication:
  darkSections: true
  darkSectionFrequency: 4
  accentUsage: sparring
  gradientDirection: none
  colorBlockSections: false
  imageOverlayBehavior: none
```

### Innocent

```yaml
aesthetic: minimalist
layout:
  density: airy
  symmetry: symmetric
  flowDirection: linear
  heroStyle: minimal-text
  gridSystem: single-column
  sectionSpacing: dramatic
  sectionDividers: none
  footerStyle: minimal
  whitespaceStrategy: dramatic
texture:
  backgroundTreatment: solid
  surfaceFinish: matte
  borderStyle: none
  shadowDepth: subtle
  cornerRadius: pill
  overlayStyle: none
  patternDensity: none
typography:
  headingStyle: standard
  headingScale: 1.0
  bodyLineHeight: 2.0
  letterSpacing: normal
  textTransform: none
  pullQuoteStyle: centered-display
  listStyle: standard
motion:
  intensity: subtle
  revealStyle: fade
  scrollBehavior: smooth
  hoverBehavior: lift
  transitionSpeed: relaxed
  loadingAnimation: pulse
  cursorStyle: default
components:
  navigation: top-bar-expanded
  cards: shadow
  buttons: pill-filled
  forms: floating-label
  imagePresentation: rounded
  testimonials: simple-quote
  ctaStyle: inline
  socialProof: none
  codeBlocks: default
colorApplication:
  darkSections: false
  darkSectionFrequency: 0
  accentUsage: sparring
  gradientDirection: none
  colorBlockSections: false
  imageOverlayBehavior: none
```

### Jester

```yaml
aesthetic: playful
layout:
  density: dense
  symmetry: broken-grid
  flowDirection: staggered
  heroStyle: collage
  gridSystem: masonry
  sectionSpacing: balanced
  sectionDividers: geometric
  footerStyle: mega-footer
  whitespaceStrategy: compact
texture:
  backgroundTreatment: halftone
  surfaceFinish: glossy
  borderStyle: decorative
  shadowDepth: colored
  cornerRadius: rounded
  overlayStyle: grain
  patternDensity: dense
typography:
  headingStyle: stacked
  headingScale: 1.4
  bodyLineHeight: 1.6
  letterSpacing: tight
  textTransform: none
  pullQuoteStyle: background-block
  listStyle: icon-list
motion:
  intensity: dramatic
  revealStyle: scale
  scrollBehavior: smooth
  hoverBehavior: scale
  transitionSpeed: snappy
  loadingAnimation: stagger-fade
  cursorStyle: dot-follower
components:
  navigation: mega-menu
  cards: glass
  buttons: split
  forms: bordered-accent
  imagePresentation: masked
  testimonials: carousel
  ctaStyle: floating
  socialProof: stat-counters
  codeBlocks: dark-branded
colorApplication:
  darkSections: true
  darkSectionFrequency: 2
  accentUsage: liberal
  gradientDirection: radial
  colorBlockSections: true
  imageOverlayBehavior: brand-duotone
```

### Magician

```yaml
aesthetic: dark-mode-native
layout:
  density: balanced
  symmetry: asymmetric
  flowDirection: diagonal
  heroStyle: typographic
  gridSystem: asymmetric-2col
  sectionSpacing: dramatic
  sectionDividers: gradient-fade
  footerStyle: minimal
  whitespaceStrategy: dramatic
texture:
  backgroundTreatment: geometric-pattern
  surfaceFinish: frosted-glass
  borderStyle: thin-line
  shadowDepth: colored
  cornerRadius: slight
  overlayStyle: mesh
  patternDensity: sparse
typography:
  headingStyle: mono-caps
  headingScale: 1.2
  bodyLineHeight: 1.6
  letterSpacing: tight
  textTransform: uppercase-headings
  pullQuoteStyle: bordered-left
  listStyle: dash-minimal
motion:
  intensity: cinematic
  revealStyle: clip-reveal
  scrollBehavior: smooth
  hoverBehavior: glow
  transitionSpeed: cinematic
  loadingAnimation: skeleton
  cursorStyle: dot-follower
components:
  navigation: transparent-hero
  cards: glass
  buttons: ghost
  forms: minimal-underline
  imagePresentation: masked
  testimonials: simple-quote
  ctaStyle: full-width-band
  socialProof: stat-counters
  codeBlocks: terminal-style
colorApplication:
  darkSections: true
  darkSectionFrequency: 1
  accentUsage: sparring
  gradientDirection: diagonal
  colorBlockSections: true
  imageOverlayBehavior: brand-duotone
```

### Lover

```yaml
aesthetic: neo-classical
layout:
  density: airy
  symmetry: symmetric
  flowDirection: linear
  heroStyle: split
  gridSystem: 12col-centered
  sectionSpacing: generous
  sectionDividers: brand-motif
  footerStyle: branded-band
  whitespaceStrategy: breathing
texture:
  backgroundTreatment: gradient-mesh
  surfaceFinish: glossy
  borderStyle: thin-line
  shadowDepth: subtle
  cornerRadius: rounded
  overlayStyle: gradient
  patternDensity: sparse
typography:
  headingStyle: display-script
  headingScale: 1.2
  bodyLineHeight: 2.0
  letterSpacing: normal
  textTransform: none
  pullQuoteStyle: centered-display
  listStyle: branded-bullets
motion:
  intensity: subtle
  revealStyle: fade
  scrollBehavior: smooth
  hoverBehavior: color-shift
  transitionSpeed: cinematic
  loadingAnimation: pulse
  cursorStyle: default
components:
  navigation: sticky-minimal
  cards: outlined
  buttons: rounded
  forms: floating-label
  imagePresentation: rounded
  testimonials: card-with-photo
  ctaStyle: inline
  socialProof: logo-strip
  codeBlocks: default
colorApplication:
  darkSections: true
  darkSectionFrequency: 4
  accentUsage: balanced
  gradientDirection: radial
  colorBlockSections: false
  imageOverlayBehavior: gradient-fade
```

### Caregiver

```yaml
aesthetic: organic
layout:
  density: airy
  symmetry: symmetric
  flowDirection: linear
  heroStyle: split
  gridSystem: 12col-centered
  sectionSpacing: balanced
  sectionDividers: none
  footerStyle: split
  whitespaceStrategy: balanced
texture:
  backgroundTreatment: solid
  surfaceFinish: matte
  borderStyle: none
  shadowDepth: subtle
  cornerRadius: rounded
  overlayStyle: none
  patternDensity: none
typography:
  headingStyle: standard
  headingScale: 1.0
  bodyLineHeight: 1.8
  letterSpacing: normal
  textTransform: none
  pullQuoteStyle: bordered-left
  listStyle: icon-list
motion:
  intensity: subtle
  revealStyle: fade
  scrollBehavior: smooth
  hoverBehavior: lift
  transitionSpeed: relaxed
  loadingAnimation: pulse
  cursorStyle: default
components:
  navigation: top-bar-expanded
  cards: shadow
  buttons: rounded
  forms: floating-label
  imagePresentation: rounded
  testimonials: card-with-photo
  ctaStyle: inline
  socialProof: trust-badges
  codeBlocks: default
colorApplication:
  darkSections: false
  darkSectionFrequency: 0
  accentUsage: balanced
  gradientDirection: none
  colorBlockSections: false
  imageOverlayBehavior: none
```

### Everyman

```yaml
aesthetic: swiss-international
layout:
  density: balanced
  symmetry: symmetric
  flowDirection: linear
  heroStyle: split
  gridSystem: 12col-centered
  sectionSpacing: balanced
  sectionDividers: thin-line
  footerStyle: split
  whitespaceStrategy: balanced
texture:
  backgroundTreatment: solid
  surfaceFinish: matte
  borderStyle: thin-line
  shadowDepth: none
  cornerRadius: slight
  overlayStyle: none
  patternDensity: none
typography:
  headingStyle: tight-sans
  headingScale: 1.0
  bodyLineHeight: 1.6
  letterSpacing: normal
  textTransform: none
  pullQuoteStyle: bordered-left
  listStyle: standard
motion:
  intensity: subtle
  revealStyle: stagger-up
  scrollBehavior: smooth
  hoverBehavior: underline-slide
  transitionSpeed: snappy
  loadingAnimation: skeleton
  cursorStyle: default
components:
  navigation: sticky-minimal
  cards: bordered
  buttons: rounded
  forms: standard
  imagePresentation: rectangular
  testimonials: simple-quote
  ctaStyle: inline
  socialProof: logo-strip
  codeBlocks: default
colorApplication:
  darkSections: true
  darkSectionFrequency: 4
  accentUsage: balanced
  gradientDirection: none
  colorBlockSections: false
  imageOverlayBehavior: none
```

### Outlaw

```yaml
aesthetic: deconstructivist
layout:
  density: dense
  symmetry: broken-grid
  flowDirection: overlap
  heroStyle: full-bleed
  gridSystem: masonry
  sectionSpacing: tight
  sectionDividers: thick-bar
  footerStyle: minimal
  whitespaceStrategy: compact
texture:
  backgroundTreatment: noise-grain
  surfaceFinish: textured
  borderStyle: heavy
  shadowDepth: dramatic
  cornerRadius: sharp
  overlayStyle: grain
  patternDensity: moderate
typography:
  headingStyle: mono-caps
  headingScale: 2.0
  bodyLineHeight: 1.5
  letterSpacing: tight
  textTransform: all-caps-hero
  pullQuoteStyle: background-block
  listStyle: dash-minimal
motion:
  intensity: dramatic
  revealStyle: clip-reveal
  scrollBehavior: smooth
  hoverBehavior: scale
  transitionSpeed: snappy
  loadingAnimation: none
  cursorStyle: custom-branded
components:
  navigation: hamburger-full
  cards: flat
  buttons: square
  forms: bordered-accent
  imagePresentation: full-bleed
  testimonials: simple-quote
  ctaStyle: full-width-band
  socialProof: none
  codeBlocks: terminal-style
colorApplication:
  darkSections: true
  darkSectionFrequency: 2
  accentUsage: liberal
  gradientDirection: diagonal
  colorBlockSections: true
  imageOverlayBehavior: dark-vignette
```

## Resolution Algorithm

When generating a site:

1. Read `charter.website.archetype` (required)
2. Load the archetype defaults from above
3. For each field in the charter's `website` section, if present → use charter value
4. For each missing field → use archetype default
5. The merged result is the final design specification
