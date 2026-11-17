---
name: format-pptx-hd
description: "HTML-crafted option for a new branded PowerPoint (.pptx): slides authored as HTML with bespoke art direction, converted and server-rendered by `render_pptx` behind a brand gate, with speaker notes, a fit lint and a render-back of the produced file. Use ONLY when the user wants web-style art direction in a .pptx (or `render-anchors`); every ordinary PowerPoint request, branded or not, including a client's own template and editing an existing deck, belongs to `format-pptx` (native, python-pptx). Not for a browser or offline HTML deck (use format-html-hd, which also covers a reveal deck with speaker notes) or a paginated print PDF (use format-pdf-hd)."
metadata:
  stromy-client-summary: "Craft a PowerPoint deck with web-style art direction authored as HTML, converted to an editable .pptx."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-pptx-hd/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# PPTX-HD: High-Fidelity Branded Presentations (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Before you start — this skill needs the `stromy-format` connector

This skill's instructions live on the `stromy-format` MCP, a sign-in connector the plugin bundles. Each user connects it once. Before step 1 below, check whether this conversation actually has the `stromy-format` MCP's tools (`fs_read` / `fs_list`) available to call.

**If those tools are not present at all, STOP — and do not retry.** A missing tool is not a slow server: it means the connector is not connected yet, or not switched on for this conversation. Retrying cannot fix it. Tell the user plainly what to do, naming the connector:

> This needs the **Stromy Format** connector, which isn't connected for this chat. Open Customize, then Plugins, choose this plugin and open its **Connectors** tab. Click **Connect** next to **Stromy Format** and sign in with your work account (if it says **Not added**, add it there first, or ask your workspace owner to). Then make sure it is switched on for this conversation and ask me again.

Then stop and wait. Never fall back to a local or identically-named base skill, and never answer from your own knowledge instead — an unsourced answer is **wrong output, not a fallback**.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-pptx-hd/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-pptx-hd"` (and `path="skills/format-pptx-hd/references"`),
   → call `fs_read` with `path="skills/format-pptx-hd/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
