import { assert } from '@esm-bundle/chai';

import Checkbox from '../../components/Checkbox.js';
import '../../theming/loader.js';
import { axTree, html, iterateMeaningfulAXNodes, leftClickElement, makeFromConstructor, makeFromString, makeFromTagName, sendKeypress } from '../utils.js';

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

  describe('[checked]/.defaultChecked', () => {
    it('can be set via property', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.defaultChecked);
      assert.isNull(element.getAttribute('checked'));

      element.defaultChecked = true;

      assert.isTrue(element.defaultChecked);
      assert.equal(element.getAttribute('checked'), '');
    });

    it('can be set via attribute', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.defaultChecked);
      assert.isNull(element.getAttribute('checked'));

      element.setAttribute('checked', '');

      assert.isTrue(element.defaultChecked);
      assert.equal(element.getAttribute('checked'), '');
    });

    it('can be unset via property', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      assert.isTrue(element.defaultChecked);
      assert.equal(element.getAttribute('checked'), '');

      element.defaultChecked = false;

      assert.isFalse(element.defaultChecked);
      assert.isNull(element.getAttribute('checked'));
    });

    it('can be unset via attribute', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      assert.isTrue(element.defaultChecked);
      assert.equal(element.getAttribute('checked'), '');

      element.removeAttribute('checked');

      assert.isFalse(element.defaultChecked);
      assert.isNull(element.getAttribute('checked'));
    });
  });

  describe('.checked', () => {
    it('initially false if not [checked]', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.checked);
    });

    it('initially true if [checked]', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      assert.isTrue(element.checked);
    });

    it('modified by [checked] if not dirty', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.checked);

      element.defaultChecked = true;

      assert.isTrue(element.checked);
    });

    it('not modified by [checked] if dirty', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.checked);
      element.checked = true;
      assert.isTrue(element.checked);
      element.checked = false;
      assert.isFalse(element.checked);
      element.defaultChecked = true;
      assert.isFalse(element.checked);
    });

    it('does not fire events on programmatic check', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      let fired = false;
      element.addEventListener('change', () => { fired = true; });
      element.addEventListener('input', () => { fired = true; });

      element.checked = true;
      assert.isFalse(fired);
    });

    it('does check on click', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      await leftClickElement(element);
      assert.isTrue(element.checked);
    });

    it('does fire events on click', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      let firedInput = false;
      let firedChange = false;
      element.addEventListener('input', (e) => {
        firedInput = true;
        assert.isTrue(element.checked);
        assert.isFalse(firedChange);
        assert.isTrue(e.bubbles);
        assert.isTrue(e.composed);
      });
      element.addEventListener('change', (e) => {
        firedChange = true;
        assert.isTrue(firedInput);
        assert.isTrue(element.checked);
        assert.isTrue(e.bubbles);
        assert.isFalse(e.composed);
      });

      await leftClickElement(element);

      assert.isTrue(firedChange);
      assert.isTrue(firedInput);
    });

    it('does fire click on spacebar', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      let firedClick = false;
      let firedInput = false;
      let firedChange = false;
      element.addEventListener('click', () => {
        firedClick = true;
        assert.isFalse(element.checked);
        assert.isFalse(firedInput);
        assert.isFalse(firedChange);
      });

      element.addEventListener('input', (e) => {
        firedInput = true;
        assert.isTrue(element.checked);
        assert.isFalse(firedChange);
        assert.isTrue(e.bubbles);
        assert.isTrue(e.composed);
      });
      element.addEventListener('change', (e) => {
        firedChange = true;
        assert.isTrue(firedInput);
        assert.isTrue(element.checked);
        assert.isTrue(e.bubbles);
        assert.isFalse(e.composed);
      });

      element.focus();
      await sendKeypress(' ');

      assert.isTrue(firedClick);
      assert.isTrue(firedChange);
      assert.isTrue(firedInput);
    });

    it('does not fire events when disabled', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox disabled>foo</mdw-checkbox>`;
      let fired = false;
      element.addEventListener('change', () => { fired = true; });
      element.addEventListener('input', () => { fired = true; });

      await leftClickElement(element);

      assert.isFalse(fired);
    });
  });

  describe('.indeterminate', () => {
    it('initially false', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.checked);
      assert.isFalse(element.indeterminate);
    });

    it('can be set via property', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      element.indeterminate = true;
      assert.isTrue(element.indeterminate);
    });

    it('set false on .checked change', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      element.indeterminate = true;
      element.checked = true;
      assert.isFalse(element.indeterminate);
    });

    it('not changed by .defaultChecked', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      element.indeterminate = true;
      element.defaultChecked = true;
      assert.isTrue(element.indeterminate);
    });
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

    it('reports aria-checked with true', async () => {
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.isOk(checked);
    });

    it('reports aria-checked with mixed', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      element.indeterminate = true;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.equal(checked, 'mixed');
    });

    it('reports aria-checked=false on uncheck', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      element.checked = false;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.isNotOk(checked);
    });

    it('reports aria-checked=false on cleared indeterminate', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      element.indeterminate = true;
      element.checked = false;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.isNotOk(checked);
    });

    it('reports aria-checked=true on cleared indeterminate', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      element.indeterminate = true;
      element.checked = true;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.isOk(checked);
    });
  });
});
