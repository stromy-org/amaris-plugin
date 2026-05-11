---
name: brand-builder
description: "Build complete brand identity systems — logos, palettes, typography, CSS tokens, templates (PPTX/DOCX/letterhead/business cards/email sig), imagery direction, brand book. Also audits, refreshes, and rebrands. Interactive multi-phase process. Triggers on: branding, brand identity, brand kit, visual identity, brand guidelines, brand audit, brand refresh, rebrand, logo design, 'does this follow our brand', 'build me a brand'."
---

# Brand Builder

Build complete, production-ready brand identity systems through an **interactive, co-creative** process. The user is involved at every decision point — choosing archetypes, reacting to moodboards, selecting visual directions, curating imagery, and approving templates. The output is a full brand kit: strategy, logo, colors, typography, CSS design tokens, document templates, imagery, and a compiled brand book (HTML-first, with optional PDF conversion).

If the brand is already fixed and the task is to operationalize it into reusable
asset packs for websites, PPTX templates, documents, or social outputs, that
downstream production work belongs to `brand-artifact-builder`, not this skill.

## Volatility & Creative Diversity

This skill is designed to produce **meaningfully different brands** every time. Mechanisms that ensure variety:

1. **Shuffled pools** — When selecting fonts, color harmony methods, logo types, archetype suggestions, or stylescape themes, shuffle the candidate pool before picking. Never present options in the same default order.
2. **Randomized direction names** — Each visual direction gets an evocative 2-word name drawn from a shuffled pool (e.g., "Midnight Authority", "Copper Industrial", "Sage Minimal", "Crimson Pulse", "Ivory Tower"). Never reuse the same name set.
3. **Method rotation** — Color palettes alternate between complementary, analogous, triadic, split-complementary, and monochromatic approaches. Don't default to the same method.
4. **Archetype-driven divergence** — Brand archetypes (Phase 0) seed all downstream decisions, and less-obvious archetype matches are explored alongside expected ones.
5. **User co-creation** — Every phase has interactive decision points where user taste overrides algorithmic defaults. More interaction = more unique outcomes.

## Interactive Board Pattern (cross-phase standard)

When a phase requires the user to **select from a large set** or **assign metadata to items**, build a **brand-styled interactive HTML board** rather than listing items in conversation text. This is a mandatory UX pattern whenever:

- The user must choose N items from a larger pool (selection boards)
- The user must assign roles, tags, or ratings to a set of items (curation boards)
- The user must compare and rank alternatives visually (direction boards, moodboards)

**Core principles (apply to all boards):**

1. **The entire card is the interaction target** — no small checkboxes or radio buttons. Click/tap the card itself.
2. **Live counters** — a fixed bottom bar showing current state (selected count, assigned count, etc.) that updates on every interaction.
3. **Clipboard export** — a button that copies the user's choices as structured text they can paste back into the conversation.
4. **Sticky navigation** — horizontal nav with `IntersectionObserver` for section tracking. Users never lose their place.
5. **Brand-styled** — use the client's actual palette, fonts, and color system from charter.json. The board should feel like a brand deliverable, not a wireframe.
6. **Lazy loading** — `loading="lazy"` on all images. Reference stock URLs for undownloaded images.
7. **Self-contained** — single HTML file with inline CSS and JS. No external dependencies beyond Google Fonts.

**Board types in this skill:**
- **Selection Board** (`_build/reviews/BRAND-Image-Selection.html`) — Phase 4 Step 2. Click-to-select from wide pool. See `references/imagery.md` § "Selection Board Specification".
- **Curation Board** (`_build/reviews/BRAND-Image-Curation.html`) — Phase 4 Step 3. Role assignment + hero marking. See `references/imagery.md` § "Curation Board Specification".
- Future phases may add boards for template variant selection, color palette comparison, etc. Follow the same pattern.

## Default Completion Rule

When the user asks to "build a brand", "create brand assets", "build that brand", or makes an equivalent end-to-end request **without explicitly narrowing scope**, carry the work through the full deliverable set:

- Phase 0: Brand discovery + archetype
- Phase 1: Brand strategy outputs
- Phase 2: Visual identity outputs (moodboards → visual directions → refined identity)
- Phase 3: Design system outputs
- Phase 4: Imagery direction + curated image library
- Phase 5: Templates (PPTX asset pack, DOCX, letterhead, business cards, email sig) — uses imagery from Phase 4
- Phase 6: Brand book (HTML + optional PDF)

Do **not** stop after logo, palette, tokens, or guidelines unless the user explicitly asks for a partial package, asks to pause, or a hard blocker prevents generation.

Missing practical details (website, email, founder name) are **not** a reason to stop. Use clearly labeled placeholders and still generate the template set.

> **Scope note:** This default completion rule applies to **Mode A (Build from Scratch)**. Modes B–E have scope defined by their own deliverable lists — see Workflow Router below.

## Workflow Overview

```
Phase 0: Brand Discovery     → name, context, archetype selection
Phase 1: Brand Strategy       → positioning, tagline workshop, personality spectrums, voice
Phase 2: Visual Identity      → moodboards → 3 visual directions → refined logo/colors/type
Phase 3: Design System        → CSS tokens, component classes, motif system
Phase 4: Imagery Direction    → curated image library, processing, SVG assets
Phase 5: Templates            → PPTX asset pack, DOCX, letterhead, cards, email sig
Phase 6: Brand Book           → compiled HTML brand book (+ optional PDF conversion)
```

**Key change from old workflow:** Imagery (Phase 4) now comes BEFORE templates (Phase 5), so brand-treated images are available for integration into slide decks and document templates.

## Build Log (MANDATORY handoff protocol)

Brand work routinely spans multiple sessions and often involves revisiting prior
decisions after new visual evidence appears. Checkpoint discipline alone is not
enough. Every `brand-builder` engagement MUST maintain a durable handoff log at:

`client-data/clients/<slug>/.build-history/BUILD_LOG.md`

This file is the single source of truth for multi-session progress, open
questions, approvals, discarded directions, and step-level status. It is
mandatory in **all modes**:

- **Modes A / C / D**: full phase tracking across strategy, identity, system,
  imagery, templates, brand book, and post-work
- **Mode B**: lighter tracking focused on audit inputs, scoring rationale,
  missing data, findings, and report outputs
- **Mode E**: lighter tracking focused on supplied materials, compliance
  findings, unresolved questions, and remediation outputs

Lighter does **not** mean optional. It only changes which phase sections are
filled in.

### Session-zero bootstrap (MANDATORY for fresh builds)

Before asking new creative questions or generating artifacts:

1. Ensure `client-data/clients/<slug>/.build-history/` exists
2. Create `BUILD_LOG.md` from `references/build-log-template.md`
3. Record the observed starting state, selected mode, and expected scope
4. Only then begin discovery, audit, or creative work

### First thing you do in ANY session (resume protocol)

1. Check whether `client-data/clients/<slug>/.build-history/BUILD_LOG.md`
   exists
2. **If it exists**: read it in full before touching anything else. Trust the
   Status Dashboard, Key Decisions, Discarded Directions, User Preferences, and
   Handoff Notes. Start from `Next action`. Do not re-litigate settled decisions
   unless the user explicitly asks you to.
3. **If it does not exist**: reconstruct one before doing any new work
4. **State reconciliation** (always, even when the log exists): verify that the
   log's claimed phase matches what's actually on disk. Check for each phase's
   key outputs:
   - Phase 2: `logos/` directory with SVGs
   - Phase 3: `tokens.css`, `guidelines.md`
   - Phase 4: `images/` with processed variants, `images/manifest.json`
   - Phase 4/5: `assets/svg/` with motif SVGs
   - Phase 5: `pptx-assets/`, `templates/`
   - Phase 6: `.build-history/brand-book.html`

   If files exist for phases the log marks as incomplete, update the log before
   starting new work. If the log marks phases complete but outputs are missing,
   flag the discrepancy to the user.

### Reconstruction protocol for inherited / in-progress brands

When a brand already has work on disk but no log yet:

1. Inspect `charter.json`, current canonical brand files, `_build/` artifacts,
   and any transition docs or audit outputs
2. Create `.build-history/BUILD_LOG.md` from the template before making new
   edits
3. Fill the dashboard and phase sections from the observed state
4. Mark inferred entries with `(reconstructed)`
5. Put uncertainty in `Open Questions & Assumptions`
6. Do not re-propose discarded directions when existing artifacts already imply
   a rejected path

### When to update the log (minimum cadence)

Update the log at every one of these moments:

| Trigger | What to update |
|---|---|
| Starting a mode or phase | Dashboard `Current phase`, section `Status = in-progress`, `Dates` start |
| Entering a numbered step / checkpoint | Dashboard `Current checkpoint`, phase checkpoint ledger |
| Key decision made | Append dated entry to Key Decisions with rationale |
| User approves or rejects something | Record under User Approvals or Discarded Directions |
| Blocker encountered | Add to Open Questions & Assumptions, set Dashboard `Blockers` |
| Blocker resolved | Strike through resolved question, clear or update Dashboard blocker |
| Visual QA completed | Add QA notes and outcome for that checkpoint |
| Ending a session | Always refresh `Last updated`, `Current phase`, `Current checkpoint`, and `Next action` |

### What belongs in the log

**Belongs**:
- Decisions and rationale
- User taste, off-limits territory, and aesthetic preferences surfaced in conversation
- Step-level status such as "Phase 2 Step 2 awaiting user choice"
- Things tried and rejected
- Assumptions, blockers, and mode-specific scope boundaries
- Handoff notes that a future agent would not infer from files alone

**Does not belong**:
- Raw copies of `charter.json` or guidelines content
- Exhaustive file touch lists when git history is clearer
- Generic QA checklists that already live in this skill

### Handoff quality bar

Before ending a session, ask: *"If a new agent opened only `BUILD_LOG.md`,
`charter.json`, and the current brand files, could they continue without
re-asking settled questions?"* If no, add the missing context to the log.

### Cleanup rule

`_build/` is disposable. `BUILD_LOG.md` is not. Because the active log lives in
`.build-history/`, cleanup must never erase progress state.

## Workflow Router

Before starting any work, detect existing brand data and select the appropriate mode.

### Existing data detection

Check `client-data/clients/<slug>/` for:
1. `charter.json` — visual identity exists?
2. `logos/` — logo assets exist?
3. `guidelines.md` — brand guidelines exist?
4. `tokens.css` — design tokens exist?
5. `templates/` — brand templates exist?

### Mode selection

| Mode | Use when | Scope | Effort |
|------|----------|-------|--------|
| **A: Build from Scratch** | No existing brand / user wants fresh start | Full Phase 0–6 | High |
| **B: Brand Audit** | Assess current brand health | Analysis only | Medium |
| **C: Brand Refresh** | Evolve visuals + messaging, preserve equity | Quick audit → Phases 2–6 | Medium-High |
| **D: Full Rebrand** | Complete reinvention | Pre-work + Phase 0–6 + transition | Very High |
| **E: Consistency Check** | Quick compliance scan | Spot check | Low |

### Auto-selection logic

- **No existing data** → Mode A automatically
- **Clear intent keywords** → auto-select:
  - "audit", "health check", "assess brand" → Mode B
  - "refresh", "modernize", "update brand", "evolve" → Mode C
  - "rebrand", "complete overhaul", "start over" → Mode D
  - "does this follow", "brand compliance", "consistent with" → Mode E
  - "build a brand", "create brand", "new brand" → Mode A
- **Existing data + ambiguous request** → present the mode table and ask

### Refresh vs. Rebrand diagnostic

When the user is unsure whether they need a refresh or rebrand, run this 5-question diagnostic (score 1–5 each):

1. **Core values alignment** — Do current brand values still represent who you are? (5 = perfectly, 1 = not at all)
2. **Audience relevance** — Does the brand resonate with your current target audience? (5 = strongly, 1 = lost connection)
3. **Visual currency** — Does the visual identity feel current? (5 = timeless, 1 = dated)
4. **Competitive differentiation** — Does the brand stand apart from competitors? (5 = distinctive, 1 = blends in)
5. **Business model fit** — Does the brand reflect what you actually do today? (5 = exact fit, 1 = completely misaligned)

**Scoring:** 20+ → Mode C (Refresh) | 12–19 → Mode C with deep strategy update | <12 → Mode D (Full Rebrand)

### Mode B: Brand Audit

**Purpose:** Assess current brand health without making changes. Produces a diagnostic report.

**Process:**
1. Load all existing brand data (`charter.json`, `profile.json`, logos, `messaging/` if present)
2. Evaluate 5 dimensions (see `references/brand-maintenance.md` for scoring criteria):
   - Brand Substance — mission/values alignment, positioning currency, archetype coherence
   - Visual Consistency — logo usage, color drift vs. charter.json, typography compliance
   - Messaging Consistency — tone alignment, key message presence, cross-channel coherence
   - Competitive Positioning — differentiation strength, category conventions
   - Stakeholder Alignment — internal/external perception match
3. Present findings interactively — discuss each dimension with the user
4. Generate deliverables

**Deliverables:** Health Scorecard (HTML with radar chart), Audit Report (DOCX/MD), Drift Report, Action Plan
**Output:** `client-data/clients/<slug>/_build/brand-audit/`
**Missing data:** Score unavailable dimensions as N/A, recommend establishing them in the action plan.

### Mode C: Brand Refresh

**Purpose:** Evolve the visual identity and messaging while preserving brand equity. The old and new should feel related at thumbnail size (the "squint test").

**Process:**
1. Quick audit (condensed Mode B — identify what's working and what's dated)
2. Equity assessment — classify each brand element as **keep** / **evolve** / **retire**
3. **Brand Exploration Board** (Phase 2, Step 0) — generate the comparison HTML so the user can explore accent colors, font alternatives, and motif options against the existing dark palette before committing. This is the natural entry point for refresh work.
4. Enter Phase 2 with current brand as "Direction 0" baseline alongside 2 new directions (seeded by exploration board picks)
5. Phases 3–6 as needed (user decides scope after seeing the new direction)
6. Generate migration plan (old-to-new mapping, rollout timeline, stakeholder notification)

**Key constraint:** Apply the "squint test" — at thumbnail size, old and new brands must feel related.
**Deliverables:** Brand Exploration Board (HTML), Refreshed brand assets (per phases selected), Migration Plan (MD), Before/After comparison (HTML)
**Output:** Staged in `client-data/clients/<slug>/_build/staged/` (promoted to canonical on accept) + migration plan in `client-data/clients/<slug>/_build/reviews/brand-refresh/`

### Mode D: Full Rebrand

**Purpose:** Complete brand reinvention — new strategy, new identity, new everything.

**Process:**
1. Rebrand assessment — document the "why", risk analysis, go/no-go confirmation
2. Brand archaeology — catalog current brand, identify any transferable equity, "sacred cows" conversation
3. **Brand Exploration Board** (Phase 2, Step 0) — generate comparison HTML to explore new directions against the old brand before committing
4. Full Phase 0–6 with "departing from" context (explicit contrast against old brand at each phase)
5. Transition planning — comms plan, phased rollout, asset deprecation schedule, post-launch monitoring

**Extra deliverables:** Old-vs-New comparison (HTML), Stakeholder Communication Guide (MD), Transition Timeline
**Output:** Staged in `client-data/clients/<slug>/_build/staged/` (promoted to canonical on accept) + transition artifacts in `client-data/clients/<slug>/_build/reviews/brand-transition/`

### Mode E: Consistency Check

**Purpose:** Quick compliance scan — does provided material follow the brand standards?

**Process:**
1. Load `charter.json` + brand guidelines (`BRAND-Brand-Guidelines.md` or brand book)
2. Ask user to provide materials to check (files, URLs, descriptions)
3. Evaluate each material against brand standards (logo usage, colors, typography, tone, messaging)
4. Generate compliance scorecard with per-item pass/fail and fix recommendations

**Deliverables:** Compliance Scorecard (HTML), Fix Recommendations (MD)
**Output:** `client-data/clients/<slug>/_build/brand-check/`

### Phase reuse across modes

| Mode | Pre-work | Ph 0 | Ph 1 | Ph 2 | Ph 3 | Ph 4 | Ph 5 | Ph 6 | Post-work |
|------|----------|------|------|------|------|------|------|------|-----------|
| A: Build | — | Full | Full | Full | Full | Full | Full | Full | — |
| B: Audit | Full audit | — | — | — | — | — | — | — | Scorecard + Report |
| C: Refresh | Audit + equity | — | Review | Full (evolve) | Full | Opt. | Opt. | Opt. | Migration plan |
| D: Rebrand | Assessment + archaeology | Full | Full | Full | Full | Full | Full | Full | Transition plan |
| E: Check | — | — | — | — | — | — | — | — | Compliance report |

## Content Boundary

`client-data` stores **brand identity and company operational data**.

**client-data/clients/\<slug\>/** — brand identity assets:
- `charter.json`, `logos/`, `images/`, `assets/`, `guidelines.md`, `tokens.css`, `templates/`, `.build-history/`

**companies/\<slug\>/** — company operational data:
- `profile.json`, `people.json`, `proposals/`, `messaging/`, `press-releases/`, `assets/`

**Does NOT belong in client-data (goes in Cowork workspace):**
- Company profiles, team rosters, proposals, press releases, messaging frameworks
- These are company data, not brand identity — even if generated alongside brand work

Company data (profile.json, people.json, proposals/, messaging/, press-releases/) now lives alongside brand data in `client-data/clients/<slug>/`.

## Brand Data Integration

`client-data/clients/<slug>/` is the org's **single source of truth** for all brand data. From there, consumer repos pick up changes via their `client-data` submodule (Cowork, plugins, MCPs, websites).

### Stage → Accept → Promote (core principle)

**Nothing touches canonical until the user explicitly accepts it.** Every phase stages its output to `_build/staged/`, and promotion to canonical is a distinct, user-triggered step. This prevents rejected work from polluting the canonical folder and eliminates dual-source-of-truth problems.

### Output destination

```
client-data/clients/<slug>/
├── charter.json          <- canonical (promoted from staged)
├── logos/                <- canonical (promoted from staged)
├── images/               <- canonical (promoted from staged)
├── guidelines.md         <- canonical (promoted from staged)
├── tokens.css            <- canonical (promoted from staged)
├── templates/            <- canonical (promoted from staged)
│   ├── pptx/
│   ├── docx/
│   └── html/
├── .build-history/
│   └── BUILD_LOG.md      <- mandatory multi-session handoff log
└── _build/               <- ALL work-in-progress (gitignored)
    ├── staged/           <- phase output awaiting promotion
    │   ├── phase2-identity/    # logos/, charter-patch.json
    │   ├── phase3-system/      # tokens.css, guidelines.md, charter-patch.json
    │   ├── phase4-imagery/     # images/, heroes/, processed/
    │   ├── phase5-templates/   # templates/, charter-patch.json
    │   └── phase6-brandbook/   # brand-book HTML/PDF
    └── reviews/          <- review HTMLs, QA boards, scripts (never promoted)
```

**Key separation:**
- `_build/staged/` — deliverables awaiting user approval. Promoted to canonical on accept, deleted on reject.
- `_build/reviews/` — interactive boards, comparison HTMLs, moodboards, build scripts. Reference artifacts that may be promoted to `.build-history/` at end-of-build but never to canonical.
- `charter.json` updates are staged as `charter-patch.json` per phase and merged into canonical on promotion (see Phase Promotion Protocol).

**charter.json mapping** from brand-builder outputs:

| Brand-builder output | charter.json field |
|---------------------|-------------------|
| Primary palette (dark, brand, accent) | `colors.primary`, `colors.accent`, `colors.text` |
| Neutral scale (n50, white) | `colors.background`, `colors.backgroundAlt` |
| Semantic colors | `colors.success`, `colors.warning`, `colors.error` |
| Display font | `fonts.heading.family` |
| Body font | `fonts.body.family` |
| Mono font | `fonts.mono.family` |
| Logo SVGs | `logo.primary`, `logo.white` |
| Presentation spacing | `presentation.slideMargin`, etc. |

## Phase Promotion Protocol

Every phase that produces brand deliverables follows the same stage→accept→promote cycle. This is the core mechanism that prevents rejected work from polluting canonical and eliminates dual-source-of-truth problems.

### How promotion works

1. **Phase writes to `_build/staged/phaseN/`** — all deliverables land here, mirroring the canonical folder structure (e.g., `_build/staged/phase2-identity/logos/logo.svg`)
2. **User reviews and accepts** — the skill presents the deliverables and asks for explicit approval
3. **Promote on accept:**
   - Copy files from `_build/staged/phaseN/` to their canonical locations in `client-data/clients/<slug>/`
   - If `charter-patch.json` exists in the staged folder, merge its contents into the canonical `charter.json` (deep merge — new keys added, existing keys overwritten, unrelated keys preserved)
   - Delete any canonical files that the new output **supersedes** (see supersession below)
   - Remove `_build/staged/phaseN/` after successful promotion
   - Log the promotion in BUILD_LOG.md under the phase's "Promotion ledger" section
4. **Reject = delete staged** — `rm -rf _build/staged/phaseN/`. Canonical is untouched. The phase can be re-run or skipped.

### Staged folder structure per phase

| Phase | Staged path | Contents |
|-------|-------------|----------|
| Phase 2 | `_build/staged/phase2-identity/` | `logos/`, `charter-patch.json` (colors, fonts, logo refs) |
| Phase 3 | `_build/staged/phase3-system/` | `tokens.css`, `guidelines.md`, `charter-patch.json` (design system fields) |
| Phase 4 | `_build/staged/phase4-imagery/` | `images/` (sourced + processed + heroes), SVG assets |
| Phase 5 | `_build/staged/phase5-templates/` | `templates/` (pptx/, docx/, html/), `charter-patch.json` (presentation/document fields) |
| Phase 6 | `_build/staged/phase6-brandbook/` | `brand-book.html`, `brand-book.pdf` (optional) |

Review/interactive artifacts (selection boards, curation boards, moodboards, comparison HTMLs, build scripts) go to `_build/reviews/` — they are never staged for promotion.

### charter-patch.json

Since multiple phases contribute to `charter.json`, each phase writes only its own fields as a `charter-patch.json` in its staged folder. On promotion, the patch is deep-merged into the canonical `charter.json`.

Example `_build/staged/phase2-identity/charter-patch.json`:
```json
{
  "colors": { "primary": "#1a1a1a", "accent": "#c75000" },
  "fonts": { "heading": { "family": "Space Grotesk" } },
  "logo": { "primary": "logos/logo.svg", "white": "logos/logo_white.svg" }
}
```

This avoids the problem of one phase overwriting fields set by another.

### Supersession tracking

When promoting, the skill checks for existing canonical files that the new output replaces. Before deleting anything, present a supersession manifest to the user:

```
Promoting Phase 2 → canonical:
  Adding:    logos/logo.svg, logos/logo_white.svg, logos/icon_dark.svg (6 files)
  Replacing: logos/ (8 existing files → 6 new files)
  Removing:  logos/icon_classic_dark.svg, logos/icon_classic_green.svg (no longer in set)
  Charter:   merging colors, fonts, logo fields

Proceed? [y/n]
```

The user must confirm before any canonical files are deleted. This makes supersession explicit and auditable.

### Derived files must stay in sync

`guidelines.md` and `tokens.css` are **derived from charter.json** — they present the same data in human-readable and CSS-consumable forms. When a promotion merges a `charter-patch.json` that changes colors, fonts, logos, imagery, or templates, the promotion step must also regenerate or update `guidelines.md` and `tokens.css` to reflect those changes. Never promote a charter patch without checking whether derived files need updating.

Similarly, if templates are promoted (Phase 5) and charter.json gains a `templates` section, that section must be removed if the templates are later rejected and deleted from canonical. **charter.json must never reference files that don't exist.**

### Iterative phases (P0–P3)

Phases 0–3 are interactive — the user reviews logos, picks colors, confirms tokens in real-time. The staging model doesn't slow these down: staging and promoting typically happen within the same conversation turn. The value is that if the user says "actually, let's redo the logos" after seeing the design system, the old logos can be cleanly replaced via a new Phase 2 promotion.

### Re-running a phase

If a phase is re-run (e.g., user wants new templates after rejecting the first batch):
1. Delete `_build/staged/phaseN/` if it still exists
2. Re-run the phase, writing to a fresh `_build/staged/phaseN/`
3. On promotion, supersession handles cleanup of the old canonical files from the previous run

## Phase 0: Brand Discovery & Archetype

Before building anything, gather context and establish the brand's psychological foundation.

### Required information (must have before Phase 1)
- **Brand name** — exact spelling and casing
- **What the company does** — industry, services, target audience
- **Desired tone** — serious/playful, corporate/startup, minimal/expressive

### Important but can be suggested if missing
- **Name origin / meaning** — often yields visual motifs
- **Domains / URLs** — needed for templates and signatures
- **Competitor/inspiration brands** — "we want to feel like X"
- **Color preferences** — even vague ones ("dark and professional")
- **Founder name(s)** — for templates, email signatures, business cards

### Discovery approach

If the user provides a detailed brief, extract what you need and confirm. If sparse, ask structured questions with multiple-choice options.

Always follow up on the name origin — it often unlocks the best visual concepts. Ask: "Is there a story behind the name? Sometimes a name origin inspires the strongest visual ideas."

### Brand Archetype Selection (interactive)

Read `references/brand-strategy.md` for the full 12-archetype framework (Jung).

1. Based on the brief, propose **3-4 candidate archetypes** — include at least one non-obvious match alongside the expected choices
2. Present each with a short description, example brands, and visual/voice direction
3. **Ask the user** which archetype resonates most — they pick a primary archetype and optionally a secondary
4. The archetype combination seeds all downstream decisions: logo style, color temperature, font energy, imagery themes, voice tone

The archetype is the single biggest lever for creative diversity. Different archetypes for similar industries yield radically different brands.

## Phase 1: Brand Strategy

Read `references/brand-strategy.md` for the full framework including brand pyramid, tagline workshop, and personality spectrums.

**Deliverables:**
- Brand archetype summary (from Phase 0)
- Brand essence (one sentence)
- Positioning statement (internal-facing)
- Tagline (6-8 options across diverse directions → workshop → refined winner)
- Brand personality (5 traits, informed by archetype + personality spectrums)
- Voice guidelines (how we write / how we don't, with voice test exercise)

### Interactive decision points in Phase 1

1. **Tagline workshop** — Present 6-8 tagline options rendered in HTML with the brand's likely font style. Let the user react ("love it", "interesting", "no"). Generate 3-4 refinements of favorites. Don't just list text — show taglines in context (e.g., mockup on a business card, below a logo placeholder, as an email signature line).

2. **Personality spectrums** — Present 5 slider-style spectrums and let user place the brand:
   - Formal ←→ Casual
   - Traditional ←→ Innovative
   - Reserved ←→ Expressive
   - Analytical ←→ Intuitive
   - Established ←→ Rebellious

3. **Voice test** — Write the same message (e.g., announcing a new service) in 3 different voices derived from the archetype. Let user pick.

Present all Phase 1 deliverables and confirm before proceeding.

## Phase 2: Visual Identity

Read `references/visual-identity.md` for moodboard frameworks, logo types (7 strategies), color harmony methods, and the expanded font repertoire (100+ fonts with energy pools).

### Step 0 (optional): Brand Exploration Board

When the user wants to **compare options before committing to a direction** — or when running a brand refresh/rebrand with existing assets — generate a **Brand Exploration Board**: a single, comprehensive HTML page that lets the user see and react to multiple possibilities side by side.

**When to offer / produce:**
- User asks to "compare options", "explore directions", "show me alternatives", "what are my options"
- Mode C (Refresh) or Mode D (Rebrand) — before entering visual directions, to establish what changes vs. what stays
- Mode A (Build) — when the user wants a wider exploration before narrowing to 3 directions
- Anytime during Phase 2 when the user wants to reconsider a specific dimension (colors, fonts, motif)

**Sections to include** (all rendered in one self-contained HTML file with embedded CSS and Google Fonts):

1. **Accent Color Palettes** (6-10 options) — Each shown as a card with: large swatch strip, accent on dark/light/brand backgrounds, accent as text, accent as thin rule/line element, mini cover-slide mockup (dark panel + light panel), hex code and descriptive name. Range should span warm-to-cool, muted-to-vivid.

2. **Typography Pairings** (5-8 options) — Each pairing shows: display heading (large), subheading, body paragraph, overline label in mono/data font, metric numbers — all rendered on both dark and light backgrounds. Always include the current fonts as option 1 for comparison. Load all fonts from Google Fonts.

3. **Motif / Signature System Options** (8-10 options) — Present motifs as true brand systems, not isolated shapes. Every option must include: a short rationale, the construction logic, and the motif rendered in at least 5 contexts:
   - section divider or heading separator
   - card or panel accent
   - crop/frame treatment
   - repeat or background pattern
   - mini cover/hero or slide mockup
   - plus at least one micro-scale use such as bullet, favicon-sized mark, or data annotation

   The option set must span multiple families, not just line variants. Include at least:
   - linear / orchestration systems
   - grid / ledger systems
   - frame / crop systems
   - typographic or ligature-derived systems
   - pattern / tessellation systems
   - pathway / signal or node systems

   Each option should feel like a plausible signature device a strong design studio would actually ship.

4. **Combined Preview Cards** (3-5 combinations) — Curated "best of" combos mixing one accent + one font pairing + one motif, each rendered as a mini presentation cover mockup (dark panel with title + accent subtitle + motif decoration, light panel with placeholder area).

**Design requirements:**
- Professional layout befitting a strategy consultancy — CSS grid/flexbox, dark section headers between sections
- Sticky top nav with section anchors for easy navigation
- Each option clearly numbered/labeled for discussion ("I like accent 4 with fonts 2 and motif 3")
- Responsive but optimized for desktop (1200px+)
- All Google Fonts loaded in a single import
- Title: `BRAND — Brand Revision Explorer` (or `Brand Exploration Board` for new builds)

**Motif quality bar:**
- Motifs must be derived from something real in the brand: logo geometry, letterform anatomy, grid logic, notation logic, or a repeated spatial relationship
- Favor repetition, alignment, rhythm, contrast, and tension over decorative doodles
- Test every motif at both macro and micro scale; if it only works as a large hero flourish, it is not a system
- Avoid generic diagonals, random arcs, floating dots, or arbitrary corner cuts unless they are clearly systemized across multiple uses
- Show motifs on both dark and light surfaces, and ensure they still feel branded when stripped back to one color

**Output:** `client-data/clients/<slug>/_build/reviews/BRAND-Brand-Revision-Comparison.html` (refresh/rebrand) or `client-data/clients/<slug>/_build/reviews/BRAND-Brand-Exploration-Board.html` (new build)

**After review:** The user's reactions ("I like accent 4, fonts from option 3, motif family 2 with option 7") feed directly into the visual directions step — use their picks to seed the 3 directions, or skip straight to refinement if the user has a clear composite preference.

### Step 1: Moodboards / Stylescapes (interactive)

Before jumping to logo concepts, generate **4-5 stylescapes** as HTML pages — each is a collage of colors, textures, typography samples, imagery references, and mood words. Each should feel radically different.

Open stylescapes in the browser for the user. Ask: "Which 2-3 of these resonate? Which feel wrong?" The chosen stylescapes inform the visual directions.

### Step 2: Visual Directions (interactive)

Present **3 complete visual directions** — each a coherent package, not mix-and-match parts.

Each direction must include:
1. **An evocative 2-word name** drawn from a shuffled pool — never the same names twice
2. **A logo concept** using a DIFFERENT logo type per direction (7 types available: wordmark+motif, lettermark+icon, abstract mark, typographic pure, combination mark, emblem, mascot)
3. **A unique font pairing** — display + body + mono, drawn from shuffled energy pools. Each direction uses DIFFERENT fonts
4. **A color palette** built using a DIFFERENT harmony method per direction
5. **A mini brand page mockup** showing how the direction would look as a real webpage hero section

**Presentation:** One HTML page showing all 3 side by side. Open in browser. Each shows: logo on dark + light backgrounds, slide mockup, font specimens with real brand copy, hero page mockup.

**The user picks a direction, not individual pieces.** After selection, offer optional deep-dives:
- Font comparison page (6-9 alternatives within the chosen style)
- Color palette exploration (show the palette with complementary/split-comp/analogous variations)

### Step 3: Refinement (after direction chosen)

1. Refine the chosen logo into all required lockups (dark, light, brand-color, mono, with-tagline, icon marks at multiple sizes)
2. Build the full color system: primary palette → extended scales (50-900) → neutral scale → semantic colors (see Semantic Color Principles below)
3. **Present 3-4 color palette options** using different harmony methods, rendered as swatches with context (logo on palette, slide mockup)
4. Define typography: full type scale (display XL to micro), specimens with real brand copy
5. Extract the brand motif — the repeatable element for the design system

### Logo Completeness Rule

A complete logo system must include **both**:

1. **A text-centric logo** — wordmark where the brand name is central and immediately readable. This is the primary identity carrier for headers, reports, and hero placements.
2. **A standalone symbol mark** — a non-text logo that works independently without the brand name. This is for favicons, app icons, social avatars, watermarks, and contexts where the name is already established. The symbol must be recognizable at 16px and distinctive at 48px+.

Both marks must share visual DNA (geometry, stroke logic, or motif connection) so they feel like parts of one system. The icon variants (`icon_dark.svg`, etc.) must use the standalone symbol, not a miniaturized fragment of the wordmark underline.

**SVG production rule:** All logo SVGs must use `<path>` elements for text, not `<text>` elements with font-family references. Text-based SVGs break when the font is unavailable. Convert all wordmark text to outlined paths before finalizing.

**Multi-motif rule:** The final identity does not need to collapse to a single motif. If the exploration clearly yields a coherent family, keep **2-4 aligned motifs** with explicit roles, for example:
- primary signature motif
- structural / layout motif
- data / annotation motif
- background rhythm or transition motif

They must share the same geometry, spacing logic, stroke logic, and emotional tone. Do not keep unrelated styles just for variety.

**Run the Visual QA Protocol** before presenting any visual output.

Always confirm the full direction (logo + fonts + colors + motif) with the user before proceeding to Phase 3.

### Semantic Color Principles

Every brand needs semantic colors (success, warning, error, info) for functional UI elements like scorecards, dashboards, RAG indicators, and status badges. These are generated as part of the color system in Phase 2 Step 3 and codified in the design tokens in Phase 3.

**Requirements:**
1. **Palette-aligned** — Semantic colors must feel like they belong to the brand palette. They should be desaturated and muted enough to not visually clash with the primary and accent colors. Avoid generic high-saturation defaults (e.g., pure traffic-light red/amber/green).
2. **Functionally distinct** — Each semantic color must be clearly distinguishable from the others and from the brand/accent colors at a glance.
3. **Light variants included** — Each semantic color gets a light variant for background fills (badges, callout boxes, table row highlights).
4. **Temperature-consistent** — If the brand palette is cool-toned, lean semantic colors cooler. If warm, lean warmer. They should feel native, not imported from a different design system.
5. **Info = brand** — The info color can be derived directly from the brand blue scale (typically the 400 stop) since informational states are brand-neutral.

**Process:** When building the color system, derive semantic colors from the palette context — don't copy them from a generic UI kit. Present them alongside the palette swatches for user review. Include them in the brand guidelines and CSS tokens.

## Phase 3: Design System

Read `references/design-system.md` for the token structure and component patterns.

**Deliverables:**
- `brand-tokens.css` — complete CSS custom properties file
- Utility classes for typography, buttons, cards, badges
- Brand motif system components (primary motif plus optional supporting motifs codified as CSS/SVG)
- Motif SVG files in `assets/svg/` (see Motif SVG Creation below)
- `BRAND-Guidelines.md` — text-based brand spec

Use the template in `assets/tokens-template.css` as a starting point. Customize all values from Phase 2 decisions.

### Motif SVG Creation (Phase 3 deliverable)

Motif SVGs are part of the **design system**, not imagery (Phase 4) or templates (Phase 5). They are vector brand elements that encode the motif construction rules from guidelines.md into actual SVG files. Create them in Phase 3 after the motif system is defined in tokens.css and guidelines.md.

**Required outputs** (in `assets/svg/`):
- Core motifs: one SVG per motif defined in guidelines (e.g., `motif-tempo-ledger.svg`, `motif-data-rail.svg`)
- Divider variants: full-width and short, in standard (dark-on-light) and white (light-on-dark) versions
- `pattern-tile.svg` — repeating tile combining motif DNA for subtle backgrounds

**Construction rules:**
- Stroke weights, colors, and dimensions MUST match the values in `tokens.css` motif variables
- Use hardcoded hex colors (not CSS variables) since SVG files are consumed outside CSS context
- Include `role="img"` and `aria-label` for accessibility
- Verify consistency: `--motif-line-weight` in tokens.css must match stroke widths in SVGs and the minimum weight stated in guidelines.md

**Why this matters:** Website-builder enforces "brand motif in 2+ locations per page" and needs these SVGs. The pptx-assets pipeline (Phase 5) renders them to PNG. Without Phase 3 motif SVGs, both downstream consumers fail silently.

### Cross-File Consistency Check (Phase 3 gate)

Before promoting Phase 3 deliverables, verify consistency across all brand files:

| Check | Source A | Source B | What to verify |
|-------|----------|----------|----------------|
| Motif weights | `tokens.css` `--motif-line-weight` | `guidelines.md` construction rules | Values match, above minimum |
| Logo wiring | Files in `logos/` | `charter.json` `logo` section | Every file on disk has a charter field |
| Color values | `charter.json` `colors` | `tokens.css` named colors | Hex values match |
| Font families | `charter.json` `fonts` | `tokens.css` `--font-*` | Family names match |

Fix any drift before promoting. Do not leave known inconsistencies for a later phase.

### guidelines.md as a Derived View

`charter.json` is the **machine-readable source of truth**. `guidelines.md` is a **human-readable derived view** — it must always reflect the current state of charter.json plus any visual/strategic context that doesn't fit in JSON (voice guidelines, motif construction notes, logo usage rules, imagery philosophy).

**Regeneration rule:** Whenever a phase promotion materially changes charter.json (new colors, fonts, logo refs, imagery catalog, template refs), `guidelines.md` must be regenerated or updated in the same promotion step. Do not leave guidelines.md stale after a charter.json change.

**What "regenerate" means in practice:**
- Re-derive all factual sections (colors, typography, logo file list, imagery themes) from the current charter.json
- Preserve strategic/editorial sections (brand foundation, voice, motif construction, usage rules) unless those changed too
- Stage the updated guidelines.md alongside the phase's other deliverables in `_build/staged/`

## Phase 4: Imagery Direction

Read `references/imagery.md` for the full imagery framework including expanded providers (free, mid-range, premium, AI generation), interactive curation, and processing pipeline.

**Deliverables:**
- Curated image library (`images/` — ~20-24 sourced and processed photos)
- Imagery direction guide (`.html` — single comprehensive document covering philosophy, principles, hero usage demos, processing recipes, full image library with original/processed toggle, keywords, SVG assets, and sourcing guidance)
- Slide-ready image crops (16:9, 2:1 variants with text-safe overlays)

> **Note:** SVG divider assets and pattern tile are Phase 3 deliverables (see Motif SVG Creation above). Phase 4's imagery guide showcases them but does not create them.

**One deliverable, not two.** The imagery direction guide is the single output file — it includes the image contact sheet (with click-to-toggle original/processed) as an integrated section. Do NOT produce a separate contact sheet HTML alongside the guide. During curation (Step 3), use the guide itself as the review artifact, or show images inline in conversation.

**Image count & theme balance:** Target ~20-24 final images across 4-6 themes. Theme counts are **flexible** — allocate more images to signature themes and fewer to supporting themes based on brand needs. Not every theme needs equal representation.

**Process — this phase is highly interactive:**

### Step 1: Theme Discovery (interactive)
1. Propose 4-6 imagery themes derived from brand archetype, personality, industry, and geography
2. For each theme: name it, describe the visual world, list example subjects, and explain which brand trait it serves
3. **Ask the user** which themes resonate, which to drop, and whether to add any
4. Converge on 4-6 final themes with a rough image count per theme

### Step 2: Wide Selection Board (interactive)
5. Source a **wide selection** — 2-3x more candidates than the final count (40-60 images) across all confirmed themes
6. Search stock platforms (free: Unsplash, Pexels, Pixabay; paid: Getty, Shutterstock, Adobe Stock, Stocksy; AI generation for abstract/texture needs)
7. Build an **interactive selection board HTML** (`_build/reviews/BRAND-Image-Selection.html`) — see `references/imagery.md` § "Selection Board Specification" for the full HTML pattern. Key features:
   - **Click-to-select**: each image card toggles selected state on click (visual border highlight)
   - **Theme sections** with sticky nav, rationale, suggested roles, and brand trait connection
   - **Live selection counter** in a fixed bottom bar showing selected count vs. target
   - **Copy selection list** button that exports selected image IDs to clipboard
   - **Pre-selection**: existing images (if rebrand) are shown first with keep/weak/questionable badges; strong images pre-selected
   - Brand-styled using the client's actual palette, fonts, and visual language
   - Images loaded via Unsplash/Pexels URLs (no download needed yet — download only after user picks)
8. **Present the selection board** to the user for review — user picks ~20-24 favorites from the wide set
9. Iterate: if a theme is under-represented in the user's picks, source additional candidates for that theme

### Step 3: Image Curation (interactive)
10. Build an **interactive curation board HTML** (`_build/reviews/BRAND-Image-Curation.html`) — see `references/imagery.md` § "Curation Board Specification" for the full HTML pattern. Key features:
    - **Role assignment buttons**: clickable `cover`, `divider`, `background`, `closing` per image (multiple allowed)
    - **Hero candidate toggle**: `★ HERO` button with text overlay preview showing readability on the image
    - **Auto-assign suggested roles**: pre-fills based on theme suggestions, user adjusts
    - **Export curation**: copies structured role + hero assignment to clipboard
    - Brand-styled, sticky nav, live counters — same quality bar as the selection board
11. **Present the curation board** to the user for review — user assigns roles, marks 4-9 heroes, exports
12. Process feedback: confirm unassigned images, validate hero count and theme coverage
13. Confirm final image set with assigned roles before processing

### Step 4: Processing & Guide Assembly
16. Apply brand treatment using sharp (8+ treatment variants available — see reference)
17. Create slide-ready crops: 16:9 (presentations), 2:1 (headers), 1:1 (cards)
18. Generate text-safe variants (darker overlay for text-over-image use)
19. Build the imagery direction guide HTML — a single comprehensive document with these sections:
    - Philosophy & visual principles
    - Hero usage demos (images in context with text overlay)
    - Before/after processing comparison
    - Treatment profiles table + processing pipeline recipe
    - Full image library with click-to-toggle original/processed per image
    - Visual vocabulary (use/avoid keyword clouds)
    - SVG divider and pattern asset showcase
    - Sourcing platforms and recommended search terms
20. Include Phase 3 SVG divider assets and pattern tile in the guide's asset showcase section

## Phase 5: Templates

Read `references/templates.md` for DOCX, letterhead, business cards, and email signature specs.

Phase 5 has two distinct deliverable categories:

1. **Automated-consumer assets** — pre-rendered files consumed by downstream skills (pptx, docx) at runtime. These are infrastructure, not standalone deliverables.
2. **Standalone human deliverables** — finished templates and design systems delivered to the user for direct use.

**Deliverables (automated-consumer):**
- PPTX asset pack (`pptx-assets/`) — pre-rendered gradients, photo overlays, motif tiles referenced from `charter.json` `pptxAssets` section. The `pptx` skill uses these directly for on-demand slide generation (no template .pptx file needed).

**Deliverables (standalone):**
- Report template (`.docx` via docx-js) — with hero image on cover
- Letterhead (`.docx` via docx-js) — with continuation page variant
- Business-card system (**interactive** `.html` review board with **20 complete front/back concepts**, click-to-select, clipboard export + promoted print packs for the approved top 10 concepts)
- Email-signature system (**interactive** `.html` review board with click-to-select, "Copy HTML" per variant + **12 email-safe fragment variants** for platform pickup)

### brand-builder vs brand-artifact-builder: pptx-assets decision tree

Both skills can produce pptx-assets. Use this decision tree:

| Scenario | Owner | Why |
|----------|-------|-----|
| Building a brand from scratch (Mode A) | **brand-builder** Phase 5 | Assets are created as part of the end-to-end brand build |
| Brand is already frozen, need pptx-assets for the first time | **brand-artifact-builder** | Brand-builder's creative phases are unnecessary |
| Updating pptx-assets after imagery changes | **brand-artifact-builder** | Incremental asset regeneration, not a brand rebuild |
| Full rebrand (Mode C/D) | **brand-builder** Phase 5 | Assets are regenerated as part of the rebrand pipeline |

These are mandatory for a default end-to-end brand build.

### PPTX Asset Pack

Instead of generating a 50-slide template .pptx (which was designed for human use in PowerPoint, not programmatic consumption), Phase 5 generates pre-rendered **presentation assets** that the `pptx` skill uses directly for on-demand slide generation.

**Assets generated:**

| Asset type | What | Storage |
|---|---|---|
| **Gradients** | 3-4 branded gradient PNGs (primary-to-dark, accent-diagonal, etc.) | `pptx-assets/gradients/` |
| **Photo overlays** | For each brand image with cover/divider/closing role: 3-4 overlay variants (brand color at varying opacities, dark scrim, B&W with accent tint) | `pptx-assets/overlays/` |
| **Motifs** | Pattern tile PNGs at presentation scale/opacities | `pptx-assets/motifs/` |

**Workflow:**
1. Identify all brand images with cover/divider/closing roles from `charter.images.catalog`
2. Generate overlay variants for each using Sharp compositing
3. Generate branded gradient and motif PNGs
4. Build an interactive **review board** (HTML page) showing all options — click-to-select pattern (same as business cards/email signatures)
5. After user selection, promote chosen assets to `pptx-assets/` and update `charter.json` with a `pptxAssets` section
6. Stage to `_build/staged/phase5-templates/pptx-assets/` → promote to canonical on acceptance

**Review board pattern:**
- For each source image: display 3-4 overlay variants side-by-side at slide dimensions
- For gradients: display all generated options
- Click-to-select with live counter ("Selected: N / target")
- Clipboard export of selected asset IDs

### Image Integration (Phase 4 → Phase 5)

Phase 5 deliverables use real brand imagery from Phase 4:
- **PPTX assets**: Photo overlays are generated from approved brand images with brand-color overlays at various opacities. Falls back to gradient-only assets when no images available.
- **DOCX**: Cover page uses a brand-treated hero image. Optional section header images.
- **Business cards**: Brand pattern tile or image texture on the back.
- **Cards + signatures pilot**: cards consume the approved image library through `images/manifest.json`; signatures remain image-free but consume the same color, motif, and placeholder policy through `templates/manifest.json`.

If a crop, lockup, motif export, or other prepared asset is meant to be reused
across website, presentation, document, or plugin workflows, treat that as a
`brand-artifact-builder` concern first. Phase 5 deliverables may consume canonical
brand files and promoted reusable exports, but they must not establish a parallel
storage convention or depend on `_build/brand-artifact-builder/` at runtime.

### Build scaffolds

- **Brand book HTML**: Build directly as a self-contained HTML file (see Phase 6). No build scaffold needed — write inline with all brand data, embedded SVG logos, and CSS. Output to `client-data/clients/<slug>/_build/staged/phase6-brandbook/`. Promoted to `.build-history/` on user acceptance. For optional PDF conversion, use Playwright's `page.pdf()` or browser print-to-PDF.
- **Cards + signatures pilot**: run the Phase 5 pilot builder from this skill:
  ```bash
  node skills/brand-builder/scripts/build-phase5-pilot.js --slug <slug>
  node skills/brand-builder/scripts/build-phase5-pilot.js --slug <slug> --pdf --qa
  ```
  Flags: `--pdf` for browser-backed PDF export, `--qa` for Playwright visual QA report. The builder reads all visual decisions from charter.json and the personality layer (`personality-from-archetype.js`), produces interactive card/signature review boards (click-to-select, clipboard export), generates 20 card concepts and 12 signature variants, and promotes the recommended top 10 card concepts to EU/US print exports. The personality layer drives motif stroke weight, typography scale, card spacing, and corner style based on brand archetype.

**Format skill note:** For DOCX, follow patterns in `references/templates.md` using the docx npm package. PPTX slides are generated on-demand by the `pptx` skill using charter.json + images + pptx-assets — the brand-builder no longer produces a .pptx file.

### Font Collision Check (Phase 2 prerequisite)

Before finalizing a brand's display font in Phase 2, run the collision checker:
```bash
python3 skills/brand-builder/scripts/check-font-collision.py --font "Proposed Font" --exclude <slug> --strict
```
This scans all active charters and exits 1 if another brand already uses the same heading font. Prevents visual sibling problems (e.g., ai4comms and popol both landing on Syne).

**QA is mandatory.** Visually inspect all generated PPTX assets, DOCX templates, business cards, and email signatures. Fix issues before presenting.

## Phase 6: Brand Book

Read `references/brand-book.md` for the section structure and design patterns.

**Approach: HTML-first.** The brand book is built as a single, self-contained HTML file — not generated via reportlab. This ensures:
- **Real brand fonts** via Google Fonts CDN (not system font approximations)
- **Actual brand imagery** embedded with relative paths from the output folder
- **Inline SVG logos** — the real logo assets, not text placeholders
- **Live CSS motif demos** — the Edge, chevron, etc. rendered as actual CSS
- **Visual consistency** with all other brand HTML deliverables (imagery guide, visual identity, exploration board)
- **No text overlap** — CSS handles layout flow naturally

**Deliverables:**
- `BRAND-Brand-Book.html` — comprehensive, magazine-quality brand guidelines (primary deliverable)
- `BRAND-Brand-Book.pdf` — optional PDF conversion (via Playwright `page.pdf()` or browser print-to-PDF)

**HTML structure (16 sections, single scrollable page):**

| # | Section | Content |
|---|---------|---------|
| 1 | Cover/Hero | Full-viewport dark bg with Edge motif pattern, inline SVG logo, tagline, version, scroll indicator |
| 2 | Table of Contents | Numbered anchor links with descriptions |
| 3 | Brand Foundation | Essence quote, positioning box, personality pills, spectrum bars, voice, language |
| 4 | Logo — Lockups | Inline SVGs on dark/light/brand backgrounds, tagline variant, mono, icon sizes |
| 5 | Logo — Rules | Clear space diagram, color-by-background table, don'ts |
| 6 | Color Palette | Primary swatches, brand blue scale strip, accent scale strip, neutral scale |
| 7 | Color Combos | Approved combination mockups, semantic colors with light variants, color rules |
| 8 | Typography Stack | Font specimen cards, type scale table with live rendered samples |
| 9 | Typography Rules | Dark/light hierarchy demos, weight restrictions, pairing rules |
| 10 | Brand Motif | Dark section, decorative Edge slashes, live CSS variant demos, code block |
| 11 | Voice & Tone | Writing principles, do/don't pairs in green/red boxes |
| 12 | Imagery Direction | Subject/avoid pills, hero image demos with text overlay, processing pipeline |
| 13 | Imagery Categories | Category cards with thumbnails, sourcing platforms, search terms |
| 14 | Templates | Template cards, PPTX asset pack overview, DOCX/letterhead/cards/signature summaries |
| 15 | Design Tokens | Dark section, syntax-highlighted CSS custom properties |
| 16 | Back Cover | Logo, tagline, domain, version, confidential |

**Technical requirements:**
- Single self-contained HTML file — all CSS inline in `<style>`, no external dependencies except Google Fonts
- Embed actual SVG logos inline (read from `logos/` folder)
- Reference brand images with relative paths (`assets/images/...`)
- Sticky sidebar navigation with scroll-tracking active state (JavaScript)
- `@media print` styles with `@page` A4 sizing and section `page-break-before`
- Follow the same design patterns as other brand HTMLs: CSS variables for all colors, Syne/Work Sans/Space Mono from Google Fonts, section-label overlines, Edge motif as decorative pattern

**Design patterns to match (from existing brand HTML files):**
- Hero: dark bg `var(--dark)`, Syne 48px bold white, Space Mono 11px tracked overline in accent
- Section labels: Space Mono 10-11px uppercase, letter-spacing 2.5-3px
- Section titles: Syne 28-32px bold
- Body text: Work Sans 15px, max-width 700px, color `var(--n600)`
- Cards: 1px solid `var(--n100)` border, border-radius 8-12px
- Quote boxes: light bg `var(--n50)`, 3px accent left border
- Swatches: CSS grid/flex, Space Mono labels, rounded corners
- Edge motif pattern: `repeating-linear-gradient(110deg, ...)` on dark sections

**Optional PDF conversion:**
If the user requests a PDF, convert the HTML using Playwright:
```javascript
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file:///' + htmlPath);
await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
await browser.close();
```
The `@media print` styles in the HTML handle page breaks and layout adjustments automatically.

## Post-Build: Sync to Consumers

After all accepted phases have been promoted to canonical, finalize for distribution:

1. Ensure `meta` section in charter.json has `tier`, `displayName`, `tagline`, `industry`
2. Ensure logo paths use `logos/` prefix and `templates` manifest maps format variants
3. Validate charter against `client-data/schema/charter.schema.json`
4. Commit changes in client-data
5. Bump client-data submodule in consumer repos (or run `bash scripts/bump-client-data.sh`)

### What goes where

**Tier 1 (producer) brands** — full set in `client-data/clients/<slug>/`:
- `charter.json`, `logos/`, `images/`, `guidelines.md`, `tokens.css`, `templates/`

Reusable exports prepared later by `brand-artifact-builder` must extend these
existing canonical folders rather than introducing a second stable artifact root.

**Tier 2 (output) brands** — minimal data:
- `charter.json` + `logos/` (optional)

## Post-Build: Reference Promotion & Cleanup

After phase-level promotions are complete (all accepted phases are in canonical), handle reference artifacts and clean up.

### Step 1: Promote reference artifacts to `.build-history/`

Copy key reference artifacts from `_build/reviews/` into `.build-history/`:

| Source (`_build/reviews/`) | Destination (`.build-history/`) | Why |
|---|---|---|
| `BRAND-Imagery-Direction.html` | `imagery-guide.html` | Imagery philosophy, processing recipes, library reference |
| `BRAND-Exploration-Board.html` or `BRAND-Brand-Revision-Comparison.html` | `exploration-board.html` | Design exploration audit trail |
| `brand-transition/` (Mode C/D only) | `brand-transition/` | Rebrand assessment + strategy docs |

Note: Brand book HTML/PDF is promoted from `_build/staged/phase6-brandbook/` during Phase 6 acceptance (it goes to `.build-history/`, not canonical).

### Step 2: Commit `.build-history/`

Stage and commit the promoted artifacts plus `BUILD_LOG.md` in client-data before deleting `_build/`.

### Step 3: Delete `_build/`

**Blast-radius guard**: confirm with the user that `.build-history/` has been committed before proceeding.

Then `rm -rf client-data/clients/<slug>/_build/`. Everything in `_build/` is disposable after promotion:

| Path | Reason disposable |
|---|---|
| `staged/` | Should be empty — all accepted phases already promoted |
| `reviews/moodboards/` | Superseded by chosen visual direction |
| `reviews/images/originals/` | Processed versions already in canonical `images/` |
| `reviews/*.js` | Build scripts, live in the skill |
| `reviews/BRAND-*-Review.html` | Intermediate QA artifacts |

### Template naming convention

Templates in client-data use normalized names:

| Build output | client-data path |
|-------------|-------------------|
| `pptx-assets/` | `pptx-assets/` (gradients, overlays, motifs) |
| `BRAND-Report-Template.docx` | `templates/docx/default.docx` |
| `BRAND-Letterhead.docx` | `templates/docx/letterhead.docx` |
| `brand-business-cards.html` | `templates/html/business-cards.html` |
| `brand-email-signature.html` | `templates/html/email-signature.html` |
| `signatures/*.fragment.html` | `templates/html/signatures/*.fragment.html` |
| `cards/*-{eu,us}-{front,back}.svg` | `templates/print/cards/` |
| `cards/*-{eu,us}-{front,back}.pdf` | `templates/pdf/cards/` |

## File Organization

Outputs are split between **canonical brand data** (promoted only), **durable build history**, **staged deliverables** (awaiting acceptance), and **review artifacts** (never promoted to canonical).

### Canonical brand data → `client-data/clients/<slug>/`

Files arrive here **only via promotion** from `_build/staged/`. Never write directly.

```
client-data/clients/<slug>/
├── charter.json              <- promoted from phase 2/3/5 patches
├── logos/                    <- promoted from phase2-identity
├── images/                   <- promoted from phase4-imagery
│   └── manifest.json
├── assets/                   <- promoted from phase4-imagery (SVG motifs)
│   └── svg/
├── guidelines.md             <- promoted from phase3-system
├── tokens.css                <- promoted from phase3-system
├── templates/                <- promoted from phase5-templates
│   ├── manifest.json
│   ├── pptx/
│   ├── docx/
│   ├── html/
│   ├── print/
│   └── pdf/
├── .build-history/           <- Durable session ledger + promoted references
│   ├── BUILD_LOG.md
│   ├── brand-book.html       (promoted from phase6-brandbook)
│   ├── brand-book.pdf        (if generated)
│   ├── imagery-guide.html    (promoted from reviews/)
│   ├── exploration-board.html
│   └── brand-transition/     (Mode C/D only)
└── _build/                   <- ALL work-in-progress (gitignored)
```

### Build lifecycle

1. **Bootstrap durable state** in `.build-history/BUILD_LOG.md`
2. **Stage** phase deliverables in `_build/staged/phaseN/` — mirroring canonical structure
3. **Review** — present staged output, generate review HTMLs in `_build/reviews/`
4. **Accept** — user approves → promote to canonical, delete staged folder, log in BUILD_LOG
5. **Reject** — user rejects → delete staged folder, canonical untouched, re-run or skip phase
6. **End-of-build** — promote reference artifacts from `_build/reviews/` to `.build-history/`, then delete `_build/`

### Staged deliverables → `client-data/clients/<slug>/_build/staged/`

```
client-data/clients/<slug>/_build/staged/
├── phase2-identity/
│   ├── logos/                     <- logo SVGs mirroring canonical structure
│   └── charter-patch.json        <- colors, fonts, logo refs
├── phase3-system/
│   ├── tokens.css
│   ├── guidelines.md
│   └── charter-patch.json        <- design system fields
├── phase4-imagery/
│   ├── images/                   <- sourced + processed + heroes
│   └── assets/svg/               <- dividers, patterns
├── phase5-templates/
│   ├── templates/                <- pptx/, docx/, html/, print/, pdf/
│   └── charter-patch.json        <- presentation/document fields
└── phase6-brandbook/
    ├── brand-book.html
    └── brand-book.pdf            (optional)
```

### Review artifacts → `client-data/clients/<slug>/_build/reviews/`

```
client-data/clients/<slug>/_build/reviews/
├── BRAND-Exploration-Board.html   <- Phase 2 Step 0
├── BRAND-Image-Selection.html     <- Phase 4 Step 2
├── BRAND-Image-Curation.html      <- Phase 4 Step 3
├── BRAND-Imagery-Direction.html   <- Phase 4 Step 4
├── BRAND-Business-Cards-Review.html <- Phase 5
├── BRAND-Signatures-Review.html   <- Phase 5
├── moodboards/                    <- Phase 2 Step 1
├── brand-audit/                   <- Mode B outputs
├── brand-check/                   <- Mode E outputs
├── brand-refresh/                 <- Mode C outputs
├── brand-transition/              <- Mode D outputs
├── images/originals/              <- Unprocessed downloads
└── *.js                           <- Build scripts
```

## Visual QA Protocol

Every phase that produces visual output (HTML, SVG, PPTX, DOCX, PDF) must be visually inspected before presenting to the user.

**When to run QA:**
- Phase 2: After generating moodboards, visual directions HTML, logo SVGs
- Phase 3: After generating interactive brand book HTML
- Phase 4: After generating imagery direction HTML and SVG assets
- Phase 5: After generating each template (PPTX, DOCX, business cards, etc.)
- Phase 6: After generating the brand book HTML (and optional PDF)

**QA checklist (check every time):**
1. **Text overlap** — Do text elements collide? SVG viewBox text inflates beyond character count
2. **Cropping** — Is anything cut off at container/viewBox edges? Add generous padding
3. **Off-canvas** — Elements positioned outside visible area?
4. **Font loading** — Do Google Fonts render? Check for fallback font flash
5. **Color contrast** — Text readable on background? Gold on white = too low contrast
6. **Scale coherence** — Small icon versions (32px, 20px, 16px) legible?
7. **Image rendering** — Are images loading? Properly cropped? Not broken?
8. **Text-on-image readability** — Sufficient contrast with overlay?
9. **Dark image display** — See `references/imagery.md` § "HTML Image Display Rules" — never apply `grayscale()` to B&W images, always use `object-position: center top` for dark/architectural photos, pre-crop when embedding base64, set `background-repeat: no-repeat`, set `html,body { width: 100% }`

**How to QA:**
- Open HTML in browser, take screenshot or visually inspect
- Check each item above, fix issues before presenting to user
- For SVGs: `letter-spacing` inflates width — add 30-40% extra viewBox width

## Incremental Delivery Protocol

**Every phase and every numbered step within a phase is a checkpoint.** Do NOT batch multiple steps or phases into a single response. The workflow is:

1. **Complete one step** — produce its deliverable(s) and present to the user
2. **Pause and wait** — explicitly ask for the user's reaction, approval, or direction
3. **Only proceed** when the user confirms, gives feedback, or says "next"

**What counts as a step:**
- Each numbered step within a phase (e.g., Phase 4 Step 1, Step 2, Step 3, Step 4 are four separate checkpoints)
- Each sub-deliverable within Phase 5 (PPTX, DOCX, letterhead, business cards, email signature are five separate checkpoints)
- Each section batch within Phase 6 brand book (present in 2-3 section groups, not all 16 at once)

**At each checkpoint, explicitly:**
- Summarize what was just produced
- Show the deliverable (open in browser, render inline, or describe with file path)
- Ask a specific question: "Does this work?", "What would you change?", "Ready for the next step?"
- If the user gives feedback, iterate on the current step before moving forward

**Never:**
- Generate Phase 5 templates without Phase 4 imagery being approved first
- Produce all Phase 5 templates in one go — each template type is a separate review
- Build the brand book without each prior phase being approved
- Skip a checkpoint because the previous step went smoothly

This protocol ensures the user has full creative control and nothing gets built on unapproved foundations.

## Key Principles

1. **Co-create, don't deliver.** Every phase has interactive decision points. The user shapes the brand alongside you.
2. **Show, don't describe.** Render everything as HTML/SVG. Open in browser. Let the user see and react.
3. **One step at a time.** Follow the Incremental Delivery Protocol above. Never batch steps or skip checkpoints.
4. **Embrace variety.** Shuffle pools, rotate methods, explore non-obvious options. Two consulting firms should NOT get similar brands.
5. **Archetype drives everything.** The brand archetype (Phase 0) seeds logo style, color temperature, font energy, imagery themes, and voice tone.
6. **The motif is everything.** The strongest brands have one repeatable visual element. Find it early, use it everywhere.
7. **Images feed assets.** Phase 4 (imagery) comes before Phase 5 (templates/assets) so brand images are available for PPTX asset generation and document templates.
8. **PPTX assets enable on-demand decks.** Pre-rendered gradients, overlays, and motifs stored in `pptx-assets/` let the `pptx` skill generate any deck layout without a template .pptx.
9. **Respect user taste.** If they say "no serifs," don't argue. Offer alternatives within their preference.
10. **Use the build scaffolds.** Brand book is written directly as HTML (no scaffold needed). PPTX assets are generated via Sharp compositing during Phase 5.
11. **Visual QA is mandatory.** Never present visual deliverables without opening and inspecting them first.

## Dependencies

- **npm** (root `package.json`): `pptxgenjs`, `docx`, `sharp` — install with `npm install`
- **System**: LibreOffice (for PPTX/DOCX to PDF conversion), Poppler (`pdftoppm` for QA)
- **Google Fonts**: loaded via CDN in HTML deliverables; specified by name in PPTX/DOCX
- **Playwright** (MCP): used for visual QA and optional HTML-to-PDF conversion
