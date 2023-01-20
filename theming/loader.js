import { css } from '../core/template.js';

import {
  generateBreakpointGlobalCSS,
  generateThemeCSS,
  generateTypographyGlobalCSS,
  themeOptionsFromSearchParams,
} from './index.js';

const rules = [
  generateThemeCSS(themeOptionsFromSearchParams(new URL(import.meta.url).searchParams)),
  generateTypographyGlobalCSS(),
  generateBreakpointGlobalCSS(),
].join('\n');

const parsed = css`${rules}`;
if (parsed instanceof HTMLStyleElement) {
  document.head.append(parsed);
} else {
  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    parsed,
  ];
}
