import List from './List.js';

/** @typedef {HTMLElement & { disabledState: boolean, expanded: boolean, toggleExpanded(force?: boolean): void }} TreeItemElement */
/** @typedef {HTMLElement & { _listRole: string, refreshTabIndexes(): void }} ListTreeElement */
/** @typedef {HTMLElement & { _setListRole?(role: string, treeExpandable?: boolean): void }} ListTreeItemElement */

/**
 * Returns the first direct expansion tree owned by an item.
 * @param {HTMLElement} item
 * @return {HTMLElement|null}
 */
function getChildTreeGroup(item) {
  for (const child of item.children) {
    if (child.localName !== 'mdw-list-tree') continue;
    if (child.slot !== 'expansion') continue;
    return /** @type {HTMLElement} */ (child);
  }
  return null;
}

/** @param {HTMLElement|null} group @return {boolean} */
function isOwnedTreeGroup(group) {
  return group?.localName === 'mdw-list-tree'
    && group.slot === 'expansion'
    && (/** @type {ListTreeElement} */ (group))._listRole === 'group';
}

/**
 * @param {HTMLElement} element
 * @yields {HTMLElement}
 * @return {IterableIterator<HTMLElement>}
 */
function* getTreeItems(element) {
  for (const child of element.children) {
    if (child.localName !== 'mdw-list-item') continue;
    const item = /** @type {TreeItemElement} */ (child);
    yield item;

    if (!item.expanded) continue;
    const group = getChildTreeGroup(item);
    if (!group || !isOwnedTreeGroup(group)) continue;
    yield* getTreeItems(group);
  }
}

/**
 * @param {HTMLElement} tree
 * @param {HTMLElement} item
 * @return {boolean}
 */
function ownsTreeItem(tree, item) {
  let currentItem = item;
  while (currentItem.parentElement !== tree) {
    const group = currentItem.parentElement;
    if (!isOwnedTreeGroup(group)) return false;
    const parentItem = group.parentElement;
    if (parentItem?.localName !== 'mdw-list-item') return false;
    if (getChildTreeGroup(parentItem) !== group) return false;
    if (!(/** @type {TreeItemElement} */ (parentItem)).expanded) return false;
    currentItem = /** @type {HTMLElement} */ (parentItem);
  }
  return currentItem.localName === 'mdw-list-item';
}

/**
 * @param {HTMLElement} tree
 * @param {HTMLElement} item
 * @return {HTMLElement|null}
 */
function getParentTreeItem(tree, item) {
  if (item.parentElement === tree) return null;
  const group = item.parentElement;
  if (!isOwnedTreeGroup(group)) return null;
  const parentItem = group.parentElement;
  return parentItem?.localName === 'mdw-list-item'
    && getChildTreeGroup(parentItem) === group
    && ownsTreeItem(tree, parentItem)
    ? /** @type {HTMLElement} */ (parentItem)
    : null;
}

/** @param {ListTreeElement & Record<string, any>} tree @return {'tree'|'group'} */
function getResolvedListRole(tree) {
  const parentItem = tree.parentElement;
  const expansionParent = tree.slot === 'expansion'
    && parentItem?.localName === 'mdw-list-item'
    ? parentItem
    : null;
  const parentTree = expansionParent?.parentElement;
  const parentRole = parentTree?.localName === 'mdw-list-tree'
    ? /** @type {ListTreeElement} */ (parentTree)._listRole
    : null;
  const ownedExpansionGroup = expansionParent != null
    && getChildTreeGroup(expansionParent) === tree;
  return ownedExpansionGroup
    && (parentRole === 'tree' || parentRole === 'group')
    ? 'group'
    : 'tree';
}

/** @param {ListTreeElement & Record<string, any>} tree @return {ListTreeElement & Record<string, any>} */
function getListTreeTopologyRoot(tree) {
  let root = tree;
  let crossesCurrentBoundary = getResolvedListRole(root) !== root._listRole;
  for (let parentItem = root.parentElement; parentItem; parentItem = root.parentElement) {
    const parentTree = parentItem?.localName === 'mdw-list-item'
      ? parentItem.parentElement
      : null;
    const currentlyOwned = root.slot === 'expansion'
      && getChildTreeGroup(parentItem) === root;
    const wasOwned = crossesCurrentBoundary && root._listRole === 'group';
    if (parentTree?.localName !== 'mdw-list-tree'
      || (!currentlyOwned && !wasOwned)
      || (!crossesCurrentBoundary && root._listRole !== 'group')) break;
    root = /** @type {ListTreeElement & Record<string, any>} */ (parentTree);
    crossesCurrentBoundary = false;
  }
  return root;
}

/**
 * @param {ListTreeElement & Record<string, any>} tree
 * @param {Set<ListTreeElement & Record<string, any>>} [trees]
 * @return {Set<ListTreeElement & Record<string, any>>}
 */
function collectListTreeTopology(tree, trees = new Set()) {
  trees.add(tree);
  for (const child of tree.children) {
    if (child.localName !== 'mdw-list-item') continue;
    for (const group of child.children) {
      if (group.localName !== 'mdw-list-tree') continue;
      const nestedTree = /** @type {ListTreeElement & Record<string, any>} */ (group);
      if (!('_listRole' in nestedTree)) continue;
      if (nestedTree._listRole === 'tree'
        && getResolvedListRole(nestedTree) === 'tree') continue;
      collectListTreeTopology(nestedTree, trees);
    }
  }
  return trees;
}

/** @param {ListTreeElement & Record<string, any>} owner @return {boolean} */
function listTreeOwnerNeedsRefresh(owner) {
  const managed = owner._kbdManagedTabIndexes;
  let ownedCount = 0;
  for (const item of getTreeItems(owner)) {
    ownedCount += 1;
    if (!managed?.has(item)) return true;
  }
  return (managed?.size ?? 0) !== ownedCount;
}

/** @param {Iterable<ListTreeElement & Record<string, any>>} trees @return {boolean} */
function listTreeRolesNeedResolution(trees) {
  for (const tree of trees) {
    if (tree._listRole !== getResolvedListRole(tree)) return true;
  }
  return false;
}

/** @param {Iterable<ListTreeElement & Record<string, any>>} trees */
function resolveListRoles(trees) {
  for (const tree of trees) {
    const role = getResolvedListRole(tree);
    tree._listRole = role;
    const updatingAriaRole = tree._updatingAriaRole;
    tree._updatingAriaRole = true;
    try {
      tree._ariaRole = role;
      tree.updateAriaProperty('role', role);
    } finally {
      tree._updatingAriaRole = updatingAriaRole;
    }
  }
  for (const tree of trees) {
    const role = tree._listRole;
    for (const child of tree.children) {
      if (child.localName !== 'mdw-list-item') continue;
      const item = /** @type {ListTreeItemElement} */ (child);
      item._setListRole?.(role, isOwnedTreeGroup(getChildTreeGroup(item)));
    }
  }
}

/** @param {ListTreeElement & Record<string, any>} tree */
function releaseDetachedListRole(tree) {
  if (tree._listRole !== 'group') return;
  tree._listRole = 'tree';
  const updatingAriaRole = tree._updatingAriaRole;
  tree._updatingAriaRole = true;
  try {
    tree._ariaRole = 'tree';
    tree.updateAriaProperty('role', 'tree');
  } finally {
    tree._updatingAriaRole = updatingAriaRole;
  }
}

/** @param {ListTreeElement & Record<string, any>} tree */
function refreshListRole(tree) {
  const root = getListTreeTopologyRoot(tree);
  const trees = collectListTreeTopology(root);
  const previousOwners = new Set([...trees].filter((owner) => owner._listRole === 'tree'));
  resolveListRoles(trees);
  const currentOwners = new Set([...trees].filter((owner) => owner._listRole === 'tree'));
  for (const owner of previousOwners) {
    if (!currentOwners.has(owner)) {
      owner.refreshTabIndexes();
    }
  }
  for (const owner of previousOwners) {
    if (currentOwners.has(owner) && listTreeOwnerNeedsRefresh(owner)) {
      owner.refreshTabIndexes();
    }
  }
  for (const owner of currentOwners) {
    if (!previousOwners.has(owner)) {
      owner.refreshTabIndexes();
    }
  }
}

/** @param {ListTreeElement & Record<string, any>} tree */
function refreshCurrentListTreeTopology(tree) {
  const root = getListTreeTopologyRoot(tree);
  if (listTreeRolesNeedResolution(collectListTreeTopology(root))) {
    refreshListRole(tree);
  } else if (listTreeOwnerNeedsRefresh(root)) {
    root.refreshTabIndexes();
  }
}

/**
 * Trees present hierarchical list items with managed disclosure navigation.
 */
export default List
  .extend()
  .set({
    /** Effective role is `tree` for owners and `group` for owned expansions. */
    _ariaRole: 'tree',
    _listRole: 'tree',
  })
  .overrides({
    shouldUseKbdNav() {
      return this.kbdNav === 'true' && this._listRole === 'tree';
    },

    _shouldUseLinearKbdNav() {
      return false;
    },

    _kbdOwnsKbdNavChild(child) {
      return ownsTreeItem(this, child);
    },

    _getKbdEventTarget(event, composed = false) {
      if (!this.shouldUseKbdNav()) return null;
      const path = composed ? event.composedPath() : [event.target];
      for (const target of path) {
        if (!(target instanceof HTMLElement)) continue;
        if (target.localName !== 'mdw-list-item') continue;
        return this._kbdOwnsKbdNavChild(target) ? target : null;
      }
      return null;
    },

    * getKbdNavChildren() {
      yield* getTreeItems(this);
    },
  })
  .define({
    /** Trees use an operation-local recursive order. */
    _kbdNavUsesDirectChildren() { return false; },
  })
  .events({
    'mdw-list-item:listtopologychange'(event) {
      if (!this.isConnected) return;
      const item = /** @type {HTMLElement|null} */ (event.target);
      if (!item || item.localName !== 'mdw-list-item') return;
      if (item.parentElement === this) {
        refreshCurrentListTreeTopology(this);
        event.stopPropagation();
      }
    },
    'mdw-list-item:expandedchange'(event) {
      const item = /** @type {HTMLElement|null} */ (event.target);
      if (!this.isConnected || !item || !ownsTreeItem(this, item)) return;
      this.refreshTabIndexes();
    },
    keydown(event) {
      if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;

      const item = this._getKbdEventTarget(event);
      if (!item) return;
      const group = getChildTreeGroup(item);
      let handled = false;

      switch (event.key) {
        case 'ArrowDown':
        case 'Down':
          handled = this.focusNext(item) != null;
          break;
        case 'ArrowUp':
        case 'Up':
          handled = this.focusPrevious(item) != null;
          break;
        case 'Home': {
          const focused = this.focusFirst();
          handled = focused != null && focused !== item;
          break;
        }
        case 'End': {
          const focused = this.focusLast();
          handled = focused != null && focused !== item;
          break;
        }
        case 'ArrowRight':
        case 'Right': {
          if (!group || !isOwnedTreeGroup(group)) break;
          const treeItem = /** @type {TreeItemElement} */ (item);
          if (treeItem.disabledState) break;
          if (!treeItem.expanded) {
            treeItem.toggleExpanded(true);
            handled = this.shouldUseKbdNav() && treeItem.expanded;
            break;
          }
          for (const child of getTreeItems(group)) {
            if (getChildTreeGroup(item) !== group || !isOwnedTreeGroup(group)) break;
            if (!this._attemptKbdFocus(child)) {
              if (!this.shouldUseKbdNav()) break;
              continue;
            }
            handled = true;
            break;
          }
          break;
        }
        case 'ArrowLeft':
        case 'Left': {
          const treeItem = /** @type {TreeItemElement} */ (item);
          if (group
            && isOwnedTreeGroup(group)
            && treeItem.expanded
            && !treeItem.disabledState) {
            treeItem.toggleExpanded(false);
            handled = this.shouldUseKbdNav() && !treeItem.expanded;
            break;
          }
          const parentItem = getParentTreeItem(this, item);
          if (parentItem) {
            handled = this._attemptKbdFocus(parentItem) != null;
          }
          break;
        }
        default:
      }

      if (!handled) return;
      event.stopPropagation();
      event.preventDefault();
    },
  })
  .childEvents({
    slot: {
      slotchange() {
        if (!this.isConnected) return;
        refreshCurrentListTreeTopology(this);
      },
    },
  })
  .on({
    connected() {
      refreshListRole(this);
    },
    disconnected() {
      releaseDetachedListRole(this);
    },
  })
  .autoRegister('mdw-list-tree');
