---
name: format-html-hd
description: "Create a premium branded HTML slide deck as ONE self-contained .html that opens offline, with the client's fonts and logos embedded: by default a document spec rendered by `render(format=\"html-deck\")` as a reveal.js deck with speaker notes (an authored slide is an `html` block), or a hand-written scroll-snap deck. Seeded variance keeps decks siblings, not clones. Use for an HTML, web or browser slide deck, a reveal.js deck or web deck with speaker notes, an interactive presentation, or turning a brief or report into branded slides, even without saying 'HTML'. Not for an editable PowerPoint (use format-pptx) or a paginated PDF (use format-pdf-hd)."
metadata:
  stromy-client-summary: "Build a polished slide deck as a single web page that opens offline and shares as one file."
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

# format-html-hd — self-contained branded HTML decks (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Before you start — this skill needs the `stromy-format` connector

This skill's instructions live on the `stromy-format` MCP, a sign-in connector the plugin bundles. Each user connects it once. Before step 1 below, check whether this conversation actually has the `stromy-format` MCP's tools (`fs_read` / `fs_list`) available to call.

**If those tools are not present at all, STOP — and do not retry.** A missing tool is not a slow server: it means the connector is not connected yet, or not switched on for this conversation. Retrying cannot fix it. Tell the user plainly what to do, naming the connector:

> This needs the **Stromy Format** connector, which isn't connected for this chat. Sign in once with your work account, in the place your assistant keeps it:
>
> - **Claude app:** open Customize, then Plugins, choose this plugin and open its **Connectors** tab. Click **Connect** next to **Stromy Format** (if it says **Not added**, add it there first, or ask your workspace owner to), then make sure it is switched on for this conversation.
> - **Codex:** run `codex mcp login stromy-format` (a browser window opens once).
> - **ChatGPT, Gemini, VS Code, Cursor or another assistant:** open its MCP or connector settings, find **Stromy Format** and choose sign in or authenticate.
>
> Then ask me again.

Then stop and wait. Never fall back to a local or identically-named base skill, and never answer from your own knowledge instead — an unsourced answer is **wrong output, not a fallback**.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-html-hd/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-html-hd"` (and `path="skills/format-html-hd/references"`),
   → call `fs_read` with `path="skills/format-html-hd/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
