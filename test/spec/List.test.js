import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import List from '../../components/List.js';
import ListItem from '../../components/ListItem.js';
import { html, makeFromConstructor, makeFromString, makeFromTagName, sendKeypress } from '../utils.js';

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

  it('refreshes list and item semantics when the authored role changes', () => {
    /** @type {InstanceType<List>} */
    const list = html`
      <mdw-list>
        <mdw-list-item>Alpha</mdw-list-item>
        <mdw-list-item>Beta</mdw-list-item>
      </mdw-list>
    `;
    const [first, second] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);

    list.setAttribute('role', 'tree');

    assert.equal(list._listRole, 'tree');
    assert.equal(first._ariaRole, 'treeitem');
    assert.equal(second._ariaRole, 'treeitem');
    assert.equal(first.tabIndex, 0);
    assert.equal(second.tabIndex, -1);

    list.removeAttribute('role');

    assert.equal(list._listRole, 'list');
    assert.equal(first._ariaRole, 'listitem');
    assert.equal(second._ariaRole, 'listitem');
    assert.equal(first.tabIndex, -1);
    assert.equal(second.tabIndex, -1);
  });

  describe('tree keyboard navigation', () => {
    it('only treats nested expansion lists as tree branches', async () => {
      /** @type {InstanceType<List>} */
      const list = html`
        <mdw-list>
          <mdw-list-item>
            Details
            <button slot=expansion>Action</button>
          </mdw-list-item>
        </mdw-list>
      `;
      await nextTask();
      const [item] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);

      assert.equal(list._listRole, 'list');
      assert.equal(item._ariaRole, 'listitem');
    });

    it('uses Left and Right for disclosure navigation', async () => {
      /** @type {InstanceType<List>} */
      const list = html`
        <mdw-list>
          <mdw-list-item>
            Parent
            <mdw-list slot=expansion>
              <mdw-list-item>Child</mdw-list-item>
            </mdw-list>
          </mdw-list-item>
          <mdw-list-item>Sibling</mdw-list-item>
        </mdw-list>
      `;
      await nextTask();
      const [parent] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);
      const childList = /** @type {InstanceType<List>} */ (parent.querySelector('mdw-list'));
      const [child] = /** @type {InstanceType<ListItem>[]} */ ([...childList.children]);

      assert.equal(list._listRole, 'tree');
      assert.equal(parent._ariaRole, 'treeitem');
      assert.equal(childList._listRole, 'group');
      assert.equal(child._ariaRole, 'treeitem');
      assert.isFalse(parent.refs.row.hasAttribute('role'));
      assert.isFalse(parent.refs.row.hasAttribute('tabindex'));
      assert.isTrue(parent.refs.state.isConnected);
      assert.isTrue(parent.refs.rippleContainer.isConnected);
      assert.isFalse(parent.expanded);

      parent.focus();
      await sendKeypress('ArrowRight');
      assert.isTrue(parent.expanded);
      assert.equal(document.activeElement, parent);

      await sendKeypress('ArrowRight');
      assert.equal(document.activeElement, child);

      await sendKeypress('ArrowLeft');
      assert.equal(document.activeElement, parent);

      await sendKeypress('ArrowLeft');
      assert.isFalse(parent.expanded);
      assert.equal(document.activeElement, parent);
    });

    it('skips hidden items in the roving tabindex', async () => {
      /** @type {InstanceType<List>} */
      const list = html`
        <mdw-list>
          <mdw-list-item hidden>Hidden</mdw-list-item>
          <mdw-list-item>
            Parent
            <mdw-list slot=expansion>
              <mdw-list-item>Child</mdw-list-item>
            </mdw-list>
          </mdw-list-item>
        </mdw-list>
      `;
      await nextTask();
      const [hidden, parent] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);

      assert.equal(hidden.tabIndex, -1);
      assert.equal(parent.tabIndex, 0);
    });

    it('does not use tree arrows for non-list expansion content', async () => {
      /** @type {InstanceType<List>} */
      const list = html`
        <mdw-list>
          <mdw-list-item>
            Details
            <button slot=expansion>Action</button>
          </mdw-list-item>
          <mdw-list-item>
            Parent
            <mdw-list slot=expansion>
              <mdw-list-item>Child</mdw-list-item>
            </mdw-list>
          </mdw-list-item>
        </mdw-list>
      `;
      await nextTask();
      const [details] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);

      details.focus();
      const event = dispatchKeydown(details, 'ArrowRight');

      assert.isFalse(event.defaultPrevented);
      assert.isFalse(details.expanded);
    });

    it('does not expand disabled tree items with ArrowRight', async () => {
      /** @type {InstanceType<List>} */
      const list = html`
        <mdw-list>
          <mdw-list-item disabled>
            Parent
            <mdw-list slot=expansion>
              <mdw-list-item>Child</mdw-list-item>
            </mdw-list>
          </mdw-list-item>
        </mdw-list>
      `;
      await nextTask();
      const [parent] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);

      const event = dispatchKeydown(parent, 'ArrowRight');

      assert.isFalse(event.defaultPrevented);
      assert.isFalse(parent.expanded);
    });

    it('keeps explicit treeitem roles synchronized with expansion ARIA', async () => {
      /** @type {InstanceType<List>} */
      const list = html`
        <mdw-list>
          <mdw-list-item role=treeitem>
            Parent
            <mdw-list slot=expansion>
              <mdw-list-item>Child</mdw-list-item>
            </mdw-list>
          </mdw-list-item>
        </mdw-list>
      `;
      await nextTask();
      const [parent] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);

      assert.equal(parent._ariaRole, 'treeitem');
      assert.equal(parent.getAttribute('aria-expanded'), 'false');
      assert.isFalse(parent.refs.row.hasAttribute('aria-expanded'));
    });

    it('includes expanded child list items in roving tabindex', async () => {
      const container = html`
        <div>
          <mdw-list>
            <mdw-list-item expanded>
              Parent
              <mdw-list slot=expansion>
                <mdw-list-item>Child</mdw-list-item>
              </mdw-list>
            </mdw-list-item>
            <mdw-list-item>Sibling</mdw-list-item>
          </mdw-list>
          <button id=after>After</button>
        </div>
      `;
      await nextTask();
      /** @type {InstanceType<List>} */
      const list = container.querySelector('mdw-list');
      const after = /** @type {HTMLButtonElement} */ (container.querySelector('#after'));
      const [parent, sibling] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);
      const childList = /** @type {InstanceType<List>} */ (parent.querySelector('mdw-list'));
      const [child] = /** @type {InstanceType<ListItem>[]} */ ([...childList.children]);

      assert.equal(parent.tabIndex, 0);
      assert.equal(child.tabIndex, -1);
      assert.equal(sibling.tabIndex, -1);

      child.refs.row.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        composed: true,
      }));
      assert.equal(document.activeElement, child);

      parent.focus();
      await sendKeypress('ArrowDown');

      assert.equal(document.activeElement, child);
      assert.equal(parent.tabIndex, -1);
      assert.equal(child.tabIndex, 0);
      assert.equal(sibling.tabIndex, -1);

      await sendKeypress('ArrowDown');

      assert.equal(document.activeElement, sibling);
      assert.equal(parent.tabIndex, -1);
      assert.equal(child.tabIndex, -1);
      assert.equal(sibling.tabIndex, 0);

      await sendKeypress('ArrowUp');

      assert.equal(document.activeElement, child);
      assert.equal(child.tabIndex, 0);

      await sendKeypress('Tab');

      assert.equal(document.activeElement, after);
    });
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
