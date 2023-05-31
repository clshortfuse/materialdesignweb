/** Import this first to ensure ThemableMixin includes custom palettes */

import ThemableMixin from '../mixins/ThemableMixin.js';

ThemableMixin.PALETTES.push(
  ...(
    (new URL(import.meta.url).searchParams)
      .getAll('custom')
      .flatMap((c) => c.split(','))
      .map((c) => c.split(':')[0])
  ),
);
