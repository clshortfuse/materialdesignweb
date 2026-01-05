import { addGlobalCss } from '../core/css.js';
import {
  generateResetCSS,
  generateThemeCSS,
  generateTypographyGlobalCSS,
  themeOptionsFromSearchParams,
} from '../services/theme.js';
import { getCurrentSearchParams } from '../utils/searchParams.js';

const options = themeOptionsFromSearchParams(getCurrentSearchParams());
addGlobalCss([
  generateThemeCSS(options),
  generateTypographyGlobalCSS(),
  options.resetCSS ? generateResetCSS() : '',
].join('\n'));
