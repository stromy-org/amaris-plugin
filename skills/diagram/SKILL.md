---
name: diagram
description: "Generate branded, editable Excalidraw diagrams (process flows, architecture views, stakeholder maps, org charts, timelines, funnels, matrices, mind maps) and export as PNG/SVG for embedding in deliverables. Accepts native Excalidraw JSON or Mermaid syntax (via bridge). Reads charter.json + tokens.css for brand theming. Use when asked to create a diagram, draw a process flow, make an architecture diagram, visualize a workflow, create a stakeholder map, org chart, funnel diagram, timeline, or any structural visual."
---

# Diagram Skill — Branded Consulting-Quality Diagrams

Generate branded, editable diagrams as PNG/SVG images for embedding in any deliverable format (PPTX, DOCX, PDF). Produces Excalidraw JSON (for editing) and rendered images (for embedding).

Uses an HTML-first rendering approach: elements are converted to styled HTML/CSS with brand tokens, web fonts, and consulting-quality styling (shadows, rounded corners), then rendered via Playwright for pixel-perfect output. Falls back to basic SVG rendering when Playwright is unavailable.

## When to Use

- "create a diagram", "draw a process flow", "make an architecture diagram"
- "visualize this workflow", "stakeholder map", "org chart"
- "funnel diagram", "timeline", "matrix", "mind map"
- Any request for a structural visual that isn't a data chart (use Plotly for data charts)

## Approach

1. **Generate Excalidraw JSON** — write element arrays directly (rectangles, text, arrows, etc.)
2. **Apply brand theming** — read charter.json colors/fonts, inject tokens.css
3. **Render to PNG/SVG** — HTML/CSS + Playwright (primary) or SVG fallback
4. **Output** — save `.excalidraw` JSON + PNG/SVG alongside the consuming deliverable

## Brand Data Integration

### Always read brand data first

Before generating any diagram, load the client's brand theme:

```javascript
const { loadBrandTheme } = require('${CLAUDE_SKILL_DIR}/scripts/diagram-to-html');
const { theme, tokensCss, fontImport } = loadBrandTheme('clientSlug', repoRoot);
```

### Brand precedence chain

1. `charter.excalidraw` section — direct Excalidraw theming (if present)
2. `tokens.css` — injected into diagram HTML for full design-token coverage
3. `charter.colors` + `charter.fonts` — derive theme values automatically

### What gets themed

| Charter field | Diagram usage |
|---------------|--------------|
| `colors.primary` | Shape outlines, primary fills |
| `colors.accent` | Secondary fills, call-outs |
| `colors.success` | Positive/completion states |
| `colors.secondary` | Neutral/background shapes |
| `colors.warning` | Decision points, risks |
| `colors.text` | Text elements (auto-contrast on fills) |
| `colors.textLight` | Arrows and connectors |
| `fonts.heading` | Title text (>=20px), loaded via Google Fonts |
| `fonts.body` | Box labels and descriptions |

See [references/brand-mapping.md](references/brand-mapping.md) for the full mapping table and consulting design principles.

## Consulting Design Principles

All diagram output follows McKinsey/BCG-quality standards:

- **Max 3-4 colors** per diagram (primary, accent, neutral, text)
- **Clean lines** — `roughness: 0`, no sketch effect
- **Rounded corners** — `border-radius: 8px` on rectangles
- **Subtle shadows** — `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`
- **Ample whitespace** — 16-24px padding inside boxes, 40-60px gap between
- **Auto-contrast text** — white on dark fills, dark on light fills
- **Heading font for titles**, body font for labels

## Diagram Types

Each type has a recipe in [references/recipes.md](references/recipes.md):

| Type | Use case | Layout |
|------|----------|--------|
| **Process flow** | Methodology phases, approval workflows | Horizontal/vertical chain of rectangles + arrows |
| **Architecture** | System components, tech stack | Layered boxes with grouped containers |
| **Stakeholder map** | Influence/interest grid, relationships | Positioned nodes with sized circles + labeled edges |
| **Org chart** | Team structure, reporting lines | Tree layout with hierarchical connectors |
| **Timeline** | Project phases, milestones | Horizontal line with event markers |
| **Funnel** | Campaign conversion, sales pipeline | Stacked rectangles narrowing down |
| **Matrix/Grid** | 2x2 analysis, prioritization | Quadrant with labeled axes |
| **Mind map** | Idea exploration, topic breakdown | Central node with radial branches |

## Mermaid Bridge

Users can provide Mermaid syntax instead of describing elements manually. The bridge:

1. Takes Mermaid text input
2. Converts to Excalidraw elements via `@excalidraw/mermaid-to-excalidraw` (runs in Playwright)
3. **Normalizes label objects** — converts embedded `label` fields into proper text elements with `containerId`/`boundElements` bindings
4. Applies brand theming (overrides default styles with charter values)
5. Exports as branded PNG/SVG

The normalization step is critical — `parseMermaidToExcalidraw` outputs `label` objects embedded in shapes instead of separate text elements, which makes text invisible in standard renderers. The `normalizeMermaidElements()` function in `diagram-to-html.js` handles this conversion.

## Workflow

### Step 1 — Identify diagram type and content

Determine the diagram type from the user's request. Gather:
- Nodes/boxes (labels, grouping)
- Connections (arrows, lines, labels)
- Layout direction (horizontal, vertical, radial)
- Any data to visualize (phases, relationships, hierarchy)

### Step 2 — Load brand data

```javascript
const { loadBrandTheme, deriveTheme } = require('${CLAUDE_SKILL_DIR}/scripts/diagram-to-html');

// With client brand data
const { theme, tokensCss, fontImport } = loadBrandTheme('stromy', repoRoot);

// Without client data (neutral defaults)
const theme = deriveTheme(null);
```

### Step 3 — Generate Excalidraw JSON

Build the elements array following the element API in [references/excalidraw-elements.md](references/excalidraw-elements.md) and the recipe for the chosen diagram type in [references/recipes.md](references/recipes.md).

Every element needs a unique `id`. Use a simple counter: `id: "elem_1"`, `id: "elem_2"`, etc.

Apply brand theme to all elements:
- Set `strokeColor`, `backgroundColor`, `roughness: 0`, `strokeWidth` from theme
- Use `roundness: { type: 3 }` for rounded corners
- Cycle `fillColors` for multi-shape diagrams
- Use `textColorOnFill()` for auto-contrast text on colored fills
- Set `fontFamily: 2` (Helvetica) — web fonts are applied at render time by the HTML renderer

### Step 4 — Save `.excalidraw` JSON

```javascript
const excalidrawFile = {
  type: "excalidraw",
  version: 2,
  source: "stromy-diagram-skill",
  elements: elements,
  appState: {
    viewBackgroundColor: theme.backgroundColor || "#ffffff",
    gridSize: null
  },
  files: {}
};
fs.writeFileSync('diagram.excalidraw', JSON.stringify(excalidrawFile, null, 2));
```

### Step 5 — Render to PNG/SVG

```bash
# PNG at 3x resolution (default) — ~300 DPI at typical 6-inch display width, required for print/DOCX
node skills/diagram/scripts/render-diagram.js diagram.excalidraw output.png --client amaris

# Use --scale 2 for screen-only output (smaller file, faster)
node skills/diagram/scripts/render-diagram.js diagram.excalidraw output.png --scale 2 --client amaris

# SVG output
node skills/diagram/scripts/render-diagram.js diagram.excalidraw output.svg --format svg --client amaris

# With explicit repo root
node skills/diagram/scripts/render-diagram.js diagram.excalidraw output.png --client amaris --repo-root .

# Fallback SVG renderer (no Playwright needed)
node skills/diagram/scripts/render-diagram.js diagram.excalidraw output.png --fallback-svg
```

**DPI guidance**: Playwright renders at screen resolution by default. The `--scale` flag maps to `deviceScaleFactor`. At a 800px viewport width:
- `--scale 2` → 1600px wide → ~200 DPI at 8-inch print width (screen quality only)
- `--scale 3` → 2400px wide → ~300 DPI at 8-inch print width (print quality, default)
- `--scale 4` → 3200px wide → ~400 DPI (large-format or high-DPI presentations)

The render script:
- Converts Excalidraw elements → styled HTML/CSS with brand tokens
- Loads Google Fonts from charter.json font stack
- Renders via Playwright screenshot at specified scale
- Falls back to basic SVG + resvg if Playwright fails

### Step 6 — Embed in deliverable

Place the PNG in the deliverable's output directory. Consumer skills (pptx, pptx-hd, docx, pdf) embed it using their standard image embedding patterns.

## Output Location

Save diagram files alongside the consuming deliverable:

```
workspace/<client>/output/<deliverable>/
  diagrams/
    process-flow.excalidraw    # Editable source
    process-flow.png           # Rendered image
  output.pptx                  # or .docx, .pdf
```

If no consuming deliverable exists (standalone diagram request), save to:
```
workspace/<client>/output/diagrams/
```

## Element Generation Tips

- **Auto-layout**: Calculate positions programmatically — don't hardcode absolute coordinates. Use grid-based spacing (e.g., `x = col * 250`, `y = row * 150`).
- **Text sizing**: Estimate text width as `text.length * fontSize * 0.6`. Add padding (`20px` each side).
- **Arrow binding**: Use `startBinding` and `endBinding` with element IDs. Add `boundElements` entries on connected shapes.
- **Grouping**: Use `groupIds` arrays to group related elements.
- **Colors**: Assign `fillColors` cyclically — element `i` gets `fillColors[i % fillColors.length]`.
- **Auto-contrast**: Use `textColorOnFill(fillHex, theme)` to pick white or dark text on colored backgrounds.
- **Deterministic layout**: Avoid `Math.random()` in build scripts — use deterministic mappings for reproducible diagrams.

## Dependencies

Required in Cowork's `package.json`:
- `playwright` — HTML rendering and Mermaid bridge (browser-based)
- `@excalidraw/mermaid-to-excalidraw` — Mermaid syntax → Excalidraw conversion (runs in Playwright)
- `@resvg/resvg-js` — SVG→PNG rasterization (fallback renderer)

No longer required (removed):
- ~~`@excalidraw/utils`~~ — replaced by HTML/Playwright renderer
- ~~`@excalidraw/excalidraw`~~ — not needed for generation or rendering
- ~~`jsdom`~~ — DOM shim no longer needed for rendering
