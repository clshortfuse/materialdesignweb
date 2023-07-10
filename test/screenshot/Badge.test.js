import '../../loaders/theme.js';
import '../../components/Icon.js';
import '../../components/Badge.js';
import { addSVGAlias } from '../../services/svgAlias.js';
import { addRobotoFont, generateScreenshotTests } from '../utils.js';

addSVGAlias('check', 'M382 816 154 588l57-57 171 171 367-367 57 57-424 424Z', '0 96 960 960');
addRobotoFont();

beforeEach(() => document.body.replaceChildren());

describe('mdw-badge', () => {
  generateScreenshotTests('<mdw-badge></mdw-badge>', [
    {
      empty: {},
      text: { textContent: 'Text' },
      textlong: { textContent: 'Long text content' },
      icon: { innerHTML: '<mdw-icon icon=check></mdw-icon>' },
      icontext: { innerHTML: '<mdw-icon icon=check></mdw-icon> Icon' },
    },
  ]);
});
