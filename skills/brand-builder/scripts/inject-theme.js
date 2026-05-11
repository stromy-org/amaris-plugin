/**
 * inject-theme.js
 *
 * Post-processes a DOCX buffer to inject theme1.xml, making branded fonts
 * and colors apply automatically when the document opens in Word/LibreOffice.
 *
 * Usage:
 *   const { injectTheme } = require('./inject-theme');
 *   const themed = await injectTheme(docxBuffer, themePath);
 *   fs.writeFileSync('output.docx', themed);
 *
 * Requires: jszip (already a transitive dependency of docx npm package)
 */

const fs = require('fs');
const JSZip = require('jszip');

const THEME_REL_TYPE = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme';
const THEME_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.theme+xml';

/**
 * Inject a theme1.xml file into an existing DOCX buffer.
 *
 * @param {Buffer} docxBuffer — The DOCX file as a Buffer (from Packer.toBuffer())
 * @param {string} themePath — Absolute path to the theme1.xml file
 * @returns {Promise<Buffer>} — Modified DOCX buffer with theme injected
 */
async function injectTheme(docxBuffer, themePath) {
  if (!fs.existsSync(themePath)) {
    throw new Error(`Theme file not found: ${themePath}`);
  }

  const themeXml = fs.readFileSync(themePath, 'utf8');
  const zip = await JSZip.loadAsync(docxBuffer);

  // 1. Inject theme1.xml at word/theme/theme1.xml
  zip.file('word/theme/theme1.xml', themeXml);

  // 2. Update [Content_Types].xml to register the theme content type
  const contentTypesXml = await zip.file('[Content_Types].xml').async('string');
  if (!contentTypesXml.includes('/word/theme/theme1.xml')) {
    const updatedCT = contentTypesXml.replace(
      '</Types>',
      `<Override PartName="/word/theme/theme1.xml" ContentType="${THEME_CONTENT_TYPE}"/>\n</Types>`,
    );
    zip.file('[Content_Types].xml', updatedCT);
  }

  // 3. Update word/_rels/document.xml.rels to include the theme relationship
  const relsPath = 'word/_rels/document.xml.rels';
  let relsXml = '';
  if (zip.file(relsPath)) {
    relsXml = await zip.file(relsPath).async('string');
  } else {
    relsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n</Relationships>';
  }

  if (!relsXml.includes(THEME_REL_TYPE)) {
    // Find the next available rId
    const existingIds = relsXml.match(/Id="rId(\d+)"/g) || [];
    const maxId = existingIds.reduce((max, match) => {
      const num = parseInt(match.match(/\d+/)[0], 10);
      return Math.max(max, num);
    }, 0);
    const newId = `rId${maxId + 1}`;

    const updatedRels = relsXml.replace(
      '</Relationships>',
      `<Relationship Id="${newId}" Type="${THEME_REL_TYPE}" Target="theme/theme1.xml"/>\n</Relationships>`,
    );
    zip.file(relsPath, updatedRels);
  }

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

module.exports = { injectTheme };
