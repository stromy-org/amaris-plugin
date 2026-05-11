# Imagery Direction Reference

## Phase 5 is Interactive

Phase 5 is **not** a generate-and-deliver phase. It requires a conversation with the user to curate imagery that genuinely represents their brand. Do not skip the theme discovery step, the contact sheet review, or the treatment approval.

---

## Step 1: Theme Discovery

### Proposing Themes

Derive 4-6 imagery theme proposals from:
- Brand personality (authoritative -> architecture; playful -> color/movement; technical -> data/grids)
- Industry context (consulting -> strategy metaphors; tech -> interfaces; manufacturing -> materials)
- Geographic identity (local landmarks, regional aesthetics, cultural visual language)
- Founder interests (if known — sailing, aviation, specific industries can inform accent themes)
- Brand archetype established in Phase 1 (this shapes treatment intensity, not just subject matter)

### Personality-to-Imagery Mapping

| Personality | Imagery direction | Subjects | Treatment |
|------------|------------------|----------|-----------|
| Authoritative / serious | Raw, material, architectural | Concrete, steel, glass, infrastructure | Desaturated, high-contrast, tight crop |
| Modern / clean | Minimal, geometric, spacious | Clean surfaces, organized spaces, light | Bright, low contrast, generous whitespace |
| Bold / disruptive | Dynamic, unexpected, dramatic | Movement, unusual angles, construction | High contrast, deep shadows, strong color |
| Refined / premium | Textured, crafted, detailed | Materials, fabrics, artisan details | Warm tones, soft shadows, shallow depth |
| Technical / systematic | Structured, precise, data-like | Grids, circuits, engineering details | Cool tones, even lighting, clinical |
| Organic / natural | Earthy, growth-oriented | Plants, wood, water, natural textures | Warm, slightly saturated, soft focus |
| Playful / creative | Colorful, tactile, mixed media | Paint, paper, collage, craft supplies, color swatches | Saturated, playful crops, visible texture |
| Luxurious / exclusive | Rich materials, fine detail | Marble, gold leaf, silk, crystal, leather, fine surfaces | Low saturation except metallics, shallow depth, soft vignette |
| Innovative / futuristic | Abstract, luminous, geometric | Light trails, holographic surfaces, glass, data visualization | Cool-shifted, high clarity, selective color pop |
| Nostalgic / heritage | Film-like, warm, aged | Vintage objects, hand tools, worn surfaces, patina, aged paper | Warm color cast, lifted blacks, subtle grain, soft contrast |
| Urban / cosmopolitan | Gritty, energetic, layered | City textures, neon, street art, architectural detail, transit | Contrasty, slight color push, geometric crops |

### Questions to Ask

Present themes as a numbered list with a brief rationale for each, then ask:

1. **Which themes resonate?** Which to keep, drop, or modify?
2. **Local vs. international?** Should imagery feel rooted in a specific place or universally corporate?
3. **Personal connections?** Do the founders have interests, industries, or metaphors they gravitate toward?
4. **Treatment uniformity?** All images get the full brand treatment, or some stay natural as accent pieces?
5. **Photography vs. illustration?** Pure photography, AI-generated abstract/texture work, or a mix?
6. **Any specific images in mind?** References, mood boards, or "I want something like X"

Converge on **4-5 final themes** before proceeding to sourcing.

---

## Step 2: Image Sourcing

### Provider Guide

Choose providers based on the brand tier and budget. Start with free sources — only escalate to paid if the free sources cannot cover the required themes.

#### Free / Open

| Provider | Strengths | Best for | Notes |
|----------|-----------|----------|-------|
| **Unsplash** | Curated, high-end aesthetic, excellent architecture and nature | Primary source for most brands | Free. API available. Best free quality overall. |
| **Pexels** | Good variety, includes video clips | Secondary source, good for lifestyle and business | Free. Less curated than Unsplash but broader range. |
| **Pixabay** | Broad range including vectors, illustrations, video, audio | Supplementary — vectors and textures | Free. Quality varies more widely; filter carefully. |
| **Burst by Shopify** | Business-oriented, commerce-friendly | E-commerce, retail, startup brands | Free. Smaller library but focused. |
| **Kaboompics** | Consistent aesthetic, lifestyle/interior focus | Lifestyle brands, interior design, hospitality | Free. Comes with complementary color palettes per photo. |

#### Accessible / Mid-Range ($5-15/mo)

| Provider | Pricing | Strengths | Best for |
|----------|---------|-----------|----------|
| **Freepik Premium** | ~$12/mo unlimited | Vectors, photos, PSD templates, includes AI generator (Flux) | Brands needing both photos and graphic elements |
| **Vecteezy** | $9-14/mo | Exceptional vector library, clean illustrations | Brands with heavy illustration or icon needs |
| **123RF** | Competitive per-image or subscription | Massive library, editorial content | Volume needs, editorial brands |
| **Envato Elements** | ~$16.50/mo | Photos + templates + graphics + fonts in one subscription | Full creative suite needs beyond just photos |

#### Premium ($20+/image or subscription)

| Provider | Pricing | Strengths | Best for |
|----------|---------|-----------|----------|
| **Getty Images** | $175-499/image, enterprise subscriptions | Gold standard, exclusive content, rights-managed options | Tier 1 brands needing exclusive or editorial imagery |
| **Shutterstock** | Subscriptions from $29/mo (10 images) | Massive library, good search, predictable pricing | High-volume needs, broad subject coverage |
| **Adobe Stock** | $30/mo for 10 images | Integrated with Creative Cloud, good quality floor | Teams already in Adobe ecosystem |
| **Stocksy** | $15-50/image (small), $100-250 (medium) | Curated editorial quality, unique aesthetic, artist-owned co-op | Premium editorial brands, distinctive look |
| **Offset by Shutterstock** | Premium tier pricing | Fine art quality, handpicked collection | Luxury and heritage brands needing gallery-quality work |

### Search Strategy

For each confirmed theme, build 2-3 search terms combining: `[subject] + [mood/quality] + [specific detail]`

Example for an architectural consulting brand:
- "concrete texture dark minimal"
- "steel glass facade detail"
- "urban architecture geometric"
- "chess strategy overhead dark"
- "compass navigation vintage"
- "financial district skyline dusk"
- "dark marble stone texture"

Example for a playful tech brand:
- "colorful abstract gradient soft"
- "creative workspace flat lay"
- "hand drawing sketch whiteboard"
- "neon light geometric"

Tips:
- Combine abstract terms (e.g., "momentum", "precision") with concrete subjects for better results
- Search in English even on international platforms — largest index
- Use color terms from the brand palette to pre-filter ("navy", "warm gold", "teal")
- Try both singular and plural subject terms

### Sourcing Workflow — Wide Selection First

The goal is to present the user with a **wide selection board** — far more candidates than needed — so they can pick favorites rather than react to a pre-curated set.

1. Use `WebSearch` to find images on Unsplash/Pexels for each theme
2. Use `WebFetch` to download each image
3. Save originals to `_build/images/candidates/` with descriptive filenames (theme prefix: `oxidized-01.jpg`, `brutalist-03.jpg`)
4. Source **2-3x more candidates than the final count** — for a 20-24 image final set, source 40-60 candidates
5. Distribute candidates across themes with **flexible counts** — signature themes get more candidates, supporting themes get fewer
6. Prefer landscape orientation, high resolution (1920px+ wide)
7. Save as JPEG
8. Record attribution: filename, source URL, photographer name, license

### Selection Board Specification

The selection board is a **mandatory interactive HTML artifact** — the user's primary tool for choosing images. It must be brand-styled and fully functional in a browser.

**File:** `_build/BRAND-Image-Selection.html`

**Required features:**

1. **Click-to-select cards** — each image card toggles a `.selected` class on click, showing a visual border in the brand accent color. No checkboxes — the entire card is the click target.

2. **Sticky theme navigation** — a horizontal nav bar at the top with anchor links to each theme section. Uses `IntersectionObserver` to highlight the active section as the user scrolls.

3. **Live selection counter** — a fixed bottom bar showing `Selected: N / ~24 target` that updates on every click. Keeps the user aware of their count without scrolling.

4. **Copy selection list button** — exports selected image IDs (e.g., "OX01, OX05, BR02") to clipboard via `navigator.clipboard.writeText()`. The user pastes this back into the conversation.

5. **Theme sections** — each section includes:
   - Theme name as `<h2>` with brand display font
   - Theme tag badge (e.g., "SIGNATURE WARMTH — fills palette gap")
   - Description paragraph explaining what this theme brings to the brand
   - Suggested roles line (cover, divider, background, closing)
   - Brand trait connection (which personality traits this theme serves)

6. **Image cards** — each card includes:
   - Image at 3:2 aspect ratio with `object-fit: cover` and `loading="lazy"`
   - Unique ID in `data-id` attribute (theme prefix + number: OX01, BR03, etc.)
   - ID display, description, source credit
   - Role tags as small badges
   - For rebrands: existing images shown first with KEEP/WEAK/QUESTIONABLE badges and pre-selection

7. **Brand styling** — use the client's actual palette, fonts (display, body, mono), and color system. Dark background for image-heavy boards. The board should feel like a brand deliverable, not a wireframe.

8. **Image loading** — reference images via stock platform URLs (e.g., `https://images.unsplash.com/photo-{ID}?w=600&q=80&fit=crop`) so no download is needed before selection. Only download the user's final picks.

**Structural pattern:**

```html
<!-- Header with title, subtitle, instructions -->
<!-- Stats bar: total candidates, selected count, theme count -->
<!-- Sticky theme nav -->

<!-- Per theme section -->
<section class="theme-section" id="theme-N">
  <h2>N. Theme Name</h2>
  <span class="theme-tag">TAG LINE</span>
  <p class="theme-desc">What this theme brings to the brand...</p>
  <div class="theme-roles">Suggested roles: ... · Brand trait: ...</div>
  <div class="image-grid">
    <!-- Image cards with onclick="toggleSelect(this)" -->
  </div>
</section>

<!-- Fixed selection bar at bottom -->
<div class="selection-bar">
  <div>Selected: <span id="sel-count">0</span> / ~24 target</div>
  <button onclick="exportSelection()">Copy selection list</button>
</div>

<script>
  function toggleSelect(card) { card.classList.toggle('selected'); updateCounts(); }
  function exportSelection() { /* clipboard export of data-id values */ }
  // IntersectionObserver for sticky nav active state
</script>
```

Present the board to the user. They pick ~20-24 favorites. If a theme is under-represented in their picks, offer to source more candidates for that theme before moving to curation.

### Universal Avoids

Regardless of brand personality, always avoid:
- People shaking hands
- People smiling at laptops
- Generic office interiors with whiteboards
- Abstract colored gradients (unless AI-generated for a specific brand purpose)
- Low-resolution or heavily filtered images
- Watermarked stock photos
- Cliche metaphors: light bulbs, puzzle pieces, targets, gears, chess pieces used literally
- Obvious AI artifacts: synthetic skin, impossible reflections, melted fingers, over-perfect symmetry
- Images that look like they belong to another well-known brand

---

## Step 3: AI Image Generation (Optional)

AI-generated imagery is a supplement, not a replacement for photography. Use it for abstract, textural, and illustrative content that stock photography cannot provide.

### Tools

| Tool | Strengths | Best for | Access |
|------|-----------|----------|--------|
| **Midjourney** (v6+) | Best artistic/editorial quality, strong aesthetic control | Hero images, editorial illustrations, abstract art | Discord bot or web app, subscription required |
| **DALL-E** (OpenAI) | Versatile, good instruction-following, reliable | General-purpose, quick iterations, concept exploration | API or ChatGPT Plus |
| **Flux** (via Freepik or open source) | Fast, good quality, accessible | Textures, patterns, quick batch generation | Freepik Premium includes it; also available via open-source deployments |
| **Krea AI** | Accepts style references, brand-focused features | Brand-consistent batch generation, style transfer | Web app, free tier available |
| **Ideogram** | Strong typography rendering in images | Images that include text, logo-adjacent graphics | Web app, free tier available |

### When to Use AI

- Abstract textures and patterns that match brand colors exactly
- Impossible or conceptual compositions (e.g., "data flowing through architecture")
- Brand-specific illustrations where stock falls short
- Consistent series of related images (same style, different subjects)
- Background textures and gradient overlays

### When NOT to Use AI

- **People and faces** — uncanny valley risk, audiences detect synthetic humans immediately
- **Product photography** — must be authentic
- **Anything requiring documentary authenticity** (annual reports, press materials)
- **Recognizable landmarks or locations** — AI may distort or fabricate details
- **Client-facing hero images for premium brands** — unless the brand identity specifically embraces a synthetic/digital aesthetic

### AI Generation Process

1. **Start with references**: Gather 3-5 mood board images that capture the desired feel
2. **Create a style anchor prompt**: A reusable prompt fragment that defines the brand's visual language. Example: `"muted teal and warm stone tones, architectural photography style, shallow depth of field, editorial grain, desaturated --style raw"`
3. **Iterate on one strong concept** rather than generating hundreds of variations
4. **Apply brand treatment** after generation — AI images still go through the processing pipeline
5. **Review critically**: Check for telltale AI artifacts before including in brand materials

### Brand Consistency Technique

Create a **style anchor** — a prompt prefix reused across all generations for this brand:

```
Style anchor example:
"[subject], shot on medium format film, muted {brand-color-name} and {accent-color-name} tones,
soft directional light, editorial composition, subtle grain, desaturated --ar 16:9 --style raw"
```

Swap only the `[subject]` portion. This ensures visual coherence across all AI-generated assets.

### Audience Awareness

Audiences are increasingly adept at detecting AI imagery. Telltale signs they notice:
- Over-perfect skin and symmetry
- Impossible lighting physics
- Repetitive micro-textures
- Uncanny background details
- Objects that fade into each other

Use AI for abstract/textural work where these artifacts are invisible or irrelevant. For any image featuring realistic scenes, apply post-processing to break the "too perfect" look: add real film grain, subtle imperfections, and slight color shifts.

---

## Step 4: Interactive Curation

After the user has selected favorites from the wide selection board, refine the set interactively using a **curation board** — a second interactive HTML artifact.

### Curation Board Specification

The curation board is a **mandatory interactive HTML artifact** — the user's tool for assigning roles, marking hero candidates, and finalizing the image set. It must be brand-styled and fully functional in a browser.

**File:** `_build/BRAND-Image-Curation.html`

**Required features:**

1. **Role assignment buttons** — each image card has clickable role buttons (`cover`, `divider`, `background`, `closing`). Multiple roles per image. Buttons toggle `.active` class with accent color fill. No dropdowns — buttons are faster and visible at a glance.

2. **Hero candidate toggle** — a `★ HERO` button per card. When active, an overlay appears on the image showing sample heading + body text with a gradient darken — the user sees immediately whether the image works as a text-over-image background. Target: 4-9 heroes.

3. **Sticky theme navigation** — same pattern as the selection board. Horizontal nav with `IntersectionObserver` for active section tracking.

4. **Live counters** — fixed bottom bar showing roles assigned count and hero count vs. target. Updates on every click.

5. **Auto-assign suggested roles** — a button that pre-fills roles based on theme suggestions (cover for dramatic images, background for textures, etc.). User can adjust after. Saves time on large sets.

6. **Export curation button** — copies a structured text block to clipboard with every image's ID, assigned roles, and hero status. Format:
   ```
   ID: roles=[role1, role2] ★ HERO
   ID: roles=[role1]
   ID: (no roles assigned)

   Hero candidates (N): ID1, ID2, ...
   ```

7. **Theme sections** — same structure as selection board: theme name, tag badge, description, suggested roles line, then image grid.

8. **Image cards** — each card includes:
   - Image at 16:9 with `object-fit: cover` and `loading="lazy"`
   - `data-id` attribute for export
   - ID, description, source credit
   - Row of role buttons (cover, divider, background, closing)
   - Hero toggle button with label
   - Hero preview overlay (hidden by default, shown when hero is active)

9. **Brand styling** — same approach as the selection board. Use the client's actual palette, fonts, and color system. The board should feel like a brand deliverable.

10. **Pre-filled existing roles** — for rebrands, existing images start with their current roles pre-activated.

**Structural pattern:**

```html
<!-- Header with title, subtitle, instructions -->
<!-- Stats bar: total images, roles assigned, hero count -->
<!-- Sticky theme nav -->

<!-- Per theme section -->
<section class="theme-section" id="theme-N">
  <h2>N. Theme Name</h2>
  <span class="theme-tag">TAG LINE</span>
  <p class="theme-desc">What this theme brings...</p>
  <div class="image-grid">
    <div class="image-card" data-id="XX01">
      <img src="..." loading="lazy">
      <!-- Hero preview overlay (hidden by default) -->
      <div class="hero-preview">
        <div class="overlay"></div>
        <div class="sample-text">
          <div class="sample-heading">Intelligence, Orchestrated.</div>
          <div class="sample-body">Supporting text for readability test</div>
        </div>
      </div>
      <div class="card-info">
        <div class="card-number">#XX01</div>
        <div class="card-desc">Description</div>
        <div class="card-roles">
          <button class="role-btn" onclick="toggleRole(event, this)" data-role="cover">cover</button>
          <button class="role-btn" onclick="toggleRole(event, this)" data-role="divider">divider</button>
          <button class="role-btn" onclick="toggleRole(event, this)" data-role="background">background</button>
          <button class="role-btn" onclick="toggleRole(event, this)" data-role="closing">closing</button>
        </div>
        <div class="hero-toggle">
          <button class="hero-btn" onclick="toggleHero(event, this)">★ HERO</button>
          <span class="hero-label">Mark as hero candidate</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Fixed bottom bar -->
<div class="selection-bar">
  <div>Roles: <span id="bar-roles">0</span> · Heroes: <span id="bar-heroes">0</span> / 4-9</div>
  <button onclick="autoAssignSuggested()">Auto-assign suggested</button>
  <button onclick="exportCuration()">Export curation</button>
</div>

<script>
  function toggleRole(e, btn) { e.stopPropagation(); btn.classList.toggle('active'); updateCounts(); }
  function toggleHero(e, btn) {
    e.stopPropagation(); btn.classList.toggle('active');
    btn.closest('.image-card').querySelector('.hero-preview')
      .classList.toggle('visible', btn.classList.contains('active'));
    updateCounts();
  }
  function exportCuration() { /* clipboard export of roles + hero status per data-id */ }
  // IntersectionObserver for sticky nav
</script>
```

Present the board to the user. They assign roles and mark heroes, then export and paste back.

### Handling Feedback

After receiving the curation export:

1. Images with **(no roles assigned)** — confirm with user: keep without roles, or drop?
2. If hero count is outside 4-9 range, suggest adjustments
3. If a theme has zero cover or closing candidates, flag it
4. Confirm the final set: "We have X images across Y themes, Z heroes. Ready to process?"

---

## Step 5: Image Processing

### Processing Pipeline

Apply brand treatment using `sharp` (Node.js) or Pillow (Python). Every sourced image goes through this pipeline:

```
1. Resize:        1920px wide, maintain aspect ratio
2. Color grade:   Warm or cool shift based on brand archetype (see Color Grading below)
3. Desaturate:    Variable — see Archetype Parameters below
4. Contrast:      Variable — see Archetype Parameters below
5. Shadows:       Deepen darks toward brand dark color
6. Highlights:    Keep clean, not blown
7. Color overlay: [brand dark color] at variable opacity, multiply blend
8. Grain:         Variable (optional, for editorial feel)
9. Crop:          Tight, geometric. Prefer 16:9, 2:1, or 1:1 ratios
```

The color overlay is the most critical step — it tints every image toward the brand palette, creating visual cohesion across diverse sources.

### Archetype-Based Parameters

Processing intensity varies by brand personality. Do not apply the same -40% saturation to every brand.

| Archetype | Saturation | Contrast | Overlay opacity | Grain | Color shift |
|-----------|-----------|----------|-----------------|-------|-------------|
| Authoritative / serious | 0.5-0.6 (-40-50%) | +15 to +25 | 15-20% | 5-8% | Cool |
| Modern / clean | 0.7-0.8 (-20-30%) | +5 to +10 | 8-12% | None | Neutral |
| Bold / disruptive | 0.6-0.7 (-30-40%) | +20 to +30 | 12-18% | 3-5% | Warm or cool (per palette) |
| Refined / premium | 0.7-0.8 (-20-30%) | +5 to +15 | 10-15% | 4-6% | Warm |
| Technical / systematic | 0.5-0.6 (-40-50%) | +10 to +15 | 12-18% | None | Cool |
| Organic / natural | 0.8-0.9 (-10-20%) | +5 to +10 | 8-12% | 3-5% | Warm |
| Playful / creative | 0.9-1.0 (minimal) | +5 to +10 | 5-8% | None | Warm |
| Luxurious / exclusive | 0.6-0.7 (-30-40%) | +10 to +15 | 10-15% | 3-5% | Warm |
| Innovative / futuristic | 0.6-0.7 (-30-40%) | +15 to +20 | 12-18% | None | Cool |
| Nostalgic / heritage | 0.7-0.8 (-20-30%) | -5 to +5 (soft) | 10-15% | 6-10% | Warm |
| Urban / cosmopolitan | 0.7-0.8 (-20-30%) | +15 to +25 | 10-15% | 4-6% | Neutral-cool |

### Color Grading

Apply a subtle color shift before the brand overlay to set the base mood:

- **Warm shift** (heritage, refined, organic, luxury brands): Push shadows toward amber/brown, highlights toward warm cream. In sharp: `.tint({ r: 255, g: 245, b: 230 })` at low intensity, or adjust `modulate` hue slightly.
- **Cool shift** (technical, innovative, authoritative brands): Push shadows toward blue/navy, highlights toward cool white. In sharp: `.tint({ r: 230, g: 240, b: 255 })` at low intensity.
- **Neutral** (modern, urban brands): No pre-shift; let the brand overlay color do all the work.

### Film Emulation Presets (Optional)

For brands that benefit from a photographic film aesthetic, apply one of these treatments before the brand overlay step:

| Preset | Inspiration | Effect | Best for |
|--------|-------------|--------|----------|
| **Portra** | Kodak Portra 400 | Lifted shadows, warm skin tones, slightly desaturated greens | Heritage, refined, organic brands |
| **Provia** | Fuji Provia 100F | Vivid but controlled color, punchy contrast, cool shadows | Bold, innovative brands |
| **HP5** | Ilford HP5 Plus | Full B&W conversion, rich midtones, visible grain | Authoritative, luxury, editorial brands |
| **Ektar** | Kodak Ektar 100 | High saturation, deep blue skies, vivid reds | Playful, bold, outdoor brands |
| **Tri-X** | Kodak Tri-X 400 | High-contrast B&W, gritty grain, deep blacks | Urban, disruptive brands |

Implementation notes:
- Film presets are applied **after** resize and **before** the brand color overlay
- Only suggest a film preset if it aligns with the brand archetype — most brands skip this step
- When using a B&W preset (HP5, Tri-X), the brand overlay becomes more important as the sole source of brand color

### Treatment Variants

Not all images need the same level of treatment. Generate multiple variants per image so templates have options.

| Variant | Use case | Treatment |
|---------|----------|-----------|
| **Full brand** | Slide covers, hero images | Full pipeline per archetype parameters |
| **Light touch** | Accents, thumbnails, secondary imagery | Desaturate -20%, overlay at 8% |
| **Dark overlay** | Text-over-image backgrounds | Full pipeline + darken to 40-60% brightness |
| **Texture blur** | Subtle backgrounds, pattern fills | Full pipeline + heavy Gaussian blur (10-20px) |
| **Duotone** | Bold visual statements, social media | Map to two brand colors (brand dark + accent). Convert to grayscale first, then map shadows to dark color, highlights to accent. |
| **Gradient overlay** | Modern hero sections, web headers | Full pipeline + brand color gradient at 30-50% opacity (transparent top to brand-dark bottom, or left to right) |
| **Split-tone** | Editorial sophistication, magazine feel | Shadows tinted to brand dark color, highlights tinted to accent or warm neutral. Keep midtones relatively neutral. |
| **Vignette crop** | Portrait focus, detail emphasis | Full pipeline + darken edges 20-30%, center remains clear. Works best on 1:1 or 4:3 crops. |
| **High-key** | Clean/minimal brands, airy aesthetics | Increase brightness +15-25%, reduce contrast -10%, desaturate -10%. Very light brand overlay (5-8%). |

### Crop Variants for Template Integration

Generate multiple crops per processed image to serve different template contexts:

| Aspect ratio | Use case | Dimensions |
|--------------|----------|------------|
| **16:9** | Slide backgrounds, video thumbnails | 1920x1080 |
| **2:1** | Website headers, email banners | 1920x960 |
| **4:3** | Document headers, report covers | 1920x1440 |
| **1:1** | Social media, card thumbnails, avatars | 1080x1080 |

### Overlay Variants for Text Placement

For images used as backgrounds behind text, generate overlay-specific crops:

| Overlay type | Description | Implementation |
|--------------|-------------|----------------|
| **Lower-third safe** | Bottom 33% darkened for text placement | Gradient from transparent (top) to 70% black (bottom) |
| **Full even** | Entire image evenly darkened | Flat overlay at 45-55% opacity in brand dark color |
| **Left fade** | Left side darkened for left-aligned text | Horizontal gradient: 65% opacity (left) to transparent (right) |
| **Top fade** | Top portion darkened for header text | Vertical gradient: 60% opacity (top) to transparent (bottom) |

### Smart Cropping Guidance

When cropping, identify the focal point of each image and ensure it is not covered by typical text placement zones:

1. For **slide backgrounds**: text occupies the lower-left quadrant. Keep focal interest in the upper-right or distributed.
2. For **document headers**: text sits centered or left-aligned at 20-40% from top. Keep focal interest in the remaining area.
3. For **card images**: focal point should be centered since the image is small and often cropped tightly.

If the focal point conflicts with the text zone, prefer to shift the crop rather than the text placement.

### Processing Script Pattern

```javascript
const sharp = require('sharp');
const path = require('path');

async function processImage(inputPath, outputPath, options = {}) {
  const {
    brandColor = '#0A1628',
    saturation = 0.6,
    contrastGain = 1.15,
    overlayOpacity = 0.15,
    grain = false,
    grainAmount = 0.05,
    warmShift = false,
    coolShift = false,
  } = options;

  const [r, g, b] = [
    parseInt(brandColor.slice(1, 3), 16),
    parseInt(brandColor.slice(3, 5), 16),
    parseInt(brandColor.slice(5, 7), 16),
  ];

  let pipeline = sharp(inputPath)
    .resize(1920, null, { withoutEnlargement: true })
    .modulate({ saturation, brightness: 1.0 });

  // Color grading (warm or cool shift)
  if (warmShift) {
    pipeline = pipeline.tint({ r: 255, g: 245, b: 230 });
  } else if (coolShift) {
    pipeline = pipeline.tint({ r: 230, g: 240, b: 255 });
  }

  // Contrast
  pipeline = pipeline.linear(contrastGain, -(128 * (contrastGain - 1)));

  // Brand color overlay
  const overlayLayers = [{
    input: Buffer.from(
      `<svg width="1920" height="1080">
        <rect width="100%" height="100%" fill="rgb(${r},${g},${b})" opacity="${overlayOpacity}"/>
      </svg>`
    ),
    blend: 'multiply',
  }];

  pipeline = pipeline.composite(overlayLayers);

  // Grain (optional)
  if (grain) {
    pipeline = pipeline.composite([{
      input: await sharp({
        create: { width: 1920, height: 1080, channels: 1, noise: { type: 'gaussian', mean: 128, sigma: grainAmount * 255 } }
      }).png().toBuffer(),
      blend: 'soft-light',
      opacity: grainAmount,
    }]);
  }

  await pipeline
    .jpeg({ quality: 85 })
    .toFile(outputPath);
}

// Duotone variant
async function processDuotone(inputPath, outputPath, darkColor, lightColor) {
  const dark = hexToRgb(darkColor);
  const light = hexToRgb(lightColor);

  await sharp(inputPath)
    .resize(1920, null, { withoutEnlargement: true })
    .grayscale()
    .tint(light) // tint highlights
    .composite([{
      input: Buffer.from(
        `<svg width="1920" height="1080">
          <rect width="100%" height="100%" fill="rgb(${dark.r},${dark.g},${dark.b})" opacity="0.4"/>
        </svg>`
      ),
      blend: 'multiply',
    }])
    .jpeg({ quality: 85 })
    .toFile(outputPath);
}

// Dark overlay variant (for text backgrounds)
async function processDarkOverlay(inputPath, outputPath, options = {}) {
  const { brandColor = '#0A1628', darkness = 0.5 } = options;
  const [r, g, b] = hexToRgbArray(brandColor);

  await sharp(inputPath)
    .resize(1920, null, { withoutEnlargement: true })
    .modulate({ saturation: 0.6, brightness: 1.0 })
    .composite([{
      input: Buffer.from(
        `<svg width="1920" height="1080">
          <rect width="100%" height="100%" fill="rgb(${r},${g},${b})" opacity="${darkness}"/>
        </svg>`
      ),
      blend: 'multiply',
    }])
    .jpeg({ quality: 85 })
    .toFile(outputPath);
}

// Gradient overlay variant (for modern hero sections)
async function processGradientOverlay(inputPath, outputPath, options = {}) {
  const { brandColor = '#0A1628', direction = 'bottom', opacity = 0.4 } = options;
  const [r, g, b] = hexToRgbArray(brandColor);

  const gradients = {
    bottom: `x1="0" y1="0" x2="0" y2="1"`,
    left: `x1="1" y1="0" x2="0" y2="0"`,
    top: `x1="0" y1="1" x2="0" y2="0"`,
  };

  await sharp(inputPath)
    .resize(1920, null, { withoutEnlargement: true })
    .modulate({ saturation: 0.7, brightness: 1.0 })
    .composite([{
      input: Buffer.from(
        `<svg width="1920" height="1080">
          <defs>
            <linearGradient id="g" ${gradients[direction] || gradients.bottom}>
              <stop offset="0%" stop-color="rgb(${r},${g},${b})" stop-opacity="0"/>
              <stop offset="100%" stop-color="rgb(${r},${g},${b})" stop-opacity="${opacity}"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)"/>
        </svg>`
      ),
      blend: 'over',
    }])
    .jpeg({ quality: 85 })
    .toFile(outputPath);
}

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function hexToRgbArray(hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}
```

---

## Step 6: Guide Assembly

### Imagery Direction Guide (HTML)

The deliverable is a self-contained HTML page with **real images** (not placeholders). It should include:

1. Hero section with imagery philosophy statement
2. Visual language principles (4 cards: subjects, avoid, composition, treatment)
3. Image categories — each showing 3-4 real processed images in a grid
4. Treatment showcase — same image shown in all applied variants side-by-side
5. Crop showcase — one image shown in all 4 aspect ratios
6. Hero overlay mockups — top 3 hero images with sample text overlaid
7. Photo processing recipe in a monospace code block (with before/after if possible)
8. Archetype parameters table (the specific values used for this brand)
9. Sourcing platforms and search terms
10. Keyword tag clouds (yes/no with visual differentiation)
11. SVG asset showcase (dividers + pattern tile)

**Format**: The guide itself is HTML. Images referenced from `assets/images/` using relative paths.

### SVG Divider Assets

Create these reusable SVG elements based on the brand motif:

- **Full-width divider** — motif element spanning full content width, for section separators
- **Short divider** — fixed-width (60-120px) for section headers
- **Minimal divider** — smallest practical version for email signatures and tight spaces
- **Pattern tile** — repeating SVG tile (60x60 or 80x80) for CSS `background-image` with `background-repeat`. Subtle — brand dark color with very low-opacity geometric lines.

---

## HTML Image Display Rules (CRITICAL)

These rules apply to **all HTML deliverables** that display brand images — brand book, imagery guide, visual identity, exploration board, PPTX build scripts. Violations produce dark/broken image display.

### Never apply CSS `filter: grayscale()` to already-desaturated images

Source images that are already B&W (e.g., moody bridge photography) become nearly black when `grayscale(100%)` is applied on top. The processing pipeline handles desaturation at build time — CSS should never duplicate it.

**Wrong**: `filter: grayscale(100%);` or `filter: grayscale(100%) brightness(0.4);`
**Right**: No filter, or `filter: brightness(1.1);` if the source is dark

### Always use `object-position: center top` for dark/moody photography

Nighttime, architectural, and bridge images typically have the subject concentrated in the upper portion with dark water/sky below. Default `object-position: center center` with `object-fit: cover` shows mostly the dark lower area.

**Wrong**: `object-fit: cover;` (without position — defaults to center)
**Right**: `object-fit: cover; object-position: center top;`

Same for background images: `background-position: center top;` not `background-position: center;`

### Pre-crop dark images when embedding as base64

When images are embedded as base64 (brand book, self-contained HTML), pre-crop with Sharp to extract the interesting region before resizing. Dark architectural images need aggressive cropping.

```javascript
// Crop top portion where the subject lives, then resize
const meta = await sharp(filePath).metadata();
const cropH = Math.round(meta.height * 0.40); // top 40%
await sharp(filePath)
  .extract({ left: 0, top: 0, width: meta.width, height: cropH })
  .resize(width, height, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 1.3 }) // boost for dark sources
  .jpeg({ quality: 82 })
  .toBuffer();
```

### Always set `background-repeat: no-repeat` on image backgrounds

Missing this causes the image to tile, creating visible seams — especially on covers and hero sections.

### Always set `html, body { width: 100%; min-width: 100%; }` in self-contained HTML

Without this, cover/hero sections may not span the full viewport width.

### Rasterize SVG logos to PNG before base64 embedding

Inline SVGs with `width="100%"` overflow their containers unpredictably. Convert to PNG at a fixed height (e.g., 200px) using Sharp before base64 encoding:

```javascript
const buf = await sharp(svgPath, { density: 300 })
  .resize({ height: 200, fit: 'inside' })
  .png()
  .toBuffer();
return `data:image/png;base64,${buf.toString('base64')}`;
```

### Brightness boost for dark source images

Dark architectural/night photography benefits from a 1.2–1.4x brightness boost when displayed in cards, galleries, or thumbnails. Without this, `object-fit: cover` crops show mostly black.

---

## File Structure

```
assets/
├── divider-full.svg
├── divider-short.svg
├── divider-minimal.svg
├── pattern-tile.svg
└── images/
    ├── originals/               <- unprocessed downloads from stock/AI sources
    │   ├── architecture-01.jpg
    │   ├── texture-dark-marble.jpg
    │   ├── ai-abstract-pattern-01.jpg
    │   └── ...
    ├── architecture-01.jpg      <- brand-treated (full brand variant)
    ├── architecture-01-dark.jpg <- dark overlay variant
    ├── architecture-01-duotone.jpg
    ├── architecture-01-gradient.jpg
    ├── texture-dark-marble.jpg
    ├── crops/                   <- aspect ratio variants
    │   ├── architecture-01-16x9.jpg
    │   ├── architecture-01-2x1.jpg
    │   ├── architecture-01-4x3.jpg
    │   ├── architecture-01-1x1.jpg
    │   └── ...
    └── overlays/                <- text-safe overlay variants
        ├── architecture-01-lower-third.jpg
        ├── architecture-01-full-even.jpg
        ├── architecture-01-left-fade.jpg
        └── ...
```
