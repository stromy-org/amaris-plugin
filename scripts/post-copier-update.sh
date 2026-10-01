#!/usr/bin/env bash
set -uo pipefail
rc=0
run() { "$@" || rc=1; }

[ ! -f package.json ] || run npm install
[ ! -f pyproject.toml ] || run uv lock
[ ! -f scripts/render-mcp.py ] || run python3 scripts/render-mcp.py
exit "$rc"

