/**
 * personality-from-archetype.js
 *
 * Translates a brand charter's archetype (+ optional overrides) into a
 * concrete "personality profile" that downstream template builders consult
 * for every visual decision — chrome weight, type scale, corner style,
 * image treatment, motif role, etc.
 *
 * This is the translation layer between abstract brand data (archetype,
 * industry) and slide-level styling choices. Without it, every brand looks
 * the same at thumbnail size because the templates only vary colors/fonts.
 *
 * Consumers pass in the parsed charter.json and get back a flat object:
 *
 *   const { derivePersonality } = require('./personality-from-archetype');
 *   const personality = derivePersonality(charter);
 *   personality.chromeWeight  // 'bold' | 'standard' | 'whisper'
 *   personality.typeScale     // 'reserved' | 'editorial' | 'dramatic'
 *
 * Overrides: users can set `meta.personalityOverrides` in charter.json to
 * override any field without changing the archetype.
 */

// Normalized archetype keys (lowercase, canonical)
const ARCHETYPE_ALIASES = {
  sage: 'sage',
  ruler: 'ruler',
  rebel: 'rebel',
  outlaw: 'rebel',
  creator: 'creator',
  artist: 'creator',
  caregiver: 'caregiver',
  explorer: 'explorer',
  innocent: 'innocent',
  hero: 'hero',
  warrior: 'hero',
  jester: 'jester',
  magician: 'magician',
  everyman: 'everyman',
  regular: 'everyman',
  lover: 'lover',
};

// Archetype → personality defaults. Opinionated, informed by the
// archetype literature (Mark & Pearson) and what translates well to
// slide-level visual decisions.
const ARCHETYPE_TABLE = {
  sage:      { density: 'spacious', chromeWeight: 'whisper',  cornerStyle: 'sharp', motifRole: 'accent', imageTreatment: 'bw-accent',      typeScale: 'reserved',  accentUsage: 'thin-rule',   footerStyle: 'minimal'  },
  ruler:     { density: 'balanced', chromeWeight: 'bold',     cornerStyle: 'sharp', motifRole: 'chrome', imageTreatment: 'tinted-overlay', typeScale: 'dramatic',  accentUsage: 'panel',       footerStyle: 'branded'  },
  rebel:     { density: 'dense',    chromeWeight: 'bold',     cornerStyle: 'sharp', motifRole: 'hero',   imageTreatment: 'duotone',        typeScale: 'dramatic',  accentUsage: 'solid-block', footerStyle: 'indexed'  },
  creator:   { density: 'spacious', chromeWeight: 'standard', cornerStyle: 'soft',  motifRole: 'hero',   imageTreatment: 'raw',            typeScale: 'editorial', accentUsage: 'panel',       footerStyle: 'branded'  },
  caregiver: { density: 'spacious', chromeWeight: 'whisper',  cornerStyle: 'soft',  motifRole: 'accent', imageTreatment: 'tinted-overlay', typeScale: 'reserved',  accentUsage: 'thin-rule',   footerStyle: 'minimal'  },
  explorer:  { density: 'balanced', chromeWeight: 'standard', cornerStyle: 'sharp', motifRole: 'chrome', imageTreatment: 'bw-accent',      typeScale: 'editorial', accentUsage: 'thin-rule',   footerStyle: 'indexed'  },
  innocent:  { density: 'spacious', chromeWeight: 'whisper',  cornerStyle: 'pill',  motifRole: 'accent', imageTreatment: 'raw',            typeScale: 'reserved',  accentUsage: 'thin-rule',   footerStyle: 'minimal'  },
  hero:      { density: 'balanced', chromeWeight: 'bold',     cornerStyle: 'sharp', motifRole: 'hero',   imageTreatment: 'tinted-overlay', typeScale: 'dramatic',  accentUsage: 'solid-block', footerStyle: 'branded'  },
  jester:    { density: 'dense',    chromeWeight: 'standard', cornerStyle: 'pill',  motifRole: 'hero',   imageTreatment: 'raw',            typeScale: 'editorial', accentUsage: 'solid-block', footerStyle: 'indexed'  },
  magician:  { density: 'balanced', chromeWeight: 'standard', cornerStyle: 'soft',  motifRole: 'hero',   imageTreatment: 'duotone',        typeScale: 'dramatic',  accentUsage: 'panel',       footerStyle: 'branded'  },
  everyman:  { density: 'balanced', chromeWeight: 'standard', cornerStyle: 'soft',  motifRole: 'accent', imageTreatment: 'raw',            typeScale: 'reserved',  accentUsage: 'thin-rule',   footerStyle: 'minimal'  },
  lover:     { density: 'spacious', chromeWeight: 'whisper',  cornerStyle: 'soft',  motifRole: 'hero',   imageTreatment: 'tinted-overlay', typeScale: 'editorial', accentUsage: 'panel',       footerStyle: 'branded'  },
};

const DEFAULT_PROFILE = {
  archetype: 'sage',
  density: 'balanced',
  chromeWeight: 'standard',
  cornerStyle: 'sharp',
  motifRole: 'accent',
  imageTreatment: 'raw',
  typeScale: 'editorial',
  accentUsage: 'thin-rule',
  footerStyle: 'branded',
};

// Numeric scales that slide functions can read directly.
const SCALES = {
  density: {
    spacious: { marginPt: 90, bodyLines: 4, gapPt: 24 },
    balanced: { marginPt: 60, bodyLines: 5, gapPt: 16 },
    dense:    { marginPt: 40, bodyLines: 7, gapPt: 12 },
  },
  chromeWeight: {
    whisper:  { accentBarPt: 2, motifLinePt: 1,   sectionNumScale: 1.0, footerRulePt: 0.5 },
    standard: { accentBarPt: 4, motifLinePt: 1.5, sectionNumScale: 1.2, footerRulePt: 1   },
    bold:     { accentBarPt: 10, motifLinePt: 4,  sectionNumScale: 2.0, footerRulePt: 2   },
  },
  cornerStyle: {
    sharp: { radiusPt: 0,  buttonRadius: 0  },
    soft:  { radiusPt: 6,  buttonRadius: 6  },
    pill:  { radiusPt: 16, buttonRadius: 999 },
  },
  typeScale: {
    // titlePt = title slides ; h1Pt = section dividers ; h2Pt = content headings ; bodyPt ; overlinePt
    reserved:  { titlePt: 32, h1Pt: 28, h2Pt: 20, bodyPt: 11, overlinePt: 10, bigNumberPt: 64 },
    editorial: { titlePt: 44, h1Pt: 32, h2Pt: 22, bodyPt: 12, overlinePt: 10, bigNumberPt: 80 },
    dramatic:  { titlePt: 64, h1Pt: 40, h2Pt: 26, bodyPt: 12, overlinePt: 11, bigNumberPt: 96 },
  },
};

/**
 * Extract the archetype string from a charter.json object. Handles the
 * two schema variants currently in the wild:
 *  - meta.archetype = 'ruler' (string)
 *  - meta.archetype = { primary: 'Magician', secondary: 'Ruler' } (object)
 *  - website.archetype = 'magician' (fallback, older schema)
 */
function extractArchetype(charter) {
  if (!charter) return null;
  const meta = charter.meta || {};
  const website = charter.website || {};

  let raw =
    (typeof meta.archetype === 'string' && meta.archetype) ||
    (meta.archetype && typeof meta.archetype === 'object' && meta.archetype.primary) ||
    (typeof website.archetype === 'string' && website.archetype) ||
    null;

  if (!raw) return null;
  const key = String(raw).trim().toLowerCase();
  return ARCHETYPE_ALIASES[key] || null;
}

/**
 * Derive a personality profile from a charter. Applies archetype defaults,
 * then merges in any `meta.personalityOverrides` field from the charter.
 *
 * Returns { ...profile, scales: { density, chromeWeight, cornerStyle, typeScale } }
 * where `scales` contains the resolved numeric values for the chosen bands.
 */
function derivePersonality(charter) {
  const archetype = extractArchetype(charter) || DEFAULT_PROFILE.archetype;
  const base = ARCHETYPE_TABLE[archetype] || ARCHETYPE_TABLE[DEFAULT_PROFILE.archetype];
  const overrides = (charter && charter.meta && charter.meta.personalityOverrides) || {};

  const profile = { archetype, ...base, ...overrides };

  profile.scales = {
    density: SCALES.density[profile.density] || SCALES.density.balanced,
    chromeWeight: SCALES.chromeWeight[profile.chromeWeight] || SCALES.chromeWeight.standard,
    cornerStyle: SCALES.cornerStyle[profile.cornerStyle] || SCALES.cornerStyle.sharp,
    typeScale: SCALES.typeScale[profile.typeScale] || SCALES.typeScale.editorial,
  };

  return profile;
}

module.exports = {
  derivePersonality,
  extractArchetype,
  ARCHETYPE_TABLE,
  SCALES,
  DEFAULT_PROFILE,
};
