import { generateVsCodeCustomElementData } from 'custom-element-vs-code-integration';

import manifest from '../api/custom-elements.json' with { type: 'json' };

// Cast imported JSON to any to satisfy the generator's expected type
const manifestData = /** @type {any} */ (manifest);

generateVsCodeCustomElementData(manifestData, {
  outdir: new URL('../api', import.meta.url).pathname,
  htmlFileName: 'html.html-data.json',
  cssFileName: 'css.css-data.json',
});
