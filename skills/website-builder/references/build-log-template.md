# Build Log Template

Copy the block below to `workspace/<slug>/BUILD_LOG.md` at the very start of a new
website build. This file is the **single source of truth** for multi-session
progress and is the first thing any follow-up agent must read before touching the
build.

Rules:
- Never delete entries — only append or update `status` fields.
- Update `Last updated`, `Current phase`, and `Next action` before ending any session.
- Every key decision gets a dated entry with the rationale (not just the outcome).
- Every blocker gets a dashboard entry until resolved.
- Phase sections are filled in as phases start; do not pre-fill future phases.

---

```markdown
# <Client Name> Website Build — Log

> Multi-session handoff log. Read this first. Update at every phase boundary and
> key decision. Do not end a session without refreshing the Status Dashboard.

## Status Dashboard

| Field | Value |
|---|---|
| Client slug | <slug> |
| Plugin slug | <plugin-slug or `TBD`> |
| Archetype / Aesthetic | <archetype> / <aesthetic> |
| Build started | YYYY-MM-DD |
| Last updated | YYYY-MM-DD |
| Current phase | Phase X — <name> |
| Overall status | `not-started` \| `in-progress` \| `blocked` \| `complete` |
| Next action | <one concrete sentence — what the next agent should do first> |
| Blockers | `none` \| <list> |
| Artifacts root | `workspace/<slug>/` |
| Target repo | `clients/<plugin-slug>/<plugin-slug>-website/` \| `not scaffolded yet` |

## Phase Checklist

- [ ] Phase 0 — Discovery & Audit
- [ ] Phase 1 — Design Direction (style boards)
- [ ] Phase 2 — Scaffold (mechanical + creative code)
- [ ] Phase 2.5 — i18n Scaffolding (only if `charter.website.i18n.enabled`)
- [ ] Phase 3 — Core Pages
- [ ] Phase 4 — Polish & QA
- [ ] Phase 5 — Deploy & Handoff

## Key Decisions (append-only)

Running log of design, architecture, and content decisions that future agents
must respect. Include the **why**, not just the what.

- `YYYY-MM-DD` — <decision> — <rationale> — <who decided: user / agent>

## Open Questions & Assumptions

Things that are unresolved or assumed. Resolve before the phase they block.

- [ ] <question> — blocks: Phase X — owner: user / agent
- [ ] <assumption being made> — confirm with user before Phase X

## Discarded Directions

Things tried and rejected. Prevents future agents from re-proposing them.

- <approach> — rejected because <reason> — `YYYY-MM-DD`

---

## Phase Logs

Fill in each phase section when that phase starts. Leave future phases out until
they begin.

### Phase 0 — Discovery & Audit

- **Status**: `in-progress` \| `complete` \| `skipped`
- **Dates**: YYYY-MM-DD → YYYY-MM-DD
- **Agent**: <short note on which session / model>

**Inputs read**
- `client-data/clients/<slug>/charter.json`
- `companies/<slug>/profile.json`
- ...

**Decisions made this phase**
- ...

**Artifacts produced**
- <path> — <what it is>

**Discussion context (things not obvious from the artifacts)**
- User tone preferences, aesthetic pushes, off-limits territory, brand lore,
  anything that came up in conversation and shaped the output.
- Note any missing launch content that is intentionally deferred (for example
  website/email/phone still unknown and therefore not blocking kickoff).

**Handoff notes — what the next agent must know**
- What to read first when picking this up
- Known gotchas
- Work-in-progress state

---

### Phase 1 — Design Direction

(Same structure as Phase 0.)

---

### Phase 2 — Scaffold

(Same structure.)

---

### Phase 2.5 — i18n Scaffolding (only if `charter.website.i18n.enabled`)

(Same structure. Only used when the charter has i18n enabled.)

**i18n Scaffold Checklist**

- [ ] Glossary seeded (`src/i18n/glossary.md`) — no-translate terms from charter
- [ ] Brand voice seeded (`src/i18n/brand-voice.md`) — archetype + register
- [ ] Translation ledger initialized (`.i18n/translation-ledger.json`)
- [ ] UI strings split per locale (`src/i18n/ui.en.ts`, `ui.<locale>.ts`)
- [ ] `pickLocale.ts` helper created
- [ ] Pages mirrored under `src/pages/<locale>/`
- [ ] Legacy redirect stubs created (if applicable)
- [ ] `astro.config.mjs` i18n block configured
- [ ] `LangSwitcher` component wired into navigation
- [ ] `hreflang` + `x-default` emitting in BaseLayout

---

### Phase 3 — Core Pages

(Same structure. Track per-page progress here when relevant.)

**Per-page status**

| Page | Status | Notes |
|---|---|---|
| home | | |
| about | | |
| services | | |
| contact | | |

---

### Phase 4 — Polish & QA

(Same structure. Record QA findings and fixes.)

---

### Phase 5 — Deploy & Handoff

(Same structure. Record repo URL, deployment URL, catalog entry, registry update.)
```
