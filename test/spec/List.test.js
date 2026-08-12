import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import List from '../../components/List.js';
import ListItem from '../../components/ListItem.js';
import ListTree from '../../components/ListTree.js';
import { html, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

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

describe('mdw-list', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-list');
    assert.equal(element.tagName.toLowerCase(), 'mdw-list');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(List);
    assert.equal(element.tagName.toLowerCase(), 'mdw-list');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-list></mdw-list>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-list');
  });

  it('keeps native list behavior by default', () => {
    /** @type {InstanceType<List>} */
    const list = html`
      <mdw-list>
        <mdw-list-item>Alpha</mdw-list-item>
        <mdw-list-item>Beta</mdw-list-item>
      </mdw-list>
    `;
    const [first, second] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);

    assert.equal(list._listRole, 'list');
    assert.equal(first._ariaRole, 'listitem');
    assert.equal(second._ariaRole, 'listitem');
    assert.equal(first.tabIndex, -1);
    assert.equal(second.tabIndex, -1);
    assert.isFalse(first.refs.state.isConnected);
    assert.isFalse(first.refs.rippleContainer.isConnected);
  });

  it('does not infer tree ownership from nested expansion content', async () => {
    /** @type {InstanceType<List>} */
    const list = html`
      <mdw-list>
        <mdw-list-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const nested = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );

    assert.equal(list._listRole, 'list');
    assert.equal(parent._ariaRole, 'listitem');
    assert.instanceOf(nested, ListTree);
    assert.equal(nested._listRole, 'tree');
    assert.isNull(list._kbdTabStop);
  });
});

describe('mdw-list-item', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-list-item');
    assert.equal(element.tagName.toLowerCase(), 'mdw-list-item');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(ListItem);
    assert.equal(element.tagName.toLowerCase(), 'mdw-list-item');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-list-item></mdw-list-item>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-list-item');
  });

  it('toggles expansion from row click and keyboard activation', async () => {
    /** @type {InstanceType<ListItem>} */
    const item = html`
      <mdw-list-item>
        Parent
        <button slot=expansion id=details>Details</button>
      </mdw-list-item>
    `;
    await nextTask();
    const row = /** @type {HTMLElement} */ (item.refs.row);
    const details = /** @type {HTMLButtonElement} */ (item.querySelector('#details'));

    assert.isTrue(item._expandable);
    assert.equal(row.getAttribute('role'), 'button');
    assert.equal(row.getAttribute('tabindex'), '0');
    assert.equal(row.getAttribute('aria-expanded'), 'false');
    assert.isTrue(item.refs.state.isConnected);
    assert.isTrue(item.refs.rippleContainer.isConnected);
    assert.isTrue(details.inert);

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, composed: true });
    row.dispatchEvent(clickEvent);

    assert.isTrue(clickEvent.defaultPrevented);
    assert.isTrue(item.expanded);
    assert.equal(row.getAttribute('aria-expanded'), 'true');
    assert.isFalse(details.inert);

    const keyEvent = dispatchKeydown(row, 'Enter');

    assert.isTrue(keyEvent.defaultPrevented);
    assert.isFalse(item.expanded);
    assert.equal(row.getAttribute('aria-expanded'), 'false');
    assert.isTrue(details.inert);
  });

  it('does not toggle expansion while disabled', async () => {
    /** @type {InstanceType<ListItem>} */
    const item = html`
      <mdw-list-item disabled>
        Parent
        <button slot=expansion>Details</button>
      </mdw-list-item>
    `;
    await nextTask();
    const row = /** @type {HTMLElement} */ (item.refs.row);

    assert.equal(row.getAttribute('role'), 'button');
    assert.isFalse(row.hasAttribute('tabindex'));
    assert.equal(row.getAttribute('aria-disabled'), 'true');

    row.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }));

    assert.isFalse(item.expanded);
  });

  it('keeps expandable linked items navigational', async () => {
    /** @type {InstanceType<ListItem>} */
    const item = html`
      <mdw-list-item href=/parent>
        Parent
        <button slot=expansion>Details</button>
      </mdw-list-item>
    `;
    await nextTask();
    const anchor = /** @type {HTMLAnchorElement} */ (item.refs.anchor);
    let defaultPreventedByComponent = false;
    anchor.addEventListener('click', (event) => {
      defaultPreventedByComponent = event.defaultPrevented;
      event.preventDefault();
    });

    anchor.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    }));

    assert.isFalse(defaultPreventedByComponent);
    assert.isFalse(item.expanded);
    assert.isFalse(anchor.hasAttribute('aria-expanded'));
  });
});
