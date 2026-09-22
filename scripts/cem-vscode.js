import fs from 'node:fs';
import path from 'node:path';

import { generateVsCodeCustomElementData } from 'custom-element-vs-code-integration';

import manifest from '../api/custom-elements.json' with { type: 'json' };

// Cast imported JSON to any to satisfy the generator's expected type
const manifestData = /** @type {any} */ (manifest);

generateVsCodeCustomElementData(manifestData, {
  outdir: new URL('../api', import.meta.url).pathname,
  htmlFileName: 'html.html-data.json',
  cssFileName: 'css.css-data.json',
});

const apiDirectory = new URL('../api', import.meta.url).pathname;
const htmlPath = path.join(apiDirectory, 'html.html-data.json');
const cssPath = path.join(apiDirectory, 'css.css-data.json');
const htmlData = JSON.parse(fs.readFileSync(htmlPath, 'utf8'));
const cssData = JSON.parse(fs.readFileSync(cssPath, 'utf8'));

/** @param {unknown} value @param {string} message */
function assert(value, message) {
  if (!value) throw new Error(`Generated VS Code custom data is invalid: ${message}`);
}

assert(htmlData?.version === 1.1, 'HTML version must be 1.1');
assert(Array.isArray(htmlData?.tags), 'HTML tags must be an array');
assert(Array.isArray(cssData?.properties), 'CSS properties must be an array');
assert(Array.isArray(cssData?.pseudoElements), 'CSS pseudoElements must be an array');

const manifestTags = new Set(manifest.modules.flatMap((module) => (
  (module.declarations || []).map((declaration) => declaration.tagName).filter(Boolean)
)));
const generatedTags = new Set();
for (const tag of htmlData.tags) {
  assert(typeof tag?.name === 'string' && tag.name.length > 0, 'every HTML tag needs a name');
  assert(!generatedTags.has(tag.name), `duplicate HTML tag ${tag.name}`);
  generatedTags.add(tag.name);
  assert(manifestTags.has(tag.name), `HTML tag ${tag.name} is absent from custom-elements.json`);
  assert(Array.isArray(tag.attributes), `HTML tag ${tag.name} attributes must be an array`);
}
for (const tagName of manifestTags) {
  assert(generatedTags.has(tagName), `custom element ${tagName} is absent from HTML custom data`);
}

const pseudoElementNames = new Set();
cssData.pseudoElements = cssData.pseudoElements.filter((entry) => {
  assert(typeof entry?.name === 'string' && entry.name.startsWith('::part('), 'invalid CSS pseudo-element');
  if (pseudoElementNames.has(entry.name)) return false;
  pseudoElementNames.add(entry.name);
  return true;
});
fs.writeFileSync(cssPath, `${JSON.stringify(cssData, null, 2)}\n`);
