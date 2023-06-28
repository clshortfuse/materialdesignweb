import { assert } from '@esm-bundle/chai';

import Checkbox from '../../components/Checkbox.js';
import '../../theming/loader.js';
import { axTree, html, iterateMeaningfulAXNodes, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

describe('mdw-checkbox', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-checkbox');
    assert.equal(element.tagName.toLowerCase(), 'mdw-checkbox');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(Checkbox);
    assert.equal(element.tagName.toLowerCase(), 'mdw-checkbox');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-checkbox></mdw-checkbox>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-checkbox');
  });

  describe('aria', () => {
    it('returns checkbox role', async () => {
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'checkbox');
    });

    it('supports aria-label', async () => {
      const element = html`<mdw-checkbox aria-label=foo></mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [{ name }] = iterateMeaningfulAXNodes(results);
      assert.equal(name, 'foo');
    });

    it('labels based on slot', async () => {
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [{ name }] = iterateMeaningfulAXNodes(results);
      assert.equal(name, 'foo');
    });

    it('reports aria-checked with false', async () => {
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.isNotOk(checked);
    });

    it('updates aria-checked with true', async () => {
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.isOk(checked);
    });

    it('updates aria-checked with mixed', async function () {
      const element = html`<mdw-checkbox checked indeterminate>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [axNode] = iterateMeaningfulAXNodes(results);
      const { checked } = axNode;

      if (checked !== 'mixed' && element.refs.control.getAttribute('aria-checked') === 'mixed') {
        console.warn('Skipping test due to Playwright bug.');
        // Playwright bug. Firefox and Webkit report wrong value
        this.skip();
      }

      assert.equal(checked, 'mixed');
    });
  });
});