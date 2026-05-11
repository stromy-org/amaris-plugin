# Generated Sites Registry

Tracks design decisions for each generated website to enforce variance between sites.
Updated after each website build (Phase 5).

## Tracked Axes

1. **Archetype** — which of 12 Jungian archetypes
2. **Aesthetic** — which of 15 macro aesthetics
3. **Hero variant** — hero section layout
4. **Card style** — card component variant
5. **Nav variant** — navigation component variant
6. **Typography expression** — heading style + scale
7. **Texture treatment** — background + surface + borders

## Registry

| Site | Archetype | Aesthetic | Hero | Cards | Nav | Typography | Texture |
|------|-----------|-----------|------|-------|-----|------------|---------|
| stromy-website | magician | editorial-magazine | split | bordered | sticky-minimal | oversized-serif (Instrument Serif) @ 1.4 | matte, thin-line borders, noise-grain overlay |
| ai4comms-website | magician | dark-mode-native | typographic | outlined | transparent-hero | tight-sans (Syne) @ 1.1 | geometric-pattern backdrop, matte surfaces, thin-line borders |

## Variance Rules

- New sites should differ on **≥4 of 7 axes** from every existing entry
- No two sites may share the same homepage section sequence
- If overlap is unavoidable (e.g., two ruler-archetype brands), note it and maximize
  variance on remaining axes

## Homepage Section Sequences

| Site | Sequence |
|------|----------|
| stromy-website | Hero → CapabilityGrid → StatsRibbon → CaseStudyCards → TechTeaser → CTABand |
| ai4comms-website | Hero → ValueProposition → Services → CaseStudy → CTA |
