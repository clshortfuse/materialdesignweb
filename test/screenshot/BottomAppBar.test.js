import '../../loaders/theme.js';
import '../../components/IconButton.js';
import '../../components/BottomAppBar.js';
import { addSVGAlias } from '../../services/svgAlias.js';
import { generateScreenshotTests } from '../utils.js';

addSVGAlias('check', 'M382 816 154 588l57-57 171 171 367-367 57 57-424 424Z', '0 96 960 960');

beforeEach(() => document.body.replaceChildren());

describe('mdw-bottom-app-bar', () => {
  generateScreenshotTests(`
    <mdw-bottom-app-bar>
      <mdw-icon-button icon=check></mdw-icon-button>
      <mdw-icon-button icon=check></mdw-icon-button>
      <mdw-icon-button icon=check></mdw-icon-button>
      <mdw-icon-button icon=check></mdw-icon-button>
    </mdw-bottom-app-bar>`, [
    {
      default: {},
      primary: { color: 'primary-container' },
    },
  ]);
});
