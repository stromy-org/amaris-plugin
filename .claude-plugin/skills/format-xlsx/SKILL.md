---
name: format-xlsx
description: "DEFAULT skill for ANY spreadsheet request (.xlsx, .xlsm, .csv, .tsv): build a new workbook, a budget or model with inputs, calculations and outputs, a data table, an analysis of an existing file, or an edit that must keep the formulas. A new workbook is built server-side with `build_xlsx` (openpyxl): real formulas, Excel Tables, brand theme and named styles, a lint for errors and ##### after a LibreOffice recalculation, and a render-back of the finished file. Not for a Word document (format-docx), a deck (format-pptx) or a picture chart for a document (format-chart)."
metadata:
  stromy-client-summary: "Build a spreadsheet in your brand with real formulas, tables and a check that nothing shows as an error or ####, or read and edit an existing workbook without breaking its formulas."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-xlsx/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Excel (.xlsx): build, read, edit (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-xlsx/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-xlsx"` (and `path="skills/format-xlsx/references"`),
   → call `fs_read` with `path="skills/format-xlsx/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
