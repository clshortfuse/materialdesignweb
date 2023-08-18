import '../../loaders/theme.js';
import Ripple from '../../components/Ripple.js';
import Slider from '../../components/Slider.js';
import { addRobotoFont, disableAnimations, generateScreenshotTests } from '../utils.js';

disableAnimations(Ripple, Slider);
await addRobotoFont();

beforeEach(() => document.body.replaceChildren());

describe('mdw-slider', () => generateScreenshotTests({
  template: '<mdw-slider></mdw-slider>',
  matrix: [
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
  ],
  padding: 64,
}));
