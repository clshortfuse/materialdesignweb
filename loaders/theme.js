import { addGlobalCss } from '../core/css.js';
import {
  generateThemeCSS,
  generateTypographyGlobalCSS,
  themeOptionsFromSearchParams,
} from '../services/theme.js';

let url;
try {
  url = import.meta.url;
} catch {}
if (!url) {
  try {
    url = document.currentScript.src;
  } catch {}
}

const searchParams = url ? new URL(url).searchParams : null;

addGlobalCss([
  generateThemeCSS(themeOptionsFromSearchParams(searchParams)),
  generateTypographyGlobalCSS(),
].join('\n'));
