---
name: format-motion
description: "Author tasteful, brand-aware motion across Stromy's HTML surfaces — a substrate-agnostic library of motion primitives (staggered reveal, line-draw, count-up, motion-path, scroll-reveal, element morph) plus the restraint doctrine that keeps motion meaningful and never excessive. Two modes: embed-live (inline a primitive into a deck or website you are hand-authoring — used by format-html-hd, format-html-reveal, and Astro sites in their own idiom) and bake (author a self-contained HTML animation and turn it into an MP4/GIF/PNG-frame sequence via the render_motion MCP tool, for dropping into PowerPoint or a PDF). USE THIS whenever someone wants animation, a motion effect, an animated reveal/transition, a line that draws itself, a counting KPI, an animated explainer, a baked video clip from web animation, or asks to make a deck/site feel alive without it becoming gimmicky. Brand-optional: reads the brand's motion grammar from companies/<slug>/brand_context.json when present, else falls back to neutral doctrine defaults. Siblings: numeric data-viz → format-chart; structural diagrams → format-diagram; React-authored video → format-remotion-video."
---

# format-motion — substrate-agnostic motion primitives + restraint doctrine (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-motion/SKILL.md"`.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-motion"` (and `path="skills/format-motion/references"`),
   → call `fs_read` with `path="skills/format-motion/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.

## If the `stromy-format` MCP is slow to respond

This server scales to zero to save cost, so the first call may take ~10–30s to cold-start. If `fs_read` or a tool errors with unavailable/timeout:

1. Tell the user the server is starting, then retry the same `fs_read` call — the call itself wakes the container.
2. Retry with a short backoff up to ~3 times.
3. Only if it is still unreachable after retries, STOP and report. Never downgrade to a local or base skill just to "get something out".
