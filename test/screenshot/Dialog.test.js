import '../../loaders/theme.js';
import Dialog from '../../components/Dialog.js';
import Scrim from '../../components/Scrim.js';
import { addRobotoFont, disableAnimations, generateScreenshotTests } from '../utils.js';

disableAnimations(Dialog, Scrim);
await addRobotoFont();

beforeEach(() => document.body.replaceChildren());
afterEach(() => document.querySelector('mdw-dialog').close());

describe('mdw-dialog', () => generateScreenshotTests({
  template: '<mdw-dialog></mdw-dialog>',
  before: {
    useHistory: false,
  },
  matrix: [
    {
      empty: {},
      content: { textContent: 'Dialog body text' },
    },
    {
      'headline-none': {},
      headline: { headline: 'Headline' },
    },
    {
      'icon-none': {},
      icon: { icon: 'edit' },
    },
    {
      'dividers-none': {},
      'dividers-full': { dividers: 'full' },
      'dividers-inset': { dividers: 'inset' },
    },
    {
      'default-none': {},
      'default-confirm': { default: 'confirm' },
      'default-cancel': { default: 'cancel' },
    },
  ],
  after: {
    'showPopup()': [],
  },
  padding: 200,
}));
