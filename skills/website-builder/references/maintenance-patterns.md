# Maintenance Patterns

Universal maintenance operations for Astro client websites. This is the source of
truth used when generating each site's `website-maintain` skill.

## Content Architecture Invariants

Before routing any content task, the generated website-maintain skill must
enforce these invariants (see `refinement-patterns.md` §7 for full rationale):

- **One canonical list per concept.** Services / capabilities / offerings /
  programmes live in a single typed array in `src/data/company.ts` with a `slug`
  per entry. Never maintain two overlapping lists of the same concept.
- **Every repeated concept has a detail page.** If the site lists services,
  `src/pages/services/[slug].astro` exists and is the target of every
  `Learn more` link. Same for cases, programmes, insights (if self-hosted).
- **Homepage teasers link to detail pages, not to the index.** A homepage
  `Our Expertise` card must link to `/services/${slug}`, never to `/what-we-do`.
- **Adding an item = updating the canonical array only.** No per-page
  duplication of copy. Longform content lives on the entry as a structured
  `longform: { challenge, approach[], signals[] }` field.

When the user asks to "add a service / capability / program / case study", the
maintain skill should edit exactly one array and verify the corresponding
`[slug].astro` route picks it up.

## Visual Invariants

The generated website-maintain skill must also guard these invariants when
accepting content or layout changes (see `refinement-patterns.md` §1–6):

- `.img-cover > img` uses absolute-positioned fill, not percentage height
- Repeated image blocks cycle through ≥3 treatments (frames, ratios, tints)
- Metric grids use `case-metrics--count-N` classes, not `flex-wrap`
- Contact pages have a real OSM embed (iframe + address card), not a placeholder
- `site.office` has `lat`, `lon`, `bbox` fields
- Insight cards are flex-column with `margin-top: auto` on the CTA link
- Insight `image` fields reference `public/assets/insights/*` — never hot-link
  to external og:images
- Affiliate/partner blocks link to each sub-agency, not only the umbrella
- Mailto links are prefilled with subject + body templates

When sourcing new insights, the maintain skill's insight workflow must include
an og:image fetch + download step (see §6 below).

## Content Operations

### Adding a Blog Post

1. Create MDX file in `src/content/blog/<slug>.mdx`
2. Required frontmatter: title, description, date (YYYY-MM-DD), author, tags (array), image
3. Optional: featured (boolean)
4. Image path: relative from MDX file to brand images (e.g., `../../brand/images/file.jpg`)
5. Filename (without .mdx) becomes URL slug
6. Verify: `npm run build` catches frontmatter errors

### Adding a Case Study

1. Create MDX file in `src/content/case-studies/<slug>.mdx`
2. Required frontmatter: title, description, client, metrics (array of {label, value}), image
3. Optional: capability (links to a capability page)
4. Structure: Challenge → Approach → Outcome
5. Auto-appears on case studies index and linked capability pages

### Updating Team Data

Resolution chain:
1. If site has `src/data/team.ts` → edit the array
2. If site uses content collection for team → edit MDX files
3. Team data fields: name, role, bio, photo (optional), expertise (optional)

### Updating Stats/Metrics

Edit `src/data/stats.ts`. Each stat has: value, label, suffix.
Keep to 3-5 stats for visual balance.

## Brand Operations

### Syncing Brand Tokens

From stromy-org root:
```bash
bash scripts/bump-client-data.sh
```

Then in the website repo:
```bash
npm run tokens
npm run build
```

### What Propagates Automatically

- Color changes → CSS custom properties → all components
- Font changes → font family variables → all text
- New images → available in `src/brand/images/`

### What Requires Manual Updates

- Removed images → check all MDX `image` fields
- Changed logo filenames → update Header and Hero imports
- New font families → update Google Fonts import URL in `global.css`

## Structural Operations

### Adding a New Page

1. Create `src/pages/<name>.astro`
2. Use PageLayout as wrapper: `<PageLayout title="..." description="...">`
3. Add nav item to `src/data/site.ts`
4. Add to sitemap (automatic via `@astrojs/sitemap`)

### Adding a New Section Component

1. Create `src/components/sections/<Name>.astro`
2. Accept props matching the section's data needs
3. Use semantic tokens (Tier 2/3) for all styling
4. Add to the page that uses it via import

### Modifying Navigation

Edit `src/data/site.ts` → `nav` array for main nav, `footerNav` for footer.

## Heavy Refresh (Major Redesign)

Routine maintenance (content edits, stats updates, brand token sync) is covered
by the Task Router workflows above. A **heavy refresh** is a different beast:
new brand tokens, new pages, animation system overhaul, feature additions or
removals, dark mode implementation, or a fundamental layout restructure.

The website-maintain skill owns the site, so heavy refreshes stay within its
scope — but they follow a different process than routine edits.

### When to use this workflow

- Rebranding: new fonts, colors, or design language
- Adding dark mode to an existing light-only site
- Adding or overhauling an animation/motion system
- Adding or removing major features (region toggle, contact forms, new page types)
- Restructuring navigation, page hierarchy, or content architecture
- Upgrading the CSS framework (e.g., Tailwind v3 → v4)

### Phase 1: Audit current state

Before changing anything:

1. **Screenshot every page** — desktop (1440px) and mobile (375px), both light
   and dark mode if applicable. These are the "before" captures.
2. **List all components** — sections, UI, layout. Note which ones will change.
3. **List all pages** — file-based routes + content-driven routes.
4. **Identify generated files** — token CSS, TypeScript modules, etc. Know what's
   hand-authored vs. generated.
5. **Check for drift** — does the live site match the charter? Are there
   undocumented patterns or workarounds?

### Phase 2: Change manifest

Write a concrete change manifest before touching code. For each change:

- What's changing (specific files and components)
- What's staying (explicitly — prevents accidental regressions)
- Dependencies (e.g., "new tokens must land before component updates")
- Risk level (high: affects all pages; medium: affects specific sections; low: isolated)

### Phase 3: Execute in dependency order

Work in layers, testing after each:

1. **Tokens and CSS foundation** — brand primitives, semantic tokens, `@theme`
   block, `global.css` structure. Run `npm run build` to verify.
2. **Layout components** — BaseLayout, PageLayout, Header, Footer, Nav. These
   affect every page, so verify with screenshots after changes.
3. **UI components** — Button, Card, Badge, etc. Test in isolation where possible.
4. **Section components** — Hero, grids, ribbons, teasers, CTAs.
5. **Page composition** — new pages, removed pages, restructured pages.
6. **Interactive features** — dark mode, animations, forms, toggles.
7. **Content updates** — MDX frontmatter changes, data file updates.

**Critical rule**: Run `npm run build` after each layer. Don't accumulate
changes across multiple layers before testing — compounding errors are much
harder to diagnose.

### Phase 4: Cross-cutting verification

After all changes:

1. **Every page at three breakpoints** — 375px, 768px, 1440px
2. **Both themes** — light and dark (if applicable)
3. **All navigation paths** — every link in header, footer, and inline CTAs
4. **Interactive elements** — toggles, forms, mobile menu, scroll reveal
5. **Build clean** — `npm run build` with zero warnings
6. **Content collections** — verify all MDX content still renders

### Common heavy-refresh pitfalls

| Pitfall | Prevention |
|---------|-----------|
| Scroll reveal hides content | Synchronous above-fold check (see `refinement-patterns.md` §13) |
| Tailwind utilities ignored | Wrap styles in `@layer base`/`@layer components` (§14) |
| Dark mode toggle breaks after nav | Use `data-*` attrs, not IDs; re-init on `astro:after-swap` (§15) |
| Contact form silently fails | Verify Formspree ID format or use mailto pattern (§16) |
| Removing a feature leaves orphans | Grep for imports, data references, and CSS classes before deleting |
| CSS custom properties not switching in dark mode | Verify `[data-theme="dark"]` overrides exist for all semantic tokens |
| Generated files hand-edited | Check `client-data.css`, `tokens.ts` — regenerate, don't edit |
| Component rendered twice has duplicate ID | Audit all `id=` attributes in components used in Header |

### Maintenance log entries

During a heavy refresh, update `.build-history/MAINTENANCE_LOG.md` more
frequently than during routine maintenance:

- Log each phase start/completion
- Record every architectural decision with rationale
- Note features added and removed
- Capture before/after screenshots
- Record any workarounds or known issues

## QA Operations

### Visual Audit Workflow

1. Start dev server: `npm run dev`
2. Screenshot each route at desktop (1440px) and mobile (390px):
   ```bash
   npx --yes playwright@latest screenshot --browser=chromium \
     --viewport-size=1440,1100 --wait-for-timeout=1800 \
     http://127.0.0.1:4321/<route> /tmp/<route>-desktop.png
   ```
3. Inspect screenshots for: broken layouts, missing images, wrong colors/fonts,
   contrast issues, responsive problems
4. Fix issues, re-capture to verify

### Responsive Check

Test at: 375px (mobile), 768px (tablet), 1440px (desktop).
Key things to check: nav toggle, image scaling, text overflow, section spacing.

### Performance Audit

```bash
npm run build
npx --yes lighthouse http://127.0.0.1:4321/ --output json
```

Target: 90+ on Performance, Accessibility, Best Practices, SEO.

### Accessibility Check

- All images have meaningful alt text
- Heading hierarchy: h1 → h2 → h3 (no skipped levels)
- Color contrast: WCAG AA minimum (4.5:1 for body text, 3:1 for large text)
- Interactive elements have focus styles
- Forms have labels

## Deployment Operations

### GitHub Pages Deploy

Push to `main` → GitHub Actions builds and deploys automatically.

Pre-deploy: `npm run build` locally to catch errors.

### Vercel Deploy

Push to `main` → Vercel auto-deploys.

### Custom Domain Setup

See `deployment-configs.md` for platform-specific DNS setup.

## i18n Operations (only if the site has `charter.website.i18n.enabled`)

Skip this entire section when generating a website-maintain skill for a single-language
site. For multilingual sites, include these workflows.

The default translation workflow is **`llm`** (skill-driven). When generating a
website-maintain skill for an `llm`-workflow site, include the Translate Content and
i18n Audit workflows below, plus the canonical task router entries.

### Task Router Entries (i18n)

The generated website-maintain skill must include these router entries when
`i18n.enabled`:

- "translate content", "refresh translations", "add NL version", "Dutch copy"
  → **Translate Content** workflow
- "audit i18n", "check translations", "missing NL" → **i18n Audit** workflow
- "update Dutch copy" → Translate Content (targeted)

### Translate Content (llm workflow)

Step-by-step procedure for the generated skill to include:

1. Load `src/i18n/glossary.md` + `src/i18n/brand-voice.md` +
   `.i18n/translation-ledger.json`.
2. Identify changed or missing fields: compare EN strings against ledger hashes.
   Entries with changed hashes are `stale`; missing hashes are new.
3. Translate new/stale strings using the glossary + brand voice rules. Reuse
   `approved` entries verbatim.
4. Run invariant checks (see below).
5. Show diff (`git diff src/data src/i18n .i18n`), wait for user approval.
6. On approval, flip ledger entries from `pending` → `approved`.

**Critical rule**: only edit EN fields when making content changes; never edit
target-locale fields directly. When EN changes, the ledger marks that hash stale
and the target locale gets retranslated in the next pass.

Reference: `src/i18n/glossary.md` is the place to add new no-translate terms as
they emerge (e.g., a new client industry term).

Full specification: `llm-translation-workflow.md` in stromy-org's website-builder
references.

### Invariant Checks (pre-approval)

The generated skill must run these before approving any translation:

1. Every `Localized<string>` field has both `en` and target locale populated.
2. Numbers in target-locale output match EN source byte-for-byte.
3. Email addresses are identical between EN and target locale.
4. URLs are identical between EN and target locale.
5. Phone numbers are identical.
6. Every "Do Not Translate" glossary term that appears in EN also appears
   verbatim in the target locale output.
7. `src/i18n/ui.<locale>.ts` has no missing keys relative to `ui.en.ts`.
8. No orphan translations exist without an EN source.

### i18n Audit

The generated skill's audit workflow:

1. Run the pseudo-locale sweep (see `llm-translation-workflow.md` §Pseudo-Locale).
2. Verify every `Localized<string>` has both locales populated.
3. Verify every ledger entry is `approved` (no `pending` or `stale`).
4. Verify every page renders at both locales (screenshot sweep).
5. Check text expansion: target locale may be ~10% longer than EN; check nav
   and button wrapping at mobile viewport.

### Content Workflow Integration

When the generated skill includes content workflows (Update Services, Update
Founders, etc.), each workflow must include this bullet:

> After editing the EN field, run the **Translate Content** workflow to refresh
> the target locale.

### Visual Audit Routes (i18n)

The generated skill's visual audit routes table must include every route under
both locale prefixes (e.g., `/en/who-we-are` and `/nl/who-we-are`).

### Editing UI strings

Edit `src/i18n/ui.en.ts` for the source locale. For `llm` workflow sites, run
the Translate Content workflow to propagate changes to target locales. For `inline`
workflow sites, manually edit each `ui.<locale>.ts`.

### Adding a translated page

1. Create the page component in `src/components/pages/<Name>.astro` (shared).
2. Create `src/pages/<locale>/<name>.astro` for each locale, rendering the shared
   component with the locale prop.
3. Ensure all UI strings use `t('key')` from `useTranslations(lang)`.
4. Verify `hreflang` renders for the new path.
5. For `llm` workflow: run Translate Content to populate target locale strings.

### Adding a translated blog post or case study

1. Pick a `translationKey` shared across all locales for this piece.
2. Create one MDX file per locale under `src/content/<collection>/<locale>/<slug>.mdx`.
3. Each file has the same `translationKey`, different `title`/`description`/body.
4. Cross-linking between locales uses `translationKey` to find siblings.

### Adding a new locale

1. Update `charter.website.i18n.locales` and `labels`.
2. Update `astro.config.mjs` `i18n.locales` and `fallback`.
3. Create `src/i18n/ui.<newlocale>.ts` (empty typed stub).
4. Create `src/pages/<locale>/` by mirroring default-locale pages.
5. Create `src/content/<collection>/<locale>/` directories.
6. Run the Translate Content workflow (for `llm`) or populate manually.
7. Run `npm run build` to catch missing keys.

### Removing a locale

1. Remove from `charter.website.i18n.locales`.
2. Delete `src/pages/<locale>/` and `src/content/*/<locale>/`.
3. Update `astro.config.mjs`.
4. Add 301 redirects at the platform level from old locale paths.
5. Clean up ledger entries for the removed locale.

### Syncing translations from a TMS

Only when `translationWorkflow === 'tms'`:
```bash
npm run translations:pull   # Fetch latest translations from TMS
npm run build                # Verify no missing keys
```

### i18n QA sweep

- Every page renders at every locale
- `hreflang` tags + `x-default` on every page
- Language switcher preserves the current path
- No hardcoded strings (pseudo-localization test: set locale to `en-XA`)
- Dates/numbers/currencies via `Intl`
- Fallback locale renders when a key is missing

Full guide: `.claude/skills/website-builder/references/i18n-patterns.md` and
`references/llm-translation-workflow.md` in stromy-org.

## Dark Mode

Optional dark mode toggle using CSS custom property overrides and `data-theme` attribute.

### How It Works

1. `[data-theme="dark"]` on `<html>` overrides Tier 2/3 semantic tokens
2. Inline `<script>` in `<head>` (before any CSS loads) reads `localStorage` + `prefers-color-scheme` to set the attribute before first paint — prevents FOUC
3. `ThemeToggle.astro` sliding pill toggle in nav bar toggles the attribute and persists to `localStorage`
4. Smooth CSS transition on `background-color`, `color`, `border-color` for key surfaces

### Enabling/Disabling

- **Enable**: Add `ThemeToggle` import to `Navigation.astro`, add dark token overrides to `tokens-semantic.css`, add FOUC-prevention script to `BaseLayout.astro` `<head>`
- **Disable**: Remove the `ThemeToggle` component from `Navigation.astro`, remove `[data-theme="dark"]` block from `tokens-semantic.css`, remove the FOUC script

### Customizing Icons Per Brand

The `ThemeToggle.astro` component is a sliding pill toggle with two inline SVG icons:
- Left side: lightbulb icon (light mode)
- Right side: 4-armed star icon (dark mode)
- A circular thumb slides left↔right to indicate the active mode
- Light mode: coral thumb on left. Dark mode: white thumb on right.

To customize icons: edit the SVG paths in `ThemeToggle.astro` (12x12 viewBox).
To customize colors: the thumb uses `var(--accent)` in light mode and `#F0F0F2` in dark mode.

### Adjusting Dark Theme Colors

Edit the `[data-theme="dark"]` block in `tokens-semantic.css`. Only override semantic tokens (Tier 2/3) — brand primitives (Tier 1) like `--brand-primary` stay the same.

Key tokens to tune:
- `--surface-page`, `--surface-alt` — main backgrounds
- `--text-heading`, `--text-body`, `--text-muted` — text colors
- `--nav-bg`, `--card-bg`, `--card-border` — component surfaces
- `--shadow-*` — increase opacity for visibility on dark backgrounds
- `--hero-overlay`, `--banner-overlay` — image overlay intensity

### Testing Checklist

- [ ] Toggle works on all pages (no FOUC on refresh)
- [ ] System preference respected when no localStorage value
- [ ] Manual override persists across page navigation
- [ ] Text contrast passes WCAG AA on dark backgrounds
- [ ] Image overlays still visible and balanced
- [ ] Shadows visible but not overpowering
- [ ] Cards, buttons, and form inputs readable
- [ ] Mobile nav menu uses dark surface in dark mode
- [ ] Smooth transition when toggling (no flash)

## Maintenance Skill Generation Template

When generating a site's `website-maintain` skill, customize these sections:

1. **Quick Orientation**: Actual directory structure of this specific site
2. **Maintenance log protocol**: Include the standard maintenance log section
   (see §Maintenance Log Protocol below) with the site's actual slug and paths
3. **Task Router**: Routes matching this site's actual pages and content types
4. **Content workflows**: Specific frontmatter schemas for this site's collections
5. **Brand sync commands**: Specific paths for this site's charter location
6. **Visual audit**: Routes list for this specific site's pages
7. **Design system reference**: This site's specific typography classes, color usage,
   component patterns
8. **Deployment**: Platform-specific commands for this site's deployment target
9. **i18n section**: Include the i18n Operations section ONLY if the site has
   `charter.website.i18n.enabled === true`. List the site's actual locales, default
   locale, routing mode, and workflow (`llm` / `inline` / `tms`). For `llm` workflow
   sites, include the Translate Content and i18n Audit workflows with invariant
   checks. Otherwise omit entirely — do not leave stub headings.

## Maintenance Log Protocol

Include this section verbatim in every generated `website-maintain` skill,
immediately after the Quick Orientation section. Customize the Status Dashboard
row values for the specific site (slug, build date, archetype if known).

```markdown
## Maintenance Log (cross-session handoff)

Every maintenance session must start by reading and end by updating
`.build-history/MAINTENANCE_LOG.md`. This file captures decisions, preferences,
and quirks that live outside the code and git history — essential for picking up
work across sessions without re-asking the user settled questions.

### First thing in ANY session

1. Check whether `.build-history/MAINTENANCE_LOG.md` exists.
2. **If it exists**: read it in full before touching anything. Note user
   aesthetic preferences, locked site decisions, and discovered quirks. Start
   from `Next action`. Do not re-propose approaches listed as off-limits.
3. **If it does not exist** (first maintenance session, or inherited site):
   - Create `.build-history/` if absent
   - Copy the template from stromy-org's
     `website-builder/references/maintenance-log-template.md`
   - Fill the Status Dashboard from the current site state (and build log if
     present in `.build-history/BUILD_LOG.md`)
   - Save before doing any content or design work

### When to update the log

| Trigger | What to update |
|---|---|
| User confirms a visual preference | Append to User Aesthetic Preferences as `[likes]` |
| Design approach rejected | Append to User Aesthetic Preferences as `[off-limits]` |
| Non-obvious site quirk found | Append to Discovered Site Quirks |
| Architecture or design decision made | Append to Site Decisions |
| Deferred item resolved | Check it off in Deferred Items |
| Ending a session | Refresh Status Dashboard + append Work Log entry |

### Handoff quality bar

Before ending a session: *"If a fresh agent read only `MAINTENANCE_LOG.md` and
`SKILL.md`, could they resume this work without asking the user anything?"* If
no, add what's missing before closing.
```
