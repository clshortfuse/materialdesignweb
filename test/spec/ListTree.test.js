import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import ListTree from '../../components/ListTree.js';
import {
  html,
  leftClickElement,
  makeFromConstructor,
  sendKeydown,
  sendKeypress,
  sendKeyup,
} from '../utils.js';

/** @typedef {import('../../components/ListTreeItem.js').default} ListTreeItem */

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

  it('owns only dedicated direct tree items', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-item>Ordinary item</mdw-list-item>
        <mdw-list-tree-item>Tree item</mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const ordinaryItem = /** @type {HTMLElement & Record<string, any>} */ (
      list.firstElementChild
    );
    const treeItem = /** @type {InstanceType<ListTreeItem>} */ (
      list.lastElementChild
    );

    assert.equal(ordinaryItem.readAriaProperty('role'), 'listitem');
    assert.equal(treeItem.readAriaProperty('role'), 'treeitem');
    const ownedItems = [...list.getKbdNavChildren()];
    assert.equal(ownedItems.length, 1);
    assert.strictEqual(ownedItems[0], treeItem);
    assert.isFalse(list._kbdManagedTabIndexes.has(ordinaryItem));
    assert.isTrue(list._kbdManagedTabIndexes.has(treeItem));
  });

  it('uses Left and Right for disclosure navigation', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
        <mdw-list-tree-item>Sibling</mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [parent] = /** @type {InstanceType<ListTreeItem>[]} */ ([...list.children]);
    const childList = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
    const [child] = /** @type {InstanceType<ListTreeItem>[]} */ ([...childList.children]);

    assert.equal(list._listRole, 'tree');
    assert.equal(parent._ariaRole, 'treeitem');
    assert.notProperty(parent, '_treeItem');
    assert.equal(childList._listRole, 'group');
    assert.equal(child._ariaRole, 'treeitem');
    assert.notProperty(child, '_treeItem');
    assert.isFalse(parent.refs.primaryCell.hasAttribute('role'));
    assert.isFalse(parent.refs.primaryCell.hasAttribute('tabindex'));
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
        <mdw-list-tree-item href=#destination actionable>Destination</mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const anchor = /** @type {HTMLAnchorElement} */ (item.refs.anchor);
    let activations = 0;
    let actions = 0;
    anchor.addEventListener('click', (event) => {
      activations += 1;
      event.preventDefault();
    });
    item.addEventListener('action', () => { actions += 1; });

    assert.equal(item.tabIndex, 0);
    assert.equal(anchor.tabIndex, -1);

    item.focus();
    await sendKeydown(' ');
    assert.isFalse(item.pressedState);
    await sendKeyup(' ');

    const event = dispatchKeydown(item, 'Enter');

    assert.isTrue(event.defaultPrevented);
    assert.equal(activations, 1);
    assert.isTrue(document.activeElement === item);

    const spaceEvent = dispatchKeydown(item, ' ');

    assert.isFalse(spaceEvent.defaultPrevented);
    assert.equal(activations, 1);
    assert.equal(actions, 0);

    item.blur();
    anchor.click();

    assert.equal(activations, 2);
    assert.equal(actions, 0);
    assert.isTrue(document.activeElement === item);
  });

  it('activates actionable treeitems from their single managed tab stop', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item actionable>
          Run task
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    let activations = 0;
    item.addEventListener('action', () => { activations += 1; });

    assert.equal(item.tabIndex, 0);
    assert.equal(item.refs.primaryAction.tabIndex, -1);
    assert.equal(item.refs.expansionAction.tabIndex, -1);

    item.focus();
    const event = dispatchKeydown(item, 'Enter');

    assert.isTrue(event.defaultPrevented);
    assert.equal(activations, 1);
    assert.isTrue(document.activeElement === item);

    item.blur();
    item.refs.primaryAction.click();

    assert.equal(activations, 2);
    assert.isTrue(document.activeElement === item);

    item.refs.expansionAction.click();

    assert.isTrue(item.expanded);
    assert.isTrue(document.activeElement === item);
  });

  it('uses one primary hit target for static treeitem presentation', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item><span id=label>Leaf</span></mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const label = /** @type {HTMLElement} */ (item.querySelector('#label'));
    let origin = null;
    item.addEventListener('click', (event) => {
      [origin] = event.composedPath();
    }, { once: true });

    await leftClickElement(label);

    assert.strictEqual(origin, item.refs.primaryInteraction);
    assert.strictEqual(document.activeElement, item);
    assert.isTrue(item.refs.state.hasAttribute('focused'));
    assert.isNotNull(item._lastRipple);
  });

  it('reconciles one owner once when an expansion group is inserted', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item expanded>
          Parent
          <span slot=expansion>Existing expansion</span>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const group = document.createElement('mdw-list-tree');
    group.slot = 'expansion';
    group.innerHTML = '<mdw-list-tree-item>Child</mdw-list-tree-item>';
    const refreshTabIndexes = list.refreshTabIndexes;
    let refreshes = 0;
    list.refreshTabIndexes = function refreshTabIndexesCounter() {
      refreshes += 1;
      return refreshTabIndexes.call(this);
    };

    parent.append(group);
    await nextTask();

    assert.equal(refreshes, 1);
    assert.equal(parent.readAriaProperty('role'), 'treeitem');
    assert.equal(group._listRole, 'group');
    assert.isTrue(list._kbdManagedTabIndexes.has(group.firstElementChild));
  });

  it('reconciles one owner once for nested expansion insertion', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item expanded>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item id=nested-parent expanded>
              Nested parent
              <span slot=expansion>Existing expansion</span>
            </mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const nestedParent = /** @type {InstanceType<ListTreeItem>} */ (
      list.querySelector('#nested-parent')
    );
    const group = document.createElement('mdw-list-tree');
    group.slot = 'expansion';
    group.innerHTML = '<mdw-list-tree-item>Nested child</mdw-list-tree-item>';
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
        <mdw-list-tree-item expanded>
          Parent
          <mdw-list-tree role=tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const group = /** @type {InstanceType<ListTree>} */ (
      list.querySelector('mdw-list-tree')
    );

    assert.equal(group._listRole, 'group');
    assert.equal(group.readAriaProperty('role'), 'group');
    assert.equal(group.getAttribute('role'), 'group');
    assert.isTrue(list._kbdManagedTabIndexes.has(group.firstElementChild));

    group.setAttribute('role', 'listbox');

    assert.equal(group._listRole, 'group');
    assert.equal(group.readAriaProperty('role'), 'group');
    assert.equal(group.getAttribute('role'), 'group');
    assert.isTrue(list._kbdManagedTabIndexes.has(group.firstElementChild));

    group.removeAttribute('slot');
    await nextTask();

    assert.equal(group._listRole, 'tree');
    assert.equal(group.readAriaProperty('role'), 'tree');
    assert.equal(group.getAttribute('role'), 'tree');
    assert.isFalse(list._kbdManagedTabIndexes.has(group.firstElementChild));
    assert.isTrue(group._kbdManagedTabIndexes.has(group.firstElementChild));
  });

  it('does not synthesize unmodified activation for modified Enter', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item href=#destination>Destination</mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
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
        <mdw-list-tree-item>First</mdw-list-tree-item>
        <mdw-list-tree-item>Last</mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [first, last] = /** @type {InstanceType<ListTreeItem>[]} */ ([...list.children]);

    first.focus();
    const upEvent = dispatchKeydown(first, 'ArrowUp');
    const upKeptFocus = document.activeElement === first;
    const homeEvent = dispatchKeydown(first, 'Home');
    const homeKeptFocus = document.activeElement === first;

    last.focus();
    const downEvent = dispatchKeydown(last, 'ArrowDown');
    const downKeptFocus = document.activeElement === last;
    const endEvent = dispatchKeydown(last, 'End');
    const endKeptFocus = document.activeElement === last;

    assert.isFalse(upEvent.defaultPrevented);
    assert.isTrue(upKeptFocus);
    assert.isFalse(homeEvent.defaultPrevented);
    assert.isTrue(homeKeptFocus);
    assert.isFalse(downEvent.defaultPrevented);
    assert.isTrue(downKeptFocus);
    assert.isFalse(endEvent.defaultPrevented);
    assert.isTrue(endKeptFocus);
    assert.strictEqual(list._kbdTabStop, last);
  });

  it('does not combine horizontal linear and disclosure navigation', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree aria-orientation=horizontal>
        <mdw-list-tree-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
        <mdw-list-tree-item>Sibling</mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const child = /** @type {InstanceType<ListTreeItem>} */ (parent.querySelector('mdw-list-tree-item'));
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
        <mdw-list-tree-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);

    const event = dispatchKeydown(parent, 'ArrowRight');

    assert.isFalse(event.defaultPrevented);
    assert.isFalse(parent.expanded);
  });

  it('does not consume disclosure keys after expansion synchronously disables navigation', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    parent.addEventListener('mdw-list-tree-item:expandedchange', () => {
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
        <mdw-list-tree-item>
          Outer item
          <mdw-list-tree>
            <mdw-list-tree-item>
              Inner parent
              <mdw-list-tree slot=expansion>
                <mdw-list-tree-item>Inner child</mdw-list-tree-item>
              </mdw-list-tree>
            </mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const outerItem = /** @type {InstanceType<ListTreeItem>} */ (outer.firstElementChild);
    const inner = /** @type {InstanceType<ListTree>} */ (
      outerItem.querySelector('mdw-list-tree')
    );
    const innerParent = /** @type {InstanceType<ListTreeItem>} */ (inner.firstElementChild);
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
        <mdw-list-tree-item actionable expanded>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item tabindex=3>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const nested = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
    const child = /** @type {InstanceType<ListTreeItem>} */ (nested.firstElementChild);

    assert.equal(nested._listRole, 'group');
    assert.equal(nested.elementInternals?.role ?? nested.getAttribute('role'), 'group');
    assert.strictEqual(parent._ownedTreeGroup, nested);
    assert.equal(parent.getAttribute('aria-expanded'), 'true');
    assert.isTrue(list._kbdManagedTabIndexes.has(child));
    assert.isFalse(nested._kbdManagedTabIndexes?.has(child) ?? false);

    const expansionAction = parent.refs.expansionAction;
    assert.isTrue(expansionAction.isConnected);
    assert.equal(expansionAction.getAttribute('tabindex'), '-1');
    nested.removeAttribute('slot');
    expansionAction.click();
    const immediateClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    parent.refs.primaryCell.dispatchEvent(immediateClick);

    assert.isFalse(immediateClick.defaultPrevented);
    assert.isTrue(parent.expanded);

    await nextTask();

    assert.equal(nested._listRole, 'tree');
    assert.equal(nested.elementInternals?.role ?? nested.getAttribute('role'), 'tree');
    assert.isNull(parent._ownedTreeGroup);
    assert.isFalse(parent.hasAttribute('aria-expanded'));
    assert.isFalse(expansionAction.isConnected);
    assert.isFalse(list._kbdManagedTabIndexes.has(child));
    assert.isTrue(nested._kbdManagedTabIndexes.has(child));
    assert.equal(child.tabIndex, 0);

    nested.slot = 'expansion';
    parent.expanded = true;
    await nextTask();

    assert.equal(nested._ariaRole, 'group');
    assert.equal(nested._listRole, 'group');
    assert.equal(nested.elementInternals?.role ?? nested.getAttribute('role'), 'group');
    assert.strictEqual(parent._ownedTreeGroup, nested);
    assert.equal(parent.getAttribute('aria-expanded'), 'true');
    assert.equal(expansionAction.getAttribute('tabindex'), '-1');
    assert.isFalse(nested._kbdManagedTabIndexes.has(child));
    assert.isTrue(list._kbdManagedTabIndexes.has(child));
    assert.equal(child.tabIndex, -1);

    list.remove();

    assert.equal(child.getAttribute('tabindex'), '3');
  });

  it('retains fixed item semantics while releasing tree ownership', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
        <mdw-list-tree-item id=sibling>Sibling</mdw-list-tree-item>
      </mdw-list-tree>
    `;
    const outside = document.createElement('div');
    document.body.append(outside);
    await nextTask();
    const item = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const sibling = /** @type {InstanceType<ListTreeItem>} */ (
      list.querySelector('#sibling')
    );

    assert.equal(item._ariaRole, 'treeitem');
    assert.strictEqual(item._ownedTreeGroup, item.querySelector('mdw-list-tree'));
    assert.isFalse(item.refs.primaryCell.hasAttribute('role'));
    assert.equal(item.refs.anchor.getAttribute('tabindex'), '-1');
    assert.equal(item.refs.primaryAction.getAttribute('tabindex'), '-1');
    assert.equal(item.refs.expansionAction.getAttribute('tabindex'), '-1');

    outside.append(item, sibling);

    assert.equal(item._ariaRole, 'treeitem');
    assert.isNull(item._ownedTreeGroup);
    assert.isFalse(item.refs.primaryCell.hasAttribute('role'));
    assert.equal(item.refs.anchor.getAttribute('tabindex'), '-1');
    assert.equal(item.refs.primaryAction.getAttribute('tabindex'), '-1');
    assert.equal(item.refs.expansionAction.getAttribute('tabindex'), '-1');
    assert.equal(sibling._ariaRole, 'treeitem');
  });

  it('does not overlap an independent nested tree', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item expanded>
          Parent
          <mdw-list-tree>
            <mdw-list-tree-item>Independent child</mdw-list-tree-item>
            <mdw-list-tree-item>Independent sibling</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
        <mdw-list-tree-item>Root sibling</mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const nested = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
    const [child, childSibling] = /** @type {InstanceType<ListTreeItem>[]} */ (
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

    let clickTarget = null;
    child.addEventListener('click', (event) => {
      clickTarget = event.target;
    }, { once: true });
    child.refs.primaryCell.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    }));

    assert.strictEqual(clickTarget, child);
    assert.isTrue(document.activeElement === child);
    assert.isFalse(document.activeElement === parent);
    assert.isTrue(child.refs.state.hasAttribute('focused'));
  });

  it('does not reconcile through an unchanged independent tree', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item expanded>
          Branch A
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item expanded>
              Nested owner
              <mdw-list-tree id=independent>
                <mdw-list-tree-item id=independent-child>Independent</mdw-list-tree-item>
              </mdw-list-tree>
            </mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
        <mdw-list-tree-item expanded>
          Branch B
          <mdw-list-tree id=changed slot=expansion>
            <mdw-list-tree-item>Changed child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const independent = /** @type {InstanceType<ListTree>} */ (
      list.querySelector('#independent')
    );
    const changed = /** @type {InstanceType<ListTree>} */ (
      list.querySelector('#changed')
    );

    changed.removeAttribute('slot');
    await nextTask();

    assert.equal(changed._listRole, 'tree');
    assert.equal(independent._listRole, 'tree');
    assert.equal(list.querySelector('#independent-child').readAriaProperty('role'), 'treeitem');
  });

  it('does not disclose an independent collapsed nested tree', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item>
          Parent
          <mdw-list-tree>
            <mdw-list-tree-item>Independent child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
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
        <mdw-list-tree-item expanded>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const child = /** @type {InstanceType<ListTreeItem>} */ (parent.querySelector('mdw-list-tree-item'));
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
        <mdw-list-tree-item expanded>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item hidden>Hidden child</mdw-list-tree-item>
            <mdw-list-tree-item>Available child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const group = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
    const [hidden, available] = /** @type {InstanceType<ListTreeItem>[]} */ ([...group.children]);
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
        <mdw-list-tree-item expanded>
          Parent
          <mdw-list-tree id=initial-group slot=expansion>
            <mdw-list-tree-item id=received>Received</mdw-list-tree-item>
            <mdw-list-tree-item id=stale>Stale</mdw-list-tree-item>
          </mdw-list-tree>
          <mdw-list-tree id=replacement-group slot=expansion>
            <mdw-list-tree-item>Replacement</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const initialGroup = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('#initial-group')
    );
    const replacementGroup = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('#replacement-group')
    );
    const received = /** @type {InstanceType<ListTreeItem>} */ (
      initialGroup.querySelector('#received')
    );
    const stale = /** @type {InstanceType<ListTreeItem>} */ (
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
        <mdw-list-tree-item expanded>
          Parent
          <mdw-list-tree id=initial-group slot=expansion>
            <mdw-list-tree-item id=rejected>Rejected</mdw-list-tree-item>
            <mdw-list-tree-item id=stale>Stale</mdw-list-tree-item>
          </mdw-list-tree>
          <mdw-list-tree id=replacement-group slot=expansion>
            <mdw-list-tree-item>Replacement</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const initialGroup = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('#initial-group')
    );
    const replacementGroup = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('#replacement-group')
    );
    const rejected = /** @type {InstanceType<ListTreeItem>} */ (
      initialGroup.querySelector('#rejected')
    );
    const stale = /** @type {InstanceType<ListTreeItem>} */ (
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
        <mdw-list-tree-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
        <mdw-list-tree-item>Sibling</mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [parent, sibling] = /** @type {InstanceType<ListTreeItem>[]} */ ([...list.children]);
    const group = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
    const child = /** @type {InstanceType<ListTreeItem>} */ (group.firstElementChild);

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
        <mdw-list-tree-item>First</mdw-list-tree-item>
        <mdw-list-tree-item hidden>Hidden</mdw-list-tree-item>
        <mdw-list-tree-item inert>Inert</mdw-list-tree-item>
        <mdw-list-tree-item>Last</mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [first, hidden, inert, last] = /** @type {InstanceType<ListTreeItem>[]} */ (
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
        <mdw-list-tree-item>First</mdw-list-tree-item>
        <mdw-list-tree-item aria-hidden=true>
          Aria hidden
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [first, ariaHidden] = /** @type {InstanceType<ListTreeItem>[]} */ ([...list.children]);

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
        <mdw-list-tree-item expanded aria-hidden=true>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>
              Child
              <mdw-list-tree slot=expansion>
                <mdw-list-tree-item>Grandchild</mdw-list-tree-item>
              </mdw-list-tree>
            </mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
        <mdw-list-tree-item>Sibling</mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [parent, sibling] = /** @type {InstanceType<ListTreeItem>[]} */ ([...list.children]);
    const child = /** @type {InstanceType<ListTreeItem>} */ (parent.querySelector('mdw-list-tree-item'));
    child.focus();

    const event = dispatchKeydown(child, 'ArrowRight');

    const grandchild = /** @type {InstanceType<ListTreeItem>} */ (
      child.querySelector('mdw-list-tree-item')
    );
    assert.deepEqual([...list.getKbdNavChildren()], [parent, child, grandchild, sibling]);
    assert.isTrue(event.defaultPrevented);
    assert.isTrue(child.expanded);
  });

  it('ignores tree items outside the generated expansion order', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item expanded>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>First child</mdw-list-tree-item>
          </mdw-list-tree>
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>
              Outside order
              <mdw-list-tree slot=expansion>
                <mdw-list-tree-item>Outside descendant</mdw-list-tree-item>
              </mdw-list-tree>
            </mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const groups = /** @type {NodeListOf<InstanceType<ListTree>>} */ (
      parent.querySelectorAll(':scope > mdw-list-tree[slot=expansion]')
    );
    const firstChild = /** @type {InstanceType<ListTreeItem>} */ (groups[0].firstElementChild);
    const outsideOrder = /** @type {InstanceType<ListTreeItem>} */ (groups[1].firstElementChild);

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
        <mdw-list-tree-item expanded>
          Parent
          <mdw-list-tree id=first-group slot=expansion>
            <mdw-list-tree-item tabindex=3>First child</mdw-list-tree-item>
          </mdw-list-tree>
          <mdw-list-tree id=next-group slot=expansion>
            <mdw-list-tree-item tabindex=4>Next child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const firstGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#first-group'));
    const nextGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#next-group'));
    const firstChild = /** @type {InstanceType<ListTreeItem>} */ (firstGroup.firstElementChild);
    const nextChild = /** @type {InstanceType<ListTreeItem>} */ (nextGroup.firstElementChild);

    firstGroup.remove();
    await nextTask();

    const order = [...list.getKbdNavChildren()];
    assert.equal(nextGroup._listRole, 'group');
    assert.strictEqual(parent._ownedTreeGroup, nextGroup);
    assert.equal(parent.getAttribute('aria-expanded'), 'true');
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
        <mdw-list-tree-item expanded>
          Parent
          <mdw-list-tree id=first-group slot=expansion>
            <mdw-list-tree-item tabindex=3>First child</mdw-list-tree-item>
          </mdw-list-tree>
          <mdw-list-tree id=next-group slot=expansion>
            <mdw-list-tree-item tabindex=4>Next child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const firstGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#first-group'));
    const nextGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#next-group'));
    const firstChild = /** @type {InstanceType<ListTreeItem>} */ (firstGroup.firstElementChild);
    const nextChild = /** @type {InstanceType<ListTreeItem>} */ (nextGroup.firstElementChild);

    firstGroup.removeAttribute('slot');
    await nextTask();

    assert.equal(firstGroup._listRole, 'tree');
    assert.equal(firstChild._ariaRole, 'treeitem');
    assert.equal(nextGroup._listRole, 'group');
    assert.strictEqual(parent._ownedTreeGroup, nextGroup);
    assert.equal(parent.getAttribute('aria-expanded'), 'true');
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
        <mdw-list-tree-item expanded>
          Parent
          <mdw-list-tree id=first-group slot=expansion>
            <mdw-list-tree-item tabindex=3>First child</mdw-list-tree-item>
          </mdw-list-tree>
          <mdw-list-tree id=next-group slot=expansion>
            <mdw-list-tree-item tabindex=4>Next child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListTreeItem>} */ (list.firstElementChild);
    const firstGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#first-group'));
    const nextGroup = /** @type {InstanceType<ListTree>} */ (parent.querySelector('#next-group'));
    const firstChild = /** @type {InstanceType<ListTreeItem>} */ (firstGroup.firstElementChild);
    const nextChild = /** @type {InstanceType<ListTreeItem>} */ (nextGroup.firstElementChild);

    firstGroup.before(nextGroup);
    await nextTask();

    const order = [...list.getKbdNavChildren()];
    assert.equal(nextGroup._listRole, 'group');
    assert.equal(firstGroup._listRole, 'tree');
    assert.strictEqual(parent._ownedTreeGroup, nextGroup);
    assert.equal(parent.getAttribute('aria-expanded'), 'true');
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
        <mdw-list-tree-item>
          Details
          <button slot=expansion>Action</button>
        </mdw-list-tree-item>
        <mdw-list-tree-item id=actionable actionable>
          Actionable details
          <button slot=expansion>Action</button>
        </mdw-list-tree-item>
        <mdw-list-tree-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [details] = /** @type {InstanceType<ListTreeItem>[]} */ ([...list.children]);
    const actionable = /** @type {InstanceType<ListTreeItem>} */ (
      list.querySelector('#actionable')
    );

    assert.isFalse(details.hasAttribute('aria-expanded'));
    assert.isFalse(details.refs.expandIcon.isConnected);
    assert.isFalse(actionable.hasAttribute('aria-expanded'));
    assert.isFalse(actionable.refs.expansionAction.isConnected);

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
        <mdw-list-tree-item disabled>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [parent] = /** @type {InstanceType<ListTreeItem>[]} */ ([...list.children]);

    const event = dispatchKeydown(parent, 'ArrowRight');

    assert.isFalse(event.defaultPrevented);
    assert.isFalse(parent.expanded);
  });

  it('keeps derived treeitem roles synchronized with expansion ARIA', async () => {
    /** @type {InstanceType<ListTree>} */
    const list = html`
      <mdw-list-tree>
        <mdw-list-tree-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const [parent] = /** @type {InstanceType<ListTreeItem>[]} */ ([...list.children]);

    assert.equal(parent._ariaRole, 'treeitem');
    assert.equal(parent.getAttribute('aria-expanded'), 'false');
    assert.isFalse(parent.refs.primaryCell.hasAttribute('aria-expanded'));
  });

  it('includes expanded child list items in roving tabindex', async () => {
    const container = html`
      <div>
        <mdw-list-tree>
          <mdw-list-tree-item expanded>
            Parent
            <mdw-list-tree slot=expansion>
              <mdw-list-tree-item>Child</mdw-list-tree-item>
            </mdw-list-tree>
          </mdw-list-tree-item>
          <mdw-list-tree-item>Sibling</mdw-list-tree-item>
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
    const [parent, sibling] = /** @type {InstanceType<ListTreeItem>[]} */ ([...list.children]);
    const childList = /** @type {InstanceType<ListTree>} */ (
      parent.querySelector('mdw-list-tree')
    );
    const [child] = /** @type {InstanceType<ListTreeItem>[]} */ ([...childList.children]);

    assert.equal(parent.tabIndex, 0);
    assert.equal(child.tabIndex, -1);
    assert.equal(sibling.tabIndex, -1);

    child.refs.primaryCell.dispatchEvent(new MouseEvent('click', {
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
