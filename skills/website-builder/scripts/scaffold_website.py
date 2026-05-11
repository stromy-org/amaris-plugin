#!/usr/bin/env python3
"""Scaffold an Astro website from a brand charter.

Creates the directory structure, config files, and brand token CSS for a new
client website. Does NOT generate any creative/brand-specific code — that is
Claude's job following the SKILL.md instructions.

Usage:
    # Auto-detects plugin slug from existing clients/<candidate>/<candidate>-plugin/
    python scaffold_website.py \
        --slug dukestrategies \
        --plugin-slug duke-strategies \
        --charter client-data/clients/dukestrategies/charter.json

    # With explicit paths
    python scaffold_website.py \
        --slug dukestrategies \
        --plugin-slug duke-strategies \
        --charter client-data/clients/dukestrategies/charter.json \
        --target-dir clients/duke-strategies/duke-strategies-website \
        --org-root /path/to/stromy-org
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from datetime import date, datetime
from pathlib import Path
from string import Template


def kebab(s: str) -> str:
    """Convert camelCase to kebab-case."""
    import re
    return re.sub(r'([a-z])([A-Z])', r'\1-\2', s).lower()


def slug_to_display(slug: str) -> str:
    """Convert slug to display name: dukestrategies → Duke Strategies."""
    return slug.replace('-', ' ').title()


def load_charter(path: Path) -> dict:
    """Load and validate charter.json."""
    if not path.exists():
        print(f"Error: Charter not found at {path}", file=sys.stderr)
        sys.exit(1)
    with open(path) as f:
        charter = json.load(f)
    if 'colors' not in charter or 'fonts' not in charter:
        print("Error: Charter must have 'colors' and 'fonts' sections", file=sys.stderr)
        sys.exit(1)
    return charter


def validate_deployment_compat(charter: dict) -> None:
    """Validate contact form / platform compatibility."""
    website = charter.get('website', {})
    deployment = website.get('deployment', {})
    platform = deployment.get('platform', 'github-pages')
    contact_form = deployment.get('contactForm', 'mailto')

    invalid_combos = {
        'github-pages': ['netlify-forms', 'custom-api'],
        'vercel': ['netlify-forms'],
        'cloudflare-pages': ['netlify-forms'],
    }

    if platform in invalid_combos and contact_form in invalid_combos[platform]:
        print(
            f"Error: '{contact_form}' is not compatible with '{platform}'. "
            f"Use 'mailto' for a simple static contact path, 'formspree' for a hosted form, or change the platform.",
            file=sys.stderr,
        )
        sys.exit(1)


def generate_brand_tokens_css(charter: dict) -> str:
    """Generate Tier 1 CSS custom properties from charter."""
    lines = ['/* Auto-generated from charter.json — do not edit manually */', ':root {']

    # Colors
    for key, value in charter.get('colors', {}).items():
        lines.append(f'  --brand-{kebab(key)}: {value};')

    # Fonts
    for role, font in charter.get('fonts', {}).items():
        family = font.get('family', 'sans-serif')
        fallback = font.get('fallback', 'sans-serif')
        weight = font.get('weight', 'normal')
        lines.append(f"  --brand-font-{role}: '{family}', {fallback};")
        lines.append(f'  --brand-font-{role}-weight: {weight};')

    lines.append('}')
    return '\n'.join(lines) + '\n'


def generate_tokens_ts(charter: dict) -> str:
    """Generate TypeScript token module from charter."""
    lines = [
        '/* Auto-generated from charter.json — do not edit manually */',
        '',
        f'export const colors = {json.dumps(charter.get("colors", {}), indent=2)} as const;',
        '',
        'export const fonts = {',
    ]
    for role, font in charter.get('fonts', {}).items():
        family = font.get('family', 'sans-serif')
        fallback = font.get('fallback', 'sans-serif')
        weight = font.get('weight', 'normal')
        lines.append(f"  {role}: {{ family: \"'{family}', {fallback}\", weight: \"{weight}\" }},")
    lines.append('} as const;')
    return '\n'.join(lines) + '\n'


def get_bootstrap_commit() -> str:
    """Get the current stromy-org commit hash."""
    try:
        result = subprocess.run(
            ['git', 'rev-parse', 'HEAD'],
            capture_output=True, text=True, check=True,
        )
        return result.stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return 'unknown'


CODEX_CONFIG = """\
#:schema https://developers.openai.com/codex/config-schema.json

# Codex project configuration
# AGENTS.md is auto-loaded as primary instructions.

# ── Instructions ───────────────────────────────────────────
# If AGENTS.md is missing, try CLAUDE.md
project_doc_fallback_filenames = ["CLAUDE.md"]

# ── Approval & Sandbox ────────────────────────────────────
approval_policy = "on-request"
sandbox_mode = "workspace-write"

# ── Reasoning ──────────────────────────────────────────────
model_reasoning_effort = "high"

# ── Web Search ─────────────────────────────────────────────
web_search = "cached"
"""


def render_template(template_path: Path, variables: dict[str, str]) -> str:
    """Render a template file with variable substitution."""
    content = template_path.read_text()
    # Use safe_substitute to avoid errors on unmatched placeholders
    return Template(content).safe_substitute(variables)


def scaffold(args: argparse.Namespace) -> None:
    """Create the website scaffold."""
    org_root = Path(args.org_root).resolve()
    charter_path = (org_root / args.charter).resolve()
    charter = load_charter(charter_path)
    validate_deployment_compat(charter)

    # Derive names
    slug = args.slug
    meta = charter.get('meta', {})
    display_name = meta.get('displayName', slug_to_display(slug))
    tagline = meta.get('tagline', '')
    website_cfg = charter.get('website', {})
    deployment = website_cfg.get('deployment', {})
    domain = deployment.get('domain', f'{slug}.com')
    platform = deployment.get('platform', 'github-pages')

    # Plugin slug convention: hyphenated kebab-case directory name under clients/.
    # Resolution order:
    #   1. Explicit --plugin-slug arg
    #   2. charter.meta.pluginSlug
    #   3. Auto-detect: existing clients/<candidate>/<candidate>-plugin/ where
    #      <candidate> normalises (lowercase, strip '-') to match slug
    #   4. Fallback: naive slug.replace('_', '-')
    plugin_slug: str | None = getattr(args, 'plugin_slug', None)
    if not plugin_slug:
        plugin_slug = meta.get('pluginSlug')
    if not plugin_slug:
        clients_root = org_root / 'clients'
        if clients_root.is_dir():
            needle = slug.lower().replace('-', '').replace('_', '')
            for candidate in sorted(clients_root.iterdir()):
                if not candidate.is_dir():
                    continue
                if candidate.name.lower().replace('-', '') != needle:
                    continue
                if (candidate / f'{candidate.name}-plugin').is_dir():
                    plugin_slug = candidate.name
                    print(
                        f"  Auto-detected plugin slug '{plugin_slug}' from "
                        f"clients/{candidate.name}/{candidate.name}-plugin/"
                    )
                    break
    if not plugin_slug:
        plugin_slug = slug.replace('_', '-')

    if args.target_dir:
        target = Path(args.target_dir).resolve()
    else:
        target = org_root / 'clients' / plugin_slug / f'{plugin_slug}-website'

    if target.exists() and any(target.iterdir()):
        print(f"Error: Target directory {target} already exists and is not empty", file=sys.stderr)
        sys.exit(1)

    templates_dir = Path(__file__).parent.parent / 'templates'
    skill_root = Path(__file__).parent.parent

    # Template variables
    variables = {
        'SLUG': slug,
        'DISPLAY_NAME': display_name,
        'PLUGIN_SLUG': plugin_slug,
        'TAGLINE': tagline,
        'DOMAIN': domain,
        'SITE_URL': f'https://{domain}',
        'GITHUB_ORG': 'stromy-org',
        'REPO_NAME': f'{plugin_slug}-website',
        'DATE': date.today().isoformat(),
        'BOOTSTRAP_COMMIT': get_bootstrap_commit(),
    }

    print(f"Scaffolding website for {display_name} at {target}")

    # Create directory structure
    dirs = [
        '.github/workflows',
        '.claude/rules',
        '.claude/skills/website-maintain',
        '.codex',
        'src/brand/logos',
        'src/brand/images',
        'src/content/blog',
        'src/content/case-studies',
        'src/content/capabilities',
        'src/styles',
        'src/lib',
        'src/components/layout',
        'src/components/ui',
        'src/components/sections',
        'src/components/content',
        'src/layouts',
        'src/pages',
        'src/data',
        'scripts',
        'public',
    ]
    for d in dirs:
        (target / d).mkdir(parents=True, exist_ok=True)

    # Render and write templates
    template_files = {
        'package.json.template': 'package.json',
        'astro.config.mjs.template': 'astro.config.mjs',
        'tsconfig.json.template': 'tsconfig.json',
        'generate-tokens.ts.template': 'scripts/generate-tokens.ts',
        'deploy-workflow.yml.template': '.github/workflows/deploy.yml',
        'commit-enforcement.md.template': '.claude/rules/commit-enforcement.md',
    }

    for tpl_name, dest in template_files.items():
        tpl_path = templates_dir / tpl_name
        if tpl_path.exists():
            content = render_template(tpl_path, variables)
            (target / dest).write_text(content)
            print(f"  Created {dest}")
        else:
            print(f"  Warning: Template {tpl_name} not found, skipping")

    # Generate brand-tokens.css (Tier 1)
    tokens_css = generate_brand_tokens_css(charter)
    (target / 'src/styles/brand-tokens.css').write_text(tokens_css)
    print("  Generated src/styles/brand-tokens.css")

    # Generate tokens.ts
    tokens_ts = generate_tokens_ts(charter)
    (target / 'src/lib/tokens.ts').write_text(tokens_ts)
    print("  Generated src/lib/tokens.ts")

    # Copy charter.json to src/brand/
    shutil.copy2(charter_path, target / 'src/brand/charter.json')
    print("  Copied charter.json to src/brand/")

    # Copy logos if they exist
    charter_dir = charter_path.parent
    logos_dir = charter_dir / 'logos'
    if logos_dir.exists():
        shutil.copytree(logos_dir, target / 'src/brand/logos', dirs_exist_ok=True)
        print("  Copied logos/")

    # Copy images if they exist
    images_dir = charter_dir / 'images'
    if images_dir.exists():
        shutil.copytree(images_dir, target / 'src/brand/images', dirs_exist_ok=True)
        print("  Copied images/")

    # Write bootstrap-version.json
    bootstrap = {
        'bootstrap_source': 'stromy-org/website-builder',
        'bootstrap_commit': get_bootstrap_commit(),
        'bootstrap_date': datetime.now().isoformat(),
        'bootstrap_profile': 'website',
    }
    (target / '.claude/bootstrap-version.json').write_text(
        json.dumps(bootstrap, indent=2) + '\n'
    )
    print("  Created .claude/bootstrap-version.json")

    # Write .codex/config.toml
    (target / '.codex/config.toml').write_text(CODEX_CONFIG)

    # Create symlinks
    agents_skills = target / '.agents' / 'skills'
    agents_skills.parent.mkdir(parents=True, exist_ok=True)
    if not agents_skills.exists():
        agents_skills.symlink_to('../.claude/skills')
        print("  Created .agents/skills symlink")

    github_skills = target / '.github' / 'skills'
    if not github_skills.exists():
        github_skills.symlink_to('../.claude/skills')
        print("  Created .github/skills symlink")

    # Write .gitignore
    (target / '.gitignore').write_text(
        'node_modules/\ndist/\n.astro/\n.env\n*.local\n'
    )

    # Write placeholder CLAUDE.md (Claude fills in Phase 3)
    (target / 'CLAUDE.md').write_text(
        f'# CLAUDE.md\n\n'
        f'<!-- Placeholder — the website-builder skill will generate comprehensive instructions -->\n\n'
        f'## Project Overview\n\n'
        f'{display_name} corporate website — Astro 6, MDX, Tailwind CSS 4.\n\n'
        f'## Commands\n\n'
        f'```bash\n'
        f'npm run dev     # Dev server (localhost:4321)\n'
        f'npm run build   # Token generation + production build\n'
        f'npm run tokens  # Regenerate brand tokens from charter.json\n'
        f'npm run check   # Astro TypeScript check\n'
        f'```\n'
    )

    # Write placeholder AGENTS.md
    (target / 'AGENTS.md').write_text(
        f'# AGENTS.md\n\n'
        f'<!-- Placeholder — the website-builder skill will generate self-contained instructions -->\n\n'
        f'{display_name} corporate website.\n'
    )

    # i18n scaffold (when charter.website.i18n.enabled)
    i18n_cfg = website_cfg.get('i18n', {})
    if i18n_cfg.get('enabled', False):
        default_locale = i18n_cfg.get('defaultLocale', 'en')
        locales = i18n_cfg.get('locales', [default_locale])
        routing = i18n_cfg.get('routing', 'prefix-non-default')
        prefix_default = routing == 'prefix-default'
        fallback_locale = i18n_cfg.get('fallbackLocale', default_locale)
        translation_workflow = i18n_cfg.get('translationWorkflow', 'llm')

        # Create i18n directories
        (target / 'src/i18n').mkdir(parents=True, exist_ok=True)
        (target / '.i18n').mkdir(parents=True, exist_ok=True)

        # Create per-locale page directories
        for locale in locales:
            if prefix_default or locale != default_locale:
                (target / f'src/pages/{locale}').mkdir(parents=True, exist_ok=True)

        # Create per-locale content collection directories
        for collection in ['blog', 'case-studies']:
            for locale in locales:
                (target / f'src/content/{collection}/{locale}').mkdir(
                    parents=True, exist_ok=True,
                )

        # Write empty glossary stub
        (target / 'src/i18n/glossary.md').write_text(
            f'# Translation Glossary\n\n'
            f'## Do Not Translate\n\n'
            f'- {display_name}\n\n'
            f'## Preferred Equivalents\n\n'
            f'| English | Target Locale | Notes |\n'
            f'|---------|---------------|-------|\n\n'
            f'## Register\n\n'
            f'<!-- e.g., formal "u" vs informal "je" for Dutch -->\n'
        )
        print('  Created src/i18n/glossary.md (stub)')

        # Write empty brand-voice stub
        (target / 'src/i18n/brand-voice.md').write_text(
            f'# Brand Voice — Translation Guide\n\n'
            f'## Archetype & Tone\n\n'
            f'- Archetype: {website_cfg.get("archetype", "unknown")}\n\n'
            f'## Few-Shot Anchors\n\n'
            f'<!-- Add 2-3 golden EN → target locale translation pairs -->\n'
        )
        print('  Created src/i18n/brand-voice.md (stub)')

        # Write empty translation ledger
        ledger = {
            'schemaVersion': 1,
            'defaultLocale': default_locale,
            'targetLocales': [l for l in locales if l != default_locale],
            'entries': {},
        }
        (target / '.i18n/translation-ledger.json').write_text(
            json.dumps(ledger, indent=2) + '\n'
        )
        print('  Created .i18n/translation-ledger.json')

        # Write pickLocale.ts stub
        locale_union = ' | '.join(f"'{l}'" for l in locales)
        (target / 'src/i18n/pickLocale.ts').write_text(
            f'/** Locale-aware field accessor for Localized<T> objects. */\n\n'
            f'export type SupportedLocale = {locale_union};\n\n'
            f'export type Localized<T> = {{ {"; ".join(f"{l}: T" if l == default_locale else f"{l}?: T" for l in locales)} }};\n\n'
            f'export const defaultLocale: SupportedLocale = \'{default_locale}\';\n\n'
            f'export function pickLocale<T>(field: Localized<T>, lang: SupportedLocale): T {{\n'
            f'  return field[lang] ?? field[defaultLocale];\n'
            f'}}\n'
        )
        print('  Created src/i18n/pickLocale.ts')

        print(f'  i18n scaffold: {len(locales)} locales, routing={routing}, workflow={translation_workflow}')

    print(f"\nScaffold complete at {target}")
    print(f"Next steps:")
    print(f"  1. cd {target} && npm install")
    print(f"  2. Claude generates creative code (Phase 2, Step 2)")
    print(f"  3. npm run dev to verify")


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Scaffold an Astro website from a brand charter',
    )
    parser.add_argument(
        '--slug', required=True,
        help='Client slug (e.g., dukestrategies)',
    )
    parser.add_argument(
        '--plugin-slug',
        help=(
            'Plugin directory slug under clients/ (kebab-case, e.g. '
            'duke-strategies). Defaults: charter.meta.pluginSlug, then '
            'auto-detection from existing clients/<candidate>/<candidate>-plugin/, '
            'then slug.replace("_","-").'
        ),
    )
    parser.add_argument(
        '--charter', required=True,
        help='Path to charter.json (relative to org root)',
    )
    parser.add_argument(
        '--target-dir',
        help='Target directory (default: clients/<plugin-slug>/<plugin-slug>-website)',
    )
    parser.add_argument(
        '--org-root', default='.',
        help='Path to stromy-org root (default: current directory)',
    )
    scaffold(parser.parse_args())


if __name__ == '__main__':
    main()
