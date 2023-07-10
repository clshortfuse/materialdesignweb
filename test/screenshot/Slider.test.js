import '../../loaders/theme.js';
import Ripple from '../../components/Ripple.js';
import Slider from '../../components/Slider.js';
import { css } from '../../core/css.js';
import { generateScreenshotTests } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

for (const ElementClass of [Ripple, Slider]) {
  ElementClass.recompose(({ composition }) => {
    composition.append(css`
    :host,::before,::after,*,*::before,*::after {
      transition-duration: 0s !important;
      animation-duration: 0s !important;
    }
  `);
  });
}

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
