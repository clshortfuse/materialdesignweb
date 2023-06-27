import { assert } from '@esm-bundle/chai';

import Checkbox from '../../components/Checkbox.js';
import '../../theming/loader.js';
import { axTree, html, iterateMeaningfulAXNodes, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => {
  document.body.replaceChildren();
});

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
      const { value } = iterateMeaningfulAXNodes(results).next();
      assert.equal(value.role, 'checkbox');
    });

    it('supports aria-label', async () => {
      const element = html`<mdw-checkbox aria-label=foo></mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const { value } = iterateMeaningfulAXNodes(results).next();
      assert.equal(value.name, 'foo');
    });

    it('labels based on slot', async () => {
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const { value } = iterateMeaningfulAXNodes(results).next();
      assert.equal(value.name, 'foo');
    });

    it('updates aria-checked with true', async () => {
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const { value } = iterateMeaningfulAXNodes(results).next();
      assert.equal(value.checked, true);
    });

    it('updates aria-checked with mixed', async () => {
      const element = html`<mdw-checkbox checked indeterminate>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const { value } = iterateMeaningfulAXNodes(results).next();
      assert.equal(value.checked, 'mixed');
    });
  });
});
