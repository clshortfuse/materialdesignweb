import '../../loaders/theme.js';
import Button from '../../components/Button.js';
import Ripple from '../../components/Ripple.js';
import { addSVGAlias } from '../../services/svgAlias.js';
import { addRobotoFont, disableAnimations, generateScreenshotTests } from '../utils.js';

addSVGAlias('check', 'M382 816 154 588l57-57 171 171 367-367 57 57-424 424Z', '0 96 960 960');
addRobotoFont();
disableAnimations(Button, Ripple);

beforeEach(() => document.body.replaceChildren());

describe('mdw-button', () => {
  generateScreenshotTests('<mdw-button></mdw-button>', [
    {
      enabled: {},
      disabled: { disabled: true },
    },
    {
      text: {},
      elevated: { elevated: '' },
      filled: { filled: '' },
      filled__tonal: { filled: 'tonal' },
      outlined: { outlined: true },
    },
    {
      noicon: {},
      icon: { icon: 'check' },
    },
    {
      stateless: { textContent: 'Text' },
      hovered: { ':hover': true, textContent: 'Hovered' },
      focused: { ':focus': true, textContent: 'Focused' },
      hovered__focused: { ':hover': true, ':focus': true, textContent: 'Hovered and Focused' },
      pressed: { ':active': true, textContent: 'Pressed' },
    },
  ]);
});
