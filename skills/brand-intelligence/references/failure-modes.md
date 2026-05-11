# Failure Modes

Common ways brand intelligence runs go wrong, and the recovery for each. The
overarching rule: **partial bundles with explicit gaps are good outcomes;
silently inventing values is a bad outcome**.

## JS-rendered SPA with no useful HTML

**Symptom:** `WebFetch` returns a near-empty body, no `<head>` metadata, no
`<img>` tags. Page is rendered client-side.

**Recovery:** Skip `WebFetch` for that page; use Playwright `browser_navigate`
+ `browser_wait_for` (network idle or specific selector). Run extraction JS
after the page is fully hydrated. Mark all extracted values with `method:
post_hydration_dom` and downgrade confidence by one tier as a precaution.

## Logo only baked into a hero PNG

**Symptom:** Header has no `<img>` or `<svg>` — it's a single hero bitmap with
the logo inside it.

**Recovery:** Do not crop the hero and call it a logo. Mark `logo.primary` as
a gap in `charter.candidate.json`. Surface in Phase 5 with the message: "No
extractable logo found — header uses an embedded hero image. Need user-provided
SVG or PNG."

## Multi-brand corporate site

**Symptom:** Domain hosts multiple subsidiary brands (WPP → Burson, Ogilvy,
Hill+Knowlton; Publicis → Saatchi, Leo Burnett). Homepage visual identity is
the parent group's, not the target brand's.

**Recovery:** Stop in Phase 0. Require user to confirm the **subsidiary's own
canonical domain** (e.g. `bursoncw.com`, not `wpp.com`). If the subsidiary has
no own domain and only a parent-group landing page, the brand-intelligence
output will be inherently weak — surface this to the user and recommend
brand-builder instead.

## Robots.txt disallows scraping

**Symptom:** `robots.txt` has `Disallow: /` for `*` or for the target paths.

**Recovery:** Stop. Document in `recon.json`:

```json
{
  "robots_txt_status": "disallowed",
  "disallowed_paths": ["/", "/press"],
  "user_agent_matched": "*"
}
```

Tell the user. Do not proceed regardless of how "interesting" the brand is.
Robots.txt is the site owner's explicit instruction; respecting it is non-
negotiable. Fall back to user-provided assets only.

## Press page is gated / requires login

**Symptom:** `/press` returns a login form, 401, or 403.

**Recovery:** Record the gate in `recon.json` with status `gated`. Drop Tier 1
provenance for this brand. The remaining run uses Tiers 2–6 only. All resulting
confidence ratings cap at `medium`. Surface this in Phase 5: "Tier 1 sources
gated — this brand kit is built from public-page extraction only."

## CSS-in-JS framework with no `:root` vars

**Symptom:** `getComputedStyle(document.documentElement)` returns no `--*`
properties. Site uses styled-components, Emotion, or similar.

**Recovery:** Skip Tier 4 entirely. Lean on Tier 5 (computed styles on
semantic elements). Mark all colors as `medium` confidence and add this note
to the manifest:

```
"extraction_notes": [
  "Site uses CSS-in-JS — no :root custom properties available. Colors derived from computed styles only."
]
```

## Cloudflare / WAF blocks Playwright

**Symptom:** Page returns a Cloudflare challenge, hCaptcha, or similar.
Playwright can't get past it.

**Recovery:** Stop. Document the block. Do not attempt to evade — that crosses
from intelligence into hostile scraping. Tell the user; suggest user-provided
HAR file or manual asset upload as the workaround.

## Domain redirects elsewhere

**Symptom:** `bursoncw.com` 301-redirects to `bursoncohnwolfe.com` (or vice
versa).

**Recovery:** Follow the redirect, but record both URLs in `recon.json` and
treat the **final** domain as canonical. If the redirect chain crosses brand
boundaries (e.g. `oldco.com` → `newco.com` after acquisition), pause and
confirm with the user — the brand may have changed identity entirely.

## Multiple logo variants — which is "primary"?

**Symptom:** Press page lists `logo-black.svg`, `logo-white.svg`,
`logo-color.svg`, `logo-icon.svg`. None labeled "primary".

**Recovery:** Don't pick one silently. Classify all into appropriate buckets
(`logo-primary`, `logo-white`, `logo-mark`) by visual properties:

- The variant that contains both color AND wordmark → `logo-primary`
- Single-color variants → keep as `logo-white` / `logo-black` for downstream
  use on dark/light backgrounds
- Icon-only variants → `logo-mark`

Surface all of them in Phase 5 review, let the user confirm or override.

## Brand kit is in a downloadable zip / PDF

**Symptom:** Press page links to `brand-kit.zip` or `brand-guidelines.pdf`
instead of individual asset URLs.

**Recovery:** Download the archive/PDF, extract the contents to `raw/`, then
classify the extracted files. Record the archive as the source URL for every
extracted asset. Confidence stays high (Tier 1).

## The site has a Brandfetch / Brand.dev entry

**Symptom:** During recon, you discover the brand has a public Brandfetch page
(e.g. `https://brandfetch.com/bursoncw.com`).

**Recovery:** This is a corroborating signal, not a primary source for this
skill. Note it in `recon.json` as:

```json
{
  "external_brand_apis": [
    {"provider": "brandfetch", "url": "...", "status": "indexed_publicly"}
  ]
}
```

If the org later subscribes to Brandfetch's paid Brand API, it can be added as
a Tier 0 source in a future revision of this skill — but do not silently scrape
Brandfetch's free page (their data is licensed; using it without their API
breaks their ToS).

## All sources agree but the brand "feels wrong"

**Symptom:** Extraction completes successfully, all confidence ratings are high,
but the resulting palette/logo doesn't match what the user knows about the brand.

**Recovery:** Trust the user. Brand sites occasionally lag behind a rebrand
(old assets still cached), or the user has access to a more recent press kit
that hasn't hit the web yet. Phase 5 review exists exactly for this. Discard
the bundle and ask the user to provide assets directly.
