import { assert } from '@esm-bundle/chai';

import BottomAppBar from '../../components/BottomAppBar.js';
import '../../theming/loader.js';
import { axTree, html, iterateMeaningfulAXNodes, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

describe('mdw-bottom-app-bar', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-bottom-app-bar');
    assert.equal(element.tagName.toLowerCase(), 'mdw-bottom-app-bar');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(BottomAppBar);
    assert.equal(element.tagName.toLowerCase(), 'mdw-bottom-app-bar');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-bottom-app-bar></mdw-bottom-app-bar>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-bottom-app-bar');
  });

  describe('aria', () => {
    it('returns toolbar role', async () => {
      const element = html`<mdw-bottom-app-bar>foo</mdw-bottom-app-bar>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'toolbar');
    });

    it('supports aria-label', async () => {
      const element = html`<mdw-bottom-app-bar aria-label=foo></mdw-bottom-app-bar>`;
      const results = await axTree({ selector: element.tagName });
      const [{ name }] = iterateMeaningfulAXNodes(results);
      assert.equal(name, 'foo');
    });
  });
});
