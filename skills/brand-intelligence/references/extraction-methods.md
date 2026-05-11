# Extraction Methods

Concrete techniques for each tier of the source trust hierarchy. SKILL.md has
the canonical workflow; this file is the implementation cookbook.

## Tier 1 — Press / Brand Kit Pages

Probe the canonical domain with `WebFetch` for each path:

```
/press
/brand
/brand-assets
/brand-guidelines
/media-kit
/media
/about/brand
/press-kit
/newsroom
```

Prompt for each:

> "Is this page a brand assets, press kit, or media kit page? If yes, list every
> URL on this page that points to a downloadable logo, brand guideline PDF,
> color palette image, or other brand asset. Return the URLs and a one-line
> description for each."

If the page exists and is a brand kit, every asset URL it lists is **Tier 1**
provenance. If the page exists but is a generic news/PR page, downgrade to
Tier 3 metadata only.

## Tier 2 — Web Manifest

```bash
curl -sSL "https://<domain>/site.webmanifest" -o "_build/brand-intelligence/<slug>/raw/site.webmanifest" || \
curl -sSL "https://<domain>/manifest.json" -o "_build/brand-intelligence/<slug>/raw/manifest.json"
```

Parse the JSON. Useful fields: `name`, `short_name`, `theme_color`,
`background_color`, `icons[]` (download every entry, classify by `sizes`).

If the homepage has `<link rel="manifest" href="...">`, prefer that URL over
the conventional paths.

## Tier 3 — HTML Head Metadata

Use Playwright `browser_evaluate` after `browser_navigate`:

```js
() => {
  const meta = (sel) => document.querySelector(sel)?.getAttribute('content') || null;
  const link = (sel) => Array.from(document.querySelectorAll(sel)).map(el => ({
    rel: el.rel, href: el.href, sizes: el.getAttribute('sizes'), type: el.type,
  }));
  return {
    title: document.title,
    description: meta('meta[name="description"]'),
    theme_color: meta('meta[name="theme-color"]'),
    og_image: meta('meta[property="og:image"]'),
    og_title: meta('meta[property="og:title"]'),
    twitter_image: meta('meta[name="twitter:image"]'),
    icons: link('link[rel*="icon"], link[rel="apple-touch-icon"]'),
    manifest: document.querySelector('link[rel="manifest"]')?.href || null,
  };
}
```

Download every URL in `icons` and `og_image`/`twitter_image` to raw/.

## Tier 4 — CSS Custom Properties

The single most valuable extraction. Real brand tokens are usually defined as
`--color-primary`, `--brand-yellow`, `--font-display`, etc. on `:root`.

```js
() => {
  const root = getComputedStyle(document.documentElement);
  const props = {};
  for (let i = 0; i < root.length; i++) {
    const name = root[i];
    if (name.startsWith('--')) props[name] = root.getPropertyValue(name).trim();
  }
  return props;
}
```

Filter the result:
- Keep entries whose name contains: `color`, `brand`, `primary`, `secondary`,
  `accent`, `neutral`, `bg`, `fg`, `text`, `font`, `family`, `display`, `body`
- Drop entries whose value is `0`, `0px`, `transparent`, or matches a generic
  spacing/sizing pattern (`1rem`, `4px`, etc.) unless the name suggests color
  or font

For colors, normalize to hex via Playwright (use a tiny eval that creates a
detached div, sets `style.color = value`, reads `getComputedStyle().color`,
parses the `rgb(...)` form).

## Tier 5 — Computed Styles On Semantic Elements

Sample known-meaningful elements only. Avoid arbitrary divs (they pick up
ads, third-party widgets, A/B test wrappers).

```js
() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      color: cs.color,
      background: cs.backgroundColor,
      fontFamily: cs.fontFamily,
      fontWeight: cs.fontWeight,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
    };
  };
  return {
    body: pick('body'),
    h1: pick('h1'),
    h2: pick('h2'),
    p: pick('main p, article p, body p'),
    header: pick('header'),
    footer: pick('footer'),
    cta: pick('a.button, button.primary, .cta, [class*="button-primary"], [class*="btn-primary"]'),
    link: pick('main a, article a'),
  };
}
```

Color extraction rule: if the same color appears on **3 or more** semantic
elements, it's a brand color. If it appears once on `cta` only, it's an accent
candidate. If it only appears on `body` text, it's neutral text — don't promote
to brand palette.

## Tier 6 — Logo Candidate Enumeration

```js
() => {
  const candidates = [];
  const sels = [
    'header img', 'header svg',
    'footer img', 'footer svg',
    'a[href="/"] img', 'a[href="/"] svg',
    '[class*="logo" i] img', '[class*="logo" i] svg',
    'img[alt*="logo" i]', 'img[src*="logo" i]',
  ];
  document.querySelectorAll(sels.join(', ')).forEach(el => {
    const rect = el.getBoundingClientRect();
    candidates.push({
      tag: el.tagName.toLowerCase(),
      src: el.src || el.getAttribute('href') || null,
      alt: el.alt || null,
      svg: el.tagName.toLowerCase() === 'svg' ? el.outerHTML.slice(0, 4000) : null,
      width: rect.width,
      height: rect.height,
      visible: rect.width > 0 && rect.height > 0,
      parent_class: el.parentElement?.className || null,
      ancestor_role: el.closest('header, footer, nav')?.tagName.toLowerCase() || null,
    });
  });
  // Dedupe by src
  const seen = new Set();
  return candidates.filter(c => {
    const key = c.src || c.svg?.slice(0, 200);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
```

For inline SVGs, the `outerHTML` IS the asset — write it to `raw/inline-<n>.svg`
directly. For `<img>` references, download via `curl`.

## Logo Classification Heuristics

After downloading, score each candidate:

| Signal | Score |
|--------|-------|
| File extension `.svg` | +3 |
| Found in `<header>` of homepage | +2 |
| Filename contains "logo" | +2 |
| Width on page > 100px | +1 |
| Aspect ratio between 2:1 and 6:1 (wordmark range) | +2 |
| Aspect ratio ~1:1 (icon range) | +1, classify as `logo-mark` not `logo-primary` |
| Source page is `/press` or `/brand` | +3 |
| File size > 100KB and PNG | -1 (likely a hero, not a logo) |

Highest-scoring SVG → `logo-primary`. Highest-scoring square → `logo-mark`.
Anything scoring < 4 → `unknown`, surface to user.

## Robots.txt

Before any Playwright run, fetch and respect:

```bash
curl -sSL "https://<domain>/robots.txt"
```

If `Disallow: /` for `*` or for the specific paths we want, **stop**. Document
the gate in `recon.json` and tell the user. Brand assets being public does not
override robots.txt — that's the site owner's explicit instruction.

## User-Agent

When using `curl` for direct asset downloads, send a real user agent so we're
not silently rate-limited:

```bash
curl -sSL -A "Mozilla/5.0 (compatible; stromy-brand-intelligence/1.0; +https://stromy.com.au)" ...
```

Identify ourselves honestly — that's the etiquette signal that distinguishes a
legitimate one-shot fetch from a hostile scrape.
