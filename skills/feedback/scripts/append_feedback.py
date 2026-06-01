#!/usr/bin/env python3
"""Append (prepend, newest-first) a feedback entry to the client's feedback log.

The feedback skill calls this script so the entry is added safely and
append-only — the log file is never rewritten or truncated, and a new entry is
always inserted directly under the stable header so the file reads newest-first.

Usage:
    echo "<entry body>" | append_feedback.py --title "<short task title>"
    append_feedback.py --title "<title>" --file /custom/path.md < body.txt

The entry body is read from stdin. The script generates the timestamp and the
`## <timestamp> — <title>` heading itself; the body should be everything that
goes *under* that heading.

Resolution order for the target file (unless --file is given):
    1. $HOME/Desktop/claude-feedback.md   (when ~/Desktop exists)
    2. $HOME/claude-feedback.md           (fallback)
"""
from __future__ import annotations

import argparse
import os
import sys
import tempfile
from datetime import datetime
from pathlib import Path

HEADER = """\
# Claude Feedback Log

This file collects Claude's own retrospectives on tasks it performed for you.
Each entry is a candid, backward-looking note: what Claude was asked to do,
which skill it used, how the experience went, and where the guidance or tooling
fell short. Newest entries are at the top.

**When you're ready, email this file to your Stromy contact** so the feedback
can be used to improve the skills and tools. Nothing here is sent automatically.

---
"""


def resolve_target(explicit: str | None) -> Path:
    if explicit:
        return Path(explicit).expanduser()
    home = Path(os.path.expanduser("~"))
    desktop = home / "Desktop"
    if desktop.is_dir():
        return desktop / "claude-feedback.md"
    return home / "claude-feedback.md"


def build_entry(title: str, body: str, now: datetime) -> str:
    stamp = now.strftime("%Y-%m-%d %H:%M")
    body = body.strip("\n")
    return f"## {stamp} — {title}\n\n{body}\n\n---\n"


def split_header(content: str) -> tuple[str, str]:
    """Return (header, remainder). Header is everything up to and including the
    first '---' line. If no recognizable header, treat all content as remainder
    and (re)prepend a fresh header."""
    marker = "\n---\n"
    idx = content.find(marker)
    if content.startswith("# Claude Feedback Log") and idx != -1:
        cut = idx + len(marker)
        return content[:cut], content[cut:]
    return HEADER, content


def atomic_write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=".claude-feedback-", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(content)
        os.replace(tmp, path)
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Prepend a feedback entry to the log.")
    parser.add_argument("--title", required=True, help="Short task title for the entry heading.")
    parser.add_argument("--file", default=None, help="Override the target log file path.")
    args = parser.parse_args(argv)

    body = sys.stdin.read()
    if not body.strip():
        print("error: empty feedback body on stdin", file=sys.stderr)
        return 2

    target = resolve_target(args.file)
    existing = target.read_text(encoding="utf-8") if target.exists() else ""
    header, remainder = split_header(existing)

    entry = build_entry(args.title, body, datetime.now())  # noqa: DTZ005 (local wall-clock is intended)
    remainder = remainder.lstrip("\n")
    new_content = f"{header}\n{entry}\n{remainder}" if remainder else f"{header}\n{entry}"

    atomic_write(target, new_content)
    print(str(target.resolve()))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
