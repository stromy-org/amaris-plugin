# CLAUDE.md

Instructions for Claude Code when working in this plugin repo.

## Overview

amaris-consulting is a Claude Code plugin for Amaris Consulting. It is a **distribution artifact** — skills are authored in Workspace Studio and cherry-picked here for client deployment.

## Repository Structure

```
amaris-consulting/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── skills/                   # Deliverable skills (from Workspace Studio)
├── companies/amaris/  # Brand data (charter, logos, colors)
├── src/                      # Shared workspace utilities
│   ├── workspace.js
│   └── workspace.py
├── package.json              # Node.js dependencies
├── pyproject.toml            # Python dependencies
├── hooks/
│   └── hooks.json            # Lifecycle hooks
├── settings.json             # Default permissions
├── .github/
│   ├── CODEOWNERS
│   └── dependabot.yml
├── LICENSE
└── README.md
```

## Brand Architecture

This plugin defaults to **Amaris Consulting** brand data at `companies/amaris/`. Skills read `charter.json`, `logos/`, `images/`, and `tokens.css` from this path automatically — no prompt-time client selection needed.

For collaborative brands (e.g., "Amaris Consulting x Partner"), skills fall back to the Amaris Consulting charter for any missing fields.

## Commands

```bash
npm install                    # Install Node dependencies
uv sync                        # Install Python dependencies
claude --plugin-dir .          # Test locally
claude plugin validate .       # Validate plugin structure
```

## Updating Skills

Skills are maintained in Workspace Studio and cherry-picked into this plugin:

1. Update the skill in `workspace-studio/.claude/skills/<skill-name>/`
2. Copy updated files to `skills/<skill-name>/`
3. Re-apply portability transforms (`.claude/companies/` → `companies/`, etc.)
4. Bump version in `.claude-plugin/plugin.json` and `package.json`

## Key Rules

- All paths are plugin-relative: `companies/`, `skills/`, `src/` — never `.claude/companies/` or `.claude/skills/`
- Node requires are flat: `require('pkg')` not `require('../../../../node_modules/pkg')`
- Workspace imports: `require('../../src/workspace')` (2 levels from skill scripts)
- Default brand: `companies/amaris/` — hardwired, no discovery needed
