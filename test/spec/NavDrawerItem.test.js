import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import '../../components/NavDrawerItem.js';
import { html } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * @param {HTMLElement} target
 * @param {string} key
 * @return {KeyboardEvent}
 */
function dispatchKeydown(target, key) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    composed: true,
    key,
  });
  target.dispatchEvent(event);
  return event;
}

describe('mdw-nav-drawer-item expansion', () => {
  it('turns expandable items without href into button-like disclosure controls', async () => {
    /** @type {InstanceType<import('../../components/NavDrawerItem.js').default>} */
    const item = html`
      <mdw-nav-drawer-item>
        Parent
        <mdw-nav-drawer-item slot=expansion>Child</mdw-nav-drawer-item>
      </mdw-nav-drawer-item>
    `;
    await nextTask();
    const anchor = /** @type {HTMLElement} */ (item.refs.anchor);

    assert.isTrue(item._expandable);
    assert.equal(anchor.getAttribute('role'), 'button');
    assert.equal(anchor.getAttribute('tabindex'), '0');
    assert.isFalse(anchor.hasAttribute('href'));
    assert.equal(anchor.getAttribute('aria-expanded'), 'false');

    const clickEvent = new Event('click', { bubbles: true, cancelable: true, composed: true });
    anchor.dispatchEvent(clickEvent);

    assert.isTrue(clickEvent.defaultPrevented);
    assert.isTrue(item.expanded);
    assert.equal(anchor.getAttribute('aria-expanded'), 'true');

    const keyEvent = dispatchKeydown(anchor, ' ');

    assert.isTrue(keyEvent.defaultPrevented);
    assert.isFalse(item.expanded);
    assert.equal(anchor.getAttribute('aria-expanded'), 'false');

    const enterEvent = dispatchKeydown(anchor, 'Enter');

    assert.isTrue(enterEvent.defaultPrevented);
    assert.isTrue(item.expanded);
    assert.equal(anchor.getAttribute('aria-expanded'), 'true');
  });

  it('keeps expandable linked items as links instead of disclosure buttons', async () => {
    /** @type {InstanceType<import('../../components/NavDrawerItem.js').default>} */
    const item = html`
      <mdw-nav-drawer-item href="/parent">
        Parent
        <mdw-nav-drawer-item slot=expansion>Child</mdw-nav-drawer-item>
      </mdw-nav-drawer-item>
    `;
    await nextTask();
    const anchor = /** @type {HTMLElement} */ (item.refs.anchor);

    assert.isTrue(item._expandable);
    assert.equal(anchor.getAttribute('href'), '/parent');
    assert.isFalse(anchor.hasAttribute('role'));
    assert.isFalse(anchor.hasAttribute('tabindex'));
    assert.isFalse(anchor.hasAttribute('aria-controls'));
    assert.isFalse(anchor.hasAttribute('aria-expanded'));

    let defaultPreventedByComponent = false;
    anchor.addEventListener('click', (event) => {
      defaultPreventedByComponent = event.defaultPrevented;
      event.preventDefault();
    });

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, composed: true });
    anchor.dispatchEvent(clickEvent);

    assert.isFalse(defaultPreventedByComponent);
    assert.isFalse(item.expanded);
  });

  it('auto-expands and refuses to collapse while expansion contains the active item', async () => {
    /** @type {InstanceType<import('../../components/NavDrawerItem.js').default>} */
    const item = html`
      <mdw-nav-drawer-item>
        Parent
        <mdw-nav-drawer-item slot=expansion active>Active child</mdw-nav-drawer-item>
      </mdw-nav-drawer-item>
    `;
    await nextTask();
    const anchor = /** @type {HTMLElement} */ (item.refs.anchor);
    const activeChild = /** @type {InstanceType<import('../../components/NavDrawerItem.js').default>} */ (item.querySelector('mdw-nav-drawer-item[active]'));

    assert.isTrue(item._expandable);
    assert.isTrue(item.expanded);
    assert.equal(anchor.getAttribute('aria-expanded'), 'true');
    assert.isFalse(activeChild.inert);

    item.toggleExpanded(false);

    assert.isTrue(item.expanded);
    assert.equal(anchor.getAttribute('aria-expanded'), 'true');
  });

  it('auto-expands when a nested expansion item becomes active later', async () => {
    /** @type {InstanceType<import('../../components/NavDrawerItem.js').default>} */
    const item = html`
      <mdw-nav-drawer-item>
        Parent
        <mdw-nav-drawer-item slot=expansion>Child</mdw-nav-drawer-item>
      </mdw-nav-drawer-item>
    `;
    await nextTask();
    const anchor = /** @type {HTMLElement} */ (item.refs.anchor);
    const child = /** @type {InstanceType<import('../../components/NavDrawerItem.js').default>} */ (item.querySelector('mdw-nav-drawer-item'));

    assert.isTrue(item._expandable);
    assert.isFalse(item.expanded);
    assert.equal(anchor.getAttribute('aria-expanded'), 'false');
    assert.isTrue(child.inert);

    child.active = true;
    await nextTask();

    assert.isTrue(item.expanded);
    assert.equal(anchor.getAttribute('aria-expanded'), 'true');
    assert.isFalse(child.inert);
  });
});
