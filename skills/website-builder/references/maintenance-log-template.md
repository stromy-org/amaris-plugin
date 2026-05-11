# Maintenance Log Template

Copy the block below to `<site-repo>/.build-history/MAINTENANCE_LOG.md` at the
start of the first maintenance session on a site. This file is the cross-session
knowledge transfer mechanism for all ongoing website work.

Rules:
- Never delete entries — only append to the Work Log and update current-session state.
- Refresh `Last session`, `Last worked on`, and `Next action` before ending any session.
- Every design decision gets a dated entry in Site Decisions with rationale.
- Non-obvious implementation discoveries go in Discovered Site Quirks.
- Aesthetic preferences surfaced in conversation go in User Preferences — not just in code.

---

```markdown
# <Client Name> Website — Maintenance Log

> Cross-session knowledge transfer for ongoing maintenance. Read this first.
> Update at every key decision, discovery, and end of session.

## Status Dashboard

| Field | Value |
|---|---|
| Site repo | `clients/<plugin-slug>/<plugin-slug>-website/` |
| Build completed | YYYY-MM-DD |
| Last session | YYYY-MM-DD |
| Last worked on | <one-sentence description of last task> |
| Open items | `none` \| <brief list> |
| Next action | <one concrete sentence — what to do first next session, or `none`> |

## User Aesthetic Preferences (append-only)

Things the user has confirmed they like or dislike about the visual direction.
These override defaults — do not re-propose approaches listed as off-limits.

- `YYYY-MM-DD` — **[likes]** <preference> — surfaced during: <task>
- `YYYY-MM-DD` — **[dislikes]** <thing that felt off> — surfaced during: <task>
- `YYYY-MM-DD` — **[off-limits]** <approach tried and rejected> — reason: <why>

## Site Decisions (append-only)

Design and architecture decisions locked in for this site. Do not re-open without
explicit user instruction.

- `YYYY-MM-DD` — <decision> — <rationale>

## Discovered Site Quirks

Non-obvious things about this site's implementation that a fresh agent must know.
These are not in the SKILL.md or CLAUDE.md — they emerged from working the site.

- <quirk> — discovered YYYY-MM-DD — <impact / watch out for>

## Deferred Items

Things flagged during sessions but not yet addressed. Check off when resolved.

- [ ] <item> — flagged YYYY-MM-DD — <context>

## Work Log (append-only)

One entry per session. Brief. Focus on what changed and what was learned.

### YYYY-MM-DD — <task in 5 words>

- **Task**: <what was worked on>
- **Done**: <what actually changed — or "nothing" if session was read-only>
- **Decisions**: <key choices made — cross-reference Site Decisions if added>
- **Learned**: <anything non-obvious discovered about the site>
- **Left off at**: <where to resume, or "complete">
```
