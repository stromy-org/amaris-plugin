---
name: website-builder
description: "Build brand-driven Astro websites for clients — standalone repo with website-maintain skill, charter-schema-driven layout, archetype-based variance. Use when asked to build, scaffold, or generate a client website."
---

# Website Builder

Build brand-driven Astro websites for clients. Each site is a standalone repo with
its own deployment, content, and maintenance skill. No two sites should look alike —
the variance engine uses archetype-driven design tokens to produce fundamentally
different visual experiences for each brand.

## Architecture Principle

Website generation is **skill-driven, not script-driven**. Unlike plugin-creator
(copy + template substitution), each website's components vary by archetype, charter
tokens, and page composition. This is Claude's job, not a script's.

**Two-layer approach:**
- **`scaffold_website.py`**: Mechanical, deterministic tasks — directory structure,
  `package.json`, `astro.config.mjs`, `tsconfig.json`, submodule registration,
  `catalog.json`, `brand-tokens.css` from charter. No creative decisions.
- **Skill-driven generation** (you, following these instructions): All component
  generation, page composition, section assembly, content integration, and styling.

## Brand Handoff Contract

This skill assumes the brand identity work already happened upstream, typically via
`brand-builder`. The boundary is:

- **Brand-builder owns**: brand strategy, archetype, logos, color system, font
  selections, motifs, imagery direction, and the core charter/profile artifacts.
- **Brand-artifact-builder owns**: reusable, surface-specific asset packs and
  exports derived from that fixed brand when downstream builds need them.
- **Website-builder owns**: `charter.website`, website-specific component decisions,
  page composition, deployment setup, and translating the established brand into
  a specific web expression.

Website runtime inputs must come from canonical brand files or their synced copy
inside the site repo, such as `src/brand/charter.json`, `src/brand/logos/`, and
`src/brand/images/`. Do not point components, token generation, or build scripts
at `_build/brand-artifact-builder/`, and do not invent a website-local parallel
asset extraction convention when a reusable pack has already been promoted.

Do not make the user restate the full brand in abstract terms if the brand artifacts
already exist. Use the existing charter/profile as the starting point, then gather
only the website-specific decisions still needed.

Website-specific visual preferences should be captured primarily through **Phase 1
style boards**, not through vague adjective prompts alone. Early questions should
focus on structural constraints and launch requirements; the boards are where the
user compares concrete visual directions and chooses what to carry forward.

## When to Use

- Creating a new client website from scratch
- The user says "build a website for [client]"
- A new brand needs a web presence

## Where Things Live

| Concern | Location |
|---------|----------|
| This skill | `skills/website-builder/` |
| Website repos | `clients/<slug>/<slug>-website/` (submodule) |
| Brand data | `client-data/clients/<slug>/charter.json` |
| Company data | `companies/<slug>/` |
| Stromy's own site | `stromy-website/` (special case, already exists) |

## Pre-Flight Checks

Before starting, verify:
1. Brand data exists in `client-data/clients/<slug>/`
2. Company data exists in `companies/<slug>/`
3. The client slug doesn't already have a website submodule
4. `workspace/<slug>/` exists with the exact required layout from §Workspace Layout
5. **Build log** — see next section. This step is mandatory, not optional.

If `workspace/<slug>/` or `BUILD_LOG.md` does not exist yet, that is not a blocker
or anomaly. Creating them is the expected first action of a fresh build.

---

## Build Log (MANDATORY handoff protocol)

Website builds routinely span multiple sessions and multiple agents. Without a
persistent progress doc, follow-up agents have no reliable way to resume: prior
decisions, discarded directions, open questions, and in-flight state all get
lost. Every build MUST maintain a `BUILD_LOG.md` adjacent to the build artifacts.

**Location**: `workspace/<slug>/BUILD_LOG.md`

### Session-zero bootstrap (MANDATORY for fresh builds)

On a fresh build, do these actions in this order before asking for design choices
or creating any site repo:

1. Create `workspace/<slug>/` with the full mandatory layout from §Workspace Layout
2. Create `workspace/<slug>/BUILD_LOG.md` from the template
3. Record the observed starting state in the log
4. Only then begin Phase 0 discovery and user-facing decision capture

The absence of `clients/<plugin-slug>/<plugin-slug>-website/` is also expected at
this stage. The target repo is created later by the scaffold step; do not treat its
absence as a pre-flight gap.

### First thing you do in ANY session (resume protocol)

1. Check whether `workspace/<slug>/BUILD_LOG.md` exists.
2. **If it exists**: READ IT IN FULL before touching anything else. Trust its
   Status Dashboard, Key Decisions, Discarded Directions, and Handoff Notes.
   Start from `Next action`. Do not re-litigate prior decisions unless the user
   explicitly asks you to. Do not re-propose approaches listed in Discarded
   Directions.
3. **If it does not exist** (fresh build OR inherited build with no log):
   - Copy the template from `references/build-log-template.md`
   - Fill the Status Dashboard from whatever state you can observe
     (charter.website section, existing artifacts on disk, prior commits)
   - If you are inheriting a partially-built project, inspect the workspace
     and reconstruct a best-effort log, clearly marking reconstructed entries
     with `(reconstructed)` and flagging any ambiguity in Open Questions.
   - Save the log **before** doing any creative work.

### When to update the log (minimum cadence)

Update the log at **every one** of these moments:

| Trigger | What to update |
|---|---|
| Starting a phase | Dashboard `Current phase`, phase section `Status = in-progress`, `Dates` start |
| Key decision made | Append dated entry to Key Decisions with rationale |
| Approach rejected | Append to Discarded Directions with reason |
| Blocker encountered | Add to Open Questions, set Dashboard `Blockers` |
| Blocker resolved | Strike through Open Question, clear Dashboard blocker |
| Phase complete | Check the phase in Phase Checklist, fill Inputs / Decisions / Artifacts / Discussion context / Handoff notes for that phase |
| Ending a session | **Always** refresh `Last updated`, `Current phase`, `Next action` |

### What belongs in the log (and what doesn't)

**Belongs**:
- Decisions and their rationale (the *why*)
- User preferences surfaced in conversation (tone, off-limits topics, aesthetic pushes)
- Things tried and rejected
- Open questions and assumptions
- Per-phase handoff notes — the non-obvious things a future agent needs

**Does not belong**:
- A dump of every file you touched (git log is authoritative)
- Generic QA checklists already in this SKILL.md
- Raw charter content (link, don't copy)

### Handoff quality bar

Before ending a session, ask: *"If a new agent opened only `BUILD_LOG.md` and
`charter.json`, could they continue this build without asking the user anything?"*
If no, add what's missing to Discussion context or Handoff notes.

### Structural audit on resume

After reading the log, verify the workspace layout matches §Workspace Layout
below. If it doesn't (stray files, wrong subdirs, root-level artifacts), STOP
and surface the drift to the user before doing creative work. Do not silently
clean up; confirm the cleanup plan first.

---

## Workspace Layout (MANDATORY)

Every build uses exactly this tree under `workspace/<slug>/`. Nothing else.

```
workspace/<slug>/
├── BUILD_LOG.md              # Handoff log (mandatory — see previous section)
├── extracted-assets/         # Phase 0 — raw assets pulled from client materials
│   ├── logos/
│   ├── images/
│   ├── team/
│   └── video/
├── website-directions/       # Phase 1 — the 3 style boards
├── screenshots/              # Phase 2+ — visual verification output
│   ├── desktop/              #   1440px captures, one per page per revision
│   └── mobile/               #   390px captures, one per page per revision
├── qa/                       # Phase 4 — QA artifacts
│   ├── lighthouse/           #   JSON + HTML reports
│   ├── accessibility/        #   axe / pa11y output
│   └── findings.md           #   human-written findings + resolutions
├── playwright-traces/        # Raw mcp/playwright logs + yml snapshots (gitignored)
└── reference/                # Any pre-existing material: legacy scrapes, prior builds
```

### Hard rules

- **The real Astro site NEVER lives in `workspace/`.** It lives in
  `clients/<plugin-slug>/<plugin-slug>-website/`. The workspace is scratch +
  evidence only.
- **All screenshots** go to `workspace/<slug>/screenshots/{desktop,mobile}/<page>.png`.
  Not `/tmp`, not repo root, not next to the Astro project.
- **All Playwright MCP traces and intermediate browser state** go to
  `workspace/<slug>/playwright-traces/`. That directory is gitignored at the
  org level.
- **Agents inheriting a build must not create alternative layouts.** If a file
  doesn't fit the tree above, it either belongs in `reference/` or should not
  exist. When in doubt, surface the drift in BUILD_LOG.md Open Questions and
  ask the user.
- **Extracted assets are the pre-scaffold source of truth.** If raw client
  assets (logos, team photos, legacy site imagery, video) need to be pulled
  from existing materials, they live under `extracted-assets/` and get copied
  into the Astro `public/` tree during Phase 2. Do not keep duplicates
  elsewhere in the workspace.

---

## Phase 0: Discovery & Audit

**Input**: Client slug (e.g., `dukestrategies`)

### 1. Read data sources

If raw client assets (logos, team photos, legacy site imagery, video) need to
be pulled from existing materials, save them under
`workspace/<slug>/extracted-assets/{logos,images,team,video}/`. These are the
canonical pre-scaffold assets and get copied into the Astro `public/` tree
during Phase 2.

```
client-data/clients/<slug>/charter.json     → brand identity, colors, fonts, images
companies/<slug>/profile.json  → company identity, services
companies/<slug>/people.json   → contact metadata
companies/<slug>/proposals/team-bios.json   → rich bios, photos
companies/<slug>/proposals/case-studies.json → case studies
```

### 2. Audit brand completeness

Check: logos exist? Images exist? Fonts are Google Fonts (for CDN)? If gaps exist,
flag them to the user before proceeding.

Missing `company.website`, `company.email`, or `company.phone` in `profile.json`
does **not** block kickoff. Record them as content gaps in `BUILD_LOG.md` and plan
to leave TODO markers or placeholder footer/contact content until the user provides
final details.

### 3. Check for `charter.website` section

**If present**: Display current config, ask user to confirm or modify.

**If absent**: Create a provisional website configuration from the brand artifacts,
then run guided Q&A for the non-obvious website decisions — see below.

Do not try to finalize visual taste entirely through text prompts. Use the guided
Q&A to lock structural requirements and guardrails, then use Phase 1 style boards
to let the user react to concrete visual options.

### Guided Website Configuration

Walk the user through these questions. Do NOT accept archetype-only with all
defaults — require conscious confirmation of at least the macro aesthetic, layout
personality, typography expression, and component variants.

The order matters:
- Gather launch-critical structural choices first
- Resolve visual preferences provisionally from the brand artifacts
- Confirm or refine the visual direction with style boards in Phase 1 before
  treating the aesthetic choices as final

```
Q1: Brand archetype? (12 options — see references/archetype-design-map.md)
Q2: Review auto-resolved aesthetic direction — override any tokens?
Q3: Which pages? (home, about, services, case-studies, blog, contact, careers, resources)
    Default: home + about + services + contact
Q4: Homepage section composition — pick from 3 auto-generated options or mix
Q5: Deployment platform? (github-pages | vercel | netlify | cloudflare-pages)
Q6: Contact path? (mailto | none | formspree | netlify-forms | custom-api)
    → Validate against deployment compatibility matrix (references/deployment-configs.md)
    → Standard protocol: for simple brochure sites and GitHub Pages launches,
      default to `mailto` unless the user explicitly wants a hosted form or API flow
Q7: Custom domain? (default from profile.json website field)
Q8: Analytics? (none | plausible | umami | google-analytics)
Q9: Optional interaction layer? (default: no decorative ambient layer)
    If yes, load `references/motion-interaction-patterns.md` and gather:
    - interactionMode: `scroll-linked` | `pointer-local` | `hover-focus` | `mixed`
    - ambientScope: `hero-only` | `accent-surfaces` | `section-bands` | `site-wide`
    - reducedMotionPolicy: `auto-disable-decorative` | `simplify` | `static-fallback`
    Guardrails:
    - treat this as opt-in, not a default flourish
    - pointer-reactive effects must be localized to decorative zones, not text-heavy or form-heavy UI
    - disable or simplify on coarse / non-hover inputs and for reduced-motion users
    - prefer scroll/view-timeline or in-view triggers for subtle section accents over persistent whole-page motion
Q10: Special requirements? (blog from day one, portfolio, custom integrations)
Q11: Multilingual? (default: no) — If yes, gather:
     - defaultLocale (BCP-47, e.g., "en")
     - locales[] (e.g., ["en", "fr", "nl"])
     - routing: "prefix-default" (every locale in URL) | "prefix-non-default" (default at /)
     - translationWorkflow: "llm" (default, skill-driven) | "inline" (edit in repo) | "tms" (Lokalise/Crowdin/Phrase)
     - translateContentCollections (default true when blog/case-studies enabled)
     → Only ask if the user signals multilingual need; otherwise default to disabled.
     → When enabled, default `translationWorkflow` to `"llm"`.
     → When enabled, load references/i18n-patterns.md before generating code.
     → When `translationWorkflow === "llm"`, add a Phase 0 substep: draft the
       glossary and brand-voice seed files from charter + company profile. These
       get committed in Phase 2 as part of the i18n scaffold.
```

For fresh builds inheriting a complete brand system, the preferred user flow is:
- confirm the website archetype/aesthetic baseline derived from the charter
- confirm page/deployment requirements
- generate 3 style boards
- let the user pick or blend directions
- write the final `charter.website`

For static launches, prefer the simplest viable contact path:
- `mailto` is the default for `github-pages` and other low-complexity brochure sites
- `none` means no direct contact action beyond published details
- `formspree` is the hosted fallback when a real form is needed without backend work
- `netlify-forms` is Netlify-only
- `custom-api` is for serverless-backed flows and is not valid on GitHub Pages

For decorative motion and reactive ambient effects:
- the default posture is **opt-in**
- if the user does not explicitly want a decorative ambient layer, stick to restrained reveal/hover behavior only
- if the user opts in, motion must be scoped to specific visual zones and must follow `references/motion-interaction-patterns.md`
- never deploy site-wide cursor-chasing effects by default

### 4. Cross-site variance check

Read `references/generated-sites-registry.md`. State to the user which previous
sites exist and which design axes they used. The new site should aim to differ on
at least 4 of 7 tracked axes.

### 5. Write charter.website

Save the completed `website` section to `client-data/clients/<slug>/charter.json`.

**Output**: Complete charter with website section, user-confirmed.

**Log update**: Mark Phase 0 complete in `BUILD_LOG.md`. Record archetype, aesthetic,
enabled pages, deployment choices in Key Decisions with rationale. Capture any
user preferences surfaced during Q&A in the Phase 0 Discussion context.

---

## Phase 1: Design Direction (Style Boards)

**Purpose**: Let the user compare 3 distinct visual directions before committing to
full page generation.

This phase is the primary mechanism for collecting website-specific visual preference.
The user should react to real artifacts in `workspace/<slug>/website-directions/`,
not just answer abstract design questions. Unless the user explicitly waives this
phase, do not skip it.

### Generate 3 style boards

Each board is a self-contained HTML file (single-page, no routing) showing:
- **Hero treatment**: Full hero with brand imagery, logo, tagline — different layout variant
- **Navigation style**: Actual page names, different component variant
- **Typography specimen**: Heading + body + mono at actual scale
- **Color application panel**: Light/dark/accent surfaces, text, buttons
- **Card pattern**: 2-3 cards with real content from profile.json
- **Button & CTA styles**: Primary, secondary, ghost variants
- **Section divider/spacing**: One section transition
- **Footer preview**: Compact footer with real contact info

### Three interpretation directions

- **Direction A — "Core"**: Pure archetype defaults
- **Direction B — "Bold"**: Pushes one axis to extreme (dramatic typography, intense
  motion, aggressive texture)
- **Direction C — "Refined"**: Blends archetype with complementary aesthetic

Each board must differ on at least 3 of these axes: hero layout, typography expression,
card/component style, navigation, texture/surface, color application, button style.

If an optional interaction layer is in scope, include a concise "interaction notes"
panel on each board describing the intended mechanism, scope, and restraint level.
Do not make the boards dependent on live JS effects just to communicate the idea.

### Output

3 HTML files saved to `workspace/<slug>/website-directions/`. User reviews in browser,
picks elements from any combination: "A's hero layout with C's typography and B's
card style." Ask the user to comment on the boards in concrete terms: what feels
right, what feels off-brand, what feels too safe, what feels too aggressive.
Merge the chosen elements into the final `charter.website` tokens.

**Log update**: Record which direction (or blend of directions) the user picked
and *why*. Add any axis choices (hero variant, card style, typography expression,
etc.) to Key Decisions. List directions the user explicitly rejected in Discarded
Directions so no future agent re-proposes them.

---

## Phase 2: Scaffold

### Step 1: Run mechanical scaffold

> **GATE — before writing ANY creative code**: Verify
> `clients/<plugin-slug>/<plugin-slug>-website/package.json` exists and contains
> `"astro"` as a dep. If not, run `scaffold_website.py` now. If you catch
> yourself about to write `.html`, `.css`, or `.js` files anywhere under
> `workspace/` as the target deliverable, **STOP** — you are deviating from the
> skill. Flat HTML is never the output. The workspace is for scratch and
> evidence, not for the site itself.

```bash
python skills/website-builder/scripts/scaffold_website.py \
  --slug <clientslug> \
  --plugin-slug <plugin-slug> \
  --charter client-data/clients/<slug>/charter.json
```

`--plugin-slug` is the kebab-case directory name under `clients/` (e.g.
`duke-strategies` for `dukestrategies`). The script defaults to auto-detecting
an existing `clients/<candidate>/<candidate>-plugin/` directory; if none is
found, it falls back to the raw slug. Pass `--plugin-slug` explicitly whenever
the two forms differ.

The script creates the directory structure and writes only deterministic,
non-creative files. See script `--help` for all options.

### Step 2: Generate creative code (you do this)

**Before writing any CSS or component**: load `references/refinement-patterns.md`.
It captures hard-won patterns (img-cover fill, image treatment variation, metric
grid columns, OSM map embed, card equal-height, insight og:images, content
architecture rule, affiliate chips, contact page template) that must be baked
in during the initial scaffold — not retrofitted later.

If `charter.website.motion.interactionMode` is set to anything other than `none`,
also load `references/motion-interaction-patterns.md` before implementing motion.

After the scaffold, generate all creative, brand-specific code:

1. **Three-tier CSS tokens** (Tier 2 semantic + Tier 3 component):
   - Tier 1 (primitives) already generated by script
   - Tier 2 — Semantic: `--surface-primary`, `--text-heading`, `--section-gap`, etc.
   - Tier 3 — Component: `--nav-bg`, `--card-border`, `--btn-radius`, `--hero-overlay`
   - See `references/three-tier-tokens.md` for full architecture

2. **global.css**: Base styles, utility classes, typography scale — all referencing
   semantic tokens. Import Google Fonts, Tailwind v4, brand-tokens.css.

3. **Layout components**: BaseLayout, PageLayout, ArticleLayout
   - Reference charter's typography, spacing, motion settings
   - BaseLayout: HTML shell, meta tags, OG, scroll reveal script
   - PageLayout: Header + main + Footer wrapper
   - ArticleLayout: Content-focused with reading width
   - **Client-side navigation re-init**: Astro ClientRouter (View Transitions)
     re-renders without a full page reload. Inline `<head>` scripts only run
     once. Wrap ALL DOM-state initialization (theme application, scroll-reveal
     observers, form handlers, toggle handlers) in a named function, call it
     immediately AND register it on `astro:after-swap`. Without this, theme
     resets on navigation, scroll animations break, and forms stop working.

4. **UI components**: Button, Card, Badge, Icon, StatBlock
   - Styled per charter's component variants (pill-filled buttons, bordered cards, etc.)
   - All use CSS custom properties from Tier 3 tokens

5. **Section components**: Hero, Services, CTA, Stats, Team, etc.
   - Each uses the variant specified in `charter.website.pages.home.sections`
   - See `references/section-catalog.md` for all variants

6. **Navigation & Footer**: Per charter's `components.navigation` and `layout.footerStyle`
   - **Mega-menu pattern**: For sites with multiple service pillars or deep IA, use a
     hover-activated mega-menu dropdown (desktop) with nested expansion (mobile). Key
     implementation details:
     - `mouseenter/mouseleave` with a 150ms close delay (prevents flicker on cursor travel)
     - `Escape` key dismissal and `aria-expanded` for accessibility
     - Re-initialize in `astro:after-swap` handler (View Transitions kill inline script state)
     - Mobile: nested `<details>` or collapsible sections within the hamburger menu
   - **Simple nav**: For brochure sites with ≤6 top-level pages, flat nav with dot
     dividers by group is sufficient — don't over-engineer

7. **Content collection schemas**: Zod schemas in `src/content.config.ts`

8. **Data files**: `src/data/site.ts`, `stats.ts`, `company.ts` — populated from profile.json
   - **Shared data with cross-cutting tags**: When the same content appears on multiple
     pages (e.g., technology stack shown on a platform page AND filtered subsets on
     pillar pages), extract it into a shared data file with tag fields (e.g.,
     `pillar: 'ai-strategy' | 'data-analytics' | 'both'`). Pages filter the shared
     array rather than duplicating content. This keeps a single source of truth and
     makes content updates propagate automatically.

9. **Google Fonts import**: Build the import URL from charter.fonts families

10. **If `charter.website.i18n.enabled === true`**: Also generate the i18n scaffold —
    `astro.config.mjs` `i18n` block, per-locale `src/i18n/ui.<locale>.ts` files +
    `utils.ts`, per-locale `src/pages/<locale>/` directories, localized content
    collection folders, `LangSwitcher.astro` component, `hreflang` emission in
    `BaseLayout`, and the following additional files:
    - `src/i18n/glossary.md` — seeded from brand name, founder names,
      archetype-specific jargon, and charter tagline.
    - `src/i18n/brand-voice.md` — seeded from charter archetype + register
      inference (e.g., B2B premium → formal "u" in NL).
    - `.i18n/translation-ledger.json` — initialized with `schemaVersion: 1` and
      empty `entries` map (tracked in git — this is the cache that makes re-runs
      stable).
    - `src/i18n/pickLocale.ts` — the tiny runtime helper that reads `{en, nl}`
      objects from data files: exports `type Localized<T>` and
      `pickLocale(field, lang)`.
    Follow `references/i18n-patterns.md` and `references/llm-translation-workflow.md`.

### Component Generation Guidelines

When generating components, follow these rules:

- **Read the charter first** — never hardcode colors, fonts, or spacing
- **Use CSS custom properties** — components consume Tier 3 tokens, not raw values
- **Astro components** — `.astro` files, not React/Preact (unless interactive island needed)
- **Tailwind CSS 4** — utility classes reference `@theme` tokens
- **Responsive** — mobile-first, test at 375px, 768px, 1440px
- **Semantic HTML** — proper heading hierarchy, landmarks, alt text
- **No banned patterns** — see Anti-Convergence Rules below
- **Dark mode contrast** — if the site has dark mode, review the dark mode rules
  below before writing any component CSS. Brand primary colors used for text/icons
  in light mode often become invisible in dark mode.
- **Nav CTA buttons** — always add `whitespace-nowrap` to CTA links in navigation
  bars. They wrap onto two lines at certain viewport widths otherwise.

### Dark mode implementation rules

When the site supports light/dark mode:

- **Never use raw primary color for text on dark surfaces.** Badges, tags, icon
  tints, and outline button text that use `text-primary` become invisible when the
  primary is a dark color. Use semantic tokens (`--text-heading`, `--text-body`) or
  the accent color instead.
- **Outline/ghost buttons need dark mode overrides.** Add a `.btn-outline` class
  and override border + text color under `[data-theme="dark"]` to use light
  text and visible borders.
- **Surface elevation needs wider steps in dark mode.** Light mode surfaces that
  feel clearly different collapse to identical in dark mode. Use at least 3-4
  lightness steps between `--surface-sunken`, `--surface-primary`, and
  `--surface-elevated`.
- **Borders need more contrast in dark mode.** Bump border lightness higher than
  feels natural — cards must be clearly delineated from their background.
- **Muted text must be lighter than you'd expect.** Test readability at actual
  rendered font sizes, not just in a color picker.
- **Tint dark surfaces with the brand's primary hue.** Pure neutral grey
  disconnects from the brand identity. A green brand gets a slight green tint in
  dark surfaces; a blue brand gets blue-tinted darks.
- **Default theme selection.** For dark-branded sites (dark primary color, dark
  hero imagery), default to dark mode rather than system preference — the brand
  was designed dark-first. For light-branded sites, respect `prefers-color-scheme`.

### Motion-specific implementation rules

When `website.motion` includes an optional decorative interaction layer:

- **Localize the effect** — hero, accent band, or designated decorative surfaces only.
  Do not run pointer-reactive backgrounds under dense text, forms, menus, or cards
  that need calm legibility.
- **Gate by input capability** — only run pointer-reactive behavior on devices that
  support fine pointers and convenient hover. Coarse-pointer devices should get a
  static or scroll-linked fallback.
- **Respect reduced motion** — decorative motion must be disabled or simplified when
  the user prefers reduced motion.
- **Prefer performant properties** — animate `transform` and `opacity` where possible.
  Avoid large-area blur/filter/repaint-heavy effects as the default path.
- **Use visibility-aware triggers** — prefer view/scroll timelines or IntersectionObserver
  for section-local activation instead of keeping every ambient layer live at once.
- **Keep it subordinate** — motion may support hierarchy and tactility, but it must
  not become the product. Premium brochure sites should feel alive, not busy.

### Verify scaffold works

After generating all code:
```bash
cd clients/<slug>/<slug>-website
npm install
npm run dev
```

**Use Playwright to screenshot and verify** the site renders correctly, tokens load,
fonts render, and the build works. All screenshots go to
`workspace/<slug>/screenshots/{desktop,mobile}/<page>.png` (see §Workspace
Layout).

**Scroll-animation caveat**: IntersectionObserver-based reveal animations (fade-up,
clip-reveal, stagger-fade) won't trigger in Playwright full-page screenshots
because the viewport doesn't actually scroll. Before full-page captures, force
all animated elements visible:
```js
document.querySelectorAll('.stagger-fade, .clip-reveal, .fade-up')
  .forEach(el => el.classList.add('in-view'));
```
Also clear `localStorage` theme state before visual testing to ensure a known
starting state.

```bash
npx --yes playwright@latest screenshot --browser=chromium \
  --viewport-size=1440,1100 --wait-for-timeout=1800 \
  http://127.0.0.1:4321/ workspace/<slug>/screenshots/desktop/home.png

npx --yes playwright@latest screenshot --browser=chromium \
  --viewport-size=390,844 --wait-for-timeout=1800 \
  http://127.0.0.1:4321/ workspace/<slug>/screenshots/mobile/home.png
```

**Output**: Runnable Astro project. All components unique to this brand.

**Log update**: In Phase 2's log section, list which components were generated,
which Tier 3 tokens were chosen, any deviations from archetype defaults, and any
structural decisions (e.g., "using client islands for X", "skipping Y component").

**MANDATORY — Refinement patterns gate**: After generating all creative code in
Phase 2, open `references/refinement-patterns.md` and cross-check every item in
the "Quick checklist" at the bottom. Fix any violations before proceeding to Phase 3.
This is not optional — these patterns exist because they were missed on previous
builds and had to be retrofitted. Bake them in now.

---

## Phase 3: Core Pages

**Before starting**: re-verify the Phase 2 gate still passes. The site under
construction must be the Astro project in `clients/<plugin-slug>/<plugin-slug>-website/`,
not any file in `workspace/`.

Build all enabled pages with real company data.

### Hub-and-spoke IA pattern

For sites with multiple service pillars, use a **hub landing page** that links to
dedicated sub-pages. The hub shows the value proposition at a glance (pillar cards with
highlights, technology ribbon, case study teasers); each pillar sub-page goes deep on
one offering. This keeps any single page focused while giving visitors a clear entry
point. Place hub pages at `/solutions/` (or equivalent) with sub-pages at
`/solutions/<pillar>/`. When restructuring existing flat pages into this hierarchy,
add Astro `redirects` in `astro.config.mjs` for all old URLs to preserve SEO.

### Page generation order

1. **Homepage**: Assemble sections per `charter.website.pages.home.sections`
   - Each section reads charter tokens for its variant
   - Content from profile.json (services), case-studies.json, team-bios.json
   - Brand imagery placed per `charter.images.catalog` roles

2. **About**: Company story, team section, values/mission
   - **Team data resolution**:
     1. `proposals/team-bios.json` → primary (photos, bios, expertise)
     2. `people.json` → fallback (name + title only)
     3. Neither → placeholder with TODO markers
   - Photos from `team-bios.json[].photo`, bios from `.executive` or `.short`
   - Contact links (email, LinkedIn) from `people.json` (join via `id`/`personId`)

3. **Services/Capabilities**: Dynamic from profile.json services array

4. **Case Studies**: If case-studies.json exists, generate MDX files. Dynamic routing
   via `[slug].astro`

5. **Contact**: From profile.json contact info. Contact behavior per `charter.website.deployment.contactForm`
   - If `mailto`: build a simple contact page patterned after the Duke site approach:
     prefilled email-draft CTAs, direct email link, and optional phone link when available
   - If `none`: publish contact details only
   - If hosted form / API: generate the corresponding form UX

6. **Blog**: Empty collection with schema. One placeholder post demonstrating layout.

**If i18n is enabled**: every page above must be generated per locale. Use `t('key')`
for all UI strings (no hardcoded copy), mirror content collection folders per locale
with a shared `translationKey`, and wire the language switcher into the header.

### Content strategy

Real content from company data everywhere possible. Placeholder text only where no
company data exists, clearly marked with `<!-- TODO: Replace with real content -->`.

**Image diversity**: Every content collection item (case study, blog post, etc.)
must use a unique image. Audit existing assignments before choosing:
`grep -r "images/" src/content/ | grep -o '[^/]*\.jpg'`. Match image mood to
content: dark/dramatic for technology, geometric/structured for methodology,
warm/industrial for partnerships.

**Hero background images**: Add subtle background images at low opacity (8-18%)
to all main page heroes. Pages without hero images feel flat compared to those
with them. Pattern: `position: absolute; inset: 0; opacity: 0.08-0.18;
object-fit: cover` behind a relative container.

### Generate website-maintain skill

The canonical skill lives in `stromy-org/.claude/skills/website-maintain/SKILL.md` and
is rendered into each website repo via `scripts/sync-website-skill.sh`. Do NOT manually
write a website-maintain skill.

Instead:
1. Add the new repo to the `WEBSITE_REPOS` array in `stromy-org/scripts/sync-website-skill.sh`
   (format: `"repo_relative_path|client_slug|site_name|site_url|dev_port"`)
2. Run the sync script from the stromy-org root:
   ```bash
   bash scripts/sync-website-skill.sh --dry-run   # verify output
   bash scripts/sync-website-skill.sh             # write and commit
   ```

The script reads the new site's `charter.json` for font/color values, detects collection
names from `content.config.ts`, and injects them into the canonical SKILL.md template
zones. The result is committed to the new repo automatically.

### Generate CLAUDE.md and AGENTS.md

Write comprehensive instruction files for the new repo:
- `CLAUDE.md`: Project overview, structure, commands, key patterns, design system
- `AGENTS.md`: Self-contained (no `.claude/rules/` refs), suitable for Codex

### Visual verification (continuous)

After each major page, use Playwright to screenshot desktop + mobile. Save to
the prescribed workspace location (see §Workspace Layout):

```bash
npx --yes playwright@latest screenshot --browser=chromium \
  --viewport-size=1440,1100 --wait-for-timeout=1800 \
  http://127.0.0.1:4321/<route> workspace/<slug>/screenshots/desktop/<page>.png

npx --yes playwright@latest screenshot --browser=chromium \
  --viewport-size=390,844 --wait-for-timeout=1800 \
  http://127.0.0.1:4321/<route> workspace/<slug>/screenshots/mobile/<page>.png
```

Fix-and-verify cycle: spot issue → fix code → re-capture → confirm fix.

**Output**: All enabled pages built with real company data.

**Log update**: Update Phase 3's Per-page status table after each page. Record
content gaps (fields with TODO markers), any content the user provided inline,
and pages that are visually complete but pending copy review.

---

## Phase 4: Polish & QA

1. **Responsive testing**: All pages at mobile (375px), tablet (768px), desktop (1440px)
2. **Brand consistency**: All colors, fonts, logos match charter
3. **Image handling**: Apply image overlay from charter (object-position, brightness)
4. **Accessibility**: Alt text, semantic HTML, WCAG AA contrast
5. **Performance**: Lighthouse 90+ target
6. **SEO**: Meta tags, OG images, sitemap, Organization structured data from profile.json
7. **Anti-convergence check**: No banned patterns, sufficient texture, section variety

Run full-page screenshots of every route at desktop and mobile. Compare against the
style board direction chosen in Phase 1.

**Output**: QA report. Fixes applied. Site ready for deployment.

**Log update**: In Phase 4's section, record QA findings and their resolutions,
any deferred issues punted to post-launch, and Lighthouse scores.

---

## Phase 5: Deploy & Handoff

1. **Git**: Initialize repo, initial commit
2. **GitHub**: Create remote repo in stromy-org, push
3. **Submodule**: Register in stromy-org as `clients/<slug>/<slug>-website`
4. **Catalog**: Add entry to `catalog.json` with type `website`
5. **Dispatch client data**: Run `bash scripts/dispatch-client-data.sh` from stromy-org to populate `client-data/` in the website repo
6. **CI/CD**: Deployment workflow already scaffolded (per platform)
7. **Domain**: Document DNS steps if custom domain
8. **Registry**: Update `references/generated-sites-registry.md` with new site entry
9. **Workspace promotion + cleanup** (see below)

**Output**: Live (or ready-to-deploy) website. Registered in org. Maintenance skill installed.

**Log update**: Mark build complete in `BUILD_LOG.md`. Record repo URL, deployment
URL, catalog entry, dispatch confirmation, and the registry update. Set Dashboard
`Overall status = complete`. The build log then moves into the target website
repo during Step 9 — the workspace is scratch and does not survive past deploy.

### Step 9 — Workspace promotion + cleanup (MANDATORY)

The `workspace/<slug>/` tree is scratch + evidence only. After deployment is
verified, promote the permanent artifacts into the target website repo and
delete the rest. This keeps scratch truly ephemeral and co-locates the build
history with the site it describes.

**Promote** — copy into `clients/<plugin-slug>/<plugin-slug>-website/.build-history/`:

| Source (workspace) | Destination (site repo `.build-history/`) | Why |
|---|---|---|
| `BUILD_LOG.md` | `BUILD_LOG.md` | Permanent build history — travels with the site |
| `website-directions/` (all 3 boards) | `website-directions/` | Design exploration audit trail, not regeneratable |
| `qa/findings.md` | `qa-findings.md` | Human QA decisions + rationale |
| _(generate new)_ | `MAINTENANCE_LOG.md` | Maintenance handoff log stub — pre-fill Status Dashboard with slug, archetype, build date, and known site quirks before the first maintenance session starts |

After copying, set `Overall status = complete` in the **promoted** `BUILD_LOG.md`
and commit `.build-history/` as part of the site repo.

**Delete** — once promotion is committed, `rm -rf workspace/<slug>/`. These
artifacts are all either duplicates, regeneratable, or obsolete:

| Path | Reason disposable |
|---|---|
| `extracted-assets/` | Already copied into the Astro `public/` tree in Phase 2 — no duplicates allowed |
| `reference/` (legacy scrapes, flat-HTML porting sources) | Obsolete once the Astro port is signed off |
| `screenshots/{desktop,mobile}/` | Regeneratable from `npm run build` + Playwright |
| `qa/compare-*`, `qa/lighthouse/`, `qa/accessibility/` | Regeneratable QA output |
| `playwright-traces/` | Ephemeral browser state, gitignored anyway |

**Blast-radius guard**: before running `rm -rf`, confirm with the user that
`.build-history/` has been committed in the site repo and the deployment is
live. Never delete the workspace before promotion is committed.

**The workspace itself is gitignored** at the org level (`workspace/` in
stromy-org's root `.gitignore`), so nothing in it is ever tracked directly —
promotion is the only path for workspace content to enter version control.

---

## Anti-Convergence Rules

### Banned patterns (hard rules)

| Category | Banned | Reason |
|----------|--------|--------|
| Fonts | Inter, Roboto, Open Sans, Poppins for headings | Most common AI choices → sameness |
| Colors | Purple-on-white gradient hero | Canonical "AI-generated" look |
| Layout | Exact: hero → 3-feature-cards → testimonials → pricing → CTA | Most common AI layout |
| Direction | "Clean and modern" as aesthetic | Non-direction → median output |
| Components | Identical card grids on consecutive sections | Visual monotony |
| Images | Generic stock (handshakes, offices, laptops) | Must use brand imagery |

### Enforced rules

- Every site has ≥1 non-solid background treatment (texture minimum)
- No page has >2 consecutive sections with same layout width (section variety)
- Dark/light alternation follows `darkSectionFrequency` (color rhythm)
- ≥1 section per page breaks the grid unless aesthetic is explicitly symmetric
- Brand motif appears in ≥2 locations (dividers, backgrounds, borders)
- ≥1 image per role in `charter.images.catalog` is rendered (role-based coverage)

### Variance tracking

- `references/generated-sites-registry.md` records key design decisions per site
- New sites should differ on ≥4 of 7 axes from every previous site
- No two sites can share the same homepage section sequence
- Before finalising Phase 1, state: "Previous sites used [X]. Your boards explore
  different combinations."

---

## Charter Website Schema (Quick Reference)

The full schema is in `references/charter-website-schema.md`. Key sections:

```
charter.website.archetype        → drives ALL defaults (12 Jungian archetypes)
charter.website.aesthetic        → macro design direction (15 options)
charter.website.layout           → density, symmetry, hero, grid, spacing, footer
charter.website.texture          → backgrounds, surfaces, borders, shadows, corners
charter.website.typography       → heading style, scale, line-height, transforms
charter.website.motion           → intensity, reveals, scroll, hover, speed
charter.website.components       → navigation, cards, buttons, forms, images, CTAs
charter.website.colorApplication → dark sections, accent usage, gradients
charter.website.pages            → enabled pages + homepage section composition
charter.website.deployment       → platform, domain, analytics, contact form
```

When fields are absent, the archetype resolves all missing values. See
`references/archetype-design-map.md` for the complete archetype → default map.

---

## Reference Documents

Load these on demand — do not read all at once:

| Document | When to read |
|----------|-------------|
| `references/charter-website-schema.md` | Phase 0 — understanding/generating charter config |
| `references/archetype-design-map.md` | Phase 0 — resolving defaults from archetype |
| `references/section-catalog.md` | Phase 2-3 — choosing section variants |
| `references/anti-convergence.md` | Phase 1-4 — checking variance rules |
| `references/astro-patterns.md` | Phase 2-3 — Astro/Tailwind implementation patterns |
| `references/stromy-website-patterns.md` | Phase 2-3 — patterns from the proven baseline |
| `references/page-composition-templates.md` | Phase 0, 3 — example compositions per archetype |
| `references/three-tier-tokens.md` | Phase 2 — CSS variable architecture |
| `references/deployment-configs.md` | Phase 0, 5 — platform deployment setup |
| `references/maintenance-patterns.md` | Phase 3 — generating website-maintain skill |
| `references/refinement-patterns.md` | Phase 2-3 — hard-won patterns to bake in during initial scaffold (img-cover fill, image treatment variation, metric grids, OSM map embed, insight og:images, card equal-height, content architecture rule, affiliate chips, contact page template) |
| `references/generated-sites-registry.md` | Phase 0, 5 — variance tracking |
| `references/i18n-patterns.md` | Phase 0-4 — ONLY when `charter.website.i18n.enabled` |
| `references/llm-translation-workflow.md` | Phase 2-5 — ONLY when `translationWorkflow === "llm"` |
| `references/build-log-template.md` | Start of every build — template for `workspace/<slug>/BUILD_LOG.md` |
| `references/maintenance-log-template.md` | Phase 5 — template for `.build-history/MAINTENANCE_LOG.md` stub promoted at deploy |
| `references/contact-page-patterns.md` | Phase 3 — contact page layout, form design, dark mode, Formspree integration |

---

## QA Checklist (Phase 4)

- [ ] `npm run build` succeeds
- [ ] `npm run check` (Astro TypeScript) passes
- [ ] All enabled pages render without errors
- [ ] Colors match charter (no hardcoded values)
- [ ] Fonts load from Google Fonts CDN
- [ ] Logos render in header and footer
- [ ] Brand images appear per role (cover, divider, closing)
- [ ] Responsive: no overflow at 375px, 768px, 1440px
- [ ] No banned patterns (Inter headings, purple gradient, 3-card-then-testimonial)
- [ ] ≥1 non-solid background texture
- [ ] No >2 consecutive same-width sections
- [ ] Dark/light section rhythm follows charter
- [ ] Brand motif in ≥2 locations
- [ ] Alt text on all images
- [ ] Heading hierarchy is correct (h1 → h2 → h3)
- [ ] OG meta tags present
- [ ] Sitemap generates
- [ ] Contact form works (if enabled)
- [ ] Navigation links all resolve
- [ ] Footer links all resolve
- [ ] 404 page exists
- [ ] Lighthouse Performance ≥ 90
- [ ] website-maintain skill generated and accurate
- [ ] CLAUDE.md and AGENTS.md written
- [ ] Submodule registered in stromy-org
- [ ] catalog.json entry added
- [ ] Client data dispatched via `dispatch-client-data.sh`
- [ ] generated-sites-registry.md updated

### Dark mode & theme (if dark mode enabled)

- [ ] Cards clearly delineated from background (border + elevation contrast)
- [ ] All text readable — especially badges, tags, icon labels using primary color
- [ ] Outline/ghost buttons have light text, not primary-color text
- [ ] Surfaces have brand-tinted hue, not pure neutral grey
- [ ] Theme persists across client-side navigations (toggle → click nav → verify)
- [ ] Default theme matches brand personality (dark-first brands default to dark)

### Visual consistency

- [ ] Nav CTA buttons don't wrap at any viewport width (375px through 1440px)
- [ ] Each content collection item has a unique image (no duplicates)
- [ ] Hero background images on all main pages (or conscious decision to omit)
- [ ] Full-page screenshots force-reveal scroll animations before capture

### i18n (only if `charter.website.i18n.enabled`)

- [ ] Every page renders at every locale (no 404)
- [ ] `hreflang` tags + `x-default` present on every page
- [ ] Language switcher preserves the current path across locales
- [ ] No hardcoded user-facing strings (grep + pseudo-locale sweep)
- [ ] Dates/numbers/currencies use `Intl` APIs
- [ ] Fallback locale renders when a translation is missing
- [ ] Content collections have a shared `translationKey` per item
- [ ] Sitemap includes all locales
