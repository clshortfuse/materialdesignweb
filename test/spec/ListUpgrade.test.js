import { assert } from '@esm-bundle/chai';

beforeEach(() => document.body.replaceChildren());

describe('mdw-list-tree upgrade order', () => {
  it('upgrades pre-existing nested lists before their items', async () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <mdw-list-tree>
        <mdw-list-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-item>Child</mdw-list-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list-tree>
      <mdw-list>
        <mdw-list-item>Option</mdw-list-item>
      </mdw-list>
      <mdw-list-tree id=plain-tree>
        <mdw-list-item>Plain item</mdw-list-item>
      </mdw-list-tree>
    `;
    document.body.append(container);

    await import('../../components/ListTree.js');
    await import('../../components/ListItem.js');
    await new Promise((resolve) => setTimeout(resolve, 0));

    const list = /** @type {HTMLElement & { _listRole: string }} */ (
      container.querySelector('mdw-list-tree')
    );
    const parent = /** @type {HTMLElement & { _ariaRole: string }} */ (list.firstElementChild);
    const childList = /** @type {HTMLElement & { _listRole: string }} */ (
      parent.querySelector('mdw-list-tree')
    );
    const child = /** @type {HTMLElement & { _ariaRole: string }} */ (childList.firstElementChild);
    assert.equal(list._listRole, 'tree');
    assert.equal(parent._ariaRole, 'treeitem');
    assert.equal(childList._listRole, 'group');
    assert.equal(child._ariaRole, 'treeitem');
    const plainTree = /** @type {HTMLElement & { _listRole: string }} */ (
      container.querySelector('#plain-tree')
    );
    const plainItem = /** @type {HTMLElement & { _ariaRole: string }} */ (
      plainTree.firstElementChild
    );
    assert.equal(plainTree._listRole, 'tree');
    assert.equal(plainItem._ariaRole, 'treeitem');

    let topologyChanges = 0;
    plainTree.addEventListener('mdw-list-item:listtopologychange', () => {
      topologyChanges += 1;
    });
    const added = /** @type {HTMLElement & {_ariaRole: string}} */ (
      document.createElement('mdw-list-item')
    );
    plainTree.append(added);

    assert.equal(added._ariaRole, 'treeitem');
    assert.equal(topologyChanges, 0);
  });
});
