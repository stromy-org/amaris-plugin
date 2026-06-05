---
name: mermaid
description: "Creates Mermaid diagrams for Markdown-based documentation (GitHub, GitLab, wikis, blogs) and visual explanations. Supports 25+ diagram types including flowcharts, sequence/class/state diagrams, ERDs, Gantt charts, mindmaps, timelines, architecture views, Kanban boards, Sankey diagrams, and newer types (Wardley maps, Venn, Ishikawa). When the `mermaid` MCP is available, uses live browser preview and PNG/SVG/PDF export. Use this skill when users ask for Mermaid syntax, Markdown-renderable diagrams, visual architecture, or quick text-to-diagram output."
---

# Mermaid Diagrams (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/mermaid/SKILL.md"`.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/mermaid"` (and `path="skills/mermaid/references"`),
   → call `fs_read` with `path="skills/mermaid/references/<file>"`.

Follow the instructions returned by the MCP exactly.
