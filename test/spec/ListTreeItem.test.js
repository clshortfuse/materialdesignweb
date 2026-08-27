import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import '../../components/ListTree.js';
import ListTreeItem from '../../components/ListTreeItem.js';
import {
  html,
  makeFromConstructor,
  makeFromString,
  makeFromTagName,
} from '../utils.js';

/** @typedef {import('../../components/ListTree.js').default} ListTree */

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

describe('mdw-list-tree-item', () => {
  it('can be created through each supported construction path', () => {
    assert.equal(makeFromTagName('mdw-list-tree-item').localName, 'mdw-list-tree-item');
    assert.equal(makeFromConstructor(ListTreeItem).localName, 'mdw-list-tree-item');
    assert.equal(
      makeFromString('<mdw-list-tree-item></mdw-list-tree-item>').localName,
      'mdw-list-tree-item',
    );
  });

  it('keeps fixed treeitem semantics without parent-derived state', async () => {
    /** @type {InstanceType<ListTreeItem>} */
    const item = html`<mdw-list-tree-item role=option>Tree item</mdw-list-tree-item>`;
    await nextTask();

    assert.equal(item.readAriaProperty('role'), 'treeitem');
    assert.equal(item.getAttribute('role'), 'treeitem');
    assert.notProperty(item, '_treeItem');
    assert.isFalse(item.refs.primaryCell.hasAttribute('role'));
    assert.equal(item.refs.anchor.getAttribute('tabindex'), '-1');
    assert.equal(item.refs.primaryAction.getAttribute('tabindex'), '-1');
    assert.equal(item.refs.expansionAction.getAttribute('tabindex'), '-1');
  });

  it('accepts ownership only from a direct ListTree parent', async () => {
    /** @type {InstanceType<ListTree>} */
    const tree = html`
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
    const item = /** @type {InstanceType<ListTreeItem>} */ (tree.firstElementChild);
    const group = /** @type {InstanceType<ListTree>} */ (
      item.querySelector('mdw-list-tree')
    );

    assert.strictEqual(item._ownedTreeGroup, group);
    assert.equal(group._listRole, 'group');
    assert.equal(item.getAttribute('aria-expanded'), 'true');

    document.body.append(item);
    await nextTask();

    assert.isNull(item._ownedTreeGroup);
    assert.equal(group._listRole, 'tree');
    assert.isFalse(item.hasAttribute('aria-expanded'));
    assert.equal(item.readAriaProperty('role'), 'treeitem');
  });

  it('does not route shadow disclosure keys to the primary action', async () => {
    /** @type {InstanceType<ListTree>} */
    const tree = html`
      <mdw-list-tree>
        <mdw-list-tree-item actionable>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListTreeItem>} */ (tree.firstElementChild);
    let actions = 0;
    item.addEventListener('action', () => { actions += 1; });

    const event = dispatchKeydown(item.refs.expansionAction, 'Enter');

    assert.isFalse(event.defaultPrevented);
    assert.equal(actions, 0);
    assert.isFalse(item.expanded);
  });

  it('keeps disclosure focus out of the primary state layer', async () => {
    /** @type {InstanceType<ListTree>} */
    const tree = html`
      <mdw-list-tree>
        <mdw-list-tree-item actionable>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-tree-item>
      </mdw-list-tree>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListTreeItem>} */ (tree.firstElementChild);

    item.focus();
    assert.isTrue(item._focused);

    item.refs.expansionAction.focus();

    assert.isFalse(item._focused);
    assert.isFalse(item.refs.state.hasAttribute('focused'));
  });
});
