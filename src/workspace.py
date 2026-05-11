"""
Workspace v2 — output path resolution for build scripts.

Works at any directory depth by walking up to find markers
instead of assuming a fixed number of parent levels.

Usage (from any build script inside workspace/):
    from pathlib import Path
    root = Path(__file__).resolve()
    while not (root / 'package.json').exists():
        root = root.parent
    import sys; sys.path.insert(0, str(root / 'src'))
    from workspace import ensure_output_dir

    output_dir = ensure_output_dir(__file__)
"""

from __future__ import annotations

import os
from pathlib import Path


def find_repo_root(start_dir: str | Path) -> Path | None:
    """Walk up from start_dir to find the repo root (directory containing package.json).
    Skips node_modules directories.
    """
    p = Path(start_dir).resolve()
    while p != p.parent:
        if (p / "package.json").exists() and "node_modules" not in p.parts:
            return p
        p = p.parent
    return None


def resolve_project_root(build_path: str | Path) -> Path:
    """Walk up from a build script to find the project root.

    The project root is the directory whose child named 'build' contains
    the build script. Works at any depth:
        workspace/<client>/build/<deliverable>/           → workspace/<client>/
        workspace/<client>/<project>/build/<deliverable>/ → workspace/<client>/<project>/

    Falls back to the build script's own directory if no 'build' parent found.
    """
    p = Path(build_path).resolve()
    # If input is a file (e.g. __file__), go to its parent directory.
    # If input is a directory or doesn't exist on disk, treat as directory path.
    if p.is_file():
        p = p.parent

    # Walk up looking for a parent named 'build'
    d = p
    while d != d.parent:
        if d.name == "build":
            return d.parent
        d = d.parent
    return p


def resolve_workspace_root(start_dir: str | Path) -> Path | None:
    """Walk up from start_dir to find the workspace/ root directory.
    Returns None if not inside a workspace tree.
    """
    p = Path(start_dir).resolve()
    while p != p.parent:
        if p.name == "workspace":
            return p
        p = p.parent
    return None


def resolve_output_dir(
    build_path: str | Path, *, output_dir: str | Path | None = None
) -> Path:
    """Resolve the output directory for a build script.

    Precedence:
        1. output_dir kwarg (explicit — for external agents)
        2. OUTPUT_DIR env var
        3. .remotion-project marker → <projectRoot>/out/
        4. Convention → <projectRoot>/output/<deliverable>/
    """
    if output_dir is not None:
        return Path(output_dir).resolve()
    env = os.environ.get("OUTPUT_DIR")
    if env:
        return Path(env).resolve()

    project_root = resolve_project_root(build_path)
    p = Path(build_path).resolve()
    if p.is_file():
        p = p.parent

    if (project_root / ".remotion-project").exists():
        return project_root / "out"

    # Walk up to find the 'build' directory and extract the deliverable name
    d = p
    while d != d.parent:
        if d.parent.name == "build":
            return project_root / "output" / d.name
        if d.name == "build":
            break
        d = d.parent

    return project_root / "output"


def ensure_output_dir(
    build_path: str | Path, *, output_dir: str | Path | None = None
) -> Path:
    """Resolve output dir and create it if it doesn't exist."""
    d = resolve_output_dir(build_path, output_dir=output_dir)
    d.mkdir(parents=True, exist_ok=True)
    return d


def resolve_output_path(
    build_path: str | Path, filename: str, *, output_dir: str | Path | None = None
) -> Path:
    """Resolve full path to an output file."""
    return resolve_output_dir(build_path, output_dir=output_dir) / filename


def resolve_intake_dir(build_path: str | Path) -> Path:
    """Resolve the intake directory for a project."""
    return resolve_project_root(build_path) / "intake"
