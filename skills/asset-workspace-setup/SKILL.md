---
name: asset-workspace-setup
description: "Design or change how a client's own SharePoint workspace is organised — the folder tree deliverables land in, what its stages are called, and whether the space keeps a visible project record. Interviews the client about how they actually work, then proposes the configuration as a reviewed pull request through the asset-broker MCP. Use when setting up a new client's or partner's workspace, when someone asks where their deliverables go or why something landed in the wrong place, or when they want to rename or restructure their folders."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/asset-broker-mcp/skills/asset-workspace-setup/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# asset-workspace-setup (MCP-hosted skill)

This skill's full instructions are hosted on the `asset-broker` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `asset-broker` MCP with `path="skills/asset-workspace-setup/SKILL.md"`.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/asset-workspace-setup"` (and `path="skills/asset-workspace-setup/references"`),
   → call `fs_read` with `path="skills/asset-workspace-setup/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `asset-broker` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
