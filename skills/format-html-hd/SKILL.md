---
name: format-html-hd
description: "Author a premium, fully self-contained branded HTML slide deck — ONE .html the agent writes directly on the client (no server render, no reveal.js): container-query 16:9 stages, scroll-snap + keyboard nav, inline-SVG brand motifs & diagrams, and the client's real fonts/logos base64-inlined so it opens offline and shares as a single file. Deeply brand-integrated from the invoking plugin's companies/<slug>/ overlay — a deterministic design system keeps every deck unmistakably THIS client's, while a seeded variance engine makes each deck fresh. USE THIS whenever someone wants an HTML / web / browser slide deck, a shareable single-file presentation, an interactive deck, a good-looking or on-brand web deck, or to turn a topic, brief, or report into branded slides — even if they don't say 'HTML'. Siblings: editable PowerPoint → format-pptx-hd; paginated print PDF → format-pdf-hd; the older server-rendered reveal.js deck → format-html-reveal."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-html-hd/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# format-html-hd — hand-authored, self-contained branded HTML decks (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-html-hd/SKILL.md"`.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-html-hd"` (and `path="skills/format-html-hd/references"`),
   → call `fs_read` with `path="skills/format-html-hd/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.

## If the `stromy-format` MCP is slow to respond

This server scales to zero to save cost, so the first call may take ~10–30s to cold-start. If `fs_read` or a tool errors with unavailable/timeout:

1. Tell the user the server is starting, then retry the same `fs_read` call — the call itself wakes the container.
2. Retry with a short backoff up to ~3 times.
3. Only if it is still unreachable after retries, STOP and report. Never downgrade to a local or base skill just to "get something out".
