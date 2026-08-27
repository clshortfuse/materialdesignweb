import { assert } from '@esm-bundle/chai';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('mdw-list-item upgrade order', () => {
  it('keeps ordinary disclosure semantics when a tree upgrades later', async () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <mdw-list-tree>
        <mdw-list-item>
          Parent
          <span slot=expansion>Details</span>
        </mdw-list-item>
      </mdw-list-tree>
    `;
    document.body.append(container);

    await import('../../components/ListItem.js');
    await customElements.whenDefined('mdw-list-item');
    await nextTask();

    const item = /** @type {InstanceType<import('../../components/ListItem.js').default>} */ (
      container.querySelector('mdw-list-item')
    );
    assert.notProperty(item, '_treeItem');
    assert.equal(item.refs.primaryCell.getAttribute('aria-expanded'), 'false');

    await import('../../components/ListTree.js');
    await customElements.whenDefined('mdw-list-tree');
    await nextTask();

    const tree = /** @type {InstanceType<import('../../components/ListTree.js').default>} */ (
      container.querySelector('mdw-list-tree')
    );
    assert.notProperty(item, '_treeItem');
    assert.equal(item.readAriaProperty('role'), 'listitem');
    assert.equal(item.refs.primaryCell.getAttribute('aria-expanded'), 'false');
    assert.isFalse(item.hasAttribute('aria-expanded'));
    assert.deepEqual([...tree.getKbdNavChildren()], []);
  });
});
