#!/usr/bin/env python3
"""
check-font-collision.py — Brand-builder diversity guardrail

Scans every charter.json under client-data/clients/ and warns when a proposed
display (heading) font is already in use by another active brand. The
brand-builder skill's Phase 2 (typography refinement) should call this before
finalizing a brand's fonts — without it, multiple brands independently land on
the same fashionable display font (we've seen ai4comms and popol both pick
Syne, making them instantly look like siblings).

Usage:
    # Check if 'Syne' would collide with any existing brand (exclude slug
    # being built so re-running on an existing charter doesn't self-collide):
    python3 check-font-collision.py --font "Syne" --exclude strategicpopoltastic

    # Machine mode — exits 1 on collision, prints colliding brand to stderr:
    python3 check-font-collision.py --font "Syne" --strict

    # List all display fonts currently in use:
    python3 check-font-collision.py --list

Exit codes:
    0 — no collision (or --list mode)
    1 — collision detected in --strict mode

Resolution: charter paths are resolved relative to the stromy-org repo root,
not the script's location, so it works from any CWD.
"""

import argparse
import json
import sys
from pathlib import Path


def find_repo_root(start: Path) -> Path:
    """Walk up from `start` until we find the stromy-org root (has client-data/)."""
    p = start.resolve()
    for candidate in [p, *p.parents]:
        if (candidate / "client-data" / "clients").is_dir():
            return candidate
    raise SystemExit(
        "Could not locate stromy-org root (no client-data/clients/ ancestor)"
    )


def collect_display_fonts(clients_dir: Path) -> dict[str, str]:
    """
    Return {brand_slug: heading_font_family} for every charter.json found.
    Skips the `_default` directory and any charter that can't be parsed.
    """
    out: dict[str, str] = {}
    for charter_path in sorted(clients_dir.glob("*/charter.json")):
        slug = charter_path.parent.name
        if slug.startswith("_"):
            continue
        try:
            charter = json.loads(charter_path.read_text())
        except (OSError, json.JSONDecodeError) as exc:
            print(f"warn: could not read {charter_path}: {exc}", file=sys.stderr)
            continue
        family = (
            charter.get("fonts", {})
            .get("heading", {})
            .get("family")
        )
        if family:
            out[slug] = family.strip()
    return out


def normalize(name: str) -> str:
    return name.strip().lower().replace("-", " ").replace("_", " ")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--font", help="Proposed display/heading font family")
    parser.add_argument("--exclude", help="Brand slug to exclude (the one being built)")
    parser.add_argument("--strict", action="store_true", help="Exit 1 on collision")
    parser.add_argument("--list", action="store_true", help="List all display fonts currently in use")
    args = parser.parse_args()

    root = find_repo_root(Path(__file__).parent)
    clients_dir = root / "client-data" / "clients"
    fonts = collect_display_fonts(clients_dir)

    if args.list:
        if not fonts:
            print("(no brands found)")
            return 0
        width = max(len(s) for s in fonts)
        print(f"Display fonts in use across {len(fonts)} brands:\n")
        for slug, family in sorted(fonts.items(), key=lambda kv: (kv[1].lower(), kv[0])):
            print(f"  {slug:<{width}}  {family}")
        return 0

    if not args.font:
        parser.error("--font is required unless --list is given")

    proposed = normalize(args.font)
    collisions = [
        (slug, family)
        for slug, family in fonts.items()
        if slug != args.exclude and normalize(family) == proposed
    ]

    if collisions:
        print(
            f"⚠  COLLISION: heading font '{args.font}' is already used by: "
            + ", ".join(f"{slug} ({family})" for slug, family in collisions),
            file=sys.stderr,
        )
        print(
            "   Pick a different display font to keep brands visually distinct at thumbnail size.",
            file=sys.stderr,
        )
        return 1 if args.strict else 0

    print(f"✓  '{args.font}' is unique across {len(fonts)} active brand(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
