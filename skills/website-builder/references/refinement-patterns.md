# Refinement Patterns

Hard-won patterns from shipping client sites that should be applied during the
**initial** scaffold — not retrofitted later. Each pattern fixes a class of bug
or architectural issue we keep re-encountering. If you're generating a new site,
read this alongside `astro-patterns.md`.

---

## 1. `img-cover` must use absolute positioning

**The bug**: A parent element with `min-height` (but no explicit `height`) wraps
an `<img>` with `width: 100%; height: 100%; object-fit: cover;`. The image's
percentage-height does not resolve against `min-height`, so the image collapses
to its intrinsic height. Any coloured background, `::before`, or `::after`
overlay on the parent (e.g. a coral tint strip) becomes visible below the image.

**The fix**: fill the parent via absolute positioning, not percentage height.

```css
.img-cover {
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  isolation: isolate;
}
.img-cover > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

This pattern is the default for any "image in a shaped container with tint/border
overlay". Ship it in `global.css` on day one.

---

## 2. Vary image treatments across repeated blocks

When the same component appears 4+ times on a page (case studies, insights,
testimonials with imagery), identical framing makes the page read as a template
dump. Define 3–4 image treatments and cycle through them deterministically.

```css
.img-frame { position: relative; }
.img-frame::before {
  content: '';
  position: absolute;
  background: var(--accent-softer);
  z-index: 0;
}
.img-frame--offset-br::before { inset: var(--sp-5) calc(var(--sp-5) * -1) calc(var(--sp-5) * -1) var(--sp-5); }
.img-frame--offset-bl::before { /* mirror */ }
.img-frame--offset-tr::before { /* mirror */ }
.img-frame--border::before    { inset: 0; border: 1px solid var(--accent); background: transparent; transform: translate(var(--sp-3), var(--sp-3)); }

.img-cover--tall   { aspect-ratio: 3 / 4; }
.img-cover--wide   { aspect-ratio: 16 / 9; }
.img-cover--square { aspect-ratio: 1 / 1; }
.img-cover--hero   { aspect-ratio: 5 / 4; }
```

Usage — index-based cycling keeps the rhythm predictable but differentiated:

```astro
{items.map((item, index) => {
  const treatments = [
    { frame: "img-frame--offset-br", ratio: "img-cover--wide", tint: "img-cover--coral" },
    { frame: "img-frame--offset-tr", ratio: "img-cover--hero", tint: "" },
    { frame: "img-frame--border",    ratio: "img-cover--wide", tint: "img-cover--coral" },
    { frame: "img-frame--offset-bl", ratio: "img-cover--tall", tint: "" },
  ];
  const t = treatments[index % treatments.length];
  /* render with t.frame, t.ratio, t.tint */
})}
```

For light brands, omit the coral tint and use subtle borders. The treatment set
should be chosen per brand archetype (Ruler → restrained borders; Creator →
aggressive offsets; Sage → calm square ratios).

---

## 3. Metric grids: deterministic columns per count

Avoid `flex-wrap + min-width` for metric rows — it produces 3+1 orphans on
4-metric case studies. Use CSS grid with a count-aware class:

```astro
<div class:list={["case-metrics--row", `case-metrics--count-${metrics.length}`]}>
  {metrics.map(m => <div class="case-metric">...</div>)}
</div>
```

```css
.case-metrics--row { display: grid; gap: var(--sp-5) var(--sp-6); }
.case-metrics--count-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.case-metrics--count-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.case-metrics--count-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (min-width: 900px) {
  .case-metrics--count-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
```

4 metrics go 2×2 on narrow screens, 1×4 wide. No orphan rows ever.

---

## 4. Map embeds: OpenStreetMap iframe, no API key

For contact pages, never ship a "MAP LOADING…" placeholder. The default should
be an OSM iframe — no API key, no tracking, gracefully degrades.

Store office coordinates on `site.office`:

```ts
office: {
  street: "...",
  postalCode: "...",
  city: "...",
  country: "...",
  lat: 51.7095,
  lon: 5.2827,
  bbox: [5.2747, 51.7055, 5.2907, 51.7135] as [number, number, number, number],
}
```

```astro
---
const [minLon, minLat, maxLon, maxLat] = site.office.bbox;
const osmEmbedUrl =
  `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}` +
  `&layer=mapnik&marker=${site.office.lat}%2C${site.office.lon}`;
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
---
<div class="map-embed">
  <iframe src={osmEmbedUrl} loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  <div class="map-embed__card">
    <span class="map-embed__label">Find Us</span>
    <p class="map-embed__address">{address}</p>
    <a href={mapsLink} target="_blank" rel="noopener noreferrer">Open in Maps →</a>
  </div>
</div>
```

Key CSS: iframe is `position: absolute; inset: 0` inside a `position: relative;
min-height: 420px` parent. The address card floats bottom-left with
`backdrop-filter: blur(8px)` and an accent border-top. On mobile, stretch the
card full-width.

Use a grayscale/contrast filter on the iframe (`filter: grayscale(0.15)
contrast(1.02)`) to tone the raw OSM tiles into the brand.

---

## 5. Insight/article cards: real og:images from referenced pages

Placeholder gradient thumbnails on a Latest Thinking section look cheap. When
the insights array references external articles (press releases, bylines,
magazine features), source the actual og:image from each referenced URL,
download it into `public/assets/insights/`, and wire it onto the card.

**Workflow during scaffold**:
1. Extend `InsightItem` type with `image?: string; imageAlt?: string;`
2. For each insight URL, fetch og:image:
   - Preferred: WebFetch / curl + regex on `<meta property="og:image" content="...">`
   - Fallback: Playwright MCP — `browser_navigate` then `browser_evaluate` to
     extract `document.querySelector('meta[property="og:image"]').content`
3. Download each image to `public/assets/insights/insight-NN-<slug>.jpg`
4. Populate `image` + `imageAlt` fields in `company.ts`
5. Keep a fallback gradient variant in `InsightCard.astro` for entries without
   a real image

**Never hot-link** to external og:images — source domains may move/delete them,
and some hosts block hot-linking. Download and self-host.

---

## 6. Grid card equal-height + bottom-aligned CTA

Cards in a grid look broken when their bottom "Read more" links float at
different vertical positions because the excerpt text varies in length. Use
flex-column with `margin-top: auto` on the CTA.

```css
.insight-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.insight-card__body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.insight-card__excerpt {
  flex-grow: 1; /* consumes slack, pushes link down */
}
.insight-card__link {
  margin-top: auto;
}
```

The same pattern applies to any card in a grid — `ServiceCard`, `TeamCard`,
`ProgramCard`. Bake it into the base component shell, not as a page-level fix.

---

## 7. Content architecture rule: one canonical list per concept

**This is the most important pattern in this document.** When scaffolding, do
not generate three near-duplicate lists of the same concept on different pages.
A common anti-pattern we keep creating:

- Homepage "Our Expertise" — 6 cards with name + tagline
- `/what-we-do` "Capabilities" — short icon list
- `/what-we-do` "Services" — 7 detailed service cards
- All "Learn more" links point to the same `/what-we-do` page

The user reads this as redundant content and broken navigation — every card
promises depth but delivers the same anchor.

**Rule**: Services, capabilities, offerings, programmes — any list of "things
we do" — must resolve to **one canonical array** in `src/data/company.ts`
with a `slug` per entry and a detail page per slug.

### Canonical shape

```ts
export type Service = {
  slug: string;               // URL segment
  name: string;               // Card title
  tagline: string;            // One-liner for cards
  description: string;        // Longer card/body copy
  icon?: string;
  industryTags?: string[];
  deliverables?: string[];
  longform: {
    challenge: string;        // "The problem we solve"
    approach: string[];       // Bulleted process
    signals: string[];        // "Engage us when…"
  };
};
```

### Required pages

- **Homepage "Our Expertise"** — renders `services.slice(0, 6)`, each card
  links to `/services/${slug}`
- **`/what-we-do`** — renders all `services`, each card links to `/services/${slug}`
- **`/services/[slug].astro`** — dynamic route via `getStaticPaths()`, renders
  the full longform content for one service

### Forbidden

- A "Capabilities" short list that is a lesser version of services with no
  detail pages — either kill it or merge into services
- "Learn more" links that all point to the same `/what-we-do` page
- Hardcoded service copy duplicated in multiple `.astro` files

### Homepage ServiceCard must pass `href`

```astro
<ServiceCard {...service} href={`/services/${service.slug}`} />
```

The card component sets `.service-card` as `display: flex; flex-direction:
column; height: 100%;` and pins the CTA with `margin-top: auto;` so it
bottom-aligns across the grid.

### Dynamic service pages

```astro
---
// src/pages/services/[slug].astro
import { services } from "../../data/company";
export async function getStaticPaths() {
  return services.map(service => ({
    params: { slug: service.slug },
    props: { service },
  }));
}
const { service } = Astro.props;
---
```

Page layout: dark hero with back link + tagline + tags, two-column body
(Challenge / Approach / Signals on the left, sticky Deliverables + CTA card on
the right), followed by a "Related Services" strip showing 3 neighboring
services, followed by the CTA band.

This same rule applies to **any repeated concept**: case studies (→
`/cases/[slug]`), team members (→ `/team/[slug]` if bios are long enough),
insights (→ `/insights/[slug]` if we host them instead of linking out),
programmes (→ `/academy/[slug]`).

---

## 8. Partner/affiliate chips: link to the real agency, not a parent

When a brand lists an international network or umbrella partner (e.g. Paritee →
Geelmuyden Kiese, Brands2Life, LHLK, DVA Studio), link to each sub-agency, not
only the umbrella. Extend the data shape:

```ts
export type Affiliate = {
  name: string;
  region: string;
  description: string;
  href: string;
  partners?: Array<{ name: string; href: string; region: string }>;
};
```

Render the partners as a chip list inside each affiliate card, with an `Partner
agencies` label above. The chips should be visually distinct from the primary
affiliate link (lighter background, smaller type, region in mono-caps subtitle).

Verify each URL during scaffold with WebFetch or Playwright — stale links on a
"Global Reach" block are immediately obvious to visitors.

---

## 9. Contact page layout (flexible template)

The Duke contact page pattern, generalised:

```
Hero (short) — title + subtitle
│
Section 1 — two-column:
│  Sticky dark "Contact Info" card (address, phone, email, LinkedIn, founders)
│  Email inquiry router:
│    - Primary feature card (big CTA + phone fallback)
│    - Intro paragraph for specialised routes
│    - Grid of 3 specialised contact-card boxes (each with prefilled mailto)
│    - Note block with blank-draft fallback
│
Section 2 (alt bg) — OSM map embed + location blurb two-column
│
Section 3 — Global Reach / affiliates grid with partner chips (if applicable)
```

Not every site needs all four blocks — skip affiliates if the client has no
network, skip the map if the client is remote-only. The **pattern** is:
structured sticky info card + multi-route CTA + real map + optional network.
Don't ship bare "send us an email" pages.

For form-based contact pages (Formspree, Netlify Forms), see
`references/contact-page-patterns.md` — covers split-form layout, field design,
dark mode input styling, and discovery call CTA patterns.

All mailto links should be prefilled with subject + body templates so the user
doesn't face an empty draft:

```ts
const createMailto = (to: string, subject: string, body: string) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
```

---

## 10. Contact page theming: semantic tokens, never hardcoded backgrounds

Contact card components (`.contact-card`, `.contact-feature`) must use semantic
tokens that auto-adapt to light/dark themes. Never hardcode `rgba(255, 255, 255, ...)`
backgrounds — they break in dark mode.

```css
/* WRONG — breaks in dark mode */
.contact-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 243, 240, 0.96) 100%);
  box-shadow: 0 18px 40px rgba(28, 28, 30, 0.08);
}

/* RIGHT — adapts to theme */
.contact-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-md);
}
```

The `.contact-info` sidebar and `.contact-feature` are intentionally dark in both
themes (dark-on-dark hero treatment), so they keep their hardcoded dark gradients.
Only the inquiry cards and note blocks need semantic tokens.

For map embed address cards, use `backdrop-filter: blur(8px)` with a theme-aware
background:

```css
.map-embed__card { background: rgba(255, 255, 255, 0.95); }
:global([data-theme="dark"]) .map-embed__card { background: rgba(28, 28, 30, 0.92); }
```

---

## 11. Container sizing recommendation

Use `--container-max: 1320px` (not 1200px) for premium/editorial sites. The wider
container prevents content feeling cramped with 3-column grids, especially on
wide monitors. For minimal/portfolio sites, 1200px is still fine.

---

## 12. Dutch (NL) translation: keep corporate English terms

When generating NL translations for multilingual sites, review the output for
over-translated corporate jargon. In the Netherlands, many English business terms
are used as-is in professional communications. Over-translating them creates
illegible compound words and sounds unprofessional to the target audience.

**Terms that should stay in English in NL copy:**
- stakeholder intelligence, stakeholder engagement, stakeholder management,
  stakeholder advisory
- change management, employee engagement, employee communications
- talking points, playbook, framework, messaging matrix, briefing packs
- key messages, feedback loops, milestone, monitoring dashboard
- regulatory narrative, recovery strategy, capability, thought leadership
- public affairs, crisis management, due diligence

**Rules:**
1. If a Dutch compound exceeds ~20 characters, break it up or use the English term
2. Deliverable names are product names — keep in English when the Dutch compound is awkward
3. "Capaciteit" ≠ "Capability" (capaciteit means capacity/volume — a common mistranslation)
4. Use `minmax(0, 1fr)` in grids + `overflow-wrap: break-word; hyphens: auto;` on
   card titles as a CSS safety net for any remaining long words
5. After generating all NL content, do a quick scan for monster-compounds (>20 chars)
   and break them up

---

## 13. Scroll reveal: synchronous above-fold check

**The bug**: `IntersectionObserver` fires its initial callback asynchronously —
often several frames after `observe()` is called. If the page adds a
`motion-ready` class that hides elements (via `clip-path`, `opacity`, or
`transform`) *before* the observer fires, above-fold content is invisible for
at least one frame. Under load, on some browsers, or with Playwright/automated
testing, the callback may never fire for elements that were already in the
viewport when observed.

**The fix**: Before creating the observer, do a synchronous viewport check for
every reveal element using `getBoundingClientRect()`. Only pass below-fold
elements to the observer.

```javascript
function initReveal() {
  document.documentElement.classList.add("motion-ready");
  var selectors = '.fade-up:not(.in-view), .clip-reveal:not(.in-view), .stagger-fade:not(.in-view)';
  var els = document.querySelectorAll(selectors);
  if (!els.length) return;

  // Synchronous check for above-fold elements
  function revealIfVisible(el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('in-view');
      return true;
    }
    return false;
  }

  var deferred = [];
  els.forEach(function(el) {
    if (!revealIfVisible(el)) deferred.push(el);
  });

  if (!deferred.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 80px 0px' });
  deferred.forEach(function(el) { observer.observe(el); });
}
initReveal();
document.addEventListener('astro:after-swap', initReveal);
```

Key details:
- `threshold: 0` (not `0.1`) — a single pixel of intersection is enough to trigger
- `rootMargin: '0px 0px 80px 0px'` — start revealing 80px before the element
  enters the viewport for smoother scroll experience
- The synchronous check runs *before* any observer is created, so above-fold
  content never flickers
- Re-init on `astro:after-swap` for ClientRouter (View Transitions) compatibility

---

## 14. CSS `@layer` cascade for Tailwind v4

**The bug**: In Tailwind v4, all utilities are generated inside `@layer utilities`.
The CSS cascade gives **unlayered** styles higher priority than any `@layer` —
regardless of specificity or source order. So an unlayered base rule like
`h1 { color: var(--text-heading) }` silently overrides `class="text-white"`,
because the utility lives inside `@layer utilities` and the base rule is
unlayered.

This is a Tailwind v4-specific issue. The old `tailwind.config.js` approach
didn't have this problem because Tailwind v3 used its own specificity system.

**The fix**: Wrap ALL base element styles in `@layer base` and ALL component
classes in `@layer components`. The cascade order is then:
`base < components < utilities` — Tailwind utilities always win.

```css
/* WRONG — unlayered styles override Tailwind utilities */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--text-heading);
}

.display-xl {
  font-size: clamp(3rem, 6vw, 5.5rem);
}

/* RIGHT — layered styles respect Tailwind utility overrides */
@layer base {
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: var(--text-heading);
  }
}

@layer components {
  .display-xl {
    font-size: clamp(3rem, 6vw, 5.5rem);
  }
}
```

**Exception**: Scroll reveal animation rules (`.motion-ready .clip-reveal`,
`.motion-ready .fade-up`, etc.) should remain **unlayered** — they need to
override both component and utility styles to correctly hide/reveal content.
The `reduced-motion` media query rules should also stay unlayered.

**Quick test**: If a Tailwind utility class like `text-white` or `bg-black` is
being ignored on an element, check whether there's an unlayered CSS rule setting
the same property. Wrap it in the appropriate `@layer`.

---

## 15. ClientRouter script patterns (View Transitions)

**The bug**: Astro's ClientRouter (View Transitions) swaps the `<body>` on
navigation. `is:inline` scripts that capture DOM references in closures go stale
after a swap — click handlers stop working, `getElementById` returns null or
points to a removed element.

Three common failures:

1. **Duplicate IDs**: A component rendered twice (e.g., ThemeToggle in desktop
   nav AND mobile menu) creates two elements with the same `id`.
   `getElementById` only finds the first one. After a page swap, even that
   reference is stale.

2. **Stale closure**: An IIFE captures `var btn = getElementById('toggle')` and
   registers click handlers. After `astro:after-swap`, `btn` points to the old
   (removed) DOM node.

3. **Duplicate listeners**: Re-running `addEventListener` on `astro:after-swap`
   without cleanup creates multiple listeners on new elements.

**The fix**:

```javascript
// Use data attributes, not IDs, for multi-instance components
// Use .onclick assignment (idempotent) instead of addEventListener
// Re-query DOM in the init function, called on both load and swap

function initToggle() {
  var btns = document.querySelectorAll('[data-theme-toggle]');
  if (!btns.length) return;

  function update() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btns.forEach(function(btn) {
      btn.querySelector('.icon-sun').classList.toggle('hidden', !isDark);
      btn.querySelector('.icon-moon').classList.toggle('hidden', isDark);
    });
  }
  update();

  btns.forEach(function(btn) {
    btn.onclick = function() {  // idempotent — no duplicate listeners
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      update();
    };
  });
}
initToggle();
document.addEventListener('astro:after-swap', initToggle);
```

Rules:
- **Never use `id` for components that render more than once** — use
  `data-*` attributes with `querySelectorAll`
- **Always re-query DOM in `astro:after-swap` handlers** — never rely on
  captured references from a previous page
- **Use `.onclick =` assignment** instead of `addEventListener` — it's
  idempotent and automatically replaces any previous handler
- **FOUC prevention scripts in `<head>` are fine** — they run before body
  swap and don't need re-initialization

---

## 16. Contact form: Formspree vs. mailto patterns

**The bug**: Formspree requires a **form ID** (e.g., `https://formspree.io/f/xrgndqog`),
not an email address. Using `https://formspree.io/f/hello@example.com` silently
fails — the form submits but Formspree returns an error.

**Pattern A — Mailto (default for simple sites)**:

When the charter specifies `contactForm: "mailto"` or for GitHub Pages sites
without a backend, use a JavaScript form handler that composes a mailto link:

```javascript
form.onsubmit = function(e) {
  e.preventDefault();
  var data = new FormData(form);
  var subject = encodeURIComponent(
    'Inquiry from ' + data.get('name') + ' — ' + data.get('inquiry')
  );
  var body = encodeURIComponent(
    'Name: ' + data.get('name') +
    '\nEmail: ' + data.get('email') +
    '\nCompany: ' + (data.get('company') || 'N/A') +
    '\n\n' + data.get('message')
  );
  window.location.href = 'mailto:' + siteEmail + '?subject=' + subject + '&body=' + body;
};
```

**Pattern B — Formspree (when a hosted form is needed)**:

1. User must create a form at formspree.io and get the form ID
2. Use `action="https://formspree.io/f/{FORM_ID}"` with `method="POST"`
3. Add `name` attributes to all form fields (Formspree reads these)
4. Add a hidden `_replyto` field set to the user's email input
5. Never put the email address in the URL — only the form ID

**Pattern C — Netlify Forms**:

Only for Netlify-deployed sites. Add `data-netlify="true"` to the `<form>` tag.

**Default selection**: Use mailto for GitHub Pages and simple brochure sites.
Use Formspree when the client explicitly wants form submissions without opening
an email client. Use Netlify Forms only when deployed to Netlify.

---

## Quick checklist — bake these in during Phase 2/3

- [ ] `.img-cover > img` uses `position: absolute; inset: 0` (not percentage height)
- [ ] Repeated image blocks cycle through ≥3 treatments (frames, ratios, tints)
- [ ] Metric grids use `case-metrics--count-N` classes, not `flex-wrap`
- [ ] Contact page has a real OSM map embed, not a placeholder
- [ ] `site.office` has `lat`, `lon`, `bbox` fields
- [ ] Insight cards have equal height and bottom-aligned links (flex-column +
      `margin-top: auto`)
- [ ] Insight `image` fields are real og:images downloaded to `public/assets/insights/`
- [ ] Services/capabilities/expertise resolve to **one** canonical array with
      per-slug detail pages — never three near-duplicate lists
- [ ] Homepage "Our Expertise" cards link to `/services/${slug}`, not `/what-we-do`
- [ ] Dynamic service route exists: `src/pages/services/[slug].astro`
- [ ] Affiliate/partner blocks link to each sub-agency (chips) when relevant
- [ ] All mailto links are prefilled with subject + body templates
- [ ] Contact cards use `var(--card-bg)` + `var(--card-border)`, not hardcoded backgrounds
- [ ] All components work in both light and dark themes (toggle and verify)
- [ ] Container max is 1320px for premium sites
- [ ] Grid columns use `minmax(0, 1fr)`, not bare `1fr` (prevents long-word blowout)
- [ ] NL translations reviewed: no monster-compounds, corporate English terms retained
- [ ] Scroll reveal uses synchronous `getBoundingClientRect()` for above-fold
      elements, not observer-only
- [ ] All base element styles wrapped in `@layer base`, component classes in
      `@layer components` (Tailwind v4 cascade)
- [ ] Multi-instance components use `data-*` attributes, not `id` selectors
- [ ] All `is:inline` scripts re-init on `astro:after-swap` with fresh DOM queries
- [ ] Contact form uses correct integration pattern (mailto / Formspree ID / Netlify)
