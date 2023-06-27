import ThemableMixin from '../mixins/ThemableMixin.js';
import { unaliased } from '../services/SVGAlias.js';

import { addIconAliases, reportUnaliasedMaterialSymbols } from './icon-aliases.js';

ThemableMixin.PALETTES.push('yellow', 'orange', 'green', 'alias');

addIconAliases();

console.debug(JSON.stringify(await reportUnaliasedMaterialSymbols(...unaliased)));
