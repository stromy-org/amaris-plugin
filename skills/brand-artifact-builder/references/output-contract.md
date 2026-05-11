# Brand Artifact Builder Output Contract

Use this file when deciding where artifact-builder outputs should live and what
should remain staged in `_build/`.

## Core Principle

Prefer extending the existing canonical brand structure instead of creating a new
parallel artifact root.

Canonical base:

```text
client-data/clients/<slug>/
├── charter.json
├── profile.json
├── logos/
├── images/
├── assets/
│   └── svg/              <- dividers, patterns, motifs
├── guidelines.md
├── tokens.css
├── templates/
├── pptx-assets/          <- pre-rendered gradients, overlays, motifs
├── .build-history/       <- durable session ledger + promoted references
│   ├── BUILD_LOG.md
│   ├── brand-book.html
│   └── imagery-guide.html
└── _build/
    └── brand-artifact-builder/
```

Current validated consumer copies:

- `stromy-website/client-data/clients/<slug>/` (committed slice via `dispatch-client-data.sh`)
- `clients/<client>/<client>-plugin/companies/<slug>/` (brand copy via `sync-plugin-brand.sh`)

These destinations mirror canonical brand data through sync or packaging. They
are consumers of the canonical tree, not separate places to invent new stable
artifact layouts.

## Stable Vs Preview Outputs

Promote to canonical brand folders when the asset is:

- reusable across more than one downstream deliverable
- trustworthy and approved
- likely to be referenced by path from other skills or repos
- a durable derivative of canonical source material

Keep in `_build/brand-artifact-builder/` when the asset is:

- a review board, contact sheet, or temporary mockup
- ambiguous, provisional, or inferred
- specific to one exploratory direction
- only useful as QA evidence

## Recommended Directory Conventions

### Logos

Use `logos/` for canonical marks and widely reusable exports.

Suggested pattern:

```text
logos/
├── <brand>-logo-primary.svg
├── <brand>-logo-white.svg
├── <brand>-logo-icon.svg
└── exports/
    ├── website/
    ├── social/
    └── app/
```

Do not replace existing canonical filenames unless you also update all known
consumers.

### Images

Use `images/` for reusable image assets. Separate masters from treated derivatives
when practical.

Suggested pattern:

```text
images/
├── source/
├── processed/
├── website/
├── pptx/
└── social/
```

If the brand already has a different but coherent structure, preserve it.

### Templates

Use `templates/` only for reusable final templates or format scaffolds, not for
raw asset staging.

### Build Artifacts

Use:

```text
_build/brand-artifact-builder/
├── inventory.md
├── gaps.md
├── manifest.json
└── previews/
```

## Surface Matrix

### Website Pack

Typical stable outputs:

- logo exports suitable for light/dark UI
- favicon or app-icon set
- reusable hero/background imagery
- token exports consumed by the website repo

Typical preview outputs:

- logo/background comparison board
- homepage/header mockups

### PPTX / Document Pack

Typical stable outputs:

- presentation-safe logo variants
- processed image crops
- divider/motif assets
- charter or token path updates needed by the template builder

Typical preview outputs:

- slide mockups
- contact sheets for image selection

### Social Pack

Typical stable outputs:

- avatar/icon mark
- profile banner
- reusable post-safe crops or textures

Typical preview outputs:

- banner/avatar fit checks
- post composition boards

## Manifest Fields

When creating `manifest.json` or a structured equivalent, prefer these fields:

- `asset_id`
- `role`
- `status` — `canonical`, `derived`, `inferred`, or `missing`
- `source_path`
- `source_url`
- `output_path`
- `surfaces`
- `format`
- `dimensions`
- `background`
- `approved`
- `notes`

Not every field is mandatory for every asset, but the status and output path should
always be clear.
