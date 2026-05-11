# Build Log Template

Copy the block below to `client-data/clients/<slug>/.build-history/BUILD_LOG.md`
at the very start of any brand-builder engagement. This file is the **single
source of truth** for multi-session progress, approvals, blockers, rejected
directions, and step-level status.

Rules:
- Never delete historical entries. Update statuses or append new dated entries.
- Update `Last updated`, `Current phase`, `Current checkpoint`, and `Next action`
  before ending any session.
- Every key decision gets a dated entry with rationale.
- Every blocker stays on the dashboard until resolved.
- Mark inferred history with `(reconstructed)` when bootstrapping a log from an
  inherited or already-in-progress build.
- Lighter modes (B and E) still require the log; only unused phase sections may
  remain blank or be marked `not-used`.

---

```markdown
# <Brand Name> Brand Build — Log

> Multi-session handoff log. Read this first. Update at every phase boundary,
> checkpoint, key decision, approval, and blocker change.

## Status Dashboard

| Field | Value |
|---|---|
| Brand slug | <slug> |
| Brand name | <display name> |
| Mode | `A: Build` \| `B: Audit` \| `C: Refresh` \| `D: Rebrand` \| `E: Check` |
| Scope | <full build / audit only / refresh identity + templates / etc.> |
| Build started | YYYY-MM-DD |
| Last updated | YYYY-MM-DD |
| Current phase | Pre-work \| Phase 0 \| Phase 1 \| Phase 2 \| Phase 3 \| Phase 4 \| Phase 5 \| Phase 6 \| Post-work |
| Current checkpoint | <one concrete step, review gate, or deliverable> |
| Overall status | `not-started` \| `in-progress` \| `blocked` \| `complete` |
| Next action | <one concrete sentence telling the next agent what to do first> |
| Blockers | `none` \| <list> |
| Canonical root | `client-data/clients/<slug>/` |
| Scratch root | `client-data/clients/<slug>/_build/` |
| Log path | `client-data/clients/<slug>/.build-history/BUILD_LOG.md` |

## Phase Checklist

- [ ] Pre-work — Mode selection / existing-state audit
- [ ] Phase 0 — Brand Discovery & Archetype
- [ ] Phase 1 — Brand Strategy
- [ ] Phase 2 — Visual Identity
- [ ] Phase 3 — Design System
- [ ] Phase 4 — Imagery Direction
- [ ] Phase 5 — Templates
- [ ] Phase 6 — Brand Book
- [ ] Post-work — Promotion / sync / cleanup

Mode notes:
- For **Mode B**, usually use Pre-work and Post-work plus focused notes on findings and outputs; mark unused creative phases `not-used`.
- For **Mode E**, usually use Pre-work and Post-work plus focused notes on checked materials and remediation; mark unused creative phases `not-used`.

## Key Decisions (append-only)

Running log of strategy, design, scope, and delivery decisions that future
agents must respect. Include the **why**, not just the outcome.

- `YYYY-MM-DD` — <decision> — <rationale> — <who decided: user / agent>

## User Preferences / Off-Limits Territory

Things surfaced in conversation that should shape future work.

- Prefers:
- Avoid:
- Explicit no-go directions:
- Stakeholder or rollout constraints:

## Open Questions & Assumptions

Things that are unresolved or assumed. Resolve before the phase they block.

- [ ] <question> — blocks: <phase/checkpoint> — owner: user / agent
- [ ] <assumption> — confirm by: <phase/checkpoint>

## Discarded Directions

Things tried and rejected. Prevents future agents from re-proposing them.

- `YYYY-MM-DD` — <approach or option> — rejected because <reason>

---

## Phase Logs

Fill in each section when that phase starts. For unused phases in a lighter mode,
set `Status: not-used` and leave a one-line reason.

### Pre-work — Mode Selection / Existing-State Audit

- **Status**: `in-progress` \| `complete` \| `blocked`
- **Dates**: YYYY-MM-DD → YYYY-MM-DD
- **Agent**: <session / model note>

**Inputs read**
- `client-data/clients/<slug>/charter.json`
- ...

**Decisions made this phase**
- ...

**Artifacts observed or produced**
- ...

**Checkpoint ledger**
- `YYYY-MM-DD` — Existing state inspected
- `YYYY-MM-DD` — Mode selected
- `YYYY-MM-DD` — Log created or reconstructed

**User approvals**
- ...

**QA notes**
- ...

**Handoff notes**
- ...

---

### Phase 0 — Brand Discovery & Archetype

- **Status**: `in-progress` \| `complete` \| `blocked` \| `not-used`
- **Dates**: YYYY-MM-DD → YYYY-MM-DD
- **Agent**: <session / model note>

**Inputs read**
- ...

**Decisions made this phase**
- ...

**Artifacts produced**
- ...

**Checkpoint ledger**
- `YYYY-MM-DD` — Discovery brief captured
- `YYYY-MM-DD` — Archetype candidates proposed
- `YYYY-MM-DD` — Primary archetype selected

**User approvals**
- ...

**QA notes**
- N/A unless visual outputs were produced

**Handoff notes**
- ...

---

### Phase 1 — Brand Strategy

- **Status**: `in-progress` \| `complete` \| `blocked` \| `not-used`
- **Dates**: YYYY-MM-DD → YYYY-MM-DD
- **Agent**: <session / model note>

**Inputs read**
- ...

**Decisions made this phase**
- ...

**Artifacts produced**
- ...

**Checkpoint ledger**
- `YYYY-MM-DD` — Positioning drafted
- `YYYY-MM-DD` — Tagline workshop presented
- `YYYY-MM-DD` — Personality spectrum confirmed
- `YYYY-MM-DD` — Voice direction approved

**User approvals**
- ...

**QA notes**
- ...

**Handoff notes**
- ...

---

### Phase 2 — Visual Identity

- **Status**: `in-progress` \| `complete` \| `blocked` \| `not-used`
- **Dates**: YYYY-MM-DD → YYYY-MM-DD
- **Agent**: <session / model note>

**Inputs read**
- ...

**Decisions made this phase**
- ...

**Artifacts staged** (`_build/staged/phase2-identity/`)
- ...

**Checkpoint ledger**
- `YYYY-MM-DD` — Step 0 exploration board prepared / skipped
- `YYYY-MM-DD` — Step 1 moodboards presented
- `YYYY-MM-DD` — Step 2 visual directions presented
- `YYYY-MM-DD` — Direction selected
- `YYYY-MM-DD` — Step 3 refinement complete

**User approvals**
- ...

**Promotion ledger**
- `YYYY-MM-DD` — Promoted: <list of files promoted to canonical>
- Superseded: <list of canonical files removed, or "none">
- Charter patch: <fields merged into charter.json, or "none">

**QA notes**
- Logo review, visual direction QA, font collision check, color system review

**Handoff notes**
- ...

---

### Phase 3 — Design System

- **Status**: `in-progress` \| `complete` \| `blocked` \| `not-used`
- **Dates**: YYYY-MM-DD → YYYY-MM-DD
- **Agent**: <session / model note>

**Inputs read**
- ...

**Decisions made this phase**
- ...

**Artifacts staged** (`_build/staged/phase3-system/`)
- ...

**Checkpoint ledger**
- `YYYY-MM-DD` — Tokens drafted
- `YYYY-MM-DD` — Utility patterns drafted
- `YYYY-MM-DD` — Guidelines updated
- `YYYY-MM-DD` — User approved design system

**User approvals**
- ...

**Promotion ledger**
- `YYYY-MM-DD` — Promoted: <list of files promoted to canonical>
- Superseded: <list of canonical files removed, or "none">
- Charter patch: <fields merged into charter.json, or "none">

**QA notes**
- ...

**Handoff notes**
- ...

---

### Phase 4 — Imagery Direction

- **Status**: `in-progress` \| `complete` \| `blocked` \| `not-used`
- **Dates**: YYYY-MM-DD → YYYY-MM-DD
- **Agent**: <session / model note>

**Inputs read**
- ...

**Decisions made this phase**
- ...

**Artifacts staged** (`_build/staged/phase4-imagery/`)
- ...

**Checkpoint ledger**
- `YYYY-MM-DD` — Step 1 themes proposed
- `YYYY-MM-DD` — Step 2 selection board presented
- `YYYY-MM-DD` — User selected image pool
- `YYYY-MM-DD` — Step 3 curation board completed
- `YYYY-MM-DD` — Step 4 processing and guide assembly complete

**User approvals**
- ...

**Promotion ledger**
- `YYYY-MM-DD` — Promoted: <list of files promoted to canonical>
- Superseded: <list of canonical files removed, or "none">

**QA notes**
- Processing checks, hero readability, crop validation, guide QA

**Handoff notes**
- ...

---

### Phase 5 — Templates

- **Status**: `in-progress` \| `complete` \| `blocked` \| `not-used`
- **Dates**: YYYY-MM-DD → YYYY-MM-DD
- **Agent**: <session / model note>

**Inputs read**
- ...

**Decisions made this phase**
- ...

**Artifacts staged** (`_build/staged/phase5-templates/`)
- ...

**Checkpoint ledger**
- `YYYY-MM-DD` — PPTX drafted
- `YYYY-MM-DD` — PPTX approved
- `YYYY-MM-DD` — DOCX report drafted
- `YYYY-MM-DD` — DOCX report approved
- `YYYY-MM-DD` — Letterhead drafted
- `YYYY-MM-DD` — Letterhead approved
- `YYYY-MM-DD` — Business cards drafted
- `YYYY-MM-DD` — Business cards approved
- `YYYY-MM-DD` — Email signature drafted
- `YYYY-MM-DD` — Email signature approved

**User approvals**
- ...

**Promotion ledger**
- `YYYY-MM-DD` — Promoted: <list of files promoted to canonical>
- Superseded: <list of canonical files removed, or "none">
- Charter patch: <fields merged into charter.json, or "none">
- OR: `YYYY-MM-DD` — REJECTED — staged folder deleted, canonical untouched

**QA notes**
- Slide library QA, DOCX layout QA, HTML template QA

**Handoff notes**
- ...

---

### Phase 6 — Brand Book

- **Status**: `in-progress` \| `complete` \| `blocked` \| `not-used`
- **Dates**: YYYY-MM-DD → YYYY-MM-DD
- **Agent**: <session / model note>

**Inputs read**
- ...

**Decisions made this phase**
- ...

**Artifacts staged** (`_build/staged/phase6-brandbook/`)
- ...

**Checkpoint ledger**
- `YYYY-MM-DD` — HTML draft prepared
- `YYYY-MM-DD` — User feedback incorporated
- `YYYY-MM-DD` — HTML approved
- `YYYY-MM-DD` — PDF generated (optional)

**User approvals**
- ...

**Promotion ledger**
- `YYYY-MM-DD` — Promoted: brand-book.html (+.pdf) → `.build-history/`
- OR: `YYYY-MM-DD` — REJECTED — staged folder deleted

**QA notes**
- Visual QA, print QA, PDF QA if generated

**Handoff notes**
- ...

---

### Post-work — Promotion / Sync / Cleanup

- **Status**: `in-progress` \| `complete` \| `blocked`
- **Dates**: YYYY-MM-DD → YYYY-MM-DD
- **Agent**: <session / model note>

**Inputs read**
- ...

**Decisions made this phase**
- ...

**Phase promotion summary**
- Phase 2: promoted / rejected / skipped — <date>
- Phase 3: promoted / rejected / skipped — <date>
- Phase 4: promoted / rejected / skipped — <date>
- Phase 5: promoted / rejected / skipped — <date>
- Phase 6: promoted / rejected / skipped — <date>

**Reference artifacts promoted to `.build-history/`**
- `imagery-guide.html`
- `exploration-board.html`
- ...

**Checkpoint ledger**
- `YYYY-MM-DD` — All phase promotions complete
- `YYYY-MM-DD` — Reference artifacts promoted to `.build-history/`
- `YYYY-MM-DD` — `.build-history/` committed
- `YYYY-MM-DD` — Sync run or intentionally deferred
- `YYYY-MM-DD` — `_build/` cleanup completed or deferred

**User approvals**
- Cleanup confirmation, if required

**QA notes**
- Final structural check before cleanup

**Handoff notes**
- Remaining follow-ups, deferred work, or why cleanup/sync was postponed
```
