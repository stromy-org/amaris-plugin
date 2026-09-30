/**
 * Image sizing utilities for aspect-ratio-preserving bounding-box fits.
 * Used by format skills (docx, pptx, pdf) to prevent logo/image squashing.
 */

const sharp = require('../node_modules/sharp');
const fs = require('fs');
const path = require('path');

/**
 * Fit an image within a bounding box while preserving aspect ratio.
 * @param {string} imagePath - Path to the image file
 * @param {number} maxWidth - Maximum width (unitless — caller decides units)
 * @param {number} maxHeight - Maximum height (unitless)
 * @returns {Promise<{width: number, height: number, naturalWidth: number, naturalHeight: number}>}
 */
async function fitImageInBox(imagePath, maxWidth, maxHeight) {
  const metadata = await sharp(imagePath).metadata();
  const naturalWidth = metadata.width;
  const naturalHeight = metadata.height;
  const aspectRatio = naturalWidth / naturalHeight;

  let w = maxWidth;
  let h = w / aspectRatio;
  if (h > maxHeight) {
    h = maxHeight;
    w = h * aspectRatio;
  }

  return {
    width: Math.round(w * 100) / 100,
    height: Math.round(h * 100) / 100,
    naturalWidth,
    naturalHeight,
  };
}

/**
 * Parse a charter dimension string like "120pt" into {value, unit}.
 * @param {string} str - e.g. "120pt", "50px", "2in"
 * @returns {{value: number, unit: string}}
 */
function parseDimension(str) {
  const match = String(str).match(/^([\d.]+)\s*([a-z]+)$/i);
  if (!match) throw new Error(`Cannot parse dimension: "${str}"`);
  return { value: parseFloat(match[1]), unit: match[2] };
}

/**
 * Fit a logo within the bounding box defined by a charter's logo config.
 * @param {string} imagePath - Path to the logo image file
 * @param {object} logoConfig - Charter logo object with maxWidth, maxHeight, sizing
 * @param {string} logoConfig.maxWidth - e.g. "120pt"
 * @param {string} logoConfig.maxHeight - e.g. "50pt"
 * @param {string} [logoConfig.sizing] - "contain" (default) or "cover"
 * @returns {Promise<{width: number, height: number, unit: string, naturalWidth: number, naturalHeight: number}>}
 */
async function fitLogoFromCharter(imagePath, logoConfig) {
  const maxW = parseDimension(logoConfig.maxWidth);
  const maxH = parseDimension(logoConfig.maxHeight);

  if (maxW.unit !== maxH.unit) {
    throw new Error(`Mismatched units: maxWidth="${logoConfig.maxWidth}", maxHeight="${logoConfig.maxHeight}"`);
  }

  const result = await fitImageInBox(imagePath, maxW.value, maxH.value);
  return {
    width: result.width,
    height: result.height,
    unit: maxW.unit,
    naturalWidth: result.naturalWidth,
    naturalHeight: result.naturalHeight,
  };
}

/**
 * Load a logo for docx-js ImageRun, transparently converting SVG → PNG if needed.
 *
 * docx-js ImageRun requires raster data (type: "png" | "jpg" etc.) — it cannot embed SVG.
 * This helper detects SVG input and rasterizes via sharp at 2× the bounding-box dimensions
 * so the embedded PNG is sharp at typical display sizes without being huge.
 *
 * @param {string} logoPath - Absolute or relative path to the logo file (.svg, .png, .jpg, etc.)
 * @param {object} logoConfig - Charter logo config with maxWidth, maxHeight, sizing
 * @returns {Promise<{buffer: Buffer, type: string, width: number, height: number, unit: string}>}
 *
 * Usage:
 *   const { loadLogoBufferForDocx } = require('../../../../src/image-utils');
 *   const logo = await loadLogoBufferForDocx(logoPath, charter.logo);
 *   new ImageRun({ data: logo.buffer, type: logo.type, transformation: { width: logo.width, height: logo.height } })
 *
 * Prefer the `png` / `whitePng` charter field over `primary` / `white` when they exist —
 * they point to pre-generated PNGs that are already the right format:
 *   const logoFile = charter.logo.png || charter.logo.primary;
 */
async function loadLogoBufferForDocx(logoPath, logoConfig) {
  const dims = await fitLogoFromCharter(logoPath, logoConfig);
  const ext = path.extname(logoPath).toLowerCase();

  let buffer;
  if (ext === '.svg') {
    // Rasterize at 2× display size for crisp embedding without oversized files
    buffer = await sharp(logoPath)
      .resize(Math.round(dims.width * 2), Math.round(dims.height * 2), {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
  } else {
    buffer = fs.readFileSync(logoPath);
  }

  return {
    buffer,
    type: 'png',
    width: dims.width,
    height: dims.height,
    unit: dims.unit,
    naturalWidth: dims.naturalWidth,
    naturalHeight: dims.naturalHeight,
  };
}

module.exports = { fitImageInBox, fitLogoFromCharter, parseDimension, loadLogoBufferForDocx };
