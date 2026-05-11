/**
 * Shared workspace utilities for amaris-consulting.
 *
 * Skills import this module via: require('../../src/workspace')
 */

const path = require('path');
const fs = require('fs');

/** Resolve a path relative to the plugin root */
function pluginRoot(...segments) {
  return path.resolve(__dirname, '..', ...segments);
}

/** Read company data file as JSON */
function readCompanyData(filename) {
  const filePath = pluginRoot('companies', 'amaris', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/** Get the output directory (creates if needed) */
function outputDir(subdir = '') {
  const dir = pluginRoot('_output', subdir);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

module.exports = { pluginRoot, readCompanyData, outputDir };
