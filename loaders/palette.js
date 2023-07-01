/** Import this first to ensure ThemableMixin includes custom palettes */

import { PALETTES } from '../services/theme.js';

PALETTES.push(
  ...(
    (new URL(import.meta.url).searchParams)
      .getAll('custom')
      .flatMap((c) => c.split(','))
      .map((c) => c.split(':')[0])
  ),
);
