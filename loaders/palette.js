/** Import this first to ensure ThemableMixin includes custom palettes */

import { PALETTES } from '../services/theme.js';
import { getCurrentSearchParams } from '../utils/searchParams.js';

PALETTES.push(
  ...(
    getCurrentSearchParams()
      .getAll('custom')
      .flatMap((c) => c.split(','))
      .map((c) => c.split(':')[0])
  ),
);
