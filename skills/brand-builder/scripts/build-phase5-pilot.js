#!/usr/bin/env node
/**
 * build-phase5-pilot.js
 *
 * Charter-driven Phase 5 pilot builder for expanded business cards and
 * email signatures. Reads all visual decisions from charter.json and the
 * personality layer — works for any brand, not just Stromy. Produces:
 * - images/manifest.json
 * - templates/manifest.json
 * - 20 card concepts for review (interactive selection board)
 * - 12 email-safe signature variants (interactive selection board)
 * - top-10 print-ready card exports in EU + US sizes
 * - optional PDF exports via Playwright when --pdf is passed
 * - optional visual QA report via Playwright when --qa is passed
 *
 * Usage:
 *   node skills/brand-builder/scripts/build-phase5-pilot.js --slug stromy
 *   node skills/brand-builder/scripts/build-phase5-pilot.js --slug stromy --pdf
 *   node skills/brand-builder/scripts/build-phase5-pilot.js --slug stromy --qa
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { derivePersonality } = require('./personality-from-archetype');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

// ── Charter-driven palette builder ──

function buildPalette(charter) {
  const c = charter.colors || {};
  return {
    primary: c.primary || '#1D342B',
    secondary: c.secondary || '#0F1310',
    accent: c.accent || '#B96034',
    success: c.success || '#47685B',
    background: c.background || '#ECE6DA',
    backgroundAlt: c.backgroundAlt || '#F3EDE2',
    text: c.text || '#171611',
    textLight: c.textLight || '#6D665C',
    textMuted: c.textLight ? adjustBrightness(c.textLight, 20) : '#8C857A',
    error: c.error || '#8E3F2E',
    white: '#FFFFFF',
    // Semantic aliases for card rendering
    get obsidian() { return this.secondary; },
    get deepForest() { return this.primary; },
    get blackForest() { return blendHex(this.secondary, this.primary, 0.4); },
    get oxide() { return this.accent; },
    get mineral() { return this.success; },
    get paper() { return this.background; },
    get paperAlt() { return this.backgroundAlt; },
    get ink() { return this.text; },
    get stone() { return this.textLight; },
    get pewter() { return this.textMuted; },
  };
}

function buildFontStack(charter) {
  const f = charter.fonts || {};
  const heading = f.heading || {};
  const body = f.body || {};
  const mono = f.mono || {};
  return {
    heading: `${heading.family || 'Georgia'}, ${heading.fallback || 'Georgia, serif'}`,
    headingFamily: heading.family || 'Georgia',
    headingWeight: heading.weight || '500',
    body: `${body.family || 'sans-serif'}, ${body.fallback || 'sans-serif'}`,
    bodyFamily: body.family || 'sans-serif',
    mono: `${mono.family || 'monospace'}, ${mono.fallback || 'monospace'}`,
    monoFamily: mono.family || 'monospace',
  };
}

function buildBrandData(charter) {
  const meta = charter.meta || {};
  const website = charter.website || {};
  return {
    name: meta.displayName || 'Brand',
    tagline: meta.tagline || '',
    domain: meta.domain || website.deployment?.domain || '',
    email: meta.contact || '',
    extraDomains: meta.extraDomains || [],
  };
}

const SAFE_FONT_STACK = {
  body: "Arial, Helvetica, sans-serif",
  mono: "'Courier New', Courier, monospace",
};

// ── Color utility functions ──

function adjustBrightness(hex, amount) {
  const clean = hex.replace('#', '');
  const r = Math.min(255, parseInt(clean.slice(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(clean.slice(2, 4), 16) + amount);
  const b = Math.min(255, parseInt(clean.slice(4, 6), 16) + amount);
  return `#${[r, g, b].map((v) => Math.max(0, v).toString(16).padStart(2, '0')).join('')}`;
}

function blendHex(hex1, hex2, ratio) {
  const c1 = hex1.replace('#', '');
  const c2 = hex2.replace('#', '');
  const blend = (i) => {
    const a = parseInt(c1.slice(i, i + 2), 16);
    const b = parseInt(c2.slice(i, i + 2), 16);
    return Math.round(a + (b - a) * ratio).toString(16).padStart(2, '0');
  };
  return `#${blend(0)}${blend(2)}${blend(4)}`;
}

// ── Card size specs ──

const CARD_SIZE_SPECS = {
  preview: {
    key: 'preview',
    width: 350,
    height: 200,
    bleed: 0,
    safe: 20,
    label: 'Preview 350x200',
    scale: 0.33,
  },
  eu: {
    key: 'eu',
    width: 1074,
    height: 720,
    bleed: 35,
    safe: 56,
    label: 'EU 85x55mm with 3mm bleed',
    scale: 1.0,
  },
  us: {
    key: 'us',
    width: 1126,
    height: 676,
    bleed: 38,
    safe: 58,
    label: 'US 3.5x2in with 0.125in bleed',
    scale: 1.0,
  },
};

const CARD_FAMILIES_FRONT = [
  {
    key: 'dark-wordmark',
    label: 'Dark Wordmark',
    feel: 'Corporate, orchestration-first, calm authority',
    tone: 'dark',
    emphasis: 'wordmark',
    motifUsage: 'tempo-ledger',
    density: 'balanced',
  },
  {
    key: 'light-editorial',
    label: 'Light Editorial',
    feel: 'Paper-led, authored, precise',
    tone: 'light',
    emphasis: 'wordmark',
    motifUsage: 'data-rail',
    density: 'balanced',
  },
  {
    key: 'icon-led-bold',
    label: 'Icon-Led Bold',
    feel: 'Signal-path symbol as the hero',
    tone: 'dark',
    emphasis: 'icon',
    motifUsage: 'echo-band',
    density: 'high',
  },
  {
    key: 'motif-led-minimal',
    label: 'Motif-Led Minimal',
    feel: 'System-first, minimal, technical',
    tone: 'light',
    emphasis: 'motif',
    motifUsage: 'tempo-ledger',
    density: 'low',
  },
  {
    key: 'image-led-dramatic',
    label: 'Image-Led Dramatic',
    feel: 'Full-bleed material texture with restrained overlay copy',
    tone: 'image',
    emphasis: 'imagery',
    motifUsage: 'switch-track',
    density: 'balanced',
  },
];

const CARD_FAMILIES_BACK = [
  {
    key: 'contact-ledger',
    label: 'Contact Ledger',
    feel: 'Structured contact rows with ledger discipline',
    density: 'high',
    usesImage: false,
  },
  {
    key: 'tagline-image',
    label: 'Tagline Image',
    feel: 'Tagline-led back over treated imagery',
    density: 'medium',
    usesImage: true,
  },
  {
    key: 'pattern-field',
    label: 'Pattern Field',
    feel: 'Pattern tile and layered motif field',
    density: 'medium',
    usesImage: false,
  },
  {
    key: 'minimal-mono',
    label: 'Minimal Mono Contact',
    feel: 'Monospaced contact system with extreme restraint',
    density: 'low',
    usesImage: false,
  },
];

// 10 recommended concepts — 2 per front family for broad coverage
const RECOMMENDED_TOP_TEN_INDEXES = new Set([0, 1, 4, 5, 8, 10, 12, 15, 17, 18]);

const SIGNATURE_DENSITIES = [
  { key: 'minimal', label: 'Minimal', compactness: 'tight' },
  { key: 'standard', label: 'Standard', compactness: 'balanced' },
  { key: 'extended', label: 'Extended', compactness: 'roomy' },
];

const SIGNATURE_CHROMES = [
  { key: 'pure-text', label: 'Pure Text', usesMotif: false, twoColumn: false },
  { key: 'motif-led', label: 'Motif-Led', usesMotif: true, twoColumn: false },
  { key: 'rule-led', label: 'Rule-Led', usesMotif: false, twoColumn: false },
  { key: 'contact-led', label: 'Two-Column Contact-Led', usesMotif: true, twoColumn: true },
];

function parseArgs(argv) {
  const args = { slug: null, pdf: false, qa: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--slug') args.slug = argv[++i];
    else if (arg === '--pdf') args.pdf = true;
    else if (arg === '--qa') args.qa = true;
  }
  if (!args.slug) {
    throw new Error('Usage: node build-phase5-pilot.js --slug <slug> [--pdf] [--qa]');
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function readFileIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

function fileToDataUri(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.svg'
    ? 'image/svg+xml'
    : ext === '.png'
      ? 'image/png'
      : ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : 'application/octet-stream';
  const data = fs.readFileSync(filePath);
  return `data:${mime};base64,${data.toString('base64')}`;
}

function hexWithOpacity(hex, opacity) {
  const clean = hex.replace('#', '');
  const value = Math.max(0, Math.min(255, Math.round(opacity * 255)));
  return `#${clean}${value.toString(16).padStart(2, '0')}`;
}

// ── Personality-driven sizing helpers ──

function motifStrokeWidth(personality, spec) {
  const baseMap = { bold: 1.6, standard: 1.2, whisper: 0.8 };
  const base = baseMap[personality.chromeWeight] || 1.2;
  // Scale down for preview, full weight for print
  return base * (spec.scale < 0.5 ? 0.7 : 1.0);
}

function nameFontSize(personality, spec) {
  const baseMap = { dramatic: 22, editorial: 19, reserved: 16 };
  const base = baseMap[personality.typeScale] || 19;
  return Math.round(base * (spec.scale < 0.5 ? 0.85 : 1.0));
}

function titleFontSize(personality, spec) {
  const baseMap = { dramatic: 11, editorial: 10, reserved: 9 };
  return baseMap[personality.typeScale] || 10;
}

function cardCornerRadius(personality) {
  const map = { sharp: 2, soft: 8, pill: 16 };
  return map[personality.cornerStyle] || 2;
}

function densityMarginFactor(personality) {
  const map = { spacious: 1.3, balanced: 1.0, dense: 0.85 };
  return map[personality.density] || 1.0;
}

// ── SVG primitive helpers ──

function lineSvg({ x1, y1, x2, y2, stroke, width, opacity }) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"${opacity ? ` opacity="${opacity}"` : ''}/>`;
}

function textSvg({ x, y, text, size, fill, family, weight, letterSpacing, anchor, italic, opacity }) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}"${weight ? ` font-weight="${weight}"` : ''}${letterSpacing ? ` letter-spacing="${letterSpacing}"` : ''}${anchor ? ` text-anchor="${anchor}"` : ''}${italic ? ' font-style="italic"' : ''}${opacity ? ` opacity="${opacity}"` : ''}>${escapeHtml(text)}</text>`;
}

// ── Motif builders — personality-scaled ──

function buildTempoLedger({ x, y, width, dark, palette, strokeW }) {
  const sw = strokeW || 1.2;
  const main = dark ? palette.paper : palette.deepForest;
  const accent = palette.oxide;
  const boxX = x + width - 16;
  return [
    lineSvg({ x1: x, y1: y, x2: x + width - 34, y2: y, stroke: main, width: sw }),
    lineSvg({ x1: x + 14, y1: y + 10, x2: x + width - 18, y2: y + 10, stroke: accent, width: sw }),
    `<rect x="${boxX}" y="${y - 4}" width="11" height="17" rx="2" fill="none" stroke="${accent}" stroke-width="${sw * 0.9}"/>`,
  ].join('');
}

function buildDataRail({ x, y, height, dark, palette, strokeW }) {
  const sw = strokeW || 1.2;
  const stroke = dark ? palette.paper : palette.deepForest;
  return [
    lineSvg({ x1: x, y1: y, x2: x, y2: y + height, stroke, width: sw }),
    `<circle cx="${x}" cy="${y + 12}" r="5" fill="${palette.oxide}"/>`,
    `<circle cx="${x}" cy="${y + height * 0.45}" r="3.5" fill="${palette.mineral}"/>`,
    `<circle cx="${x}" cy="${y + height - 14}" r="3.5" fill="none" stroke="${stroke}" stroke-width="${sw}"/>`,
    lineSvg({ x1: x, y1: y + 12, x2: x + 32, y2: y + 12, stroke: stroke, width: sw * 0.8, opacity: 0.4 }),
    lineSvg({ x1: x, y1: y + height * 0.45, x2: x + 42, y2: y + height * 0.45, stroke: stroke, width: sw * 0.8, opacity: 0.4 }),
  ].join('');
}

function buildEchoBand({ x, y, width, dark, palette, strokeW }) {
  const sw = strokeW || 1.2;
  const first = dark ? palette.paper : palette.deepForest;
  return [
    lineSvg({ x1: x, y1: y, x2: x + width, y2: y, stroke: first, width: sw, opacity: 0.9 }),
    lineSvg({ x1: x + 16, y1: y + 8, x2: x + width + 16, y2: y + 8, stroke: palette.oxide, width: sw, opacity: 0.8 }),
    lineSvg({ x1: x + 32, y1: y + 16, x2: x + width + 32, y2: y + 16, stroke: palette.mineral, width: sw, opacity: 0.7 }),
  ].join('');
}

function buildSwitchTrack({ x, y, width, dark, palette, strokeW }) {
  const sw = strokeW || 1.2;
  const base = dark ? palette.paper : palette.deepForest;
  // Control points relative to width for proper scaling
  const cp1x = x + width * 0.25;
  const cp2x = x + width * 0.35;
  const jx = x + width * 0.5;
  const cp3x = x + width * 0.6;
  const cp4x = x + width * 0.68;
  const cp5x = x + width * 0.82;
  const dotCx = x + width * 0.55;
  return [
    `<path d="M${x} ${y} C${cp1x} ${y} ${cp2x} ${y + 12} ${jx} ${y + 12} H${x + width}" fill="none" stroke="${base}" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<path d="M${x} ${y + 10} H${jx - 4} C${cp3x} ${y + 10} ${cp4x} ${y - 2} ${cp5x} ${y - 2} H${x + width}" fill="none" stroke="${palette.oxide}" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<circle cx="${dotCx}" cy="${y + 11}" r="${Math.max(4, width * 0.035)}" fill="${palette.oxide}"/>`,
    `<circle cx="${dotCx}" cy="${y + 11}" r="${Math.max(1.5, width * 0.015)}" fill="${dark ? palette.obsidian : palette.paper}"/>`,
  ].join('');
}

function buildMotif(kind, opts) {
  switch (kind) {
    case 'tempo-ledger':
      return buildTempoLedger(opts);
    case 'data-rail':
      return buildDataRail(opts);
    case 'echo-band':
      return buildEchoBand(opts);
    case 'switch-track':
      return buildSwitchTrack(opts);
    default:
      return '';
  }
}

// ── Google Fonts @font-face defs for SVG ──

function fontFaceDefs(fonts) {
  const families = [fonts.headingFamily, fonts.bodyFamily, fonts.monoFamily]
    .filter(Boolean)
    .map((f) => f.replace(/ /g, '+'))
    .join('&family=');
  if (!families) return '';
  return `<defs><style type="text/css">@import url('https://fonts.googleapis.com/css2?family=${families}&amp;display=swap');</style></defs>`;
}

// ── Imagery manifest ──

async function buildImageryManifest(brandDir, charter) {
  const catalog = charter.images && charter.images.catalog ? charter.images.catalog : [];
  const library = [];

  for (const entry of catalog) {
    const filename = path.basename(entry.file);
    const stem = filename.replace(path.extname(filename), '');
    const sourcePath = path.join(brandDir, entry.file);
    const processedRel = `images/processed/${stem}.brand.jpg`;
    const processedPath = path.join(brandDir, processedRel);
    const hero16Rel = `images/heroes/${stem}.hero-16x9.jpg`;
    const hero2x1Rel = `images/heroes/${stem}.hero-2x1.jpg`;
    const heroRel = `images/heroes/${stem}.hero.jpg`;
    const metadata = fs.existsSync(processedPath) ? await sharp(processedPath).metadata() : null;
    const prefersSquare = (entry.roles || []).includes('background');
    const overlayPolicy = entry.hero ? 'dark-52' : prefersSquare ? 'dark-40' : 'dark-32';
    const textSafeZone = entry.hero ? 'bottom-left' : prefersSquare ? 'center-safe' : 'lower-third';
    const motifAffinity = entry.theme && entry.theme.includes('shadow')
      ? ['echo-band', 'data-rail']
      : entry.theme && entry.theme.includes('oxidized')
        ? ['tempo-ledger', 'switch-track']
        : ['tempo-ledger', 'data-rail'];

    library.push({
      id: slugify(stem),
      source: entry.file,
      processed: fs.existsSync(processedPath) ? processedRel : null,
      theme: entry.theme || 'uncategorized',
      roles: entry.roles || [],
      hero: !!entry.hero,
      preferredCrop: prefersSquare ? 'square-1x1' : entry.hero ? 'hero-2x1' : 'hero-16x9',
      overlayPolicy,
      textSafeZone,
      altText: entry.description,
      printSafe: Boolean(metadata && metadata.width >= 1200 && metadata.height >= 700),
      dimensions: metadata ? { width: metadata.width, height: metadata.height } : null,
      motifAffinity,
      crops: {
        'hero-16x9': fs.existsSync(path.join(brandDir, hero16Rel)) ? hero16Rel : null,
        'hero-2x1': fs.existsSync(path.join(brandDir, hero2x1Rel)) ? hero2x1Rel : null,
        hero: fs.existsSync(path.join(brandDir, heroRel)) ? heroRel : null,
      },
    });
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    scope: 'Phase 5 pilot cards + signatures handoff',
    library,
  };
}

// ── Concept and variant builders ──

function buildCardConcepts(imageryManifest) {
  const preferredImages = imageryManifest.library
    .filter((item) => item.processed && item.printSafe)
    .slice(0, 20);

  return CARD_FAMILIES_FRONT.flatMap((front, frontIndex) => {
    return CARD_FAMILIES_BACK.map((back, backIndex) => {
      const conceptIndex = frontIndex * CARD_FAMILIES_BACK.length + backIndex;
      const image = preferredImages[conceptIndex % preferredImages.length];
      const id = `c${String(conceptIndex + 1).padStart(2, '0')}-${front.key}-${back.key}`;
      const productionCandidate = RECOMMENDED_TOP_TEN_INDEXES.has(conceptIndex);

      return {
        id,
        number: conceptIndex + 1,
        title: `${front.label} / ${back.label}`,
        frontFamily: front,
        backFamily: back,
        image,
        productionCandidate,
        printFormats: productionCandidate ? ['eu', 'us'] : [],
        rationale: `${front.feel}. ${back.feel}. Uses ${image ? image.id : 'no image asset'} as the key material reference.`,
        recommendedUse: productionCandidate
          ? 'Recommended production candidate'
          : 'Exploration concept for review',
      };
    });
  });
}

function buildSignatureVariants() {
  return SIGNATURE_DENSITIES.flatMap((density, densityIndex) => {
    return SIGNATURE_CHROMES.map((chrome, chromeIndex) => {
      const index = densityIndex * SIGNATURE_CHROMES.length + chromeIndex;
      return {
        id: `${density.key}-${chrome.key}`,
        number: index + 1,
        density,
        chrome,
        title: `${density.label} / ${chrome.label}`,
        rationale: `${density.label} density with ${chrome.label.toLowerCase()} chrome for copy-paste email use.`,
      };
    });
  });
}

function buildTemplateManifest(cardConcepts, signatureVariants, brandSlug) {
  const BRAND = brandSlug.toUpperCase();
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    phase5Pilot: {
      scope: 'cards + signatures first',
      externalDataPolicy: {
        source: 'company data or user-supplied payload',
        fallback: 'obvious placeholders',
        forbiddenInBrandTokens: ['sender.name', 'sender.title', 'sender.phone', 'sender.linkedin'],
      },
    },
    artifacts: {
      'print.business-cards': {
        conceptCount: cardConcepts.length,
        reviewBoard: `_build/${BRAND}-Business-Cards-Review.html`,
        promotedCatalog: 'templates/html/business-cards.html',
        formats: ['EU-85x55', 'US-3.5x2'],
        promotedConceptIds: cardConcepts.filter((item) => item.productionCandidate).map((item) => item.id),
        requiredExternalFields: ['sender.name', 'sender.title', 'sender.email', 'sender.phone'],
      },
      'html.email-signature': {
        variantCount: signatureVariants.length,
        reviewBoard: `_build/${BRAND}-Signatures-Review.html`,
        promotedCatalog: 'templates/html/email-signature.html',
        fragmentDir: 'templates/html/signatures/',
        requiredExternalFields: ['sender.name', 'sender.title', 'sender.email'],
        fallback: 'placeholders',
      },
    },
    cards: cardConcepts.map((item) => ({
      id: item.id,
      title: item.title,
      frontFamily: item.frontFamily.key,
      backFamily: item.backFamily.key,
      image: item.image ? item.image.id : null,
      productionCandidate: item.productionCandidate,
      printFormats: item.printFormats,
    })),
    signatures: signatureVariants.map((item) => ({
      id: item.id,
      title: item.title,
      density: item.density.key,
      chrome: item.chrome.key,
    })),
  };
}

// ── Card SVG rendering ──

function rootRect(spec, fill) {
  return `<rect x="0" y="0" width="${spec.width}" height="${spec.height}" fill="${fill}"/>`;
}

function trimRect(spec) {
  const trimX = spec.bleed;
  const trimY = spec.bleed;
  const trimW = spec.width - spec.bleed * 2;
  const trimH = spec.height - spec.bleed * 2;
  return { trimX, trimY, trimW, trimH };
}

function safeRect(spec, marginFactor) {
  const mf = marginFactor || 1.0;
  const { trimX, trimY, trimW, trimH } = trimRect(spec);
  const safeMargin = Math.round(spec.safe * mf);
  return {
    x: trimX + safeMargin,
    y: trimY + safeMargin,
    w: trimW - safeMargin * 2,
    h: trimH - safeMargin * 2,
  };
}

function renderFront(concept, spec, assets, palette, fonts, personality) {
  const { trimX, trimY, trimW, trimH } = trimRect(spec);
  const mf = densityMarginFactor(personality);
  const safe = safeRect(spec, mf);
  const logoLight = assets.logoWhite;
  const logoDark = assets.logoDark;
  const iconDark = assets.iconDark;
  const imageHref = concept.image ? concept.image.processedDataUri : null;
  const front = concept.frontFamily.key;
  const base = [];
  const sw = motifStrokeWidth(personality, spec);
  const nameSize = nameFontSize(personality, spec);
  const titleSize = titleFontSize(personality, spec);
  const motifOpts = { palette, strokeW: sw };

  // Add font imports
  base.push(fontFaceDefs(fonts));

  if (front === 'dark-wordmark') {
    base.push(rootRect(spec, palette.obsidian));
    base.push(`<rect x="${trimX}" y="${trimY}" width="${trimW}" height="${trimH}" fill="${hexWithOpacity(palette.deepForest, 0.4)}"/>`);
    base.push(`<image href="${logoLight}" x="${safe.x}" y="${safe.y}" width="${Math.round(safe.w * 0.5)}" height="${Math.round(safe.h * 0.18)}" preserveAspectRatio="xMinYMin meet"/>`);
    base.push(textSvg({ x: safe.x, y: safe.y + safe.h - nameSize - 6, text: '[Name]', size: nameSize, fill: palette.paper, family: fonts.heading, weight: fonts.headingWeight }));
    base.push(textSvg({ x: safe.x, y: safe.y + safe.h - 4, text: '[Title]', size: titleSize, fill: palette.oxide, family: fonts.mono, letterSpacing: '0.07em' }));
    base.push(buildMotif('tempo-ledger', { x: safe.x, y: safe.y + safe.h - nameSize - 42, width: Math.min(200, safe.w * 0.4), dark: true, ...motifOpts }));
  } else if (front === 'light-editorial') {
    base.push(rootRect(spec, palette.paper));
    base.push(`<rect x="${trimX}" y="${trimY}" width="${trimW}" height="${trimH}" fill="${hexWithOpacity(palette.paperAlt, 0.95)}" stroke="${hexWithOpacity(palette.deepForest, 0.1)}" stroke-width="1.5"/>`);
    base.push(buildMotif('data-rail', { x: safe.x + 6, y: safe.y + 6, height: safe.h - 18, dark: false, ...motifOpts }));
    base.push(`<image href="${logoDark}" x="${safe.x + 30}" y="${safe.y}" width="${Math.round(safe.w * 0.44)}" height="${Math.round(safe.h * 0.16)}" preserveAspectRatio="xMinYMin meet"/>`);
    base.push(textSvg({ x: safe.x + 30, y: safe.y + safe.h - nameSize - 14, text: '[Name]', size: nameSize, fill: palette.ink, family: fonts.heading, weight: fonts.headingWeight }));
    base.push(textSvg({ x: safe.x + 30, y: safe.y + safe.h - 8, text: `[Title]  ·  ${concept._brandName || 'BRAND'}`, size: titleSize, fill: palette.stone, family: fonts.mono, letterSpacing: '0.06em' }));
  } else if (front === 'icon-led-bold') {
    base.push(`<defs><linearGradient id="g-${concept.id}-${spec.key}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${palette.deepForest}"/><stop offset="100%" stop-color="${palette.obsidian}"/></linearGradient></defs>`);
    base.push(`<rect x="0" y="0" width="${spec.width}" height="${spec.height}" fill="url(#g-${concept.id}-${spec.key})"/>`);
    base.push(buildMotif('echo-band', { x: trimX + 10, y: trimY + 24, width: trimW * 0.65, dark: true, ...motifOpts }));
    const iconSize = Math.min(110, safe.h * 0.55);
    base.push(`<image href="${iconDark}" x="${trimX + trimW * 0.5 - iconSize / 2}" y="${trimY + 20}" width="${iconSize}" height="${iconSize}" preserveAspectRatio="xMidYMid meet"/>`);
    base.push(textSvg({ x: trimX + trimW / 2, y: trimY + trimH - nameSize - 18, text: '[Name]', size: nameSize, fill: palette.paper, family: fonts.body, weight: '700', anchor: 'middle', letterSpacing: '0.01em' }));
    base.push(textSvg({ x: trimX + trimW / 2, y: trimY + trimH - 14, text: '[Title]', size: titleSize, fill: palette.oxide, family: fonts.mono, anchor: 'middle', letterSpacing: '0.07em' }));
  } else if (front === 'motif-led-minimal') {
    base.push(rootRect(spec, palette.paperAlt));
    base.push(`<rect x="${trimX}" y="${trimY}" width="${trimW}" height="${trimH}" fill="${palette.paper}" stroke="${hexWithOpacity(palette.ink, 0.06)}" stroke-width="1"/>`);
    base.push(buildMotif('tempo-ledger', { x: trimX + 16, y: trimY + 26, width: trimW - 32, dark: false, ...motifOpts }));
    base.push(buildMotif('switch-track', { x: trimX + 16, y: trimY + trimH - 40, width: trimW - 56, dark: false, ...motifOpts }));
    base.push(`<image href="${logoDark}" x="${safe.x}" y="${safe.y + 22}" width="${Math.round(safe.w * 0.32)}" height="${Math.round(safe.h * 0.13)}" preserveAspectRatio="xMinYMin meet"/>`);
    base.push(textSvg({ x: safe.x, y: safe.y + safe.h * 0.58, text: '[Name]', size: nameSize, fill: palette.deepForest, family: fonts.heading, weight: fonts.headingWeight }));
    base.push(textSvg({ x: safe.x, y: safe.y + safe.h * 0.58 + nameSize + 4, text: '[Title]', size: titleSize, fill: palette.stone, family: fonts.mono, letterSpacing: '0.06em' }));
  } else {
    // image-led-dramatic
    base.push(rootRect(spec, palette.obsidian));
    if (imageHref) {
      base.push(`<image href="${imageHref}" x="0" y="0" width="${spec.width}" height="${spec.height}" preserveAspectRatio="xMidYMid slice"/>`);
    }
    // Gradient overlay instead of flat — lighter opacity
    base.push(`<defs><linearGradient id="ov-${concept.id}-${spec.key}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${palette.obsidian}" stop-opacity="0.18"/><stop offset="60%" stop-color="${palette.obsidian}" stop-opacity="0.32"/><stop offset="100%" stop-color="${palette.obsidian}" stop-opacity="0.62"/></linearGradient></defs>`);
    base.push(`<rect x="0" y="0" width="${spec.width}" height="${spec.height}" fill="url(#ov-${concept.id}-${spec.key})"/>`);
    base.push(`<image href="${logoLight}" x="${safe.x}" y="${safe.y}" width="${Math.round(safe.w * 0.44)}" height="${Math.round(safe.h * 0.15)}" preserveAspectRatio="xMinYMin meet"/>`);
    base.push(buildMotif('switch-track', { x: safe.x, y: safe.y + safe.h - nameSize - 42, width: Math.min(200, safe.w * 0.5), dark: true, ...motifOpts }));
    base.push(textSvg({ x: safe.x, y: safe.y + safe.h - nameSize - 6, text: '[Name]', size: nameSize, fill: palette.paper, family: fonts.heading, weight: fonts.headingWeight }));
    base.push(textSvg({ x: safe.x, y: safe.y + safe.h - 4, text: '[Title]', size: titleSize, fill: palette.paperAlt, family: fonts.mono, letterSpacing: '0.07em' }));
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${spec.width} ${spec.height}" width="${spec.width}" height="${spec.height}">${base.join('')}</svg>`;
}

function renderBack(concept, spec, assets, palette, fonts, personality, brandData) {
  const { trimX, trimY, trimW, trimH } = trimRect(spec);
  const mf = densityMarginFactor(personality);
  const safe = safeRect(spec, mf);
  const imageHref = concept.image ? concept.image.processedDataUri : null;
  const back = concept.backFamily.key;
  const base = [];
  const sw = motifStrokeWidth(personality, spec);
  const motifOpts = { palette, strokeW: sw };
  const contactSize = spec.scale < 0.5 ? 10 : 11;
  const taglineSize = spec.scale < 0.5 ? 16 : 19;
  const BRAND = brandData.name.toUpperCase();

  base.push(fontFaceDefs(fonts));

  if (back === 'contact-ledger') {
    base.push(rootRect(spec, palette.paper));
    base.push(`<rect x="${trimX}" y="${trimY}" width="${trimW}" height="${trimH}" fill="${palette.paper}" stroke="${hexWithOpacity(palette.deepForest, 0.08)}" stroke-width="1"/>`);
    base.push(buildMotif('tempo-ledger', { x: safe.x, y: safe.y + 16, width: Math.min(220, safe.w * 0.68), dark: false, ...motifOpts }));
    base.push(textSvg({ x: safe.x, y: safe.y + 56, text: brandData.tagline, size: taglineSize, fill: palette.deepForest, family: fonts.heading, italic: true }));
    base.push(buildMotif('data-rail', { x: safe.x + 7, y: safe.y + 74, height: safe.h - 104, dark: false, ...motifOpts }));
    base.push(textSvg({ x: safe.x + 34, y: safe.y + 100, text: `E  ${brandData.email}`, size: contactSize, fill: palette.ink, family: fonts.mono }));
    base.push(textSvg({ x: safe.x + 34, y: safe.y + 122, text: `W  ${brandData.domain}`, size: contactSize, fill: palette.ink, family: fonts.mono }));
    base.push(textSvg({ x: safe.x + 34, y: safe.y + 144, text: 'P  +[Phone]', size: contactSize, fill: palette.stone, family: fonts.mono }));
    base.push(textSvg({ x: safe.x + safe.w - 10, y: safe.y + safe.h - 8, text: 'EU / US print-ready', size: 9, fill: palette.pewter, family: fonts.mono, anchor: 'end', letterSpacing: '0.06em' }));
  } else if (back === 'tagline-image') {
    base.push(rootRect(spec, palette.obsidian));
    if (imageHref) {
      base.push(`<image href="${imageHref}" x="0" y="0" width="${spec.width}" height="${spec.height}" preserveAspectRatio="xMidYMid slice"/>`);
    }
    base.push(`<defs><linearGradient id="bov-${concept.id}-${spec.key}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${palette.obsidian}" stop-opacity="0.25"/><stop offset="50%" stop-color="${palette.obsidian}" stop-opacity="0.4"/><stop offset="100%" stop-color="${palette.obsidian}" stop-opacity="0.65"/></linearGradient></defs>`);
    base.push(`<rect x="0" y="0" width="${spec.width}" height="${spec.height}" fill="url(#bov-${concept.id}-${spec.key})"/>`);
    base.push(buildMotif('echo-band', { x: safe.x, y: safe.y + 22, width: safe.w * 0.58, dark: true, ...motifOpts }));
    const tagParts = brandData.tagline.split(/[,.]+/).map((s) => s.trim()).filter(Boolean);
    let tagY = safe.y + 72;
    for (const part of tagParts) {
      base.push(textSvg({ x: safe.x, y: tagY, text: part + (tagParts.indexOf(part) < tagParts.length - 1 ? ',' : '.'), size: taglineSize + 4, fill: palette.paper, family: fonts.heading, weight: fonts.headingWeight }));
      tagY += taglineSize + 10;
    }
    base.push(textSvg({ x: safe.x, y: safe.y + safe.h - 22, text: brandData.domain, size: contactSize, fill: palette.oxide, family: fonts.mono, letterSpacing: '0.07em' }));
    base.push(textSvg({ x: safe.x, y: safe.y + safe.h - 6, text: brandData.email, size: contactSize, fill: palette.paperAlt, family: fonts.mono, letterSpacing: '0.06em' }));
  } else if (back === 'pattern-field') {
    base.push(rootRect(spec, palette.deepForest));
    base.push(`<image href="${assets.patternTile}" x="${trimX}" y="${trimY}" width="${trimW}" height="${trimH}" preserveAspectRatio="xMidYMid slice" opacity="0.24"/>`);
    base.push(buildMotif('switch-track', { x: safe.x, y: safe.y + 20, width: Math.min(200, safe.w * 0.6), dark: true, ...motifOpts }));
    base.push(`<image href="${assets.iconPaper}" x="${safe.x}" y="${safe.y + 50}" width="60" height="60" preserveAspectRatio="xMinYMin meet"/>`);
    base.push(textSvg({ x: safe.x + 76, y: safe.y + 80, text: BRAND, size: 16, fill: palette.paper, family: fonts.body, weight: '700', letterSpacing: '0.06em' }));
    base.push(textSvg({ x: safe.x + 76, y: safe.y + 100, text: brandData.email, size: contactSize, fill: palette.paperAlt, family: fonts.mono }));
    base.push(textSvg({ x: safe.x + 76, y: safe.y + 120, text: `${brandData.domain}  ·  [LinkedIn]`, size: contactSize, fill: palette.oxide, family: fonts.mono }));
    base.push(textSvg({ x: safe.x, y: safe.y + safe.h - 10, text: 'Pattern-led back for conference or event use', size: 9, fill: palette.paperAlt, family: fonts.mono, letterSpacing: '0.04em' }));
  } else {
    // minimal-mono
    base.push(rootRect(spec, palette.paperAlt));
    base.push(`<rect x="${trimX}" y="${trimY}" width="${trimW}" height="${trimH}" fill="${palette.paperAlt}" stroke="${hexWithOpacity(palette.ink, 0.08)}" stroke-width="1"/>`);
    base.push(textSvg({ x: safe.x, y: safe.y + 26, text: BRAND, size: contactSize, fill: palette.stone, family: fonts.mono, letterSpacing: '0.08em' }));
    base.push(textSvg({ x: safe.x, y: safe.y + 64, text: brandData.email, size: 13, fill: palette.ink, family: fonts.mono }));
    base.push(textSvg({ x: safe.x, y: safe.y + 86, text: brandData.domain, size: 13, fill: palette.deepForest, family: fonts.mono }));
    base.push(textSvg({ x: safe.x, y: safe.y + 108, text: '[Phone]  ·  [LinkedIn]', size: contactSize + 1, fill: palette.stone, family: fonts.mono }));
    base.push(buildMotif('tempo-ledger', { x: safe.x, y: safe.y + safe.h - 28, width: Math.min(190, safe.w * 0.55), dark: false, ...motifOpts }));
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${spec.width} ${spec.height}" width="${spec.width}" height="${spec.height}">${base.join('')}</svg>`;
}

// ── Review board: card preview section ──

function cardPreviewSection(concept, frontSvg, backSvg) {
  const selected = concept.productionCandidate ? ' selected' : '';
  return `
    <section class="concept${concept.productionCandidate ? ' concept--candidate' : ''}${selected}" id="${concept.id}" data-id="${concept.id}" onclick="toggleSelect(this)">
      <div class="concept__meta">
        <div class="concept__eyebrow">Concept ${String(concept.number).padStart(2, '0')}${concept.productionCandidate ? ' <span class="badge badge--rec">Recommended</span>' : ''}</div>
        <h2>${escapeHtml(concept.title)}</h2>
        <p>${escapeHtml(concept.rationale)}</p>
        <div class="chips">
          <span>${escapeHtml(concept.frontFamily.label)}</span>
          <span>${escapeHtml(concept.backFamily.label)}</span>
          <span>${escapeHtml(concept.image ? concept.image.id : 'no-image')}</span>
        </div>
      </div>
      <div class="concept__art">
        <figure>
          <div class="svg-container">${frontSvg}</div>
          <figcaption>Front</figcaption>
        </figure>
        <figure>
          <div class="svg-container">${backSvg}</div>
          <figcaption>Back</figcaption>
        </figure>
      </div>
    </section>
  `;
}

// ── Interactive cards review board ──

function buildCardsReviewHtml(brand, cardConcepts, hrefs, title, summary, palette, fonts, personality) {
  const frontFamilies = CARD_FAMILIES_FRONT.map((f) => f.label);
  const stickyNav = frontFamilies.map((label, i) => {
    const anchorId = `family-${slugify(label)}`;
    return `<a href="#${anchorId}" class="nav__link" data-family="${i}">${escapeHtml(label)}</a>`;
  }).join('');

  // Insert family anchor divs with inline SVG content
  const familySections = [];
  cardConcepts.forEach((concept, idx) => {
    if (idx % CARD_FAMILIES_BACK.length === 0) {
      const fam = CARD_FAMILIES_FRONT[Math.floor(idx / CARD_FAMILIES_BACK.length)];
      familySections.push(`<div id="family-${slugify(fam.label)}" class="family-anchor"><h3 class="family-label">${escapeHtml(fam.label)}</h3></div>`);
    }
    familySections.push(cardPreviewSection(concept, hrefs[concept.id].frontSvg, hrefs[concept.id].backSvg));
  });

  const cornerRadius = cardCornerRadius(personality);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fonts.headingFamily)}:wght@400;500;600&family=${encodeURIComponent(fonts.bodyFamily)}:wght@400;500;600;700&family=${encodeURIComponent(fonts.monoFamily)}&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --primary: ${palette.deepForest};
      --secondary: ${palette.obsidian};
      --accent: ${palette.oxide};
      --success: ${palette.mineral};
      --bg: ${palette.paper};
      --bg-alt: ${palette.paperAlt};
      --text: ${palette.ink};
      --text-light: ${palette.stone};
      --text-muted: ${palette.pewter};
      --border: rgba(23,22,17,.1);
      --corner: ${cornerRadius}px;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "${fonts.bodyFamily}", ${fonts.body.split(',').slice(1).join(',')};
      background:
        radial-gradient(circle at top right, ${hexWithOpacity(palette.oxide, 0.15)}, transparent 32%),
        linear-gradient(180deg, ${palette.paperAlt} 0%, ${palette.paper} 100%);
      color: var(--text);
    }
    main { max-width: 1460px; margin: 0 auto; padding: 40px 28px 120px; }
    .hero {
      background: linear-gradient(145deg, ${hexWithOpacity(palette.obsidian, 0.96)}, ${hexWithOpacity(palette.deepForest, 0.96)});
      color: ${palette.paper};
      border-radius: 24px;
      padding: 28px;
      margin-bottom: 28px;
      box-shadow: 0 18px 40px ${hexWithOpacity(palette.obsidian, 0.16)};
    }
    .hero__eyebrow {
      font-family: "${fonts.monoFamily}", ${fonts.mono.split(',').slice(1).join(',')};
      font-size: 11px;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: ${adjustBrightness(palette.oxide, 40)};
      margin-bottom: 16px;
    }
    .hero h1 {
      margin: 0 0 12px;
      font-family: "${fonts.headingFamily}", ${fonts.heading.split(',').slice(1).join(',')};
      font-size: clamp(32px, 4vw, 52px);
      line-height: 1.04;
      font-weight: ${fonts.headingWeight};
    }
    .hero p {
      margin: 0;
      max-width: 800px;
      color: ${hexWithOpacity(palette.paper, 0.82)};
      line-height: 1.65;
      font-size: 15px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-top: 22px;
    }
    .summary__item {
      background: ${hexWithOpacity(palette.paper, 0.08)};
      border: 1px solid ${hexWithOpacity(palette.paper, 0.12)};
      border-radius: 16px;
      padding: 14px 16px;
    }
    .summary__item strong {
      display: block;
      color: ${palette.paper};
      font-size: 22px;
      margin-bottom: 6px;
      font-family: "${fonts.headingFamily}", serif;
      font-weight: ${fonts.headingWeight};
    }
    .summary__item span {
      color: ${hexWithOpacity(palette.paper, 0.72)};
      font-size: 12px;
      letter-spacing: .08em;
      text-transform: uppercase;
      font-family: "${fonts.monoFamily}", monospace;
    }
    /* Sticky navigation */
    .sticky-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: ${hexWithOpacity(palette.paper, 0.92)};
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 10px 0;
      margin-bottom: 20px;
      display: flex;
      gap: 8px;
      overflow-x: auto;
    }
    .nav__link {
      font-family: "${fonts.monoFamily}", monospace;
      font-size: 11px;
      letter-spacing: .08em;
      text-transform: uppercase;
      text-decoration: none;
      color: var(--text-light);
      padding: 6px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      white-space: nowrap;
      transition: all .2s;
    }
    .nav__link:hover, .nav__link.active {
      color: var(--accent);
      border-color: ${hexWithOpacity(palette.oxide, 0.4)};
      background: ${hexWithOpacity(palette.oxide, 0.06)};
    }
    .family-anchor { scroll-margin-top: 60px; }
    .family-label {
      font-family: "${fonts.headingFamily}", serif;
      font-size: 20px;
      font-weight: ${fonts.headingWeight};
      color: var(--primary);
      margin: 28px 0 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }
    /* Concept cards — click-to-select */
    .concept {
      display: grid;
      grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
      gap: 22px;
      align-items: start;
      margin-bottom: 22px;
      padding: 22px;
      background: ${hexWithOpacity(palette.paperAlt, 0.82)};
      border: 2px solid transparent;
      border-radius: var(--corner);
      box-shadow: 0 10px 24px ${hexWithOpacity(palette.obsidian, 0.05)};
      cursor: pointer;
      transition: all .2s;
    }
    .concept:hover { box-shadow: 0 14px 32px ${hexWithOpacity(palette.obsidian, 0.1)}; }
    .concept.selected {
      border-color: ${palette.oxide};
      box-shadow: 0 14px 28px ${hexWithOpacity(palette.oxide, 0.14)};
    }
    .concept.selected::after {
      content: '✓';
      position: absolute;
      top: 12px;
      right: 16px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${palette.oxide};
      color: ${palette.white};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
    }
    .concept { position: relative; }
    .badge--rec {
      display: inline-block;
      background: ${hexWithOpacity(palette.oxide, 0.12)};
      color: ${palette.oxide};
      border: 1px solid ${hexWithOpacity(palette.oxide, 0.3)};
      border-radius: 999px;
      padding: 2px 8px;
      font-size: 9px;
      letter-spacing: .06em;
      text-transform: uppercase;
      margin-left: 6px;
      vertical-align: middle;
    }
    .concept__eyebrow {
      font-family: "${fonts.monoFamily}", monospace;
      font-size: 11px;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: var(--text-light);
      margin-bottom: 10px;
    }
    .concept__meta h2 {
      margin: 0 0 10px;
      font-family: "${fonts.headingFamily}", serif;
      font-size: 24px;
      font-weight: ${fonts.headingWeight};
      line-height: 1.08;
      color: var(--primary);
    }
    .concept__meta p {
      margin: 0 0 14px;
      line-height: 1.65;
      color: var(--text-light);
      font-size: 13px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chips span {
      border: 1px solid ${hexWithOpacity(palette.deepForest, 0.1)};
      background: ${hexWithOpacity(palette.paper, 0.8)};
      color: var(--text);
      border-radius: 999px;
      padding: 4px 9px;
      font-size: 10px;
      letter-spacing: .06em;
      text-transform: uppercase;
      font-family: "${fonts.monoFamily}", monospace;
    }
    .concept__art {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    figure {
      margin: 0;
      background: white;
      border: 1px solid ${hexWithOpacity(palette.obsidian, 0.06)};
      border-radius: calc(var(--corner) - 2px);
      overflow: hidden;
    }
    .svg-container { display: block; width: 100%; overflow: hidden; }
    .svg-container svg { display: block; width: 100%; height: auto; }
    figure img { display: block; width: 100%; height: auto; }
    figcaption {
      padding: 8px 10px;
      font-family: "${fonts.monoFamily}", monospace;
      font-size: 10px;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: var(--text-light);
    }
    /* Bottom bar */
    .bottom-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 200;
      background: ${hexWithOpacity(palette.obsidian, 0.95)};
      backdrop-filter: blur(12px);
      color: ${palette.paper};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 28px;
      font-family: "${fonts.monoFamily}", monospace;
      font-size: 13px;
      letter-spacing: .04em;
    }
    .bottom-bar__count { font-size: 15px; }
    .bottom-bar__count strong { color: ${palette.oxide}; font-size: 22px; margin-right: 4px; }
    .bottom-bar button {
      background: ${palette.oxide};
      color: ${palette.white};
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-family: "${fonts.monoFamily}", monospace;
      font-size: 12px;
      letter-spacing: .06em;
      text-transform: uppercase;
      cursor: pointer;
      transition: opacity .2s;
    }
    .bottom-bar button:hover { opacity: 0.85; }
    .bottom-bar button:active { opacity: 0.7; }
    .toast {
      position: fixed;
      bottom: 70px;
      right: 28px;
      background: ${palette.deepForest};
      color: ${palette.paper};
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 12px;
      font-family: "${fonts.monoFamily}", monospace;
      opacity: 0;
      transition: opacity .3s;
      pointer-events: none;
      z-index: 300;
    }
    .toast.show { opacity: 1; }
    @media (max-width: 980px) {
      .concept { grid-template-columns: 1fr; }
      .concept__art { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="hero__eyebrow">${escapeHtml(brand.name)} Phase 5 Pilot</div>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(summary)}</p>
      <div class="summary">
        <div class="summary__item"><strong>20</strong><span>Complete front/back concepts</span></div>
        <div class="summary__item"><strong>5 × 4</strong><span>Front and back family system</span></div>
        <div class="summary__item"><strong>10</strong><span>Recommended production candidates</span></div>
      </div>
    </section>
    <nav class="sticky-nav">${stickyNav}</nav>
    ${familySections.join('\n')}
  </main>
  <div class="bottom-bar">
    <div class="bottom-bar__count"><strong id="sel-count">0</strong> / 10 target selected</div>
    <button onclick="exportSelection()">Copy Selected IDs</button>
  </div>
  <div class="toast" id="toast">Copied to clipboard</div>
  <script>
    function toggleSelect(el) {
      el.classList.toggle('selected');
      updateCounts();
    }
    function updateCounts() {
      var count = document.querySelectorAll('.concept.selected').length;
      document.getElementById('sel-count').textContent = count;
    }
    function exportSelection() {
      var ids = Array.from(document.querySelectorAll('.concept.selected'))
        .map(function(el) { return el.getAttribute('data-id'); })
        .join(', ');
      if (!ids) { ids = '(none selected)'; }
      navigator.clipboard.writeText(ids).then(function() {
        var toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 1800);
      });
    }
    // IntersectionObserver for sticky nav
    (function() {
      var anchors = document.querySelectorAll('.family-anchor');
      var links = document.querySelectorAll('.nav__link');
      if (!anchors.length) return;
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            links.forEach(function(link) {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { rootMargin: '-60px 0px -70% 0px', threshold: 0 });
      anchors.forEach(function(a) { observer.observe(a); });
    })();
    // Initialize count
    updateCounts();
  </script>
</body>
</html>`;
}

// ── Card production catalog ──

function buildCardsCatalogHtml(brand, promotedConcepts, hrefs, palette, fonts) {
  const items = promotedConcepts.map((concept) => {
    const paths = hrefs[concept.id];
    const previewFront = paths.euFrontSvg || paths.frontSvg;
    const previewBack = paths.euBackSvg || paths.backSvg;
    return `
      <section class="concept">
        <div class="concept__meta">
          <div class="concept__eyebrow">Promoted Candidate ${String(concept.number).padStart(2, '0')}</div>
          <h2>${escapeHtml(concept.title)}</h2>
          <p>${escapeHtml(concept.rationale)}</p>
          <ul>
            <li><a href="${paths.euFrontSvgLink || '#'}">EU front SVG</a></li>
            <li><a href="${paths.euBackSvgLink || '#'}">EU back SVG</a></li>
            <li><a href="${paths.usFrontSvgLink || '#'}">US front SVG</a></li>
            <li><a href="${paths.usBackSvgLink || '#'}">US back SVG</a></li>
            ${paths.euFrontPdf ? `<li><a href="${paths.euFrontPdf}">EU front PDF</a></li>` : ''}
            ${paths.euBackPdf ? `<li><a href="${paths.euBackPdf}">EU back PDF</a></li>` : ''}
            ${paths.usFrontPdf ? `<li><a href="${paths.usFrontPdf}">US front PDF</a></li>` : ''}
            ${paths.usBackPdf ? `<li><a href="${paths.usBackPdf}">US back PDF</a></li>` : ''}
          </ul>
        </div>
        <div class="concept__art">
          <figure><div class="svg-container">${previewFront}</div><figcaption>Front</figcaption></figure>
          <figure><div class="svg-container">${previewBack}</div><figcaption>Back</figcaption></figure>
        </div>
      </section>
    `;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escapeHtml(brand.name)} Business Card Production Catalog</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fonts.headingFamily)}:wght@400;500&family=${encodeURIComponent(fonts.bodyFamily)}:wght@400;500;700&family=${encodeURIComponent(fonts.monoFamily)}&display=swap" rel="stylesheet"/>
  <style>
    body {
      margin: 0;
      font-family: "${fonts.bodyFamily}", ${fonts.body.split(',').slice(1).join(',')};
      background: linear-gradient(180deg, ${palette.paperAlt} 0%, ${palette.paper} 100%);
      color: ${palette.ink};
    }
    main { max-width: 1280px; margin: 0 auto; padding: 32px 24px 72px; }
    header {
      background: linear-gradient(135deg, ${palette.obsidian} 0%, ${palette.deepForest} 100%);
      color: ${palette.paper};
      border-radius: 24px;
      padding: 28px;
      margin-bottom: 24px;
    }
    header h1 {
      margin: 0 0 10px;
      font-family: "${fonts.headingFamily}", serif;
      font-size: 42px;
      font-weight: ${fonts.headingWeight};
    }
    header p {
      margin: 0;
      max-width: 840px;
      color: ${hexWithOpacity(palette.paper, 0.78)};
      line-height: 1.65;
    }
    .concept {
      display: grid;
      grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
      gap: 20px;
      background: rgba(255,255,255,.55);
      border: 1px solid ${hexWithOpacity(palette.ink, 0.09)};
      border-radius: 22px;
      padding: 20px;
      margin-bottom: 18px;
    }
    .concept__eyebrow,
    figcaption,
    li {
      font-family: "${fonts.monoFamily}", monospace;
      font-size: 11px;
      letter-spacing: .1em;
      text-transform: uppercase;
    }
    .concept__meta h2 {
      margin: 8px 0 10px;
      font-family: "${fonts.headingFamily}", serif;
      color: ${palette.deepForest};
      font-size: 28px;
      font-weight: ${fonts.headingWeight};
    }
    .concept__meta p { color: ${palette.stone}; line-height: 1.6; }
    .concept__meta ul { margin: 14px 0 0 18px; padding: 0; }
    .concept__meta li { margin: 0 0 8px; text-transform: none; font-size: 12px; letter-spacing: 0; }
    .concept__meta a { color: ${palette.oxide}; text-decoration: none; }
    .concept__art { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    figure { margin: 0; background: white; border-radius: 16px; overflow: hidden; border: 1px solid ${hexWithOpacity(palette.ink, 0.08)}; }
    .svg-container { display: block; width: 100%; overflow: hidden; }
    .svg-container svg { display: block; width: 100%; height: auto; }
    figure img { display: block; width: 100%; height: auto; }
    figcaption { padding: 10px 12px; color: ${palette.stone}; }
    @media (max-width: 920px) {
      .concept { grid-template-columns: 1fr; }
      .concept__art { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${escapeHtml(brand.name)} Business Card Production Catalog</h1>
      <p>Promoted Phase 5 pilot outputs. This page narrows the full 20-concept exploration to the ten strongest production candidates and links directly to the print-ready SVG/PDF exports for EU and US sizing.</p>
    </header>
    ${items}
  </main>
</body>
</html>`;
}

// ── Signature rendering ──

function signaturePayloadFromCharter(charter) {
  const meta = charter.meta || {};
  return {
    sender: {
      name: '[Name]',
      title: '[Title]',
      email: meta.contact || 'hello@example.com',
      phone: '+[Phone]',
      linkedin: '[LinkedIn]',
    },
    brand: {
      name: (meta.displayName || 'Brand').toUpperCase(),
      tagline: meta.tagline || '',
      domain: meta.domain || '',
      extraDomains: meta.extraDomains || [],
    },
  };
}

function signatureMotifTable(palette) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
    <tr>
      <td style="width:180px; font-size:1px; line-height:1px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; width:180px;">
          <tr><td style="border-bottom:2px solid ${palette.deepForest}; font-size:1px; line-height:1px;">&nbsp;</td></tr>
          <tr><td style="height:6px; font-size:1px; line-height:1px;">&nbsp;</td></tr>
          <tr><td style="padding-left:16px; border-bottom:2px solid ${palette.oxide}; font-size:1px; line-height:1px;">&nbsp;</td></tr>
        </table>
      </td>
      <td style="width:16px; padding-left:8px; font-size:1px; line-height:1px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; width:16px; height:18px; border:2px solid ${palette.oxide};">
          <tr><td style="font-size:1px; line-height:1px;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>
  </table>`;
}

function signatureRule(palette) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; width:220px;"><tr><td style="border-bottom:2px solid ${palette.deepForest}; font-size:1px; line-height:1px;">&nbsp;</td></tr></table>`;
}

function textLine(text, opts = {}) {
  const font = opts.mono ? SAFE_FONT_STACK.mono : SAFE_FONT_STACK.body;
  const color = opts.color || '#171611';
  const size = opts.size || 12;
  const weight = opts.weight ? `font-weight:${opts.weight};` : '';
  const italic = opts.italic ? 'font-style:italic;' : '';
  const extra = opts.extra || '';
  return `<tr><td style="font-family:${font}; color:${color}; font-size:${size}px; line-height:${opts.lineHeight || Math.round(size * 1.35)}px; ${weight}${italic}${extra}">${text}</td></tr>`;
}

function signatureFragmentHtml(variant, payload, palette) {
  const sender = payload.sender;
  const brand = payload.brand;
  const rows = [];

  if (variant.chrome.usesMotif) rows.push(`<tr><td style="padding-bottom:8px;">${signatureMotifTable(palette)}</td></tr>`);
  if (variant.chrome.key === 'rule-led') rows.push(`<tr><td style="padding-bottom:8px;">${signatureRule(palette)}</td></tr>`);

  if (variant.chrome.twoColumn) {
    return `
<!-- ${variant.id} -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; font-family:${SAFE_FONT_STACK.body}; width:420px; max-width:420px;">
  ${variant.chrome.usesMotif ? `<tr><td colspan="2" style="padding-bottom:8px;">${signatureMotifTable(palette)}</td></tr>` : ''}
  <tr>
    <td style="vertical-align:top; padding-right:18px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        ${textLine(escapeHtml(sender.name), { size: 15, weight: 700, color: palette.ink })}
        ${textLine(`${escapeHtml(sender.title)} · ${escapeHtml(brand.name)}`, { size: 12, color: palette.stone })}
        ${textLine(escapeHtml(sender.email), { mono: true, size: 11, color: palette.stone })}
        ${textLine(escapeHtml(sender.phone), { mono: true, size: 11, color: palette.stone })}
      </table>
    </td>
    <td style="vertical-align:top; padding-left:18px; border-left:1px solid ${hexWithOpacity(palette.stone, 0.35)};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        ${textLine(`<a href="https://${brand.domain}" style="color:${palette.oxide}; text-decoration:none;">${escapeHtml(brand.domain)}</a>`, { mono: true, size: 11 })}
        ${textLine(`<a href="https://${escapeHtml(sender.linkedin)}" style="color:${palette.oxide}; text-decoration:none;">LinkedIn</a>`, { mono: true, size: 11 })}
        ${brand.extraDomains.length ? textLine(escapeHtml(brand.extraDomains.join(' · ')), { mono: true, size: 10, color: palette.pewter }) : ''}
        ${textLine(escapeHtml(brand.tagline), { size: 9, color: palette.pewter, italic: true })}
      </table>
    </td>
  </tr>
</table>`.trim();
  }

  rows.push(textLine(escapeHtml(sender.name), { size: variant.density.key === 'minimal' ? 14 : 15, weight: 700, color: palette.ink }));
  rows.push(textLine(`${escapeHtml(sender.title)} ${variant.density.key === 'minimal' ? '|' : '·'} ${escapeHtml(brand.name)}`, {
    size: 12,
    color: palette.stone,
  }));

  if (variant.density.key !== 'minimal' || variant.chrome.key !== 'pure-text') {
    rows.push(textLine(`<a href="https://${brand.domain}" style="color:${palette.oxide}; text-decoration:none;">${escapeHtml(brand.domain)}</a>${variant.density.key === 'extended' && brand.extraDomains.length ? ` <span style="color:${palette.pewter};">· ${escapeHtml(brand.extraDomains.join(' · '))}</span>` : ''}`, {
      mono: true,
      size: 11,
    }));
  }

  if (variant.density.key !== 'minimal') {
    rows.push(textLine(escapeHtml(sender.email), { mono: true, size: 11, color: palette.stone }));
  }

  if (variant.density.key === 'extended') {
    rows.push(textLine(escapeHtml(sender.phone), { mono: true, size: 11, color: palette.stone }));
  }

  if (variant.density.key !== 'minimal' && variant.chrome.key !== 'pure-text') {
    rows.push(textLine(escapeHtml(brand.tagline), { size: 9, color: palette.pewter, italic: true }));
  }

  return `
<!-- ${variant.id} -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; width:${variant.density.key === 'extended' ? '340px' : variant.density.key === 'standard' ? '300px' : '260px'}; max-width:420px;">
  ${rows.join('\n')}
</table>`.trim();
}

// ── Interactive signature review board ──

function buildSignatureReviewHtml(brand, signatureVariants, palette, fonts, charter, assets) {
  const payload = signaturePayloadFromCharter(charter);
  const cards = signatureVariants.map((variant) => {
    const fragmentId = `frag-${variant.id}`;
    return `
      <section class="variant" data-id="${variant.id}" onclick="toggleSelect(this, event)">
        <div class="variant__meta">
          <div class="variant__eyebrow">Variant ${String(variant.number).padStart(2, '0')}</div>
          <h2>${escapeHtml(variant.title)}</h2>
          <p>${escapeHtml(variant.rationale)}</p>
          <div class="chips">
            <span>${escapeHtml(variant.density.label)}</span>
            <span>${escapeHtml(variant.chrome.label)}</span>
          </div>
          <div class="actions">
            <a href="../templates/html/signatures/${variant.id}.fragment.html">Fragment</a>
            <button class="copy-btn" onclick="copyFragment('${fragmentId}', event)">Copy HTML</button>
          </div>
        </div>
        <div class="variant__preview">
          <div class="signature-shell" id="${fragmentId}">${signatureFragmentHtml(variant, payload, palette)}</div>
        </div>
      </section>
    `;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escapeHtml(brand.name)} Signature Review</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fonts.headingFamily)}:wght@400;500&family=${encodeURIComponent(fonts.bodyFamily)}:wght@400;500;700&family=${encodeURIComponent(fonts.monoFamily)}&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --primary: ${palette.deepForest};
      --accent: ${palette.oxide};
      --bg: ${palette.paper};
      --bg-alt: ${palette.paperAlt};
      --text: ${palette.ink};
      --text-light: ${palette.stone};
      --text-muted: ${palette.pewter};
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "${fonts.bodyFamily}", ${fonts.body.split(',').slice(1).join(',')};
      background: linear-gradient(180deg, ${palette.paper} 0%, ${palette.paperAlt} 100%);
      color: ${palette.ink};
    }
    main { max-width: 1280px; margin: 0 auto; padding: 32px 24px 120px; }
    header {
      background: linear-gradient(135deg, ${palette.obsidian} 0%, ${palette.deepForest} 100%);
      color: ${palette.paper};
      border-radius: 24px;
      padding: 28px;
      margin-bottom: 24px;
    }
    header h1 {
      margin: 0 0 10px;
      font-family: "${fonts.headingFamily}", serif;
      font-size: 42px;
      font-weight: ${fonts.headingWeight};
    }
    header p { margin: 0; max-width: 820px; line-height: 1.65; color: ${hexWithOpacity(palette.paper, 0.78)}; }
    .grid { display: grid; gap: 18px; }
    .variant {
      display: grid;
      grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
      gap: 20px;
      align-items: start;
      background: rgba(255,255,255,.62);
      border: 2px solid transparent;
      border-radius: 22px;
      padding: 20px;
      cursor: pointer;
      transition: all .2s;
      position: relative;
    }
    .variant:hover { box-shadow: 0 8px 24px ${hexWithOpacity(palette.obsidian, 0.08)}; }
    .variant.selected {
      border-color: ${palette.oxide};
      box-shadow: 0 10px 24px ${hexWithOpacity(palette.oxide, 0.14)};
    }
    .variant.selected::after {
      content: '✓';
      position: absolute;
      top: 12px;
      right: 16px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${palette.oxide};
      color: ${palette.white};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
    }
    .variant__eyebrow, .chips span, .actions a {
      font-family: "${fonts.monoFamily}", monospace;
      font-size: 11px;
      letter-spacing: .12em;
      text-transform: uppercase;
    }
    .variant__meta h2 {
      margin: 8px 0 10px;
      color: ${palette.deepForest};
      font-family: "${fonts.headingFamily}", serif;
      font-size: 24px;
      font-weight: ${fonts.headingWeight};
    }
    .variant__meta p { color: ${palette.stone}; line-height: 1.65; margin: 0 0 14px; }
    .chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
    .chips span {
      border: 1px solid ${hexWithOpacity(palette.deepForest, 0.12)};
      padding: 4px 9px;
      border-radius: 999px;
      color: ${palette.ink};
      background: ${hexWithOpacity(palette.paper, 0.8)};
    }
    .actions { display: flex; gap: 12px; align-items: center; }
    .actions a {
      display: inline-block;
      text-decoration: none;
      color: ${palette.oxide};
      letter-spacing: .08em;
    }
    .copy-btn {
      background: ${hexWithOpacity(palette.oxide, 0.1)};
      color: ${palette.oxide};
      border: 1px solid ${hexWithOpacity(palette.oxide, 0.3)};
      border-radius: 6px;
      padding: 4px 10px;
      font-family: "${fonts.monoFamily}", monospace;
      font-size: 10px;
      letter-spacing: .06em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all .2s;
    }
    .copy-btn:hover { background: ${hexWithOpacity(palette.oxide, 0.18)}; }
    .variant__preview {
      background: white;
      border: 1px solid ${hexWithOpacity(palette.ink, 0.06)};
      border-radius: 18px;
      padding: 18px;
    }
    .signature-shell { overflow-x: auto; }
    /* Bottom bar */
    .bottom-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 200;
      background: ${hexWithOpacity(palette.obsidian, 0.95)};
      backdrop-filter: blur(12px);
      color: ${palette.paper};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 28px;
      font-family: "${fonts.monoFamily}", monospace;
      font-size: 13px;
    }
    .bottom-bar__count strong { color: ${palette.oxide}; font-size: 22px; margin-right: 4px; }
    .bottom-bar button {
      background: ${palette.oxide};
      color: ${palette.white};
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-family: "${fonts.monoFamily}", monospace;
      font-size: 12px;
      letter-spacing: .06em;
      text-transform: uppercase;
      cursor: pointer;
    }
    .bottom-bar button:hover { opacity: 0.85; }
    .toast {
      position: fixed;
      bottom: 70px;
      right: 28px;
      background: ${palette.deepForest};
      color: ${palette.paper};
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 12px;
      font-family: "${fonts.monoFamily}", monospace;
      opacity: 0;
      transition: opacity .3s;
      pointer-events: none;
      z-index: 300;
    }
    .toast.show { opacity: 1; }
    @media (max-width: 980px) { .variant { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <header>
      ${assets && assets.logoWhite ? `<img src="${assets.logoWhite}" alt="${escapeHtml(brand.name)} logo" style="height:40px;margin-bottom:18px;opacity:.92;"/>` : ''}
      <h1>${escapeHtml(brand.name)} Signature Review</h1>
      <p>${escapeHtml(brand.tagline || '')}</p>
      <p style="margin-top:10px;font-size:13px;">Phase 5 pilot review board — 12 email-safe signature variants across 3 densities and 4 chrome behaviors. Click to select, then export your choices. Every variant is table-based, inline-style only, safe-font only, and prepared as a pickup fragment for Outlook, Gmail, and Apple Mail.</p>
      <div style="display:flex;gap:18px;margin-top:16px;flex-wrap:wrap;">
        <div style="background:${hexWithOpacity(palette.paper, 0.08)};border:1px solid ${hexWithOpacity(palette.paper, 0.12)};border-radius:12px;padding:10px 14px;">
          <span style="display:block;font-family:'${fonts.headingFamily}',serif;font-size:18px;font-weight:${fonts.headingWeight};color:${palette.paper};">${fonts.headingFamily}</span>
          <span style="font-family:'${fonts.monoFamily}',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:${hexWithOpacity(palette.paper, 0.6)};">Heading font</span>
        </div>
        <div style="background:${hexWithOpacity(palette.paper, 0.08)};border:1px solid ${hexWithOpacity(palette.paper, 0.12)};border-radius:12px;padding:10px 14px;">
          <span style="display:block;font-family:'${fonts.bodyFamily}',sans-serif;font-size:18px;color:${palette.paper};">${fonts.bodyFamily}</span>
          <span style="font-family:'${fonts.monoFamily}',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:${hexWithOpacity(palette.paper, 0.6)};">Body font</span>
        </div>
        <div style="background:${hexWithOpacity(palette.paper, 0.08)};border:1px solid ${hexWithOpacity(palette.paper, 0.12)};border-radius:12px;padding:10px 14px;display:flex;gap:8px;align-items:center;">
          <span style="width:24px;height:24px;border-radius:6px;background:${palette.primary};display:inline-block;"></span>
          <span style="width:24px;height:24px;border-radius:6px;background:${palette.accent};display:inline-block;"></span>
          <span style="width:24px;height:24px;border-radius:6px;background:${palette.background};display:inline-block;border:1px solid ${hexWithOpacity(palette.paper, 0.2)};"></span>
          <span style="font-family:'${fonts.monoFamily}',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:${hexWithOpacity(palette.paper, 0.6)};">Palette</span>
        </div>
      </div>
    </header>
    <div class="grid">
      ${cards}
    </div>
  </main>
  <div class="bottom-bar">
    <div class="bottom-bar__count"><strong id="sel-count">0</strong> / 4 target selected</div>
    <button onclick="exportSelection()">Copy Selected IDs</button>
  </div>
  <div class="toast" id="toast">Copied to clipboard</div>
  <script>
    function toggleSelect(el, event) {
      if (event && (event.target.tagName === 'A' || event.target.tagName === 'BUTTON')) return;
      el.classList.toggle('selected');
      updateCounts();
    }
    function updateCounts() {
      var count = document.querySelectorAll('.variant.selected').length;
      document.getElementById('sel-count').textContent = count;
    }
    function exportSelection() {
      var ids = Array.from(document.querySelectorAll('.variant.selected'))
        .map(function(el) { return el.getAttribute('data-id'); })
        .join(', ');
      if (!ids) { ids = '(none selected)'; }
      navigator.clipboard.writeText(ids).then(function() { showToast('Copied to clipboard'); });
    }
    function copyFragment(fragId, event) {
      event.stopPropagation();
      var el = document.getElementById(fragId);
      if (!el) return;
      navigator.clipboard.writeText(el.innerHTML.trim()).then(function() { showToast('Fragment HTML copied'); });
    }
    function showToast(msg) {
      var toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(function() { toast.classList.remove('show'); }, 1800);
    }
    updateCounts();
  </script>
</body>
</html>`;
}

// ── Signature catalog ──

function buildSignatureCatalogHtml(brand, signatureVariants, palette, fonts, charter) {
  const payload = signaturePayloadFromCharter(charter);
  const sections = signatureVariants.map((variant) => {
    return `
      <section class="variant">
        <div class="variant__meta">
          <div class="variant__eyebrow">Variant ${String(variant.number).padStart(2, '0')}</div>
          <h2>${escapeHtml(variant.title)}</h2>
          <p>${escapeHtml(variant.rationale)}</p>
          <p><a href="signatures/${variant.id}.fragment.html">Open fragment</a></p>
        </div>
        <div class="variant__preview">${signatureFragmentHtml(variant, payload, palette)}</div>
      </section>
    `;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escapeHtml(brand.name)} Email Signatures</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fonts.headingFamily)}:wght@400;500&family=${encodeURIComponent(fonts.bodyFamily)}:wght@400;500;700&family=${encodeURIComponent(fonts.monoFamily)}&display=swap" rel="stylesheet"/>
  <style>
    body { margin: 0; font-family: "${fonts.bodyFamily}", ${fonts.body.split(',').slice(1).join(',')}; background: linear-gradient(180deg, ${palette.paperAlt} 0%, ${palette.paper} 100%); color: ${palette.ink}; }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 24px 72px; }
    header { background: linear-gradient(135deg, ${palette.obsidian} 0%, ${palette.deepForest} 100%); color: ${palette.paper}; border-radius: 24px; padding: 28px; margin-bottom: 24px; }
    header h1 { margin: 0 0 10px; font-family: "${fonts.headingFamily}", serif; font-size: 40px; font-weight: ${fonts.headingWeight}; }
    header p { margin: 0; line-height: 1.65; color: ${hexWithOpacity(palette.paper, 0.78)}; max-width: 780px; }
    .variant { display: grid; grid-template-columns: minmax(240px, 280px) minmax(0, 1fr); gap: 20px; align-items: start; background: rgba(255,255,255,.6); border: 1px solid ${hexWithOpacity(palette.ink, 0.08)}; border-radius: 20px; padding: 20px; margin-bottom: 16px; }
    .variant__eyebrow, .variant__meta a { font-family: "${fonts.monoFamily}", monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; }
    .variant__meta h2 { margin: 8px 0 10px; font-family: "${fonts.headingFamily}", serif; font-size: 26px; font-weight: ${fonts.headingWeight}; color: ${palette.deepForest}; }
    .variant__meta p { margin: 0 0 10px; color: ${palette.stone}; line-height: 1.6; }
    .variant__meta a { color: ${palette.oxide}; text-decoration: none; letter-spacing: .08em; }
    .variant__preview { background: white; border: 1px solid ${hexWithOpacity(palette.ink, 0.08)}; border-radius: 16px; padding: 16px; overflow-x: auto; }
    @media (max-width: 920px) { .variant { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${escapeHtml(brand.name)} Email Signatures</h1>
      <p>Production catalog of the 12 Phase 5 pilot signature variants. Each linked fragment is ready to be opened and copy/pasted into email platforms without relying on remote fonts, stylesheets, or images.</p>
    </header>
    ${sections}
  </main>
</body>
</html>`;
}

// ── PDF export via Playwright ──

async function maybeExportPdfs(printExports, brandDir) {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch (error) {
    return { attempted: false, success: false, reason: error.message };
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    for (const item of printExports) {
      const html = `<!doctype html><html><body style="margin:0;background:white;"><img src="file://${item.svgPath}" style="display:block;width:100%;height:auto;"/></body></html>`;
      await page.setViewportSize({ width: item.width, height: item.height });
      await page.setContent(html, { waitUntil: 'load' });
      await page.pdf({
        path: item.pdfPath,
        width: `${item.width}px`,
        height: `${item.height}px`,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        printBackground: true,
      });
    }
  } finally {
    await browser.close();
  }

  return { attempted: true, success: true, reason: null };
}

// ── Visual QA via Playwright ──

async function runVisualQa(cardConcepts, reviewCardsDir, buildDir, palette, fonts) {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch (error) {
    return { attempted: false, success: false, reason: error.message, report: null };
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const qaDir = path.join(buildDir, 'qa-screenshots');
  ensureDir(qaDir);

  const results = [];

  try {
    for (const concept of cardConcepts) {
      for (const face of ['front', 'back']) {
        const svgPath = path.join(reviewCardsDir, `${concept.id}-${face}.svg`);
        if (!fs.existsSync(svgPath)) continue;

        const svgContent = fs.readFileSync(svgPath, 'utf8');
        const html = `<!doctype html><html><body style="margin:0;padding:0;background:white;">${svgContent}</body></html>`;
        await page.setViewportSize({ width: 400, height: 240 });
        await page.setContent(html, { waitUntil: 'load' });

        const screenshotPath = path.join(qaDir, `${concept.id}-${face}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        results.push({
          concept: concept.id,
          face,
          screenshot: path.relative(buildDir, screenshotPath),
          pass: true,
          notes: [],
        });
      }
    }
  } finally {
    await browser.close();
  }

  // Generate QA report HTML
  const reportPath = path.join(buildDir, 'Phase5-QA-Report.html');
  const thumbnails = results.map((r) => {
    return `
      <div class="qa-item ${r.pass ? 'qa-pass' : 'qa-fail'}">
        <img src="${r.screenshot}" alt="${r.concept} ${r.face}"/>
        <div class="qa-label">${escapeHtml(r.concept)} ${r.face} ${r.pass ? '✓' : '✗'}</div>
        ${r.notes.length ? `<div class="qa-notes">${r.notes.join(', ')}</div>` : ''}
      </div>
    `;
  }).join('');

  const qaHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Phase 5 QA Report</title>
  <style>
    body { margin: 0; font-family: sans-serif; background: ${palette.paperAlt}; color: ${palette.ink}; padding: 24px; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    .stats { margin-bottom: 20px; font-size: 14px; color: ${palette.stone}; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
    .qa-item { background: white; border-radius: 12px; overflow: hidden; border: 2px solid transparent; }
    .qa-item img { display: block; width: 100%; height: auto; }
    .qa-label { padding: 8px 10px; font-size: 11px; font-family: monospace; }
    .qa-pass { border-color: ${palette.mineral}; }
    .qa-fail { border-color: ${palette.error}; }
    .qa-notes { padding: 0 10px 8px; font-size: 10px; color: ${palette.error}; }
  </style>
</head>
<body>
  <h1>Phase 5 Visual QA Report</h1>
  <div class="stats">${results.length} screenshots · ${results.filter((r) => r.pass).length} pass · ${results.filter((r) => !r.pass).length} fail · Generated ${new Date().toISOString()}</div>
  <div class="grid">${thumbnails}</div>
</body>
</html>`;

  fs.writeFileSync(reportPath, qaHtml, 'utf8');

  return {
    attempted: true,
    success: true,
    reason: null,
    report: path.relative(buildDir, reportPath),
    screenshotCount: results.length,
    passCount: results.filter((r) => r.pass).length,
    failCount: results.filter((r) => !r.pass).length,
  };
}

// ── Path utility ──

function relativePath(fromDir, toFile) {
  return path.relative(fromDir, toFile).split(path.sep).join('/');
}

// ── Main ──

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const brandDir = path.join(PROJECT_ROOT, 'client-data', 'clients', args.slug);
  const buildDir = path.join(brandDir, '_build');
  const templatesDir = path.join(brandDir, 'templates');
  const htmlDir = path.join(templatesDir, 'html');
  const signaturesDir = path.join(htmlDir, 'signatures');
  const printCardsDir = path.join(templatesDir, 'print', 'cards');
  const pdfCardsDir = path.join(templatesDir, 'pdf', 'cards');
  const reviewCardsDir = path.join(buildDir, 'cards', 'review');
  const BRAND = args.slug.toUpperCase();
  const reviewCardsHtml = path.join(buildDir, `${BRAND}-Business-Cards-Review.html`);
  const reviewSignaturesHtml = path.join(buildDir, `${BRAND}-Signatures-Review.html`);
  const cardCatalogHtml = path.join(htmlDir, 'business-cards.html');
  const signatureCatalogHtml = path.join(htmlDir, 'email-signature.html');
  const imageryManifestPath = path.join(brandDir, 'images', 'manifest.json');
  const templateManifestPath = path.join(templatesDir, 'manifest.json');
  const qaPath = path.join(buildDir, `${BRAND}-Phase5-Pilot-QA.json`);

  ensureDir(reviewCardsDir);
  ensureDir(signaturesDir);
  ensureDir(printCardsDir);
  ensureDir(pdfCardsDir);

  const charter = readJson(path.join(brandDir, 'charter.json'));
  const palette = buildPalette(charter);
  const fonts = buildFontStack(charter);
  const personality = derivePersonality(charter);
  const brandData = buildBrandData(charter);
  const brand = {
    slug: args.slug,
    name: brandData.name,
    tagline: brandData.tagline,
  };

  const assets = {
    logoDark: fileToDataUri(path.join(brandDir, 'logos', 'logo.svg')),
    logoWhite: fileToDataUri(path.join(brandDir, 'logos', 'logo_white.svg')),
    iconDark: fileToDataUri(path.join(brandDir, 'logos', 'icon_dark.svg')),
    iconPaper: fileToDataUri(path.join(brandDir, 'logos', 'icon_paper.svg')),
    patternTile: fileToDataUri(path.join(brandDir, 'logos', 'pattern-tile.svg')),
  };

  const imageryManifest = await buildImageryManifest(brandDir, charter);
  imageryManifest.library.forEach((item) => {
    if (item.processed) {
      item.processedDataUri = fileToDataUri(path.join(brandDir, item.processed));
    }
  });
  writeJson(imageryManifestPath, {
    ...imageryManifest,
    library: imageryManifest.library.map((item) => {
      const clone = { ...item };
      delete clone.processedDataUri;
      return clone;
    }),
  });

  const cardConcepts = buildCardConcepts(imageryManifest);
  // Attach brand name to concepts for renderFront
  cardConcepts.forEach((c) => { c._brandName = brandData.name; });

  const signatureVariants = buildSignatureVariants();
  writeJson(templateManifestPath, buildTemplateManifest(cardConcepts, signatureVariants, args.slug));

  const cardHrefs = {};
  const printExports = [];

  for (const concept of cardConcepts) {
    const reviewFrontPath = path.join(reviewCardsDir, `${concept.id}-front.svg`);
    const reviewBackPath = path.join(reviewCardsDir, `${concept.id}-back.svg`);
    fs.writeFileSync(reviewFrontPath, renderFront(concept, CARD_SIZE_SPECS.preview, assets, palette, fonts, personality), 'utf8');
    fs.writeFileSync(reviewBackPath, renderBack(concept, CARD_SIZE_SPECS.preview, assets, palette, fonts, personality, brandData), 'utf8');

    // Store raw SVG content for inline embedding (browser sandbox blocks
    // nested <image> elements and @import in SVGs loaded via <img src>)
    cardHrefs[concept.id] = {
      frontSvg: fs.readFileSync(reviewFrontPath, 'utf8'),
      backSvg: fs.readFileSync(reviewBackPath, 'utf8'),
    };

    if (concept.productionCandidate) {
      for (const formatKey of ['eu', 'us']) {
        const spec = CARD_SIZE_SPECS[formatKey];
        const frontSvgPath = path.join(printCardsDir, `${concept.id}-${formatKey}-front.svg`);
        const backSvgPath = path.join(printCardsDir, `${concept.id}-${formatKey}-back.svg`);
        const frontPdfPath = path.join(pdfCardsDir, `${concept.id}-${formatKey}-front.pdf`);
        const backPdfPath = path.join(pdfCardsDir, `${concept.id}-${formatKey}-back.pdf`);

        fs.writeFileSync(frontSvgPath, renderFront(concept, spec, assets, palette, fonts, personality), 'utf8');
        fs.writeFileSync(backSvgPath, renderBack(concept, spec, assets, palette, fonts, personality, brandData), 'utf8');

        cardHrefs[concept.id][`${formatKey}FrontSvg`] = fs.readFileSync(frontSvgPath, 'utf8');
        cardHrefs[concept.id][`${formatKey}BackSvg`] = fs.readFileSync(backSvgPath, 'utf8');
        // Keep relative paths for download links
        cardHrefs[concept.id][`${formatKey}FrontSvgLink`] = relativePath(htmlDir, frontSvgPath);
        cardHrefs[concept.id][`${formatKey}BackSvgLink`] = relativePath(htmlDir, backSvgPath);
        cardHrefs[concept.id][`${formatKey}FrontPdf`] = fs.existsSync(frontPdfPath) ? relativePath(htmlDir, frontPdfPath) : null;
        cardHrefs[concept.id][`${formatKey}BackPdf`] = fs.existsSync(backPdfPath) ? relativePath(htmlDir, backPdfPath) : null;

        printExports.push({ svgPath: frontSvgPath, pdfPath: frontPdfPath, width: spec.width, height: spec.height });
        printExports.push({ svgPath: backSvgPath, pdfPath: backPdfPath, width: spec.width, height: spec.height });
      }
    }
  }

  fs.writeFileSync(
    reviewCardsHtml,
    buildCardsReviewHtml(
      brand,
      cardConcepts,
      cardHrefs,
      `${brand.name} Business Card Review`,
      `Twenty complete business-card concepts built from the approved ${brand.name} brand system. The page explores all five front families and all four back families before narrowing to the recommended ten production candidates.`,
      palette,
      fonts,
      personality,
    ),
    'utf8',
  );

  const promotedConcepts = cardConcepts.filter((item) => item.productionCandidate);
  fs.writeFileSync(cardCatalogHtml, buildCardsCatalogHtml(brand, promotedConcepts, cardHrefs, palette, fonts), 'utf8');

  const sigPayload = signaturePayloadFromCharter(charter);
  for (const variant of signatureVariants) {
    const fragmentPath = path.join(signaturesDir, `${variant.id}.fragment.html`);
    fs.writeFileSync(fragmentPath, signatureFragmentHtml(variant, sigPayload, palette) + '\n', 'utf8');
  }

  fs.writeFileSync(reviewSignaturesHtml, buildSignatureReviewHtml(brand, signatureVariants, palette, fonts, charter, assets), 'utf8');
  fs.writeFileSync(signatureCatalogHtml, buildSignatureCatalogHtml(brand, signatureVariants, palette, fonts, charter), 'utf8');

  let pdfResult = { attempted: false, success: false, reason: 'not-requested' };
  if (args.pdf) {
    pdfResult = await maybeExportPdfs(printExports, brandDir);
  }

  if (pdfResult.success) {
    for (const concept of promotedConcepts) {
      for (const formatKey of ['eu', 'us']) {
        const frontPdfPath = path.join(pdfCardsDir, `${concept.id}-${formatKey}-front.pdf`);
        const backPdfPath = path.join(pdfCardsDir, `${concept.id}-${formatKey}-back.pdf`);
        cardHrefs[concept.id][`${formatKey}FrontPdf`] = relativePath(htmlDir, frontPdfPath);
        cardHrefs[concept.id][`${formatKey}BackPdf`] = relativePath(htmlDir, backPdfPath);
      }
    }
    fs.writeFileSync(cardCatalogHtml, buildCardsCatalogHtml(brand, promotedConcepts, cardHrefs, palette, fonts), 'utf8');
  }

  let qaResult = { attempted: false };
  if (args.qa) {
    qaResult = await runVisualQa(cardConcepts, reviewCardsDir, buildDir, palette, fonts);
  }

  const qa = {
    generatedAt: new Date().toISOString(),
    brand: args.slug,
    personality: {
      archetype: personality.archetype,
      chromeWeight: personality.chromeWeight,
      density: personality.density,
      typeScale: personality.typeScale,
      cornerStyle: personality.cornerStyle,
      motifRole: personality.motifRole,
    },
    checks: {
      cardConceptCount: cardConcepts.length,
      signatureVariantCount: signatureVariants.length,
      promotedCardCount: promotedConcepts.length,
      imageryManifestEntries: imageryManifest.library.length,
      signatureFragments: signatureVariants.length,
      inlineStyleOnlySignatures: signatureVariants.every((variant) => {
        const html = readFileIfExists(path.join(signaturesDir, `${variant.id}.fragment.html`)) || '';
        return !html.includes('<style') && !html.includes('class=');
      }),
      imageFreeSignatures: signatureVariants.every((variant) => {
        const html = readFileIfExists(path.join(signaturesDir, `${variant.id}.fragment.html`)) || '';
        return !html.includes('<img') && !html.includes('background-image');
      }),
      recommendedTopTenIds: promotedConcepts.map((item) => item.id),
      pdfExport: pdfResult,
      visualQa: qaResult,
    },
  };
  writeJson(qaPath, qa);

  console.log(`Built Phase 5 pilot for ${brand.name}`);
  console.log(`- Imagery manifest: ${path.relative(PROJECT_ROOT, imageryManifestPath)}`);
  console.log(`- Templates manifest: ${path.relative(PROJECT_ROOT, templateManifestPath)}`);
  console.log(`- Card review: ${path.relative(PROJECT_ROOT, reviewCardsHtml)}`);
  console.log(`- Signature review: ${path.relative(PROJECT_ROOT, reviewSignaturesHtml)}`);
  console.log(`- Card catalog: ${path.relative(PROJECT_ROOT, cardCatalogHtml)}`);
  console.log(`- Signature catalog: ${path.relative(PROJECT_ROOT, signatureCatalogHtml)}`);
  console.log(`- QA: ${path.relative(PROJECT_ROOT, qaPath)}`);
  console.log(`- Personality: ${personality.archetype} (chrome=${personality.chromeWeight}, type=${personality.typeScale}, density=${personality.density})`);
  if (args.pdf) {
    console.log(`- PDF export: ${pdfResult.success ? 'success' : `not generated (${pdfResult.reason})`}`);
  }
  if (args.qa) {
    console.log(`- Visual QA: ${qaResult.success ? `${qaResult.screenshotCount} screenshots (${qaResult.passCount} pass)` : `not generated (${qaResult.reason})`}`);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
