---
name: format-html-reveal
description: "Create a premium, self-contained reveal.js HTML slide deck — ONE downloadable .html (reveal.js + brand fonts + images all inlined) that opens offline in any browser and shares as a file or link, SERVER-RENDERED via the `render_deck` MCP tool (brand gate, no local build). Premium-floor layout archetypes + a deterministic variance engine (brand_context.expression.visualAxes + surfaceExpression.presentation) keep every deck premium AND visibly each client's own. TRIGGER on: 'reveal.js deck', 'server-rendered web deck', 'interactive presentation', 'shareable web slides'. SIBLINGS — pick the right one: a hand-authored client-side self-contained HTML deck (no reveal.js, full pixel control) → format-html-hd; an editable .pptx → format-pptx-hd; a paginated print PDF → format-pdf-hd."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-html-reveal/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# HTML-REVEAL: Premium Self-Contained reveal.js Slide Decks (server-rendered) (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-html-reveal/SKILL.md"`.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-html-reveal"` (and `path="skills/format-html-reveal/references"`),
   → call `fs_read` with `path="skills/format-html-reveal/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.

## If the `stromy-format` MCP is slow to respond

This server scales to zero to save cost, so the first call may take ~10–30s to cold-start. If `fs_read` or a tool errors with unavailable/timeout:

1. Tell the user the server is starting, then retry the same `fs_read` call — the call itself wakes the container.
2. Retry with a short backoff up to ~3 times.
3. Only if it is still unreachable after retries, STOP and report. Never downgrade to a local or base skill just to "get something out".
