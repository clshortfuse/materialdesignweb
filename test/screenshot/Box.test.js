import '../../loaders/theme.js';
import '../../components/Box.js';
import { generateScreenshotTests } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

describe('mdw-box', () => {
  generateScreenshotTests('<mdw-box>Text</mdw-box>', [
    {
      padding0: {},
      padding8: { padding: 8 },
    },
    {
      defaultcolor: {},
      primarycolor: { color: 'primary' },
      secondarycolor: { color: 'secondary' },
      tertiarycolor: { color: 'tertiary' },
      primarycontainercolor: { color: 'primary-container' },
      secondarycontainercolor: { color: 'secondary-container' },
      tertiarycontainercolor: { color: 'tertiary-container' },
    },
    {
      defaultink: {},
      primaryink: { ink: 'primary' },
      secondaryink: { ink: 'secondary' },
      tertiaryink: { ink: 'tertiary' },
    },
  ]);
});
