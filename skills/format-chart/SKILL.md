---
name: format-chart
description: "Render brand-aware data charts (bar, line, waterfall, sankey, sunburst, treemap, funnel, heatmap, gauge, radar and other Plotly types) to PNG/SVG with the client's compiled brand theme, for embedding in PPTX, DOCX, PDF or HTML deliverables. You author the Plotly figure JSON; the server `render_chart` tool applies palette and fonts and runs a palette check and visual QA. Use for any chart, plot, graph or KPI visual. Not for process flows, org charts or stakeholder maps (use format-diagram), unbranded Mermaid pie/XY in Markdown (use format-mermaid), or a chart native to an Excel workbook (use format-xlsx)."
metadata:
  stromy-client-summary: "Turn your numbers into a clean, on-brand chart you can drop into any deliverable."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-chart/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Chart — branded data visualisation (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-chart/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-chart"` (and `path="skills/format-chart/references"`),
   → call `fs_read` with `path="skills/format-chart/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
