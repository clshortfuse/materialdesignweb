import { generateThemeCSS, generateTypographyGlobalCSS, themeOptionsFromSearchParams } from '../theming/index.js';
import { getSearchParams } from '../utils/cli.js';

process.stdout.write(
  generateThemeCSS(
    themeOptionsFromSearchParams(
      getSearchParams(),
    ),
  ),
);
process.stdout.write(generateTypographyGlobalCSS());
