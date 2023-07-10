import '../../loaders/theme.js';
import IconButton from '../../components/IconButton.js';
import Ripple from '../../components/Ripple.js';
import Tooltip from '../../components/Tooltip.js';
import { addSVGAlias } from '../../services/svgAlias.js';
import { addRobotoFont, disableAnimations, generateScreenshotTests } from '../utils.js';

addSVGAlias('check', 'M382 816 154 588l57-57 171 171 367-367 57 57-424 424Z', '0 96 960 960');
addRobotoFont();
disableAnimations(IconButton, Tooltip, Ripple);

beforeEach(() => document.body.replaceChildren());

describe('mdw-icon-button', () => {
  generateScreenshotTests('<mdw-icon-button icon=check></mdw-icon-button>', [
    {
      enabled: {},
      disabled: { disabled: true },
    },
    {
      button: {},
      untoggled: { type: 'checkbox' },
      toggled: { type: 'checkbox', checked: true },
    },
    {
      standard: {},
      filled: { filled: '' },
      filled__tonal: { filled: 'tonal' },
      outlined: { outlined: true },
    },
    {
      stateless: { textContent: 'Tooltip' },
      focused: { ':focus': true, textContent: 'Focused' },
      hovered: { ':hover': true, textContent: 'Hovered' },
      hovered__focused: { ':hover': true, ':focus': true, textContent: 'Hovered and Focused' },
      pressed: { ':active': true, textContent: 'Pressed' },
    },
    {
      overrides: { TOOLTIP_MOUSE_IDLE_MS: 0 },
    },
  ], 64);
});
