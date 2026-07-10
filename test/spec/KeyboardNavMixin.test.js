import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';
import KeyboardNavMixin from '../../mixins/KeyboardNavMixin.js';

const KeyboardNavTestElement = CustomElement
  .extend()
  .mixin(KeyboardNavMixin)
  .html`<slot id=slot></slot>`
  .autoRegister('mdw-keyboard-nav-test');

beforeEach(() => document.body.replaceChildren());

/**
 * @param {string} content
 * @return {InstanceType<KeyboardNavTestElement>}
 */
function createKeyboardNavTestElement(content) {
  const element = new KeyboardNavTestElement();
  element.innerHTML = content;
  document.body.append(element);
  return element;
}

/**
 * @param {HTMLElement} target
 * @param {string} key
 * @return {KeyboardEvent}
 */
function dispatchKeyboardNavigation(target, key) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    composed: true,
    key,
  });
  target.dispatchEvent(event);
  return event;
}

describe('KeyboardNavMixin', () => {
  it('adds roving tabindex to children without requiring author tabindex', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));

    assert.equal(first.tabIndex, 0);
    assert.equal(second.tabIndex, -1);
  });

  it('moves focus with vertical arrows and skips aria-hidden children', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=hidden aria-hidden=true>Hidden</button>
      <button id=third>Third</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const hidden = /** @type {HTMLButtonElement} */ (element.querySelector('#hidden'));
    const third = /** @type {HTMLButtonElement} */ (element.querySelector('#third'));

    first.focus();
    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isTrue(event.defaultPrevented);
    assert.equal(document.activeElement, third);
    assert.equal(element.ariaActiveDescendantElement, third);
    assert.equal(first.tabIndex, -1);
    assert.equal(hidden.tabIndex, -1);
    assert.equal(third.tabIndex, 0);
  });

  it('uses horizontal Left and Right when aria orientation is horizontal', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));

    element.updateAriaProperty('ariaOrientation', 'horizontal');
    first.focus();
    dispatchKeyboardNavigation(first, 'ArrowRight');

    assert.equal(document.activeElement, second);

    dispatchKeyboardNavigation(second, 'ArrowLeft');

    assert.equal(document.activeElement, first);
  });

  it('restores author tabindex values when kbdNav is disabled', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first tabindex=2>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));

    assert.equal(first.tabIndex, 0);
    assert.equal(second.tabIndex, -1);

    element.kbdNav = 'false';

    assert.equal(first.getAttribute('tabindex'), '2');
    assert.isFalse(second.hasAttribute('tabindex'));

    element.kbdNav = 'true';

    assert.equal(first.tabIndex, 0);
    assert.equal(second.tabIndex, -1);
  });

  it('updates roving tabindex when a child receives focus directly', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));

    second.focus();

    assert.equal(element.ariaActiveDescendantElement, second);
    assert.equal(first.tabIndex, -1);
    assert.equal(second.tabIndex, 0);
  });
});
