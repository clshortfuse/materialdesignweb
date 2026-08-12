import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';
import KeyboardNavMixin from '../../mixins/KeyboardNavMixin.js';

const KeyboardNavTestElement = CustomElement
  .extend()
  .mixin(KeyboardNavMixin)
  .html`<slot id=slot></slot>`
  .autoRegister('mdw-keyboard-nav-test');

const KeyboardNavDisabledOptOutTestElement = CustomElement
  .extend()
  .mixin(KeyboardNavMixin)
  .define({
    kbdNavFocusableWhenDisabled() { return false; },
  })
  .html`<slot id=slot></slot>`
  .autoRegister('mdw-keyboard-nav-disabled-opt-out-test');

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Registers the focus-proxy fixture.
const KeyboardNavFocusProxyTestElement = CustomElement
  .extend()
  .methods({
    /** @type {HTMLElement['focus']} */
    focus(...options) {
      this.refs.control.focus(...options);
    },
  })
  .html`<button id=control><slot></slot></button>`
  .childEvents({
    control: {
      focusin(event) {
        event.stopPropagation();
      },
    },
  })
  .autoRegister('mdw-keyboard-nav-focus-proxy-test');

const KeyboardNavDescendantTestElement = CustomElement
  .extend()
  .mixin(KeyboardNavMixin)
  .overrides({
    _kbdOwnsKbdNavChild(child) {
      return child?.localName === 'button' && child.closest('mdw-keyboard-nav-descendant-test') === this;
    },
  })
  .define({
    kbdNavChildren() {
      return this.querySelectorAll('button');
    },
    _kbdNavUsesDirectChildren() { return false; },
  })
  .html`<slot id=slot></slot>`
  .autoRegister('mdw-keyboard-nav-descendant-test');

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

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
  it('adds roving tabindex without retaining navigation topology on connect', () => {
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

  it('uses roving DOM focus without active-descendant state', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));

    assert.isTrue(element.ariaActiveDescendantElement == null);

    first.remove();
    element.refreshTabIndexes();

    assert.isTrue(element.ariaActiveDescendantElement == null);
    assert.isTrue(element._kbdTabStop === second);
  });

  it('preserves the disabled-focus compatibility opt-out', () => {
    const element = new KeyboardNavDisabledOptOutTestElement();
    element.innerHTML = `
      <button id=disabled aria-disabled=true>Disabled</button>
      <button id=enabled>Enabled</button>
    `;
    document.body.append(element);
    const disabled = /** @type {HTMLButtonElement} */ (
      element.querySelector('#disabled')
    );
    const enabled = /** @type {HTMLButtonElement} */ (
      element.querySelector('#enabled')
    );

    assert.isFalse(element.kbdNavFocusableWhenDisabled);
    assert.equal(disabled.tabIndex, -1);
    assert.equal(enabled.tabIndex, 0);
    assert.isTrue(element.focusCurrentOrFirst() === enabled);
  });

  it('does not restore managed state when focus disables navigation', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first tabindex=2>First</button>
      <button id=second tabindex=3>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));
    first.focus();
    second.addEventListener('focus', () => {
      element.kbdNav = 'false';
    }, { once: true });

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isFalse(event.defaultPrevented);
    assert.isFalse(element.shouldUseKbdNav());
    assert.equal(first.getAttribute('tabindex'), '2');
    assert.equal(second.getAttribute('tabindex'), '3');
    assert.equal(element._kbdManagedTabIndexes?.size ?? 0, 0);
    assert.isNull(element._kbdTabStop);
  });

  it('stops traversal when focus disables navigation', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
      <button id=third>Third</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));
    const third = /** @type {HTMLButtonElement} */ (element.querySelector('#third'));
    let thirdFocuses = 0;
    first.focus();
    second.addEventListener('focus', () => {
      element.kbdNav = 'false';
    }, { once: true });
    third.addEventListener('focus', () => { thirdFocuses += 1; });

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isFalse(event.defaultPrevented);
    assert.isFalse(element.shouldUseKbdNav());
    assert.equal(thirdFocuses, 0);
    assert.isTrue(document.activeElement === second);
  });

  it('requires an explicit consumer signal for targets inserted after connection', async () => {
    const element = new KeyboardNavTestElement();
    const first = document.createElement('button');
    const second = document.createElement('button');
    element.append(first);
    document.body.append(element);

    element.append(second);
    await nextTask();

    assert.equal(first.tabIndex, 0);
    assert.isFalse(second.hasAttribute('tabindex'));

    element.refreshTabIndexes();

    assert.equal(first.tabIndex, 0);
    assert.equal(second.tabIndex, -1);
  });

  it('lets actual focus behavior decide for aria-hidden children', () => {
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
    assert.equal(document.activeElement, hidden);
    assert.isTrue(element.ariaActiveDescendantElement == null);
    assert.equal(first.tabIndex, -1);
    assert.equal(hidden.tabIndex, 0);
    assert.equal(third.tabIndex, -1);
  });

  it('lets actual focus behavior decide for natively disabled controls', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=disabled disabled>Disabled</button>
      <button id=enabled>Enabled</button>
    `);
    const disabled = /** @type {HTMLButtonElement} */ (element.querySelector('#disabled'));
    const enabled = /** @type {HTMLButtonElement} */ (element.querySelector('#enabled'));

    assert.equal(disabled.tabIndex, 0);
    assert.equal(enabled.tabIndex, -1);

    assert.strictEqual(element.focusCurrentOrFirst(), enabled);
    assert.equal(document.activeElement, enabled);
    assert.equal(disabled.tabIndex, -1);
    assert.equal(enabled.tabIndex, 0);
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

  it('prefers authored host ARIA attributes over internals defaults', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));

    element.setAttribute('role', 'toolbar');
    element.setAttribute('aria-orientation', 'horizontal');

    assert.equal(element.readAriaProperty('role'), 'toolbar');
    assert.equal(element.readAriaProperty('ariaOrientation'), 'horizontal');

    first.focus();
    dispatchKeyboardNavigation(first, 'ArrowRight');

    assert.equal(document.activeElement, second);
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

    assert.isTrue(element.ariaActiveDescendantElement == null);
    assert.equal(first.tabIndex, -1);
    assert.equal(second.tabIndex, 0);
  });

  it('navigates direct children without reading or retaining a collection', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));
    first.focus();
    const getKbdNavChildren = element.getKbdNavChildren;
    let collectionReads = 0;
    element.getKbdNavChildren = function getKbdNavChildrenCounter() {
      collectionReads += 1;
      return getKbdNavChildren.call(this);
    };

    dispatchKeyboardNavigation(first, 'ArrowDown');
    dispatchKeyboardNavigation(second, 'ArrowUp');
    dispatchKeyboardNavigation(first, 'End');

    assert.equal(collectionReads, 0);
    assert.equal(document.activeElement, second);
  });

  it('ignores a non-owned direct authored tab stop', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <span id=decoy tabindex=0>Decoy</span>
      <button id=owned>Owned</button>
    `);
    const decoy = /** @type {HTMLSpanElement} */ (element.querySelector('#decoy'));
    const owned = /** @type {HTMLButtonElement} */ (element.querySelector('#owned'));
    Object.defineProperty(element, 'kbdNavQuery', { value: 'button' });
    element.refreshTabIndexes();

    assert.equal(element.focusCurrentOrFirst(), owned);
    assert.equal(document.activeElement, owned);
    assert.equal(decoy.tabIndex, 0);
  });

  it('reconciles direct children without materializing navigation order', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first tabindex=2>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));
    const third = document.createElement('button');
    let customOrderReads = 0;
    element.getKbdNavChildren = function getKbdNavChildrenCounter() {
      customOrderReads += 1;
      return [];
    };

    element.append(third);
    element.refreshTabIndexes();

    assert.equal(customOrderReads, 0);

    element.focusCurrentOrFirst();
    element.focus();

    assert.equal(first.tabIndex, 0);
    assert.equal(second.tabIndex, -1);
    assert.equal(third.tabIndex, -1);

    first.remove();
    element.refreshTabIndexes();

    assert.equal(customOrderReads, 0);
    assert.equal(first.getAttribute('tabindex'), '2');
    assert.equal(second.tabIndex, 0);
    assert.isFalse(element._kbdManagedTabIndexes.has(first));
  });

  it('uses live direct additions and removals without invalidation state', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));
    const getKbdNavChildren = element.getKbdNavChildren;
    let collectionReads = 0;
    element.getKbdNavChildren = function getKbdNavChildrenCounter() {
      collectionReads += 1;
      return getKbdNavChildren.call(this);
    };
    const third = document.createElement('button');
    const graphic = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const wrapper = document.createElement('div');
    const nested = document.createElement('button');
    wrapper.append(nested);

    element.append(graphic, third, wrapper);
    first.focus();
    dispatchKeyboardNavigation(first, 'ArrowDown');
    dispatchKeyboardNavigation(second, 'ArrowDown');

    assert.equal(document.activeElement, third);
    assert.equal(collectionReads, 0);
    assert.isFalse(nested.hasAttribute('tabindex'));

    second.remove();
    dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.equal(document.activeElement, third);
    assert.equal(collectionReads, 0);
  });

  it('uses current DOM order after a same-task reorder', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
      <button id=third>Third</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));
    const third = /** @type {HTMLButtonElement} */ (element.querySelector('#third'));
    first.focus();
    dispatchKeyboardNavigation(first, 'End');
    first.focus();
    const getKbdNavChildren = element.getKbdNavChildren;
    let collectionReads = 0;
    element.getKbdNavChildren = function getKbdNavChildrenCounter() {
      collectionReads += 1;
      return getKbdNavChildren.call(this);
    };

    second.before(third);
    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isTrue(event.defaultPrevented);
    assert.equal(collectionReads, 0);
    assert.equal(document.activeElement, third);
    assert.deepEqual([...element.kbdNavChildren], [first, third, second]);
  });

  it('stops live traversal after a candidate receives focus before reparenting', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=moved>Moved</button>
      <button id=third>Third</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const moved = /** @type {HTMLButtonElement} */ (element.querySelector('#moved'));
    const third = /** @type {HTMLButtonElement} */ (element.querySelector('#third'));
    const outside = document.createElement('div');
    const intruder = document.createElement('button');
    outside.append(intruder);
    document.body.append(outside);
    moved.addEventListener('focus', () => outside.prepend(moved), { once: true });
    first.focus();

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isTrue(event.defaultPrevented);
    assert.strictEqual(moved.parentElement, outside);
    assert.isFalse(element._kbdManagedTabIndexes.has(moved));
    assert.isFalse(element._kbdManagedTabIndexes.has(intruder));
    assert.isFalse(moved.hasAttribute('tabindex'));
    assert.isFalse(intruder.hasAttribute('tabindex'));
    assert.strictEqual(element._kbdTabStop, first);
    assert.isFalse(document.activeElement === third);
    assert.isFalse(document.activeElement === intruder);
  });

  it('continues past a candidate rejected by native focus', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=rejected style="display: none">Rejected</button>
      <button id=third>Third</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const third = /** @type {HTMLButtonElement} */ (element.querySelector('#third'));
    first.focus();

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isTrue(event.defaultPrevented);
    assert.strictEqual(document.activeElement, third);
    assert.strictEqual(element._kbdTabStop, third);
  });

  it('continues past a rejected direct candidate that synchronously reorders itself', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=rejected>Rejected</button>
      <button id=later>Later</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const rejected = /** @type {HTMLButtonElement} */ (element.querySelector('#rejected'));
    const later = /** @type {HTMLButtonElement} */ (element.querySelector('#later'));
    rejected.focus = () => { element.append(rejected); };
    first.focus();

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isTrue(event.defaultPrevented);
    assert.isTrue(document.activeElement === later);
    assert.isTrue(element._kbdTabStop === later);
    assert.isTrue(element.children[0] === first);
    assert.isTrue(element.children[1] === later);
    assert.isTrue(element.children[2] === rejected);
  });

  it('does not wrap after rejected focus removes the current direct target', () => {
    const forward = createKeyboardNavTestElement(`
      <button id=before>Before</button>
      <button id=current>Current</button>
      <button id=rejected>Rejected</button>
    `);
    const before = /** @type {HTMLButtonElement} */ (forward.querySelector('#before'));
    const current = /** @type {HTMLButtonElement} */ (forward.querySelector('#current'));
    const rejected = /** @type {HTMLButtonElement} */ (forward.querySelector('#rejected'));
    let beforeFocuses = 0;
    before.addEventListener('focus', () => { beforeFocuses += 1; });
    rejected.focus = () => { current.remove(); };
    current.focus();

    const next = forward.focusNext(current, false);

    assert.isNull(next);
    assert.equal(beforeFocuses, 0);

    const reverse = createKeyboardNavTestElement(`
      <button id=rejected>Rejected</button>
      <button id=current>Current</button>
      <button id=after>After</button>
    `);
    const reverseRejected = /** @type {HTMLButtonElement} */ (reverse.querySelector('#rejected'));
    const reverseCurrent = /** @type {HTMLButtonElement} */ (reverse.querySelector('#current'));
    const after = /** @type {HTMLButtonElement} */ (reverse.querySelector('#after'));
    let afterFocuses = 0;
    after.addEventListener('focus', () => { afterFocuses += 1; });
    reverseRejected.focus = () => { reverseCurrent.remove(); };
    reverseCurrent.focus();

    const previous = reverse.focusPrevious(reverseCurrent, false);

    assert.isNull(previous);
    assert.equal(afterFocuses, 0);
  });

  it('continues edge traversal after rejected edge candidates reorder themselves', () => {
    const forward = createKeyboardNavTestElement(`
      <button id=rejected>Rejected</button>
      <button id=later>Later</button>
    `);
    const forwardRejected = /** @type {HTMLButtonElement} */ (forward.querySelector('#rejected'));
    const later = /** @type {HTMLButtonElement} */ (forward.querySelector('#later'));
    forwardRejected.focus = () => { forward.append(forwardRejected); };

    const first = forward.focusFirst();

    assert.isTrue(first === later);
    assert.isTrue(document.activeElement === later);

    const reverse = createKeyboardNavTestElement(`
      <button id=later>Later</button>
      <button id=rejected>Rejected</button>
    `);
    const reverseRejected = /** @type {HTMLButtonElement} */ (reverse.querySelector('#rejected'));
    const reverseLater = /** @type {HTMLButtonElement} */ (reverse.querySelector('#later'));
    reverseRejected.focus = () => { reverse.prepend(reverseRejected); };

    const last = reverse.focusLast();

    assert.isTrue(last === reverseLater);
    assert.isTrue(document.activeElement === reverseLater);
  });

  it('continues focusCurrentOrFirst after a rejected direct candidate reorders itself', () => {
    const element = createKeyboardNavTestElement(`
      <button id=current style="display: none">Current</button>
      <button id=rejected>Rejected</button>
      <button id=later>Later</button>
    `);
    const rejected = /** @type {HTMLButtonElement} */ (element.querySelector('#rejected'));
    const later = /** @type {HTMLButtonElement} */ (element.querySelector('#later'));
    rejected.focus = () => { element.append(rejected); };

    const focused = element.focusCurrentOrFirst();

    assert.isTrue(focused === later);
    assert.isTrue(document.activeElement === later);
  });

  it('removes the receipt listener after a rejected native focus attempt', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=rejected style="display: none">Rejected</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const rejected = /** @type {HTMLButtonElement} */ (element.querySelector('#rejected'));
    let focusListenerAdds = 0;
    let focusListenerRemovals = 0;
    const addEventListener = rejected.addEventListener;
    const removeEventListener = rejected.removeEventListener;
    /** @param {Parameters<typeof rejected.addEventListener>} args */
    rejected.addEventListener = function addEventListenerCounter(...args) {
      if (args[0] === 'focus') {
        focusListenerAdds += 1;
      }
      return addEventListener.apply(this, args);
    };
    /** @param {Parameters<typeof rejected.removeEventListener>} args */
    rejected.removeEventListener = function removeEventListenerCounter(...args) {
      if (args[0] === 'focus') {
        focusListenerRemovals += 1;
      }
      return removeEventListener.apply(this, args);
    };
    first.focus();

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isFalse(event.defaultPrevented);
    assert.equal(focusListenerAdds, 1);
    assert.equal(focusListenerRemovals, 1);
    assert.isTrue(document.activeElement === first);
  });

  it('restores a previous tab stop reparented while the next target focuses', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first tabindex=2>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));
    const outside = document.createElement('div');
    document.body.append(outside);
    second.addEventListener('focus', () => outside.append(first), { once: true });
    first.focus();

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isTrue(event.defaultPrevented);
    assert.strictEqual(document.activeElement, second);
    assert.strictEqual(first.parentElement, outside);
    assert.equal(first.getAttribute('tabindex'), '2');
    assert.isFalse(element._kbdManagedTabIndexes.has(first));
  });

  it('stops custom traversal after a candidate receives focus before reparenting', () => {
    const element = new KeyboardNavDescendantTestElement();
    const wrapper = document.createElement('div');
    const first = document.createElement('button');
    const moved = document.createElement('button');
    const third = document.createElement('button');
    const outside = document.createElement('div');
    wrapper.append(first, moved, third);
    element.append(wrapper);
    document.body.append(element, outside);
    moved.addEventListener('focus', () => outside.append(moved), { once: true });
    first.focus();

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isTrue(event.defaultPrevented);
    assert.strictEqual(moved.parentElement, outside);
    assert.isFalse(element._kbdManagedTabIndexes.has(moved));
    assert.isFalse(moved.hasAttribute('tabindex'));
    assert.isFalse(document.activeElement === third);
    assert.strictEqual(element._kbdTabStop, first);
    assert.isTrue(element.ariaActiveDescendantElement == null);
  });

  it('does not continue custom order after focus is received before reparenting', () => {
    const element = new KeyboardNavDescendantTestElement();
    const wrapper = document.createElement('div');
    const first = document.createElement('button');
    const moved = document.createElement('button');
    const later = document.createElement('button');
    const outside = document.createElement('div');
    let outsideFocuses = 0;
    wrapper.append(first, moved, later);
    element.append(wrapper);
    document.body.append(element, outside);
    moved.addEventListener('focus', () => outside.append(moved, later), { once: true });
    later.addEventListener('focus', () => { outsideFocuses += 1; });
    first.focus();

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    element.refreshTabIndexes();

    assert.isTrue(event.defaultPrevented);
    assert.strictEqual(moved.parentElement, outside);
    assert.strictEqual(later.parentElement, outside);
    assert.equal(outsideFocuses, 0);
    assert.isFalse(element._kbdManagedTabIndexes.has(moved));
    assert.isFalse(element._kbdManagedTabIndexes.has(later));
  });

  it('continues after a live candidate rejects focus and ignores nested topology', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
      <button id=third>Third</button>
      <div id=wrapper></div>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));
    const third = /** @type {HTMLButtonElement} */ (element.querySelector('#third'));
    const wrapper = /** @type {HTMLDivElement} */ (element.querySelector('#wrapper'));
    first.focus();
    dispatchKeyboardNavigation(first, 'End');
    first.focus();
    const getKbdNavChildren = element.getKbdNavChildren;
    let collectionReads = 0;
    element.getKbdNavChildren = function getKbdNavChildrenCounter() {
      collectionReads += 1;
      return getKbdNavChildren.call(this);
    };

    wrapper.append(document.createElement('button'));
    second.hidden = true;
    dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.equal(collectionReads, 0);
    assert.equal(document.activeElement, third);
    assert.isFalse(wrapper.querySelector('button').hasAttribute('tabindex'));
  });

  it('reads a custom descendant order per navigation without retaining it', () => {
    const element = new KeyboardNavDescendantTestElement();
    const wrapper = document.createElement('div');
    const first = document.createElement('button');
    const second = document.createElement('button');
    wrapper.append(first, second);
    element.append(wrapper);
    document.body.append(element);
    let orderReads = 0;
    Object.defineProperty(element, 'kbdNavChildren', {
      get() {
        orderReads += 1;
        return element.querySelectorAll('button');
      },
    });

    element.refreshTabIndexes();

    assert.equal(orderReads, 1);

    first.focus();
    dispatchKeyboardNavigation(first, 'ArrowDown');
    const firstNavigationReads = orderReads;
    const third = document.createElement('button');

    second.before(third);
    first.focus();
    dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.equal(document.activeElement, third);
    assert.isAbove(firstNavigationReads, 1);
    assert.isAbove(orderReads, firstNavigationReads);
    assert.deepEqual([...element.kbdNavChildren], [first, third, second]);
  });

  it('updates its tab stop when an owned focus proxy suppresses focusin', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <mdw-keyboard-nav-focus-proxy-test id=first tabindex=2>First</mdw-keyboard-nav-focus-proxy-test>
      <mdw-keyboard-nav-focus-proxy-test id=second tabindex=3>Second</mdw-keyboard-nav-focus-proxy-test>
    `);
    const first = /** @type {InstanceType<KeyboardNavFocusProxyTestElement>} */ (
      element.querySelector('#first')
    );
    const second = /** @type {InstanceType<KeyboardNavFocusProxyTestElement>} */ (
      element.querySelector('#second')
    );

    first.focus();
    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isTrue(event.defaultPrevented);
    assert.equal(document.activeElement, second);
    assert.strictEqual(element._kbdTabStop, second);
    assert.equal(first.tabIndex, -1);
    assert.equal(second.tabIndex, 0);
  });

  it('continues after the preferred target rejects focus', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const direct = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
    `);
    const directFirst = /** @type {HTMLButtonElement} */ (direct.querySelector('#first'));
    const directSecond = /** @type {HTMLButtonElement} */ (direct.querySelector('#second'));
    directFirst.focus = () => {};

    assert.equal(direct.focusCurrentOrFirst(), directSecond);

    const custom = new KeyboardNavDescendantTestElement();
    const wrapper = document.createElement('div');
    const customFirst = document.createElement('button');
    const customSecond = document.createElement('button');
    customFirst.focus = () => {};
    wrapper.append(customFirst, customSecond);
    custom.append(wrapper);
    document.body.append(custom);

    assert.equal(custom.focusCurrentOrFirst(), customSecond);
  });

  it('does not consume navigation when every focus attempt fails', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));
    first.focus();
    second.focus = () => {};

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isFalse(event.defaultPrevented);
    assert.equal(document.activeElement, first);
    assert.isNull(element.focusPrevious(first, false));
  });

  it('does not consume navigation when every custom-order focus attempt fails', () => {
    const element = new KeyboardNavDescendantTestElement();
    const wrapper = document.createElement('div');
    const first = document.createElement('button');
    const second = document.createElement('button');
    second.focus = () => {};
    wrapper.append(first, second);
    element.append(wrapper);
    document.body.append(element);
    first.focus();

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isFalse(event.defaultPrevented);
    assert.equal(document.activeElement, first);
    assert.isNull(element.focusNext(first));
  });

  it('does not consume keys that leave focus on the same target', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement('<button>Only</button>');
    const only = /** @type {HTMLButtonElement} */ (element.firstElementChild);
    only.focus();

    const arrowEvent = dispatchKeyboardNavigation(only, 'ArrowDown');
    const homeEvent = dispatchKeyboardNavigation(only, 'Home');
    const endEvent = dispatchKeyboardNavigation(only, 'End');

    assert.isFalse(arrowEvent.defaultPrevented);
    assert.isFalse(homeEvent.defaultPrevented);
    assert.isFalse(endEvent.defaultPrevented);
    assert.equal(document.activeElement, only);
  });

  it('accepts transient focus receipt without committing the target', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));
    first.focus();
    first.focus = () => {};
    second.focus = function transientFocus(...options) {
      HTMLButtonElement.prototype.focus.call(this, ...options);
      this.blur();
    };

    const event = dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.isTrue(event.defaultPrevented);
    assert.equal(element._kbdTabStop, first);
    assert.equal(first.tabIndex, 0);
    assert.equal(second.tabIndex, -1);
  });

  it('does not consume arrow keys from nested native controls', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <div id=managed tabindex=0><input id=nested></div>
      <button id=next>Next</button>
    `);
    const input = /** @type {HTMLInputElement} */ (element.querySelector('#nested'));

    input.focus();
    const event = dispatchKeyboardNavigation(input, 'ArrowDown');

    assert.isFalse(event.defaultPrevented);
    assert.equal(document.activeElement, input);
  });

  it('restores authored state and reconnects without topology state', () => {
    /** @type {InstanceType<KeyboardNavTestElement>} */
    const element = createKeyboardNavTestElement(`
      <button id=first tabindex=2>First</button>
      <button id=second>Second</button>
    `);
    const first = /** @type {HTMLButtonElement} */ (element.querySelector('#first'));
    const second = /** @type {HTMLButtonElement} */ (element.querySelector('#second'));
    first.focus();
    dispatchKeyboardNavigation(first, 'ArrowDown');

    element.remove();

    assert.equal(first.getAttribute('tabindex'), '2');
    assert.isFalse(second.hasAttribute('tabindex'));
    assert.isNull(element._kbdTabStop);

    document.body.append(element);
    first.focus();
    dispatchKeyboardNavigation(first, 'ArrowDown');

    assert.equal(document.activeElement, second);
  });
});
