import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import TextArea from '../../components/TextArea.js';
import { html, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

describe('mdw-textarea', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-textarea');
    assert.equal(element.tagName.toLowerCase(), 'mdw-textarea');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(TextArea);
    assert.equal(element.tagName.toLowerCase(), 'mdw-textarea');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-textarea></mdw-textarea>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-textarea');
  });

  describe('[value]', () => {
    it('reads initial value from attribute', () => {
      /** @type {InstanceType<TextArea>} */
      const element = html`<mdw-textarea value="hello"></mdw-textarea>`;
      const control = /** @type {HTMLTextAreaElement} */ (element.shadowRoot.querySelector('#control'));
      assert.equal(element.defaultValue, 'hello');
      assert.equal(element.value, 'hello');
      assert.equal(control.value, 'hello');
    });

    it('writes property value to the internal textarea', () => {
      /** @type {InstanceType<TextArea>} */
      const element = html`<mdw-textarea></mdw-textarea>`;
      const control = /** @type {HTMLTextAreaElement} */ (element.shadowRoot.querySelector('#control'));

      element.value = 'updated over property';
      assert.equal(element.value, 'updated over property');
      assert.equal(control.value, 'updated over property');
    });

    it('tracks user input from the internal textarea', () => {
      /** @type {InstanceType<TextArea>} */
      const element = html`<mdw-textarea></mdw-textarea>`;
      const control = /** @type {HTMLTextAreaElement} */ (element.shadowRoot.querySelector('#control'));

      control.value = 'typed';
      control.dispatchEvent(new Event('input', { bubbles: true }));
      assert.equal(element.value, 'typed');
    });

    it('updates populated state when value is set/cleared over property', () => {
      /** @type {InstanceType<TextArea>} */
      const element = html`<mdw-textarea filled label="Notes"></mdw-textarea>`;
      const shape = /** @type {HTMLElement} */ (element.shadowRoot.querySelector('#shape'));

      assert.isFalse(shape.hasAttribute('populated'));
      element.value = 'hello';
      assert.isTrue(shape.hasAttribute('populated'));
      element.value = '';
      assert.isFalse(shape.hasAttribute('populated'));
    });
  });
});
