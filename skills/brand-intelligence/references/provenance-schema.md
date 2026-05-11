# Provenance Schema

Every persisted field, asset, and decision must be auditable. This is the
schema.

## Confidence Rubric

| Confidence | Meaning | When to assign |
|-----------|---------|---------------|
| `high` | Source explicitly designates this as brand identity | Tier 1–4 results, or Tier 5 results corroborated by ≥2 semantic elements |
| `medium` | Source is brand-owner-controlled but not explicitly labeled | Tier 5–6 results, single-element sampling |
| `low` | Best-effort guess, needs human confirmation | Tier 7, or any result that conflicts with a higher-tier source |

## Field-Level Provenance (in `charter.candidate.json`)

Every value gets a sibling `_provenance` entry:

```json
{
  "colors": {
    "primary": "#FEFF00",
    "_provenance": {
      "primary": {
        "tier": 4,
        "method": "css_vars",
        "source_url": "https://www.bursoncw.com/",
        "fetched_at": "2026-05-01T14:32:11Z",
        "confidence": "high",
        "raw_value": "var(--brand-yellow)",
        "alternatives": [
          {"tier": 5, "method": "computed_style", "source_element": "header background", "value": "rgb(254, 255, 0)"}
        ]
      }
    }
  }
}
```

If the provenance block bloats the file beyond comfortable reading, move it to
a sidecar `charter.candidate.provenance.json` with the same key structure.

## Asset-Level Provenance (in `assets.json`)

```json
{
  "path": "raw/burson-logo.svg",
  "bucket": "logo-primary",
  "source_tier": 1,
  "source_url": "https://www.bursoncw.com/press/burson-logo.svg",
  "source_page": "https://www.bursoncw.com/press",
  "fetched_at": "2026-05-01T14:32:11Z",
  "user_agent": "Mozilla/5.0 (compatible; stromy-brand-intelligence/1.0; +https://stromy.com.au)",
  "sha256": "abc123...",
  "size_bytes": 4823,
  "content_type": "image/svg+xml",
  "confidence": "high",
  "classification_score": 9,
  "classification_signals": [
    "extension_svg",
    "in_header",
    "filename_logo",
    "press_page_source"
  ],
  "notes": null
}
```

## Run-Level Provenance (in `manifest.json`)

The bundle handed to `brand-artifact-builder` includes a top-level run record:

```json
{
  "skill": "brand-intelligence",
  "skill_version": "1.0",
  "run_id": "2026-05-01T14-32-11Z-burson",
  "target": {
    "slug": "burson",
    "domain": "bursoncw.com",
    "user_provided_brand_name": "Burson"
  },
  "started_at": "2026-05-01T14:32:11Z",
  "completed_at": "2026-05-01T14:38:42Z",
  "robots_txt_status": "allowed",
  "phases": {
    "recon": {"status": "complete", "sources_found": 4},
    "inspect": {"status": "complete", "pages_loaded": 2},
    "download": {"status": "complete", "assets_downloaded": 11, "deduped": 2},
    "synthesize": {"status": "complete", "fields_populated": 7, "gaps": 3},
    "verify": {"status": "user_approved", "approved_assets": 5, "rejected_assets": 6}
  },
  "gaps": [
    "typography.body — no source returned a body font family",
    "logo.dark — no dark-mode variant found",
    "tagline — not present on homepage or press page"
  ]
}
```

## Why This Matters

Without provenance, a brand kit pulled from the web is indistinguishable from
one we invented. Six months from now, when a designer asks "is this really their
yellow?", the answer must be a URL and a timestamp, not "we think so".

Provenance is also the gate for re-runs: if `bursoncw.com` redesigns next year,
a provenance-tagged charter lets us diff old vs new and refresh selectively
instead of starting over.
