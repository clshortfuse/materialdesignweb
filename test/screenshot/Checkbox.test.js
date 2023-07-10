import '../../loaders/theme.js';
import Checkbox from '../../components/Checkbox.js';
import Ripple from '../../components/Ripple.js';
import { addSVGAlias } from '../../services/svgAlias.js';
import { addRobotoFont, disableAnimations, generateScreenshotTests } from '../utils.js';

addSVGAlias('check', 'M382 816 154 588l57-57 171 171 367-367 57 57-424 424Z', '0 96 960 960');
addSVGAlias('check_indeterminate_small', 'M280 616v-80h400v80H280Z', '0 96 960 960');
addRobotoFont();
disableAnimations(Ripple, Checkbox);

beforeEach(() => document.body.replaceChildren());

describe('mdw-checkbox', () => {
  generateScreenshotTests('<mdw-checkbox></mdw-checkbox>', [
    {
      enabled: {},
      disabled: { disabled: true },
    },
    {
      unchecked: {},
      checked: { checked: true },
      indeterminate: { indeterminate: true },
    },
    {
      empty: {},
      text: { textContent: 'Text' },
    },
    {
      defaultcolor: {},
      tertiary: { color: 'tertiary' },
    },
    {
      stateless: {},
      focused: { ':focus': true },
      hovered: { ':hover': true },
      hovered__focused: { ':hover': true, ':focus': true },
      pressed: { ':active': true },
    },
  ]);
});
