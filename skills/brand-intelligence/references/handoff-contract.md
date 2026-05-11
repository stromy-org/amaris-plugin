# Handoff Contract: brand-intelligence → brand-artifact-builder

The exact bundle shape that this skill must produce, and that
`brand-artifact-builder` consumes.

## Bundle Location

```
_build/brand-intelligence/<slug>/approved/
├── charter.json                    # User-approved candidate, provenance stripped
├── charter.provenance.json         # Full provenance sidecar (kept for audit)
├── logos/
│   ├── logo.svg                    # Primary, renamed to canonical name
│   ├── logo-white.svg              # Optional dark-bg variant
│   ├── logo-mark.svg               # Optional icon-only variant
│   └── source/                     # Original filenames preserved
│       ├── burson-logo-color.svg
│       └── burson-logo-white.svg
├── images/
│   └── og-image.jpg                # Anything classified above 'unknown'
└── manifest.json                   # Run-level provenance + handoff metadata
```

## charter.json Shape

Match the existing charter schema in `client-data/clients/<existing>/charter.json`.
Read one of the existing charters first to confirm field names. Typical shape
for a tier-2 output brand:

```json
{
  "meta": {
    "slug": "burson",
    "name": "Burson",
    "tier": "output",
    "source": "brand-intelligence",
    "source_run": "2026-05-01T14-32-11Z-burson"
  },
  "logo": {
    "primary": "logos/logo.svg",
    "white": "logos/logo-white.svg",
    "mark": "logos/logo-mark.svg"
  },
  "colors": {
    "primary": "#FEFF00",
    "secondary": "#0A0400",
    "neutral": "#FFFFF1"
  },
  "typography": {
    "heading": "Helvetica Neue",
    "body": "Helvetica Neue"
  }
}
```

Do not invent fields the existing schema doesn't have. If a discovered value
doesn't fit any existing field, drop it into `manifest.json` `extras[]` and
flag in the Phase 5 review.

## manifest.json Shape

```json
{
  "skill": "brand-intelligence",
  "skill_version": "1.0",
  "run_id": "2026-05-01T14-32-11Z-burson",
  "target": {"slug": "burson", "domain": "bursoncw.com"},
  "approved_by_user_at": "2026-05-01T14:42:18Z",
  "assets": [
    {"path": "logos/logo.svg", "source_url": "...", "source_tier": 1, "confidence": "high"}
  ],
  "rejected_assets": [
    {"path": "raw/some-banner.png", "reason": "user_rejected_in_phase_5"}
  ],
  "gaps": [
    "logo.dark — no dark variant found",
    "tagline — not extractable"
  ],
  "extras": [],
  "next_step": {
    "skill": "brand-artifact-builder",
    "command_hint": "Hand this bundle to brand-artifact-builder targeting client-data/clients/burson/ at tier=output"
  }
}
```

## What brand-artifact-builder Expects

Reading `brand-artifact-builder/SKILL.md`, the inputs section accepts:
charter, profile, logos directory, guidelines, and "approved imagery or
templates". This bundle satisfies that contract:

- `charter.json` → charter source
- `logos/` → logo source (canonical names + originals preserved)
- `images/` → approved imagery
- `manifest.json` → provenance audit trail (artifact-builder records this in
  its post-promotion housekeeping)

When invoking artifact-builder after this skill, point it explicitly at the
`approved/` directory rather than `client-data/clients/<slug>/` — this signals
"package this fresh bundle into canonical storage" rather than "package what's
already canonical".

## What This Skill Must NOT Do

- **Never write to `client-data/`.** That's brand-artifact-builder's job, gated
  by its own user confirmation step.
- **Never delete the `_build/brand-intelligence/<slug>/raw/` tree until
  artifact-builder has successfully promoted.** The raw tree is the audit
  source — keep it until canonical storage is confirmed.
- **Never auto-invoke brand-artifact-builder.** Print the handoff command and
  let the user invoke it. This preserves the human-in-the-loop boundary
  between discovery and packaging.
