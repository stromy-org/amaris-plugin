---
name: format-pptx
description: "DEFAULT skill for ANY PowerPoint or .pptx request, branded or not: a new deck, a deck on the client's own template, editing or reviewing an existing deck, speaker notes, comments, reordering, adding slides. Builds native, editable slides server-side with `build_pptx` (python-pptx) on the client's template or a master synthesised from their brand, runs a fit lint (no overlapping or overflowing text) and a render-back of the finished file. Use `format-pptx-hd` only when the user wants web-style art direction authored as HTML."
metadata:
  stromy-client-summary: "Create or edit an editable PowerPoint deck on your own template and brand, with speaker notes, charts and a check that nothing overlaps."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-pptx/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# PowerPoint (.pptx): create, edit, review (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-pptx/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-pptx"` (and `path="skills/format-pptx/references"`),
   → call `fs_read` with `path="skills/format-pptx/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
