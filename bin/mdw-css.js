#!/usr/bin/env node

import { generateThemeCSS, generateTypographyGlobalCSS, themeOptionsFromSearchParams } from '../services/theme.js';
import { getSearchParams } from '../utils/cli.js';

process.stdout.write(
  generateThemeCSS(
    themeOptionsFromSearchParams(
      getSearchParams(),
    ),
  ),
);
process.stdout.write(generateTypographyGlobalCSS());
