---
name: diagram
description: "Generate branded, editable Excalidraw diagrams (process flows, architecture views, stakeholder maps, org charts, timelines, funnels, matrices, mind maps) and export as PNG/SVG for embedding in deliverables. Accepts native Excalidraw JSON or Mermaid syntax (via bridge). Reads charter.json + tokens.css for brand theming. Use when asked to create a diagram, draw a process flow, make an architecture diagram, visualize a workflow, create a stakeholder map, org chart, funnel diagram, timeline, or any structural visual."
---

# Diagram Skill — Branded Consulting-Quality Diagrams (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/diagram/SKILL.md"`.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/diagram"` (and `path="skills/diagram/references"`),
   → call `fs_read` with `path="skills/diagram/references/<file>"`.

Follow the instructions returned by the MCP exactly.
