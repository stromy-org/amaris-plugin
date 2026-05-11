# Internationalization (i18n) Patterns — Optional

Guidance for generating and maintaining Astro client websites in multiple languages.
**Entirely optional.** A site only uses this when `charter.website.i18n.enabled === true`.

When absent, the website is single-language and all i18n tooling is skipped.

---

## Charter Schema Addition

Add under `charter.website.i18n`:

```jsonc
{
  "enabled": true,
  "defaultLocale": "en",
  "locales": ["en", "fr", "nl"],
  "labels": {
    "en": "English",
    "fr": "Français",
    "nl": "Nederlands"
  },
  "routing": "prefix-default",        // "prefix-default" | "prefix-non-default"
  "fallbackLocale": "en",              // Render defaultLocale when a translation is missing
  "localeDetection": false,            // Server-side redirect based on Accept-Language (disable for static hosts)
  "translationWorkflow": "inline",     // "inline" | "tms" (Lokalise/Crowdin/Phrase)
  "translateContentCollections": true  // Mirror /blog, /case-studies per locale
}
```

**Defaults when `i18n.enabled === false` or absent**: the site is single-language. No
locale directories, no `hreflang`, no language switcher.

**Routing modes**:
- `prefix-default` — every locale in the URL (`/en/`, `/fr/`). Simplest for SEO clarity.
- `prefix-non-default` — default locale at `/`, others at `/fr/`, `/nl/`. Keeps clean root URLs.

---

## Design Principles (follow these in every phase)

1. **Externalize every user-facing string.** Never hardcode copy in components. All text
   lives in locale resource files or MDX collections, keyed by a stable ID.
2. **UTF-8 everywhere.** Astro handles this by default; do not override.
3. **Localize dates, numbers, currencies** via the `Intl` API — never string templates.
4. **Text expansion.** Design components to absorb ~40% longer strings (German, French).
   Avoid fixed-width buttons and one-line hero headlines that would wrap awkwardly.
5. **Bidirectional readiness.** Use CSS logical properties (`margin-inline-start`,
   `padding-block`) so adding RTL later is a one-line `dir="rtl"` change.
6. **Locale-aware assets.** Images with embedded text must have per-locale variants; prefer
   text overlays rendered in HTML/CSS.
7. **hreflang on every page.** Include `<link rel="alternate" hreflang="...">` for each
   locale plus `x-default`.
8. **Language switcher preserves the path.** Switching from `/fr/about` must land on
   `/en/about`, not the homepage. Never auto-redirect based on IP alone.
9. **Persist the user's choice** in a cookie (`NEXT_LOCALE` or `site_locale`).

---

## Astro Implementation

Astro ships first-class i18n. Configure in `astro.config.mjs`:

```js
// For prefix-default routing with mirrored page sets per locale:
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'nl'],
    routing: {
      prefixDefaultLocale: true,   // or false per charter
    },
    // Do NOT add `fallback` + `fallbackType: 'redirect'` when both locales
    // have their own pages — Astro generates redirect responses instead of
    // rendering actual pages. Fallback is handled by pickLocale() defaulting
    // to EN at runtime.
  }
});
```

### Directory layout

```
src/
├── i18n/
│   ├── ui.ts                 # UI strings per locale
│   └── utils.ts              # t(key), getLocaleFromUrl(), localizedPath()
├── pages/
│   ├── index.astro           # defaultLocale home (if prefixDefaultLocale=false)
│   ├── about.astro
│   ├── fr/
│   │   ├── index.astro
│   │   └── about.astro
│   └── nl/
│       ├── index.astro
│       └── about.astro
└── content/
    ├── blog/
    │   ├── en/
    │   ├── fr/
    │   └── nl/
    └── case-studies/
        ├── en/
        ├── fr/
        └── nl/
```

### Minimal `src/i18n/ui.ts`

```ts
export const languages = { en: 'English', fr: 'Français', nl: 'Nederlands' } as const;
export const defaultLang = 'en';

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'hero.cta': 'Get in touch',
  },
  fr: {
    'nav.about': 'À propos',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'hero.cta': 'Nous contacter',
  },
} as const;
```

### Minimal `src/i18n/utils.ts`

```ts
import { ui, defaultLang, type languages } from './ui';

export function getLocaleFromUrl(url: URL): keyof typeof languages {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof languages;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function localizedPath(path: string, lang: string) {
  if (lang === defaultLang) return path;
  return `/${lang}${path.startsWith('/') ? path : '/' + path}`;
}
```

### hreflang in `BaseLayout.astro`

```astro
---
const { pathname } = Astro.url;
const pathWithoutLocale = pathname.replace(/^\/(fr|nl)/, '') || '/';
const locales = ['en', 'fr', 'nl'];
---
{locales.map(l => (
  <link
    rel="alternate"
    hreflang={l}
    href={l === 'en' ? pathWithoutLocale : `/${l}${pathWithoutLocale}`}
  />
))}
<link rel="alternate" hreflang="x-default" href={pathWithoutLocale} />
```

### Language switcher

Switcher must compute the sibling path, not hardcode `/`:

```astro
---
import { languages } from '../i18n/ui';
const { pathname } = Astro.url;
const stripped = pathname.replace(/^\/(fr|nl)/, '') || '/';
---
<nav aria-label="Language">
  {Object.entries(languages).map(([code, label]) => (
    <a href={code === 'en' ? stripped : `/${code}${stripped}`}>{label}</a>
  ))}
</nav>
```

### Localized content collections

Define the schema once; branch folders per locale. Query with a `locale` filter:

```ts
// src/content.config.ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    locale: z.enum(['en', 'fr', 'nl']),
    translationKey: z.string(), // shared ID across locales for cross-linking
  }),
});
```

### Sitemap

`@astrojs/sitemap` auto-handles `hreflang` when Astro's `i18n` config is set. Ensure
`site` is set in `astro.config.mjs`.

---

## Translation Workflow

Three modes, selected by `charter.website.i18n.translationWorkflow`:

### Mode A — LLM (default)

Claude Code performs translation in-session, guided by a glossary, brand-voice file,
and a translation ledger that caches approved outputs by source hash. No API key, no
Node script, no TMS. Deterministic under re-runs because approved translations are
reused verbatim.

**Full specification**: `references/llm-translation-workflow.md`

Key files:
- `src/i18n/glossary.md` — no-translate terms + preferred locale equivalents
- `src/i18n/brand-voice.md` — archetype, register, tone, few-shot anchors
- `.i18n/translation-ledger.json` — source hash → approved translation cache
- `src/i18n/ui.<locale>.ts` — per-locale UI string files (split, not monolithic)
- `src/i18n/pickLocale.ts` — tiny runtime helper for `Localized<T>` objects

This is the recommended workflow for new sites. It requires no external dependencies
and produces reviewable diffs in git.

### Mode B — Inline (small sites)

Translations live in `src/i18n/ui.ts` and inside MDX frontmatter. Translators edit
directly in PRs. Fine for ≤3 locales and low content volume. No glossary enforcement
or ledger — purely manual.

### Mode C — TMS integration

Connect to Lokalise, Crowdin, or Phrase. Export UI keys to JSON/PO files, sync via CI.
Adds a `scripts/sync-translations.ts` step and a `.tms/` config directory.

Regardless of mode, keep a **glossary** (`src/i18n/glossary.md`) with brand terms that
must not be translated (product names, trademarks).

---

## QA Requirements for i18n Sites

Add these to the standard QA checklist:

- [ ] Every page renders at every locale without 404
- [ ] `hreflang` tags present on every page, including `x-default`
- [ ] Language switcher preserves the current path across locales
- [ ] No hardcoded English strings (grep for common copy; pseudo-localize test)
- [ ] Dates/numbers/currencies formatted per `Intl` API
- [ ] Text expansion: German/French translations don't break layouts
- [ ] Fallback locale renders when a translation is missing (no blank strings)
- [ ] Sitemap includes all locales with correct `hreflang`
- [ ] Content collections: every `translationKey` has an entry per locale (or is
      consciously single-locale with a `locale` field)
- [ ] 404 page localized

### Pseudo-localization test

Before real translations exist, run a pseudo-locale (`en-XA`) that wraps strings with
accented characters and padding. Catches hardcoded strings and layout breaks early.

---

## Scaffold Impact

When `charter.website.i18n.enabled === true`, the scaffold step additionally:

1. Creates `src/i18n/`, `src/pages/<locale>/` per locale (including default when
   `prefixDefaultLocale: true`), and `src/content/<collection>/<locale>/` for every
   enabled content collection.
2. Writes per-locale UI string files: `src/i18n/ui.en.ts`, `src/i18n/ui.<locale>.ts`
   with keys for nav + hero CTA.
3. Adds the `i18n` block to `astro.config.mjs`.
4. Generates `BaseLayout` with `hreflang` emission.
5. Adds the language switcher component (`src/components/ui/LangSwitcher.astro`).
6. Seeds `src/i18n/glossary.md` with the brand name as a no-translate term.
7. Seeds `src/i18n/brand-voice.md` from charter archetype + register inference.
8. Creates `.i18n/translation-ledger.json` with `schemaVersion: 1` and empty entries.
9. Writes `src/i18n/pickLocale.ts` — the runtime helper for `Localized<T>` objects.

When i18n is **disabled**, none of the above happens and the site stays single-locale.

---

## Maintenance Operations (i18n-specific)

### Adding a new locale

1. Update `charter.website.i18n.locales` and `labels`.
2. Update `astro.config.mjs` `locales` array and `fallback` map.
3. Add entries to `src/i18n/ui.ts`.
4. Create `src/pages/<locale>/` by copying default-locale pages.
5. Create `src/content/<collection>/<locale>/` folders.
6. Run `npm run build` to catch missing keys.

### Adding a translated page

1. Create the page at `src/pages/<locale>/<name>.astro`.
2. Ensure all UI strings use `t('key')`, not hardcoded text.
3. Verify hreflang renders for the new page.

### Adding a translated blog post or case study

1. Pick a `translationKey` (share across locales).
2. Create one MDX file per locale under `src/content/<collection>/<locale>/<slug>.mdx`.
3. Each file has the same `translationKey` but locale-specific `title`, `description`,
   and body.

### Syncing translations from a TMS

If `translationWorkflow === 'tms'`:
```bash
npm run translations:pull   # Fetch latest translations
npm run build                # Verify no missing keys
```
Review PR diff, merge.

### Removing a locale

1. Remove from `charter.website.i18n.locales`.
2. Delete `src/pages/<locale>/` and `src/content/*/<locale>/`.
3. Update `astro.config.mjs`.
4. Verify hreflang map no longer references the removed locale.
5. Set up 301 redirects from the old locale paths.

---

## Practical Notes (from Duke Strategies pilot, 2026-04)

Lessons learned from the first full i18n rollout. These are non-binding guidance —
adjust per project.

### Page structure

1. **Page duplication is simpler than shared page components.** Full page copies with
   only `const lang = "en"` → `"nl"` and href prefixes changed is simpler, more
   readable, and easier to maintain than extracting page bodies into shared components
   with `<PageBody lang="en"/>`. The duplication is minimal (just the lang const and
   href prefixes). Sed substitution creates locale copies in seconds.

2. **Redirect stubs at root paths.** When using `prefixDefaultLocale: true`, create
   meta-refresh redirect stubs at the old paths (`/`, `/who-we-are`, etc.) pointing to
   `/en/...`. Include `<link rel="canonical">` on each stub.

3. **Template literal hrefs need manual fixup after sed.** When creating locale page
   copies via sed, backtick template literals like `` `/en/services/${slug}` `` are
   missed by simple `s|/en/|/nl/|` substitution. Always do a manual pass on template
   literals after mechanical substitution.

### Data architecture

4. **Defer `Localized<T>` refactoring to the translation phase.** Wrapping strings in
   `{ en: "..." }` then immediately adding `nl` in the next phase means touching every
   data entry twice. Combine into one pass during translation.

5. **`pickLocale.ts` type constraint:** `field[defaultLocale]` doesn't satisfy
   TypeScript when `defaultLocale` is a variable — use `field.en` directly in the
   fallback to ensure the return type is `T` not `T | undefined`.

6. **Nav uses `labelKey: UIKey`, not `label: string`.** Navigation items reference UI
   string keys, resolved via `t(item.labelKey)` at render time. The generated
   website-maintain skill must document this pattern so agents don't try to edit label
   strings in nav.ts directly.

7. **Component props remain plain strings.** Card components (`ServiceCard`, `TeamCard`,
   etc.) accept `string` props. The `pickLocale()` call happens at the page level when
   passing props — components don't need to know about `Localized<T>`.

### Translation specifics

8. **Array fields need special handling.** `industries[]`, `deliverables[]`,
   `approach[]`, `signals[]` — each array element becomes `Localized<string>`, not the
   array itself. The type is `Localized<string>[]`, each element resolved via
   `pickLocale(element, lang)`.

9. **Contact page mailto templates** are a translation edge case — the email body
   contains translatable greeting/field labels but also the recipient email and subject
   line. The glossary should explicitly address mailto body translation rules.

### Generated skill docs

10. **List ALL i18n file locations in Quick Orientation.** `src/i18n/`, `.i18n/`,
    per-locale page directories, redirect stubs. Without this, agents add content to
    the wrong location.

11. **Every content workflow needs a "then translate" reminder.** The most likely
    failure mode is an agent editing EN content, committing, and forgetting to run the
    translation workflow — leaving the other locale stale.

12. **Visual audit route table must include both locale prefixes.** Double the route
    list when i18n is enabled.

### Pre-translation sweep

13. **Inline hardcoded strings are the #1 translation gap.** Before the first
    translation pass, do a systematic sweep of all page templates to extract every
    hardcoded string to `ui.en.ts`. Testimonial quotes, section headings, button labels
    embedded inline in pages are easy to miss.
