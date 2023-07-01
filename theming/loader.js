import { css } from '../core/css.js';

import {
  generateThemeCSS,
  generateTypographyGlobalCSS,
  themeOptionsFromSearchParams,
} from './index.js';

const rules = [
  generateThemeCSS(themeOptionsFromSearchParams(new URL(import.meta.url).searchParams)),
  generateTypographyGlobalCSS(),
].join('\n');

const parsed = css(rules);
if (parsed instanceof HTMLStyleElement) {
  document.head.append(parsed);
} else {
  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    parsed,
  ];
}
