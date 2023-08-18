import '../../loaders/theme.js';
import Button from '../../components/Button.js';
import Card from '../../components/Card.js';
import Ripple from '../../components/Ripple.js';
import { addRobotoFont, disableAnimations, generateScreenshotTests } from '../utils.js';

disableAnimations(Button, Card, Ripple);
await addRobotoFont();

beforeEach(() => document.body.replaceChildren());

describe('mdw-card', () => generateScreenshotTests({
  template: '<mdw-card padding=24>Card</mdw-card>',
  matrix: [
    {
      enabled: {},
      disabled: { disabled: true },
    },
    {
      elevated: { elevated: true },
      filled: { filled: true },
      outlined: { outlined: true },
    },
    {
      nonactionable: {},
      actionable: { actionable: true },
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
