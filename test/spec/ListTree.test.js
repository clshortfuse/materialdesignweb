import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import '../../components/ListItem.js';
import ListTree from '../../components/ListTree.js';
import { html, makeFromConstructor, sendKeypress } from '../utils.js';

/** @typedef {import('../../components/ListItem.js').default} ListItem */

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

describe('mdw-list-tree', () => {
  it('creates an explicit tree element', () => {
    const element = makeFromConstructor(ListTree);

    assert.equal(element.localName, 'mdw-list-tree');
    assert.equal(element._listRole, 'tree');
  });

  it('uses Left and Right for disclosure navigation', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
        <mdw-list-item>Sibling</mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [parent] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);
    const childList = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
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

  it('activates linked treeitems from their single managed tab stop', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item href=#destination>Destination</mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const anchor = /** @type {HTMLAnchorElement} */ (item.refs.anchor);
    let activations = 0;
    anchor.addEventListener('click', (event) => {
      activations += 1;
      event.preventDefault();
    });

    assert.equal(item.tabIndex, 0);
    assert.equal(anchor.tabIndex, -1);

    item.focus();
    const event = dispatchKeydown(item, 'Enter');

    assert.isTrue(event.defaultPrevented);
    assert.equal(activations, 1);
    assert.isTrue(document.activeElement === item);
  });

  it('reconciles one owner once when an expansion group is inserted', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <span slot=expansion>Existing expansion</span>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const group = document.createElement('mdw-list-tree');
    group.slot = 'expansion';
    group.innerHTML = '<mdw-list-item>Child</mdw-list-item>';
    const refreshTabIndexes = list.refreshTabIndexes;
    const setListRole = parent._setListRole;
    let refreshes = 0;
    let roleUpdates = 0;
    list.refreshTabIndexes = function refreshTabIndexesCounter() {
      refreshes += 1;
      return refreshTabIndexes.call(this);
    };
    parent._setListRole = function setListRoleCounter(...args) {
      roleUpdates += 1;
      return setListRole.apply(this, args);
    };

    parent.append(group);
    await nextTask();

    assert.equal(refreshes, 1);
    assert.equal(roleUpdates, 1);
    assert.equal(group._listRole, 'group');
    assert.isTrue(list._kbdManagedTabIndexes.has(group.firstElementChild));
  });

  it('reconciles one owner once for nested expansion insertion', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item id=nested-parent expanded>
              Nested parent
              <span slot=expansion>Existing expansion</span>
            </mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const nestedParent = /** @type {InstanceType<ListItem>} */ (
      list.querySelector('#nested-parent')
    );
    const group = document.createElement('mdw-list-tree');
    group.slot = 'expansion';
    group.innerHTML = '<mdw-list-item>Nested child</mdw-list-item>';
    const refreshTabIndexes = list.refreshTabIndexes;
    let refreshes = 0;
    list.refreshTabIndexes = function refreshTabIndexesCounter() {
      refreshes += 1;
      return refreshTabIndexes.call(this);
    };

    nestedParent.append(group);
    await nextTask();

    assert.equal(refreshes, 1);
    assert.equal(group._listRole, 'group');
    assert.isTrue(list._kbdManagedTabIndexes.has(group.firstElementChild));
  });

  it('derives ownership from expansion topology instead of role attributes', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree role=tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const group = /** @type {InstanceType<ListTree>} */ (
      list.querySelector('mdw-list-tree')
    );

    assert.equal(group._listRole, 'group');
    assert.isTrue(list._kbdManagedTabIndexes.has(group.firstElementChild));

    group.setAttribute('role', 'listbox');

    assert.equal(group._listRole, 'group');
    assert.isTrue(list._kbdManagedTabIndexes.has(group.firstElementChild));

    group.removeAttribute('slot');
    await nextTask();

    assert.equal(group._listRole, 'tree');
    assert.isFalse(list._kbdManagedTabIndexes.has(group.firstElementChild));
    assert.isTrue(group._kbdManagedTabIndexes.has(group.firstElementChild));
  });

  it('does not synthesize unmodified activation for modified Enter', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item href=#destination>Destination</mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const anchor = /** @type {HTMLAnchorElement} */ (item.refs.anchor);
    let activations = 0;
    anchor.addEventListener('click', (event) => {
      activations += 1;
      event.preventDefault();
    });
    item.focus();

    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      composed: true,
      ctrlKey: true,
      key: 'Enter',
    });
    item.dispatchEvent(event);

    assert.isFalse(event.defaultPrevented);
    assert.equal(activations, 0);
    assert.isTrue(document.activeElement === item);
  });

  it('does not consume Home or End when tree focus is already at the edge', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item>First</mdw-list-item>
        <mdw-list-item>Last</mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [first, last] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);

    first.focus();
    const homeEvent = dispatchKeydown(first, 'Home');
    const homeKeptFocus = document.activeElement === first;

    last.focus();
    const endEvent = dispatchKeydown(last, 'End');
    const endKeptFocus = document.activeElement === last;

    assert.isFalse(homeEvent.defaultPrevented);
    assert.isTrue(homeKeptFocus);
    assert.isFalse(endEvent.defaultPrevented);
    assert.isTrue(endKeptFocus);
    assert.strictEqual(list._kbdTabStop, last);
  });

  it('does not combine horizontal linear and disclosure navigation', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree aria-orientation=horizontal>
        <mdw-list-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
        <mdw-list-item>Sibling</mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const child = /** @type {InstanceType<ListItem>} */ (parent.querySelector('mdw-list-item'));
    parent.focus();

    const expandEvent = dispatchKeydown(parent, 'ArrowRight');

    assert.isTrue(expandEvent.defaultPrevented);
    assert.isTrue(parent.expanded);
    assert.strictEqual(document.activeElement, parent);

    dispatchKeydown(parent, 'ArrowRight');
    assert.strictEqual(document.activeElement, child);

    dispatchKeydown(child, 'ArrowLeft');
    assert.strictEqual(document.activeElement, parent);
  });

  it('does not handle disclosure keys when keyboard navigation is disabled', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree kbd-nav=false>
        <mdw-list-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);

    const event = dispatchKeydown(parent, 'ArrowRight');

    assert.isFalse(event.defaultPrevented);
    assert.isFalse(parent.expanded);
  });

  it('does not consume disclosure keys after expansion synchronously disables navigation', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    parent.addEventListener('mdw-list-item:expandedchange', () => {
      list.kbdNav = 'false';
    });

    const expandEvent = dispatchKeydown(parent, 'ArrowRight');

    assert.isTrue(parent.expanded);
    assert.equal(list.kbdNav, 'false');
    assert.isFalse(expandEvent.defaultPrevented);

    list.kbdNav = 'true';
    const collapseEvent = dispatchKeydown(parent, 'ArrowLeft');

    assert.isFalse(parent.expanded);
    assert.equal(list.kbdNav, 'false');
    assert.isFalse(collapseEvent.defaultPrevented);
  });

  it('does not cross the owning tree boundary with ArrowLeft', async () => {
    const outer = html`
      <mdw-list-tree>
        <mdw-list-item>
          Outer item
          <mdw-list-tree>
            <mdw-list-item>
              Inner parent
              <mdw-list-tree slot=expansion>
                <mdw-list-item>Inner child</mdw-list-item>
              </mdw-list-tree>
            </mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const outerItem = /** @type {InstanceType<ListItem>} */ (outer.firstElementChild);
    const inner = /** @type {InstanceType<ListTree>} */ (
      outerItem.querySelector('mdw-list-tree')
    );
    const innerParent = /** @type {InstanceType<ListItem>} */ (inner.firstElementChild);
    innerParent.focus();

    const event = dispatchKeydown(innerParent, 'ArrowLeft');

    assert.isFalse(event.defaultPrevented);
    assert.strictEqual(document.activeElement, innerParent);
    assert.notStrictEqual(document.activeElement, outerItem);
  });

  it('transfers ownership when an expansion becomes independent and owned again', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item tabindex=3>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const nested = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
    const child = /** @type {InstanceType<ListItem>} */ (nested.firstElementChild);

    assert.equal(nested._listRole, 'group');
    assert.equal(nested.elementInternals?.role ?? nested.getAttribute('role'), 'group');
    assert.isTrue(list._kbdManagedTabIndexes.has(child));
    assert.isFalse(nested._kbdManagedTabIndexes?.has(child) ?? false);

    nested.removeAttribute('slot');
    await nextTask();

    assert.equal(nested._listRole, 'tree');
    assert.equal(nested.elementInternals?.role ?? nested.getAttribute('role'), 'tree');
    assert.isFalse(list._kbdManagedTabIndexes.has(child));
    assert.isTrue(nested._kbdManagedTabIndexes.has(child));
    assert.equal(child.tabIndex, 0);

    nested.slot = 'expansion';
    parent.expanded = true;
    await nextTask();

    assert.equal(nested._ariaRole, 'group');
    assert.equal(nested._listRole, 'group');
    assert.equal(nested.elementInternals?.role ?? nested.getAttribute('role'), 'group');
    assert.isFalse(nested._kbdManagedTabIndexes.has(child));
    assert.isTrue(list._kbdManagedTabIndexes.has(child));
    assert.equal(child.tabIndex, -1);

    list.remove();

    assert.equal(child.getAttribute('tabindex'), '3');
  });

  it('releases parent-derived item semantics outside a list owner', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
        <mdw-list-item id=sibling>Sibling</mdw-list-item>
      </mdw-list-tree>
    `;
    const outside = document.createElement('div');
    document.body.append(outside);
    await nextTask();
    const item = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const sibling = /** @type {InstanceType<ListItem>} */ (
      list.querySelector('#sibling')
    );

    assert.equal(item._ariaRole, 'treeitem');
    assert.isFalse(item.refs.row.hasAttribute('role'));

    outside.append(item, sibling);

    assert.equal(item._ariaRole, 'listitem');
    assert.equal(item.refs.row.getAttribute('role'), 'button');
    assert.equal(sibling._ariaRole, 'listitem');
  });

  it('does not overlap an independent nested tree', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree>
            <mdw-list-item>Independent child</mdw-list-item>
            <mdw-list-item>Independent sibling</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
        <mdw-list-item>Root sibling</mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const nested = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
    const [child, childSibling] = /** @type {InstanceType<ListItem>[]} */ (
      [...nested.children]
    );

    assert.equal(nested._listRole, 'tree');
    assert.deepEqual([...list.getKbdNavChildren()], [...list.children]);
    assert.isFalse(list._kbdManagedTabIndexes.has(child));
    assert.isTrue(nested._kbdManagedTabIndexes.has(child));

    parent.focus();
    const rootEvent = dispatchKeydown(parent, 'ArrowRight');

    assert.isFalse(rootEvent.defaultPrevented);
    assert.strictEqual(document.activeElement, parent);

    child.focus();
    const nestedEvent = dispatchKeydown(child, 'ArrowDown');

    assert.isTrue(nestedEvent.defaultPrevented);
    assert.strictEqual(document.activeElement, childSibling);
  });

  it('does not reconcile through an unchanged independent tree', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Branch A
          <mdw-list-tree slot=expansion>
            <mdw-list-item expanded>
              Nested owner
              <mdw-list-tree id=independent>
                <mdw-list-item id=independent-child>Independent</mdw-list-item>
              </mdw-list-tree>
            </mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
        <mdw-list-item expanded>
          Branch B
          <mdw-list-tree id=changed slot=expansion>
            <mdw-list-item>Changed child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const independent = /** @type {InstanceType<ListTree>} */ (
      list.querySelector('#independent')
    );
    const independentChild = /** @type {InstanceType<ListItem>} */ (
      list.querySelector('#independent-child')
    );
    const changed = /** @type {InstanceType<ListTree>} */ (
      list.querySelector('#changed')
    );
    const setListRole = independentChild._setListRole;
    let roleWrites = 0;
    independentChild._setListRole = function setListRoleCounter(...args) {
      roleWrites += 1;
      return setListRole.apply(this, args);
    };

    changed.removeAttribute('slot');
    await nextTask();

    assert.equal(changed._listRole, 'tree');
    assert.equal(independent._listRole, 'tree');
    assert.equal(roleWrites, 0);
  });

  it('does not disclose an independent collapsed nested tree', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item>
          Parent
          <mdw-list-tree>
            <mdw-list-item>Independent child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    parent.focus();

    const event = dispatchKeydown(parent, 'ArrowRight');

    assert.isFalse(event.defaultPrevented);
    assert.isFalse(parent.expanded);
    assert.strictEqual(document.activeElement, parent);
  });

  it('does not consume disclosure navigation when child focus is rejected', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const child = /** @type {InstanceType<ListItem>} */ (parent.querySelector('mdw-list-item'));
    child.focus = () => {};
    parent.focus();

    const event = dispatchKeydown(parent, 'ArrowRight');

    assert.isFalse(event.defaultPrevented);
    assert.strictEqual(document.activeElement, parent);
    assert.strictEqual(list._kbdTabStop, parent);
  });

  it('continues disclosure navigation after child focus is rejected', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item hidden>Hidden child</mdw-list-item>
            <mdw-list-item>Available child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const group = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
    const [hidden, available] = /** @type {InstanceType<ListItem>[]} */ ([...group.children]);
    let hiddenFocusAttempts = 0;
    hidden.focus = () => { hiddenFocusAttempts += 1; };
    parent.focus();

    const event = dispatchKeydown(parent, 'ArrowRight');

    assert.deepEqual([...list.getKbdNavChildren()], [parent, hidden, available]);
    assert.equal(hiddenFocusAttempts, 1);
    assert.isTrue(event.defaultPrevented);
    assert.strictEqual(document.activeElement, available);
    assert.deepEqual(
      [parent.tabIndex, hidden.tabIndex, available.tabIndex],
      [-1, -1, 0],
    );
  });

  it('stops ArrowRight after focus receipt reorders expansion groups', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree id=initial-group slot=expansion>
            <mdw-list-item id=received>Received</mdw-list-item>
            <mdw-list-item id=stale>Stale</mdw-list-item>
          </mdw-list-tree>
          <mdw-list-tree id=replacement-group slot=expansion>
            <mdw-list-item>Replacement</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const initialGroup = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('#initial-group')
    );
    const replacementGroup = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('#replacement-group')
    );
    const received = /** @type {InstanceType<ListItem>} */ (
      initialGroup.querySelector('#received')
    );
    const stale = /** @type {InstanceType<ListItem>} */ (
      initialGroup.querySelector('#stale')
    );
    let staleFocusReceipts = 0;
    received.addEventListener('focus', () => {
      initialGroup.before(replacementGroup);
    }, { once: true });
    stale.addEventListener('focus', () => { staleFocusReceipts += 1; });
    parent.focus();

    const event = dispatchKeydown(parent, 'ArrowRight');

    assert.equal(staleFocusReceipts, 0);
    assert.isTrue(event.defaultPrevented);
    assert.strictEqual(parent.firstElementChild, replacementGroup);
  });

  it('stops ArrowRight after rejected focus reorders expansion groups', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree id=initial-group slot=expansion>
            <mdw-list-item id=rejected>Rejected</mdw-list-item>
            <mdw-list-item id=stale>Stale</mdw-list-item>
          </mdw-list-tree>
          <mdw-list-tree id=replacement-group slot=expansion>
            <mdw-list-item>Replacement</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const initialGroup = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('#initial-group')
    );
    const replacementGroup = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('#replacement-group')
    );
    const rejected = /** @type {InstanceType<ListItem>} */ (
      initialGroup.querySelector('#rejected')
    );
    const stale = /** @type {InstanceType<ListItem>} */ (
      initialGroup.querySelector('#stale')
    );
    let staleFocusReceipts = 0;
    rejected.focus = () => { initialGroup.before(replacementGroup); };
    stale.addEventListener('focus', () => { staleFocusReceipts += 1; });
    parent.focus();

    const event = dispatchKeydown(parent, 'ArrowRight');

    assert.equal(staleFocusReceipts, 0);
    assert.isFalse(event.defaultPrevented);
    assert.strictEqual(document.activeElement, parent);
    assert.strictEqual(parent.firstElementChild, replacementGroup);
  });

  it('uses expanded state as the structural tree boundary', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
        <mdw-list-item>Sibling</mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [parent, sibling] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);
    const group = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
    const child = /** @type {InstanceType<ListItem>} */ (group.firstElementChild);

    group.inert = false;
    list.refreshTabIndexes();

    assert.deepEqual([...list.getKbdNavChildren()], [parent, sibling]);
    assert.isFalse(list._kbdManagedTabIndexes.has(child));

    parent.expanded = true;
    group.inert = true;
    list.refreshTabIndexes();

    assert.deepEqual([...list.getKbdNavChildren()], [parent, child, sibling]);
    assert.equal(child.tabIndex, -1);
  });

  it('lets actual focus behavior reject hidden and inert tree items', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item>First</mdw-list-item>
        <mdw-list-item hidden>Hidden</mdw-list-item>
        <mdw-list-item inert>Inert</mdw-list-item>
        <mdw-list-item>Last</mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [first, hidden, inert, last] = /** @type {InstanceType<ListItem>[]} */ (
      [...list.children]
    );
    let hiddenFocusAttempts = 0;
    let inertFocusAttempts = 0;
    hidden.focus = () => { hiddenFocusAttempts += 1; };
    inert.focus = () => { inertFocusAttempts += 1; };

    first.focus();
    const event = dispatchKeydown(first, 'ArrowDown');

    assert.deepEqual([...list.getKbdNavChildren()], [first, hidden, inert, last]);
    assert.deepEqual([hiddenFocusAttempts, inertFocusAttempts], [1, 1]);
    assert.isTrue(event.defaultPrevented);
    assert.strictEqual(document.activeElement, last);
    assert.deepEqual(
      [first.tabIndex, hidden.tabIndex, inert.tabIndex, last.tabIndex],
      [-1, -1, -1, 0],
    );
  });

  it('lets actual focus behavior decide for aria-hidden tree items', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item>First</mdw-list-item>
        <mdw-list-item aria-hidden=true>
          Aria hidden
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [first, ariaHidden] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);

    first.focus();
    const moveEvent = dispatchKeydown(first, 'ArrowDown');

    assert.deepEqual([...list.getKbdNavChildren()], [first, ariaHidden]);
    assert.isTrue(moveEvent.defaultPrevented);
    assert.strictEqual(document.activeElement, ariaHidden);
    assert.equal(first.tabIndex, -1);
    assert.equal(ariaHidden.tabIndex, 0);

    const disclosureEvent = dispatchKeydown(ariaHidden, 'ArrowRight');

    assert.isTrue(disclosureEvent.defaultPrevented);
    assert.isTrue(ariaHidden.expanded);
  });

  it('keeps tree ownership below an aria-hidden expanded ancestor', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded aria-hidden=true>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>
              Child
              <mdw-list-tree slot=expansion>
                <mdw-list-item>Grandchild</mdw-list-item>
              </mdw-list-tree>
            </mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
        <mdw-list-item>Sibling</mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [parent, sibling] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);
    const child = /** @type {InstanceType<ListItem>} */ (parent.querySelector('mdw-list-item'));
    child.focus();

    const event = dispatchKeydown(child, 'ArrowRight');

    const grandchild = /** @type {InstanceType<ListItem>} */ (
      child.querySelector('mdw-list-item')
    );
    assert.deepEqual([...list.getKbdNavChildren()], [parent, child, grandchild, sibling]);
    assert.isTrue(event.defaultPrevented);
    assert.isTrue(child.expanded);
  });

  it('ignores tree items outside the generated expansion order', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>First child</mdw-list-item>
          </mdw-list-tree>
          <mdw-list-tree slot=expansion>
            <mdw-list-item>
              Outside order
              <mdw-list-tree slot=expansion>
                <mdw-list-item>Outside descendant</mdw-list-item>
              </mdw-list-tree>
            </mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const groups = /** @type {NodeListOf<InstanceType<ListTree>>} */ (
      parent.querySelectorAll(':scope > mdw-list-tree[slot=expansion]')
    );
    const firstChild = /** @type {InstanceType<ListItem>} */ (groups[0].firstElementChild);
    const outsideOrder = /** @type {InstanceType<ListItem>} */ (groups[1].firstElementChild);

    assert.deepEqual([...list.getKbdNavChildren()], [parent, firstChild]);
    assert.equal(groups[0]._listRole, 'group');
    assert.equal(groups[1]._listRole, 'tree');

    outsideOrder.focus();
    const event = dispatchKeydown(outsideOrder, 'ArrowRight');

    assert.isTrue(event.defaultPrevented);
    assert.isTrue(outsideOrder.expanded);
    assert.isFalse(list._kbdManagedTabIndexes.has(outsideOrder));
    assert.isTrue(groups[1]._kbdManagedTabIndexes.has(outsideOrder));
  });

  it('transfers tree ownership when the first direct expansion group is removed', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree id=first-group slot=expansion>
            <mdw-list-item tabindex=3>First child</mdw-list-item>
          </mdw-list-tree>
          <mdw-list-tree id=next-group slot=expansion>
            <mdw-list-item tabindex=4>Next child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const firstGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#first-group'));
    const nextGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#next-group'));
    const firstChild = /** @type {InstanceType<ListItem>} */ (firstGroup.firstElementChild);
    const nextChild = /** @type {InstanceType<ListItem>} */ (nextGroup.firstElementChild);

    firstGroup.remove();
    await nextTask();

    const order = [...list.getKbdNavChildren()];
    assert.equal(nextGroup._listRole, 'group');
    assert.equal(order.length, 2);
    assert.strictEqual(order[0], parent);
    assert.strictEqual(order[1], nextChild);
    assert.equal(nextChild.tabIndex, -1);
    assert.isTrue(list._kbdManagedTabIndexes.has(nextChild));
    assert.equal(firstChild.getAttribute('tabindex'), '3');
    assert.isFalse(list._kbdManagedTabIndexes.has(firstChild));
    assert.equal(firstGroup._listRole, 'tree');
  });

  it('transfers tree ownership when the first expansion group changes slots', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree id=first-group slot=expansion>
            <mdw-list-item tabindex=3>First child</mdw-list-item>
          </mdw-list-tree>
          <mdw-list-tree id=next-group slot=expansion>
            <mdw-list-item tabindex=4>Next child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const firstGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#first-group'));
    const nextGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#next-group'));
    const firstChild = /** @type {InstanceType<ListItem>} */ (firstGroup.firstElementChild);
    const nextChild = /** @type {InstanceType<ListItem>} */ (nextGroup.firstElementChild);

    firstGroup.removeAttribute('slot');
    await nextTask();

    assert.equal(firstGroup._listRole, 'tree');
    assert.equal(firstChild._ariaRole, 'treeitem');
    assert.equal(nextGroup._listRole, 'group');
    assert.equal(nextChild._ariaRole, 'treeitem');
    assert.deepEqual([...list.getKbdNavChildren()], [parent, nextChild]);
    assert.equal(firstChild.getAttribute('tabindex'), '0');
    assert.isFalse(list._kbdManagedTabIndexes.has(firstChild));
    assert.isTrue(firstGroup._kbdManagedTabIndexes.has(firstChild));
    assert.equal(firstGroup._kbdManagedTabIndexes.get(firstChild), '3');
    assert.equal(nextChild.tabIndex, -1);
    assert.isTrue(list._kbdManagedTabIndexes.has(nextChild));
  });

  it('transfers tree ownership when direct expansion groups reorder', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item expanded>
          Parent
          <mdw-list-tree id=first-group slot=expansion>
            <mdw-list-item tabindex=3>First child</mdw-list-item>
          </mdw-list-tree>
          <mdw-list-tree id=next-group slot=expansion>
            <mdw-list-item tabindex=4>Next child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const firstGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#first-group'));
    const nextGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#next-group'));
    const firstChild = /** @type {InstanceType<ListItem>} */ (firstGroup.firstElementChild);
    const nextChild = /** @type {InstanceType<ListItem>} */ (nextGroup.firstElementChild);

    firstGroup.before(nextGroup);
    await nextTask();

    const order = [...list.getKbdNavChildren()];
    assert.equal(nextGroup._listRole, 'group');
    assert.equal(firstGroup._listRole, 'tree');
    assert.equal(order.length, 2);
    assert.strictEqual(order[0], parent);
    assert.strictEqual(order[1], nextChild);
    assert.equal(nextChild.tabIndex, -1);
    assert.isTrue(list._kbdManagedTabIndexes.has(nextChild));
    assert.equal(firstChild.getAttribute('tabindex'), '0');
    assert.isFalse(list._kbdManagedTabIndexes.has(firstChild));
    assert.isTrue(firstGroup._kbdManagedTabIndexes.has(firstChild));
    assert.equal(firstGroup._kbdManagedTabIndexes.get(firstChild), '3');
  });

  it('does not expose or activate a tree branch for non-tree expansion content', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item>
          Details
          <button slot=expansion>Action</button>
        </mdw-list-item>
        <mdw-list-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [details] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);

    assert.isFalse(details.hasAttribute('aria-expanded'));

    details.focus();
    const arrowEvent = dispatchKeydown(details, 'ArrowRight');
    const enterEvent = dispatchKeydown(details, 'Enter');
    details.click();

    assert.isFalse(arrowEvent.defaultPrevented);
    assert.isFalse(enterEvent.defaultPrevented);
    assert.isFalse(details.expanded);
  });

  it('does not expand disabled tree items with ArrowRight', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item disabled>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [parent] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);

    const event = dispatchKeydown(parent, 'ArrowRight');

    assert.isFalse(event.defaultPrevented);
    assert.isFalse(parent.expanded);
  });

  it('keeps derived treeitem roles synchronized with expansion ARIA', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
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
        <mdw-list-tree>
          <mdw-list-item expanded>
            Parent
            <mdw-list-tree slot=expansion>
              <mdw-list-item>Child</mdw-list-item>
            </mdw-list-tree>
          </mdw-list-item>
          <mdw-list-item>Sibling</mdw-list-item>
        </mdw-list-tree>
        <button id=after>After</button>
      </div>
    `;
    await nextTask();
    /** @type {InstanceType<ListTree>} */
    const list = /** @type {InstanceType<ListTree>} */ (
      container.querySelector('mdw-list-tree')
    );
    const after = /** @type {HTMLButtonElement} */ (container.querySelector('#after'));
    const [parent, sibling] = /** @type {InstanceType<ListItem>[]} */ ([...list.children]);
    const childList = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
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
