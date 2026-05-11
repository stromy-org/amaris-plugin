"""
build-brand-book.py — Brand book PDF scaffold (14-16 pages)

Generates a branded PDF using reportlab with brand colors, fonts, and motif.
The brand-builder skill populates the BRAND config during Phase 6.

USAGE (from client-data/clients/<slug>/_build/):
    1. Copy this file to the _build directory
    2. Set BRAND config dict with Phase 1-5 outputs
    3. Set OUTPUT_DIR env var to target path (e.g., client-data/clients/<slug>/_build/)
    4. python build-brand-book.py

REQUIRES: reportlab — install with `pip install reportlab` or add to pyproject.toml
NOTE: The brand-builder skill prefers HTML-first brand books. This PDF scaffold
is an optional fallback for when a standalone PDF is specifically needed.
"""

import os
from pathlib import Path

from reportlab.lib.pagesizes import A4  # noqa: E402
from reportlab.lib.colors import HexColor  # noqa: E402
from reportlab.pdfgen import canvas  # noqa: E402

# Output directory — set via OUTPUT_DIR env var or defaults to current directory
OUTPUT_DIR = Path(os.environ.get("OUTPUT_DIR", str(Path(__file__).parent)))


def ensure_output_dir() -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    return OUTPUT_DIR

# ============================================================
# BRAND CONFIG — populate from Phase 1-5 outputs
# ============================================================
BRAND = {
    "name": "BRANDNAME",
    "tagline": "Your tagline here",
    "domain": "example.com",
    "version": "1.0",
    "date": "March 2025",
    # Brand essence (Phase 1)
    "essence": "BRANDNAME delivers strategic advisory so ambitious organizations can navigate complexity with confidence.",
    "positioning": "For mid-market enterprises seeking transformation, BRANDNAME is the advisory partner that combines analytical rigor with practical execution.",
    "personality": ["Precise", "Authoritative", "Resourceful", "Pragmatic", "Incisive"],
    "voice": "Write like a senior partner briefing a board: conclusions first, evidence second, jargon never.",
    "voice_rules": [
        "Lead with the answer, then support with evidence",
        "Short sentences — never more than 20 words",
        "Numbers over adjectives — '23 clusters' not 'many groups'",
        "Active voice only — 'We analyzed' not 'An analysis was conducted'",
    ],
    "voice_dos": [
        ("We identified 3 critical gaps in your data pipeline.", "Our innovative team leveraged cutting-edge methodologies to assess opportunities."),
        ("Revenue grew 23% after the process redesign.", "Significant improvements were observed across multiple business dimensions."),
        ("This won't work. Here's what will.", "While challenges exist, there are also exciting possibilities to explore."),
    ],
    # Colors (Phase 2) — use hex strings
    "colors": {
        "dark": "#0B0B0B",
        "brand": "#2E5090",
        "accent": "#E67E22",
        "brand_light": "#5B9BD5",
        "n800": "#1F2937",
        "n600": "#6B7280",
        "n500": "#9CA3AF",
        "n200": "#E5E7EB",
        "n50": "#F9FAFB",
        "white": "#FAFAFA",
        "success": "#28A745",
        "warning": "#FFC107",
        "error": "#DC3545",
        "info": "#2E5090",
    },
    # Typography (Phase 2) — reportlab font mappings
    "fonts": {
        "display": "Times-Roman",
        "display_bold": "Times-Bold",
        "body": "Helvetica",
        "body_bold": "Helvetica-Bold",
        "mono": "Courier",
    },
    # Google Fonts names (for reference in the PDF)
    "google_fonts": {
        "display": "Instrument Serif",
        "body": "DM Sans",
        "mono": "IBM Plex Mono",
    },
    # Type scale (Phase 2)
    "type_scale": [
        ("Display XL", "48px / 3rem", "Hero text, cover pages"),
        ("Display LG", "36px / 2.25rem", "Report titles"),
        ("Display MD", "24px / 1.5rem", "Section titles"),
        ("Display SM", "20px / 1.25rem", "Card titles"),
        ("Heading", "18px / 1.125rem", "Content headings"),
        ("Body", "15px / 0.9375rem", "Paragraphs"),
        ("Body SM", "13px / 0.8125rem", "Captions, secondary"),
        ("Overline", "11px / 0.6875rem", "Section labels"),
        ("Micro", "10px / 0.625rem", "Legal, fine print"),
    ],
    # Motif description (Phase 2)
    "motif_desc": "Horizontal rule with terminal dot — used as section dividers, footer rules, and decorative accents at any scale.",
    # Logo variants (Phase 2) — list descriptions for the PDF
    "logo_variants": [
        ("Primary (light bg)", "Dark brand color on light/white backgrounds"),
        ("Primary (dark bg)", "White or light brand on dark backgrounds"),
        ("With tagline", "Primary lockup plus tagline beneath"),
        ("Icon mark", "Standalone icon for favicons and small formats"),
        ("Monochrome", "Single-color version for watermarks and embossing"),
    ],
    "logo_donts": [
        "Never rotate or skew the logo",
        "Never change the logo colors outside approved palette",
        "Never place the logo on busy photographic backgrounds without overlay",
        "Never scale below 16px / 12pt minimum size",
        "Never add effects (shadows, gradients, outlines) to the logo",
    ],
    # Color usage rules (Phase 2)
    "color_rules": [
        "Brand dark replaces pure black in all contexts",
        "Accent is reserved for CTAs and highlights — never as a background fill",
        f"Use {'' }neutral-50 (warm off-white) instead of pure white for large surfaces",
    ],
    # Imagery (Phase 5)
    "imagery_subjects": ["Architecture", "Textures", "Data patterns", "Urban geometry"],
    "imagery_avoids": ["Stock handshakes", "Smiling at laptops", "Generic gradients", "Low-res imagery"],
    "imagery_recipe": "Desaturate -40%, Contrast +15, Shadows -20, Brand overlay at 15% opacity (multiply)",
    # Templates (Phase 4) — list for reference page
    "templates": [
        ("Presentation Template", f"BRANDNAME-Template.pptx", "10-slide branded deck with all layout types"),
        ("Report Template", f"BRANDNAME-Report-Template.docx", "Formal report with cover, TOC, styled headings"),
        ("Letterhead", f"BRANDNAME-Letterhead.docx", "Single-page letter with branded header/footer"),
        ("Business Cards", "brandname-business-cards.html", "Print-ready visual reference (85x55mm)"),
        ("Email Signature", "brandname-email-signature.html", "Table-based, email-client compatible"),
    ],
}

C = {k: HexColor(v) for k, v in BRAND["colors"].items()}
F = BRAND["fonts"]

# ============================================================
# PAGE SETUP
# ============================================================
W, H = A4  # 595.27 x 841.89 points
ML, MR, MT, MB = 50, 50, 60, 60
CW = W - ML - MR  # content width


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def motif_line(c, x, y, w, line_color=None, dot_color=None, lw=1.5, dot_r=3):
    """Draw the brand motif (horizontal line with terminal dot) at any position."""
    lc = line_color or C["brand"]
    dc = dot_color or C["accent"]
    c.setStrokeColor(lc)
    c.setLineWidth(lw)
    c.line(x, y, x + w - dot_r * 2 - 4, y)
    c.setFillColor(dc)
    c.circle(x + w - dot_r, y, dot_r, fill=1, stroke=0)


def page_footer(c, page_num, dark=False):
    """Standard footer with motif + brand name + page number."""
    text_color = C["n500"] if dark else C["n600"]
    line_color = C["n800"] if dark else C["n200"]
    y = MB - 20
    motif_line(c, ML, y, CW, line_color=line_color, dot_color=C["brand"], lw=0.75, dot_r=2)
    c.setFont(F["body"], 7)
    c.setFillColor(text_color)
    c.drawString(ML, y - 12, f"{BRAND['name']} Brand Guidelines · v{BRAND['version']} · {BRAND['date']}")
    c.drawRightString(W - MR, y - 12, str(page_num))


def section_overline(c, text, y, color=None):
    """Uppercase tracked label for section identification."""
    c.setFont(F["body_bold"], 8)
    c.setFillColor(color or C["accent"])
    c.drawString(ML, y, text.upper())
    return y - 24


def section_title(c, text, y, color=None, size=28):
    """Large serif section heading."""
    c.setFont(F["display_bold"], size)
    c.setFillColor(color or C["dark"])
    c.drawString(ML, y, text)
    return y - size - 8


def body_text(c, text, x, y, max_width=None, size=10, color=None, font=None, leading=14):
    """Word-wrapped body text. Returns Y position after last line."""
    mw = max_width or CW
    c.setFont(font or F["body"], size)
    c.setFillColor(color or C["n600"])
    words = text.split()
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        if c.stringWidth(test, font or F["body"], size) > mw:
            c.drawString(x, y, line)
            y -= leading
            line = word
        else:
            line = test
    if line:
        c.drawString(x, y, line)
        y -= leading
    return y


def swatch(c, x, y, w, h, color, name, hex_val):
    """Color swatch with rounded rect, name label, and hex value."""
    c.setFillColor(color)
    c.roundRect(x, y, w, h, 4, fill=1, stroke=0)
    c.setFont(F["body_bold"], 8)
    c.setFillColor(C["dark"])
    c.drawString(x, y - 14, name)
    c.setFont(F["mono"], 7)
    c.setFillColor(C["n500"])
    c.drawString(x, y - 24, hex_val)


def tinted_box(c, x, y, w, h, fill_color, border_color, text, text_color=None):
    """Tinted box with left border and text."""
    c.setFillColor(fill_color)
    c.roundRect(x, y, w, h, 3, fill=1, stroke=0)
    c.setFillColor(border_color)
    c.rect(x, y, 3, h, fill=1, stroke=0)
    tc = text_color or C["dark"]
    return body_text(c, text, x + 14, y + h - 14, max_width=w - 24, size=9, color=tc, leading=12)


# ============================================================
# PAGES
# ============================================================

def page_cover(c):
    """Page 1: Cover"""
    # Dark background
    c.setFillColor(C["dark"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # Brand accent bar
    c.setFillColor(C["brand"])
    c.rect(0, H - 6, W, 6, fill=1, stroke=0)
    # Logo / brand name
    c.setFont(F["display_bold"], 42)
    c.setFillColor(C["white"])
    c.drawCentredString(W / 2, H / 2 + 40, BRAND["name"])
    # Motif
    motif_line(c, W / 2 - 60, H / 2 + 10, 120, line_color=C["brand_light"], dot_color=C["accent"])
    # Tagline
    c.setFont(F["body"], 11)
    c.setFillColor(C["n500"])
    c.drawCentredString(W / 2, H / 2 - 20, BRAND["tagline"].upper())
    # Subtitle
    c.setFont(F["body"], 14)
    c.setFillColor(C["brand_light"])
    c.drawCentredString(W / 2, H / 2 - 60, "Brand Guidelines")
    # Version + date
    c.setFont(F["mono"], 8)
    c.setFillColor(C["n600"])
    c.drawCentredString(W / 2, MB + 40, f"v{BRAND['version']} · {BRAND['date']}")
    # Domain
    c.setFont(F["mono"], 9)
    c.setFillColor(C["accent"])
    c.drawCentredString(W / 2, MB + 20, BRAND["domain"])


def page_toc(c):
    """Page 2: Table of Contents"""
    y = H - MT
    y = section_overline(c, "Contents", y)
    y = section_title(c, "Table of Contents", y, size=24)
    y -= 10
    sections = [
        ("01", "Brand Foundation", "Essence, positioning, personality, voice", "3"),
        ("02", "Logo System", "Primary lockups, variants, usage rules", "4-5"),
        ("03", "Color Palette", "Primary, scales, semantic, combinations", "6-7"),
        ("04", "Typography", "Type stack, scale, pairing rules", "8-9"),
        ("05", "Brand Motif", "System, variants, implementation", "10"),
        ("06", "Voice & Tone", "Writing principles, do/don't examples", "11"),
        ("07", "Imagery Direction", "Subjects, avoids, processing, sourcing", "12-13"),
        ("08", "Templates & Tokens", "Template reference, CSS design tokens", "14-15"),
    ]
    for num, title, desc, pg in sections:
        c.setFont(F["display"], 18)
        c.setFillColor(C["brand_light"])
        c.drawString(ML, y, num)
        c.setFont(F["display"], 12)
        c.setFillColor(C["dark"])
        c.drawString(ML + 40, y, title)
        c.setFont(F["body"], 8)
        c.setFillColor(C["n600"])
        c.drawString(ML + 40, y - 14, desc)
        c.setFont(F["mono"], 9)
        c.setFillColor(C["n500"])
        c.drawRightString(W - MR, y, pg)
        # Separator
        c.setStrokeColor(C["n200"])
        c.setLineWidth(0.5)
        c.line(ML, y - 24, W - MR, y - 24)
        y -= 44
    page_footer(c, 2)


def page_foundation(c):
    """Page 3: Brand Foundation"""
    y = H - MT
    y = section_overline(c, "Brand Foundation", y)
    y = section_title(c, "Who We Are", y, size=24)
    y -= 4
    # Essence
    c.setFont(F["body"], 11)
    c.setFillColor(C["dark"])
    y = body_text(c, BRAND["essence"], ML, y, size=11, color=C["dark"], leading=16)
    y -= 12
    # Positioning box
    y = tinted_box(c, ML, y - 60, CW, 60, HexColor("#EBF0F7"), C["brand"], BRAND["positioning"])
    y -= 20
    # Personality traits
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "BRAND PERSONALITY")
    y -= 18
    x = ML
    for trait in BRAND["personality"]:
        tw = c.stringWidth(trait, F["body"], 9) + 20
        c.setFillColor(HexColor("#EBF0F7"))
        c.roundRect(x, y - 4, tw, 20, 10, fill=1, stroke=0)
        c.setFont(F["body"], 9)
        c.setFillColor(C["brand"])
        c.drawString(x + 10, y, trait)
        x += tw + 8
    y -= 36
    # Tagline
    c.setFont(F["display_bold"], 18)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, f'"{BRAND["tagline"]}"')
    y -= 28
    # Voice
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "VOICE")
    y -= 14
    y = body_text(c, BRAND["voice"], ML, y, size=9, color=C["n600"], leading=12)
    page_footer(c, 3)


def page_logo_primary(c):
    """Page 4: Logo — Primary Lockups"""
    y = H - MT
    y = section_overline(c, "Logo System", y)
    y = section_title(c, "Primary Lockups", y, size=24)
    y -= 10
    # 2x2 grid showing logo on different backgrounds
    box_w = (CW - 16) / 2
    box_h = 120
    backgrounds = [
        (C["dark"], C["white"], "On dark"),
        (C["white"], C["dark"], "On light"),
        (C["brand"], C["white"], "On brand"),
        (C["n50"], C["n600"], "Monochrome"),
    ]
    for i, (bg, fg, label) in enumerate(backgrounds):
        bx = ML + (i % 2) * (box_w + 16)
        by = y - (i // 2) * (box_h + 30)
        c.setFillColor(bg)
        c.roundRect(bx, by - box_h, box_w, box_h, 6, fill=1, stroke=0)
        # Brand name as logo placeholder
        c.setFont(F["display_bold"], 24)
        c.setFillColor(fg)
        c.drawCentredString(bx + box_w / 2, by - box_h / 2 - 8, BRAND["name"])
        # Label
        c.setFont(F["body"], 8)
        c.setFillColor(C["n500"])
        c.drawString(bx, by - box_h - 14, label)
    y -= 2 * (box_h + 30) + 20
    # Variants list
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "LOGO VARIANTS")
    y -= 16
    for name, desc in BRAND["logo_variants"]:
        c.setFont(F["body_bold"], 9)
        c.setFillColor(C["dark"])
        c.drawString(ML + 10, y, name)
        c.setFont(F["body"], 8)
        c.setFillColor(C["n600"])
        c.drawString(ML + 160, y, desc)
        y -= 14
    page_footer(c, 4)


def page_logo_rules(c):
    """Page 5: Logo — Usage Rules"""
    y = H - MT
    y = section_overline(c, "Logo System", y)
    y = section_title(c, "Usage Rules", y, size=24)
    y -= 10
    # Clear space
    y = body_text(c, "Minimum clear space around the logo equals the height of the icon mark. Never crowd the logo with other elements.", ML, y, size=10, color=C["dark"], leading=14)
    y -= 16
    # Don'ts
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "DON'TS")
    y -= 16
    for dont in BRAND["logo_donts"]:
        c.setFillColor(C["accent"])
        c.circle(ML + 4, y + 3, 2.5, fill=1, stroke=0)
        c.setFont(F["body"], 9)
        c.setFillColor(C["n600"])
        c.drawString(ML + 16, y, dont)
        y -= 16
    page_footer(c, 5)


def page_colors(c):
    """Page 6: Color Palette"""
    y = H - MT
    y = section_overline(c, "Color Palette", y)
    y = section_title(c, "Primary Colors", y, size=24)
    y -= 10
    # Primary swatches (large)
    sw = (CW - 32) / 3
    primary = [
        ("Dark", BRAND["colors"]["dark"]),
        ("Brand", BRAND["colors"]["brand"]),
        ("Accent", BRAND["colors"]["accent"]),
    ]
    for i, (name, hex_val) in enumerate(primary):
        swatch(c, ML + i * (sw + 16), y - 70, sw, 70, HexColor(hex_val), name, hex_val)
    y -= 110
    # Color rules
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "COLOR USAGE RULES")
    y -= 16
    for rule in BRAND["color_rules"]:
        tinted_box(c, ML, y - 28, CW, 28, HexColor("#F0FAF0"), C["success"], rule)
        y -= 40
    page_footer(c, 6)


def page_color_combos(c):
    """Page 7: Color Combinations + Semantic"""
    y = H - MT
    y = section_overline(c, "Color Palette", y)
    y = section_title(c, "Combinations & Semantic", y, size=24)
    y -= 10
    # Approved combos
    combos = [
        (C["dark"], C["white"], C["brand"], "Dark bg + white text + brand accent"),
        (C["white"], C["dark"], C["brand"], "Light bg + dark text + brand headers"),
        (C["brand"], C["white"], C["accent"], "Brand bg + white text + accent highlights"),
        (C["n50"], C["dark"], C["accent"], "Neutral bg + dark text + accent CTAs"),
    ]
    box_w = (CW - 16) / 2
    for i, (bg, fg, acc, label) in enumerate(combos):
        bx = ML + (i % 2) * (box_w + 16)
        by = y - (i // 2) * 80
        c.setFillColor(bg)
        c.roundRect(bx, by - 50, box_w, 50, 4, fill=1, stroke=0)
        c.setFont(F["display_bold"], 14)
        c.setFillColor(fg)
        c.drawString(bx + 12, by - 22, BRAND["name"])
        c.setFont(F["body"], 8)
        c.setFillColor(acc)
        c.drawString(bx + 12, by - 36, BRAND["tagline"])
        c.setFont(F["body"], 7)
        c.setFillColor(C["n500"])
        c.drawString(bx, by - 64, label)
    y -= 180
    # Semantic colors
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "SEMANTIC COLORS")
    y -= 20
    semantics = [("Success", "success"), ("Warning", "warning"), ("Error", "error"), ("Info", "info")]
    for i, (name, key) in enumerate(semantics):
        swatch(c, ML + i * 120, y - 30, 40, 30, C[key], name, BRAND["colors"][key])
    page_footer(c, 7)


def page_typography_scale(c):
    """Page 8: Typography — Stack + Scale"""
    y = H - MT
    y = section_overline(c, "Typography", y)
    y = section_title(c, "Type Stack & Scale", y, size=24)
    y -= 10
    # Type stack cards
    gf = BRAND["google_fonts"]
    stack = [
        ("Display", gf["display"], "Headlines, titles, hero sections", F["display"]),
        ("Body", gf["body"], "Paragraphs, UI, everything else", F["body"]),
        ("Mono", gf["mono"], "Data, code, metadata", F["mono"]),
    ]
    card_w = (CW - 24) / 3
    for i, (role, font_name, usage, rl_font) in enumerate(stack):
        cx = ML + i * (card_w + 12)
        c.setFillColor(C["n50"])
        c.roundRect(cx, y - 70, card_w, 70, 4, fill=1, stroke=0)
        c.setFont(rl_font, 14)
        c.setFillColor(C["dark"])
        c.drawString(cx + 10, y - 20, font_name)
        c.setFont(F["body_bold"], 7)
        c.setFillColor(C["brand"])
        c.drawString(cx + 10, y - 36, role.upper())
        c.setFont(F["body"], 7)
        c.setFillColor(C["n600"])
        c.drawString(cx + 10, y - 50, usage)
    y -= 100
    # Type scale
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "TYPE SCALE")
    y -= 16
    for name, size_str, usage in BRAND["type_scale"]:
        c.setFont(F["mono"], 7)
        c.setFillColor(C["n500"])
        c.drawString(ML, y, size_str)
        c.setFont(F["body_bold"], 8)
        c.setFillColor(C["dark"])
        c.drawString(ML + 120, y, name)
        c.setFont(F["body"], 7)
        c.setFillColor(C["n600"])
        c.drawString(ML + 220, y, usage)
        y -= 14
    page_footer(c, 8)


def page_typography_rules(c):
    """Page 9: Typography — Pairing Rules"""
    y = H - MT
    y = section_overline(c, "Typography", y)
    y = section_title(c, "Pairing Rules & Hierarchy", y, size=24)
    y -= 10
    # Weight restrictions
    weights = [("Regular (400)", "Body text, descriptions"), ("Medium (500)", "Headings, UI labels"), ("Bold (700)", "Emphasis, callouts (use sparingly)")]
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "WEIGHT RESTRICTIONS")
    y -= 16
    for weight, usage in weights:
        c.setFont(F["body_bold"], 9)
        c.setFillColor(C["dark"])
        c.drawString(ML + 10, y, weight)
        c.setFont(F["body"], 8)
        c.setFillColor(C["n600"])
        c.drawString(ML + 140, y, usage)
        y -= 16
    y -= 16
    # Hierarchy demo
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "HIERARCHY DEMONSTRATION")
    y -= 20
    c.setFont(F["display_bold"], 20)
    c.setFillColor(C["dark"])
    c.drawString(ML + 10, y, "Section Title (Display Bold)")
    y -= 26
    c.setFont(F["display"], 14)
    c.setFillColor(C["brand"])
    c.drawString(ML + 10, y, "Subsection Heading (Display Regular)")
    y -= 20
    c.setFont(F["body"], 10)
    c.setFillColor(C["n600"])
    y = body_text(c, "Body text in the default reading font. Paragraphs are set at 15px with 1.5 line height for comfortable reading. Keep body copy clean and scannable.", ML + 10, y, max_width=CW - 20, size=10, leading=14)
    y -= 8
    c.setFont(F["mono"], 8)
    c.setFillColor(C["n500"])
    c.drawString(ML + 10, y, "metadata · mono · timestamps · data labels")
    page_footer(c, 9)


def page_motif(c):
    """Page 10: Brand Motif System"""
    # Brand-color background
    c.setFillColor(C["brand"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    y = H - MT
    c.setFont(F["body_bold"], 8)
    c.setFillColor(C["white"])
    c.drawString(ML, y, "BRAND MOTIF")
    y -= 28
    c.setFont(F["display_bold"], 28)
    c.setFillColor(C["white"])
    c.drawString(ML, y, "The Motif System")
    y -= 20
    # Motif demos at different scales
    motif_line(c, ML, y, CW, line_color=C["white"], dot_color=C["accent"])
    y -= 30
    c.setFont(F["body"], 10)
    c.setFillColor(HexColor("#FFFFFFCC"))
    y = body_text(c, BRAND["motif_desc"], ML, y, size=10, color=HexColor("#FFFFFFCC"), leading=14)
    y -= 20
    # Variants
    variants = [
        ("Full-width", f"{CW}pt", "Section dividers, page headers"),
        ("Short", "120pt", "Section labels, subsection breaks"),
        ("Minimal", "60pt", "Email signatures, card accents"),
    ]
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["white"])
    c.drawString(ML, y, "VARIANTS")
    y -= 20
    for name, width, context in variants:
        c.setFont(F["body_bold"], 9)
        c.setFillColor(C["white"])
        c.drawString(ML, y, name)
        c.setFont(F["body"], 8)
        c.setFillColor(HexColor("#FFFFFFAA"))
        c.drawString(ML + 100, y, f"{width} — {context}")
        y -= 10
        w = float(width.replace("pt", ""))
        if w > CW:
            w = CW
        motif_line(c, ML, y, w, line_color=HexColor("#FFFFFF88"), dot_color=C["accent"])
        y -= 20
    page_footer(c, 10, dark=True)


def page_voice(c):
    """Page 11: Voice & Tone"""
    y = H - MT
    y = section_overline(c, "Voice & Tone", y)
    y = section_title(c, "How We Write", y, size=24)
    y -= 4
    # Voice rules
    for rule in BRAND["voice_rules"]:
        c.setFillColor(C["brand"])
        c.circle(ML + 4, y + 3, 2.5, fill=1, stroke=0)
        c.setFont(F["body"], 9)
        c.setFillColor(C["dark"])
        c.drawString(ML + 16, y, rule)
        y -= 16
    y -= 12
    # Do/Don't pairs
    pair_w = (CW - 16) / 2
    for do_text, dont_text in BRAND["voice_dos"]:
        # DO box
        tinted_box(c, ML, y - 40, pair_w, 40, HexColor("#F0FAF0"), C["success"], f"DO: {do_text}")
        # DON'T box
        tinted_box(c, ML + pair_w + 16, y - 40, pair_w, 40, HexColor("#FEF3F2"), C["error"], f"DON'T: {dont_text}")
        y -= 56
    page_footer(c, 11)


def page_imagery(c):
    """Page 12: Imagery Direction"""
    y = H - MT
    y = section_overline(c, "Imagery", y)
    y = section_title(c, "Visual Language", y, size=24)
    y -= 10
    # Subjects
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "SUBJECTS")
    y -= 16
    x = ML
    for subj in BRAND["imagery_subjects"]:
        tw = c.stringWidth(subj, F["body"], 8) + 16
        c.setFillColor(HexColor("#F0FAF0"))
        c.roundRect(x, y - 4, tw, 18, 9, fill=1, stroke=0)
        c.setFont(F["body"], 8)
        c.setFillColor(C["success"])
        c.drawString(x + 8, y, subj)
        x += tw + 6
    y -= 30
    # Avoids
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "AVOID")
    y -= 16
    x = ML
    for avoid in BRAND["imagery_avoids"]:
        tw = c.stringWidth(avoid, F["body"], 8) + 16
        c.setFillColor(HexColor("#FEF3F2"))
        c.roundRect(x, y - 4, tw, 18, 9, fill=1, stroke=0)
        c.setFont(F["body"], 8)
        c.setFillColor(C["error"])
        c.drawString(x + 8, y, avoid)
        x += tw + 6
    y -= 30
    # Processing recipe
    c.setFont(F["body_bold"], 9)
    c.setFillColor(C["dark"])
    c.drawString(ML, y, "PHOTO PROCESSING RECIPE")
    y -= 16
    c.setFillColor(C["n50"])
    c.roundRect(ML, y - 40, CW, 40, 4, fill=1, stroke=0)
    c.setFont(F["mono"], 8)
    c.setFillColor(C["n600"])
    c.drawString(ML + 10, y - 14, BRAND["imagery_recipe"])
    page_footer(c, 12)


def page_templates(c):
    """Page 14: Templates Reference"""
    y = H - MT
    y = section_overline(c, "Templates", y)
    y = section_title(c, "Template Reference", y, size=24)
    y -= 10
    for name, filename, desc in BRAND["templates"]:
        c.setFillColor(C["n50"])
        c.roundRect(ML, y - 50, CW, 50, 4, fill=1, stroke=0)
        c.setFont(F["body_bold"], 10)
        c.setFillColor(C["dark"])
        c.drawString(ML + 12, y - 16, name)
        c.setFont(F["mono"], 7)
        c.setFillColor(C["brand"])
        c.drawString(ML + 12, y - 30, filename)
        c.setFont(F["body"], 8)
        c.setFillColor(C["n600"])
        c.drawString(ML + 12, y - 42, desc)
        y -= 64
    page_footer(c, 14)


def page_tokens(c):
    """Page 15: Design Tokens (dark page)"""
    c.setFillColor(C["dark"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    y = H - MT
    c.setFont(F["body_bold"], 8)
    c.setFillColor(C["accent"])
    c.drawString(ML, y, "DESIGN TOKENS")
    y -= 24
    c.setFont(F["display_bold"], 24)
    c.setFillColor(C["white"])
    c.drawString(ML, y, "CSS Custom Properties")
    y -= 20
    # Sample tokens
    tokens = [
        ("/* Colors */", ""),
        ("--brand-dark:", BRAND["colors"]["dark"]),
        ("--brand-primary:", BRAND["colors"]["brand"]),
        ("--brand-accent:", BRAND["colors"]["accent"]),
        ("", ""),
        ("/* Typography */", ""),
        (f"--font-display:", f"'{BRAND['google_fonts']['display']}', Georgia, serif"),
        (f"--font-body:", f"'{BRAND['google_fonts']['body']}', sans-serif"),
        (f"--font-mono:", f"'{BRAND['google_fonts']['mono']}', monospace"),
        ("", ""),
        ("/* Spacing */", ""),
        ("--space-4:", "1rem"),
        ("--space-8:", "2rem"),
        ("--space-16:", "4rem"),
        ("", ""),
        ("/* Motif */", ""),
        ("--motif-line-color:", "var(--brand-primary)"),
        ("--motif-dot-color:", "var(--brand-accent)"),
        ("--motif-line-weight:", "1.5px"),
        ("--motif-dot-size:", "5px"),
    ]
    for prop, val in tokens:
        if not prop and not val:
            y -= 8
            continue
        if prop.startswith("/*"):
            c.setFont(F["mono"], 8)
            c.setFillColor(C["n500"])
            c.drawString(ML + 10, y, prop)
        else:
            c.setFont(F["mono"], 8)
            c.setFillColor(C["brand_light"])
            c.drawString(ML + 10, y, prop)
            c.setFillColor(C["accent"])
            c.drawString(ML + 200, y, val)
        y -= 14
    page_footer(c, 15, dark=True)


def page_back_cover(c):
    """Page 16: Back Cover"""
    c.setFillColor(C["dark"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # Brand accent bar
    c.setFillColor(C["brand"])
    c.rect(0, H - 6, W, 6, fill=1, stroke=0)
    # Logo
    c.setFont(F["display_bold"], 36)
    c.setFillColor(C["white"])
    c.drawCentredString(W / 2, H / 2 + 30, BRAND["name"])
    # Motif
    motif_line(c, W / 2 - 50, H / 2 + 6, 100, line_color=C["brand_light"], dot_color=C["accent"])
    # Tagline
    c.setFont(F["body"], 10)
    c.setFillColor(C["n500"])
    c.drawCentredString(W / 2, H / 2 - 20, BRAND["tagline"])
    # Domain
    c.setFont(F["mono"], 9)
    c.setFillColor(C["accent"])
    c.drawCentredString(W / 2, MB + 60, BRAND["domain"])
    # Version + confidential
    c.setFont(F["mono"], 7)
    c.setFillColor(C["n600"])
    c.drawCentredString(W / 2, MB + 30, f"v{BRAND['version']} · {BRAND['date']} · Confidential")


# ============================================================
# BUILD
# ============================================================

def build():
    output_dir = ensure_output_dir(__file__)
    output_path = str(Path(output_dir) / f"{BRAND['name']}-Brand-Book.pdf")

    pdf = canvas.Canvas(output_path, pagesize=A4)
    pdf.setTitle(f"{BRAND['name']} Brand Guidelines")
    pdf.setAuthor(BRAND["name"])

    pages = [
        page_cover,
        page_toc,
        page_foundation,
        page_logo_primary,
        page_logo_rules,
        page_colors,
        page_color_combos,
        page_typography_scale,
        page_typography_rules,
        page_motif,
        page_voice,
        page_imagery,
        page_templates,
        page_tokens,
        page_back_cover,
    ]

    for i, page_fn in enumerate(pages):
        print(f"  page {i + 1}/{len(pages)}: {page_fn.__doc__ or page_fn.__name__}")
        page_fn(pdf)
        pdf.showPage()

    pdf.save()
    print(f"\nDone: {output_path}")


if __name__ == "__main__":
    build()
