---
name: format-docx-hd
description: "High-fidelity branded Word (.docx) creation from authored HTML. Server-renders via the `render_docx` MCP tool — Chromium parses the HTML, docx-js emits OOXML, and an OOXML layout lint plus a LibreOffice render-back contact sheet run inside the render. No local build script. Uses the invoking plugin's brand overlay. Use when GENERATING a branded Word deliverable: reports, briefs, memos, letters, policy documents, findings write-ups, any client-facing .docx where visual quality matters. Triggers on: 'branded Word doc', 'report in Word', 'branded .docx', 'HD docx', 'client-ready Word document'. NOT for editing an existing .docx, tracked changes, comments or template surgery — use `format-docx`."
metadata:
  stromy-client-summary: "Produce a polished, on-brand Word document such as a report, brief or memo, ready to send."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-docx-hd/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# DOCX-HD: High-Fidelity Branded Word Documents (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-docx-hd/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-docx-hd"` (and `path="skills/format-docx-hd/references"`),
   → call `fs_read` with `path="skills/format-docx-hd/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
