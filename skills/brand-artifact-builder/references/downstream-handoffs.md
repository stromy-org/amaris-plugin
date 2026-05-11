# Downstream Handoffs Audit

Use this file when deciding whether a downstream workflow should consume
canonical brand data directly or wait for a reusable pack from
`brand-artifact-builder`.

## Hard Rule

`client-data/clients/<slug>/_build/brand-artifact-builder/` is review-only.
It may hold inventories, manifests, preview boards, and QA evidence, but
downstream consumers must never depend on it at runtime.

## Canonical Source And Synced Copies

Stable source of truth:

- `client-data/clients/<slug>/`

Current consumer destinations validated in this repo:

- `stromy-website/client-data/clients/<slug>/` — committed slice via `dispatch-client-data.sh`
- `Cowork/client-data/clients/<slug>/` — full submodule via `bump-client-data.sh`
- `clients/<client>/<client>-plugin/companies/<slug>/` — brand copy via `sync-plugin-brand.sh`

These are copies of the canonical brand (via three-tier distribution), not separate artifact roots.
Do not invent a parallel `artifacts/` or `brand-pack/` tree in those consumers.

Consumer tiers:
- **Full submodule**: Stromy, Cowork, report-renderer — all clients via `bump-client-data.sh`
- **Dispatched slice**: Website repos — one client, committed, via `dispatch-client-data.sh`
- **Committed copy**: Plugin repos — one client's brand, committed, via `sync-plugin-brand.sh`

## Consumer Matrix

| Consumer | Canonical inputs | Artifact-builder outputs that may be promoted | Notes |
|---|---|---|---|
| Website | `charter.json`, `logos/`, `images/`, `tokens.css` | favicon/app icons, reusable hero/background crops, website-safe logo exports | Website runtime should read canonical or synced brand files only |
| Presentation | `charter.json`, `logos/`, `images/`, `pptx-assets/`, `tokens.css` | pre-rendered gradients, photo overlays (brand-tinted composites), motif tiles, presentation-safe crops, reusable lockups | PPTX skill consumes `pptxAssets` from charter.json directly; falls back to runtime Sharp compositing when assets are unavailable |
| Document | `charter.json`, `logos/`, `images/`, `templates/`, `tokens.css` | document-safe logos, monochrome marks, header/footer assets, print-safe imagery | DOCX/print flows share the same canonical folders as other consumers |
| Plugin | synced `companies/<slug>/` copy of `charter.json`, `logos/`, `images/`, `templates/`, `tokens.css` | none plugin-specific by default; only reuse promoted canonical assets | Plugin packaging inherits the same contract as Cowork and websites |

## Decision Rules

- If an asset is reusable across more than one downstream surface, promote it
  into an existing canonical folder under `client-data/clients/<slug>/`.
- If an output is only for review, comparison, or QA, keep it under
  `_build/brand-artifact-builder/`.
- If a downstream workflow can already operate from canonical files, do not add
  a new artifact-builder step just for formality.
- If no clear canonical destination exists yet, keep the output in `_build/`
  and record the schema gap instead of improvising a permanent path.

## Stromy Forward-Test Baseline

The current repo already provides a real downstream path for validation:

- Canonical source: `client-data/clients/stromy/`
- Website consumer copy: `stromy-website/client-data/clients/stromy/` (committed slice)
- Website runtime logo imports: `stromy-website/src/components/layout/`

Use this path when you need a concrete proof that downstream consumers can run
from canonical or synced brand data without depending on review artifacts.
