# Page Composition Templates

Example homepage section compositions per archetype. Use these as starting points
during Phase 0 Q4, then customize based on user input and available content.

## Ruler (Luxury / Professional)

### Composition A — Authority
```
hero (split) → value-proposition (three-pillars) → social-proof (trust-badges) →
services (alternating-rows) → case-study-highlight (full-width-image) →
stats (ribbon) → cta (full-width-band)
```

### Composition B — Prestige
```
hero (typographic) → social-proof (logo-strip) → services (single-spotlight) →
stats (large-numbers) → team-preview (leadership-spotlight) →
testimonials (simple-quote) → cta (split-cta)
```

### Composition C — Editorial
```
hero (split) → services (bento-grid) → case-study-highlight (full-width-image) →
social-proof (press-mentions) → stats (ribbon) → cta (minimal)
```

## Hero (Brutalist / Bold)

### Composition A — Impact
```
hero (full-bleed) → stats (large-numbers) → services (alternating-rows) →
case-study-highlight (full-width-image) → social-proof (stat-counters) →
cta (full-width-band)
```

### Composition B — Confrontational
```
hero (full-bleed) → value-proposition (single-statement) →
services (timeline) → testimonials (simple-quote) → stats (ribbon) →
cta (full-width-band)
```

## Explorer (Organic / Adventurous)

### Composition A — Journey
```
hero (full-bleed) → services (timeline) → social-proof (testimonial-cards) →
case-study-highlight (full-width-image) → stats (ribbon) →
team-preview (carousel) → cta (consultation)
```

### Composition B — Discovery
```
hero (full-bleed) → value-proposition (icon-columns) →
services (bento-grid) → social-proof (press-mentions) →
cta (newsletter)
```

## Creator (Maximalist / Vibrant)

### Composition A — Showcase
```
hero (collage) → services (bento-grid) → social-proof (logo-strip) →
case-study-highlight (full-width-image) → testimonials (carousel) →
stats (large-numbers) → cta (floating)
```

### Composition B — Portfolio
```
hero (collage) → value-proposition (three-pillars) →
services (tabbed) → social-proof (testimonial-cards) →
team-preview (grid-with-hover) → cta (split-cta)
```

## Sage (Editorial / Intellectual)

### Composition A — Magazine
```
hero (typographic) → services (alternating-rows) → social-proof (press-mentions) →
case-study-highlight (full-width-image) → stats (ribbon) → cta (inline)
```

### Composition B — Scholarly
```
hero (typographic) → value-proposition (numbered-list) →
services (accordion) → testimonials (sidebar-pull) →
cta (minimal)
```

## Innocent (Minimalist / Clean)

### Composition A — Pure
```
hero (minimal-text) → value-proposition (three-pillars) →
services (icon-grid) → testimonials (simple-quote) → cta (inline)
```

### Composition B — Focused
```
hero (minimal-text) → services (single-spotlight) →
social-proof (logo-strip) → cta (newsletter)
```

## Jester (Playful / Bold)

### Composition A — Energetic
```
hero (collage) → services (bento-grid) → social-proof (stat-counters) →
testimonials (carousel) → stats (large-numbers) → cta (floating)
```

## Magician (Dark / Transformative)

### Composition A — Mystique
```
hero (typographic) → services (tabbed) → social-proof (stat-counters) →
case-study-highlight (full-width-image) → stats (ribbon) →
cta (full-width-band)
```

### Composition B — Reveal
```
hero (full-bleed) → value-proposition (single-statement) →
services (timeline) → testimonials (simple-quote) →
team-preview (grid-with-hover) → cta (minimal)
```

## Lover (Neo-Classical / Elegant)

### Composition A — Romance
```
hero (split) → value-proposition (icon-columns) →
services (alternating-rows) → testimonials (card-with-photo) →
social-proof (logo-strip) → cta (inline)
```

## Caregiver (Warm / Trustworthy)

### Composition A — Nurture
```
hero (split) → value-proposition (three-pillars) →
services (icon-grid) → testimonials (card-with-photo) →
team-preview (grid-with-hover) → cta (consultation)
```

## Everyman (Swiss / Reliable)

### Composition A — Dependable
```
hero (split) → services (alternating-rows) → social-proof (logo-strip) →
stats (ribbon) → testimonials (simple-quote) → cta (inline)
```

## Outlaw (Deconstructivist / Aggressive)

### Composition A — Rebel
```
hero (full-bleed) → value-proposition (single-statement) →
services (bento-grid) → stats (large-numbers) →
cta (full-width-band)
```

---

## Customization Rules

1. **Mix and match**: Users can pick sections from any composition template
2. **Content availability**: Only include sections for which data exists (e.g., skip
   case-study-highlight if no case studies)
3. **No duplicate sequences**: Check `generated-sites-registry.md` — if this exact
   sequence exists, swap ≥2 sections
4. **Section count**: 5-8 sections for homepage is ideal. Below 5 feels sparse, above
   8 feels overwhelming.
5. **CTA placement**: Always end with a CTA section
6. **Stats placement**: Between content sections for rhythm, never first or last
