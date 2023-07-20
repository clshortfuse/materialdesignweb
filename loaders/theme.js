import { addGlobalCss } from '../core/css.js';
import {
  generateThemeCSS,
  generateTypographyGlobalCSS,
  themeOptionsFromSearchParams,
} from '../services/theme.js';
import { getCurrentSearchParams } from '../utils/searchParams.js';

addGlobalCss([
  generateThemeCSS(themeOptionsFromSearchParams(getCurrentSearchParams())),
  generateTypographyGlobalCSS(),
].join('\n'));
