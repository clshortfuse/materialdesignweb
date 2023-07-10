import '../../loaders/theme.js';
import Ripple from '../../components/Ripple.js';
import Slider from '../../components/Slider.js';
import { addRobotoFont, disableAnimations, generateScreenshotTests } from '../utils.js';

addRobotoFont();
disableAnimations(Ripple, Slider);

beforeEach(() => document.body.replaceChildren());

describe('mdw-slider', () => {
  generateScreenshotTests('<mdw-slider></mdw-slider>', [
    {
      enabled: {},
      disabled: { disabled: true },
    },
    {
      continuous: {},
      discrete: { ticks: 10 },
    },
    {
      stateless: {},
      focused: { ':focus': true },
      hovered: { ':hover': true },
      hovered__focused: { ':hover': true, ':focus': true },
      pressed: { ':active': true },
    },
  ], 64);
});
