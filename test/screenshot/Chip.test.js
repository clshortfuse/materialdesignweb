import '../../loaders/theme.js';

import Chip from '../../components/Chip.js';
import Ripple from '../../components/Ripple.js';
import { addSVGAlias } from '../../services/svgAlias.js';
import { addRobotoFont, disableAnimations, generateScreenshotTests } from '../utils.js';

addSVGAlias('edit', 'M772 453 602 285l56-56q23-23 56.5-23t56.5 23l56 56q23 23 24 55.5T829 396l-57 57Zm-58 59L290 936H120V766l424-424 170 170Z', '0 96 960 960');
disableAnimations(Chip, Ripple);
await addRobotoFont();

beforeEach(() => document.body.replaceChildren());

describe('mdw-chip', () => generateScreenshotTests({
  template: '<mdw-chip>Chip</mdw-chip>',
  matrix: [
    {
      enabled: {},
      disabled: { disabled: true },
    },
    {
      assist: { icon: 'edit' },
      elevated: { icon: 'edit', elevated: true },
      suggestion: { suggestion: true },
    },
    {
      defaultink: {},
      primaryink: { ink: 'primary' },
      tertiaryink: { ink: 'tertiary' },
    },
    {
      stateless: {},
      hovered: { ':hover': true, textContent: 'Hovered' },
      focused: { ':focus': true, textContent: 'Focused' },
      hovered__focused: { ':hover': true, ':focus': true, textContent: 'Hovered and Focused' },
      pressed: { ':active': true, textContent: 'Pressed' },
    },
  ],
}));
