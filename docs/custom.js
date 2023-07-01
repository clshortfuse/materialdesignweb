import { unaliased } from '../services/svgAlias.js';
import { PALETTES } from '../services/theme.js';

import { addIconAliases, reportUnaliasedMaterialSymbols } from './icon-aliases.js';

PALETTES.push('yellow', 'orange', 'green', 'alias');

addIconAliases();

setTimeout(async () => {
  console.debug(JSON.stringify(await reportUnaliasedMaterialSymbols(...unaliased)));
});
