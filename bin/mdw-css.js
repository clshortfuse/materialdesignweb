#!/usr/bin/env node

import { generateResetCSS, generateThemeCSS, generateTypographyGlobalCSS, themeOptionsFromSearchParams } from '../services/theme.js';
import { getSearchParams } from '../utils/cli.js';

const options = themeOptionsFromSearchParams(getSearchParams());
process.stdout.write(generateThemeCSS(options));

process.stdout.write(generateTypographyGlobalCSS());

if (options.resetCSS) {
  process.stdout.write(generateResetCSS());
}
