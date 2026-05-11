# Astro Implementation Patterns

Patterns for building Astro 5/6 websites with Tailwind CSS 4, MDX, and the three-tier
token system.

## Project Configuration

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**Note**: Do NOT add `@astrojs/preact` unless genuinely interactive islands are needed.
CSS + Astro View Transitions handle nav toggles and animations.

### Tailwind CSS 4

Tailwind v4 uses `@theme` directives in CSS instead of `tailwind.config.js`:

```css
@import "tailwindcss";
@import "./brand-tokens.css";

@theme {
  --color-primary: #FF7F66;
  --color-secondary: #DFDFE0;
  /* ... */
  --font-heading: "Montserrat", sans-serif;
  --font-body: "Montserrat", sans-serif;
}
```

This makes brand colors/fonts available as Tailwind utilities: `bg-primary`, `text-accent`,
`font-heading`, etc.

### Tailwind v4 Cascade Rules

Tailwind v4 generates utilities inside `@layer utilities`. The CSS cascade gives
**unlayered** styles higher priority than any `@layer`. This means an unlayered
base rule silently overrides Tailwind utility classes — regardless of specificity.

**Mandatory structure for `global.css`**:

```css
@import url("https://fonts.googleapis.com/css2?family=...");
@import "tailwindcss";
@import "./brand-tokens.css";

@theme {
  /* Tier 1 primitives — registered as Tailwind utilities */
}

/* Tier 2 semantic tokens — NOT in a layer (CSS custom properties only) */
:root { --surface-primary: ...; }
[data-theme="dark"] { --surface-primary: ...; }

@layer base {
  /* Element-level defaults — Tailwind utilities CAN override these */
  body { font-family: var(--font-body); color: var(--text-body); }
  h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); color: var(--text-heading); }
}

@layer components {
  /* Named classes — Tailwind utilities CAN override these */
  .display-xl { font-size: clamp(3rem, 6vw, 5.5rem); }
  .section-kicker { font-family: var(--font-mono); }
  .surface-panel { background: var(--card-bg); border: 1px solid var(--border-subtle); }
}

/* Scroll reveal rules — intentionally unlayered (must override utilities) */
.motion-ready .clip-reveal { clip-path: inset(100% 0 0 0); opacity: 0; }
.motion-ready .clip-reveal.in-view { clip-path: inset(0); opacity: 1; }
```

**Why semantic tokens are unlayered**: CSS custom property declarations
(`:root { --surface-primary: ... }`) don't compete with Tailwind utilities —
they define variables, not property values. Only rules that set actual CSS
properties (`color`, `background`, `font-family`) need layering.

See `refinement-patterns.md` §14 for the full explanation and failure mode.

### Content Collections (Astro 5+/6)

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

**Access pattern**:
```typescript
import { getCollection, render } from 'astro:content';
const posts = await getCollection('blog');
const { Content } = await render(entry); // NOT entry.render()
```

## Component Patterns

### Astro Component Structure

```astro
---
// Frontmatter: runs at build time
interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
}
const { title, variant = 'primary' } = Astro.props;
---

<section class="section-wrapper">
  <h2 class="display-lg">{title}</h2>
  <slot />
</section>

<style>
  .section-wrapper {
    padding: var(--section-padding);
    max-width: var(--layout-max-width);
    margin: 0 auto;
  }
</style>
```

### Layout Pattern (BaseLayout)

```astro
---
import { ClientRouter } from "astro:transitions";
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image } = Astro.props;
const canonicalUrl = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonicalUrl} />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={image} />}
    <ClientRouter />
  </head>
  <body>
    <slot />
    <!-- Scroll reveal script -->
  </body>
</html>
```

### Dynamic Routing

```astro
---
// src/pages/case-studies/[slug].astro
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('caseStudies');
  return entries.map(entry => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
```

## Styling Patterns

### Google Fonts Import

Build the import URL from charter.fonts:

```css
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Space+Mono:wght@400&display=swap");
```

**Rule**: URL-encode font names with spaces. Use `display=swap` for performance.

### Typography Classes

Define responsive typography using `clamp()`:

```css
.display-xl {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 6vw, 5.5rem);
  line-height: 1.05;
  letter-spacing: var(--letter-spacing-heading);
}
```

Scale sizes based on `charter.website.typography.headingScale`.

### Section Dark/Light Alternation

```astro
---
const isDark = sectionIndex % darkSectionFrequency === 0;
---

<section class:list={[
  'section-wrapper',
  isDark ? 'bg-dark text-on-dark' : 'bg-light'
]}>
```

### Image Handling

Use Astro's built-in image optimization:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../brand/images/cover.jpg';
---

<Image
  src={heroImage}
  alt="Description"
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

For dynamic images (from content collections), use standard `<img>` with responsive srcset.

## Scroll Reveal Pattern

Progressive enhancement: content is visible by default. The `motion-ready` class
gates animations so content stays visible if JS fails or hasn't loaded.

**Critical**: Always check above-fold elements synchronously before deferring to
IntersectionObserver. The observer callback is async and may not fire immediately
for elements already in the viewport. See `refinement-patterns.md` §13 for the
full pattern and rationale.

```javascript
function initReveal() {
  document.documentElement.classList.add("motion-ready");
  var selectors = '.fade-up:not(.in-view), .clip-reveal:not(.in-view), .stagger-fade:not(.in-view)';
  var els = document.querySelectorAll(selectors);
  if (!els.length) return;

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

## Data Files Pattern

```typescript
// src/data/site.ts
export const site = {
  name: 'Duke Strategies',
  tagline: 'Bridging Strategy and Impact',
  url: 'https://dukestrategies.com',
  nav: [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Contact', href: '/contact' },
  ],
} as const;
```

## ClientRouter Script Patterns

Astro's ClientRouter (View Transitions) swaps the `<body>` on navigation. This
breaks `is:inline` scripts that capture DOM references in closures.

### Rules

1. **No duplicate IDs** — Components rendered twice (desktop + mobile nav) must
   use `data-*` attributes with `querySelectorAll`, not `getElementById`
2. **Re-query DOM on swap** — `astro:after-swap` handlers must re-query elements,
   not rely on captured references from a previous page
3. **Idempotent handlers** — Use `.onclick =` assignment instead of
   `addEventListener` to avoid duplicate listeners after re-init
4. **FOUC scripts are exempt** — `<script is:inline>` in `<head>` that runs
   before body paint (e.g., theme detection) doesn't need re-init

### Pattern

```javascript
function initComponent() {
  // Always re-query — never cache across page swaps
  var els = document.querySelectorAll('[data-my-component]');
  if (!els.length) return;

  els.forEach(function(el) {
    el.onclick = function() { /* handler */ };  // idempotent
  });
}
initComponent();
document.addEventListener('astro:after-swap', initComponent);
```

See `refinement-patterns.md` §15 for detailed failure modes.

## Performance Checklist

- Use Astro Image for all images (automatic WebP, responsive srcset)
- Preload critical fonts with `<link rel="preload">`
- Inline critical CSS in BaseLayout head
- Use `loading="lazy"` for below-fold images
- Minimize client-side JS — prefer CSS animations over JS
- Use Astro View Transitions instead of SPA routing
