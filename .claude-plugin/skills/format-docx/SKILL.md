---
name: format-docx
description: "DEFAULT skill for ANY Word or .docx request, branded or not: a memo, report, letter, brief or proposal; a document on the client's own template or letterhead; a table of contents, headers, footers and page numbers; editing an existing .docx in place with tracked changes, comments, find-and-replace, accept or reject; reading or extracting its text. Builds native, editable Word files server-side with `build_docx` (python-docx) and edits them with `edit_docx`, with a structural lint (styles, heading order, alt text, table fit, numbering, TOC) and a render-back of the finished file. Use `format-docx-hd` only when the user wants an art-directed, web-style layout authored as HTML. Not for PDFs (format-pdf), spreadsheets (format-xlsx) or Google Docs."
metadata:
  stromy-client-summary: "Create or edit Word documents on your own template and brand: memos, reports, letters, tables of contents, tracked changes and comments."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-docx/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Word (.docx): create, edit, review (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-docx/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-docx"` (and `path="skills/format-docx/references"`),
   → call `fs_read` with `path="skills/format-docx/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
