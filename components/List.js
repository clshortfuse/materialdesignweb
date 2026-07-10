import DensityMixin from '../mixins/DensityMixin.js';
import KeyboardNavMixin from '../mixins/KeyboardNavMixin.js';

import Box from './Box.js';

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */
/** @typedef {HTMLElement & { disabledState: boolean, expanded: boolean, toggleExpanded(force?: boolean): void }} TreeItemElement */

/**
 * @param {HTMLElement} item
 * @return {HTMLElement|null}
 */
function getChildTreeGroup(item) {
  for (const child of item.children) {
    if (child.localName !== 'mdw-list') continue;
    if (child.slot !== 'expansion') continue;
    return /** @type {HTMLElement} */ (child);
  }
  return null;
}

/**
 * @param {HTMLElement} element
 * @return {boolean}
 */
function hasTreeItems(element) {
  for (const child of element.children) {
    if (child.localName !== 'mdw-list-item') continue;
    if (getChildTreeGroup(/** @type {HTMLElement} */ (child))) return true;
  }
  return false;
}

/**
 * @param {HTMLElement} element
 * @param {boolean} [visibleOnly]
 * @param {HTMLElement[]} [items]
 * @return {HTMLElement[]}
 */
function getTreeItems(element, visibleOnly = false, items = []) {
  for (const child of element.children) {
    if (child.localName !== 'mdw-list-item') continue;
    const item = /** @type {HTMLElement} */ (child);
    if (visibleOnly && (
      item.hidden
      || item.inert
      || item.getAttribute('aria-hidden') === 'true'
    )) continue;
    items.push(item);

    const group = getChildTreeGroup(item);
    if (!group) continue;
    if (visibleOnly && (
      group.hidden
      || group.inert
      || group.getAttribute('aria-hidden') === 'true'
    )) continue;
    getTreeItems(group, visibleOnly, items);
  }
  return items;
}

/**
 * Lists present a single column of related content, such as options or navigation.
 * @see https://m3.material.io/components/lists/specs
 */
export default Box
  .extend()
  .mixin(DensityMixin)
  .mixin(KeyboardNavMixin)
  .set({
    /** ARIA role applied to the host element (default: 'list'). */
    _ariaRole: 'list',

    /** Resolved ARIA role after inspecting nested list topology. */
    _listRole: 'list',

    /** Last role explicitly authored on the host. */
    _authoredListRole: null,

    /** Whether role attribute changes should be treated as authored. */
    _listRoleConnected: false,

    /** Suppresses role reflection from being treated as author input. */
    _updatingListRole: false,

    /**
     * Visual color token for list surfaces. Default is `surface` to match
     * Material surface theming.
     */
    color: { empty: 'surface' },
  })
  .observe({
    /** Internal observer for the authored `role` attribute. */
    _roleAttribute: { attr: 'role', reflect: 'read' },
  })
  .overrides({
    shouldUseKbdNav() {
      return this.kbdNav === 'true'
        && (this._listRole === 'tree' || this._listRole === 'listbox');
    },

    getKbdNavChildren() {
      if (this._listRole === 'tree') return getTreeItems(this, true);
      return this.querySelectorAll(this.kbdNavQuery);
    },
  })
  .methods({
    /** @return {boolean} */
    _shouldAutoResolveListRole() { return true; },

    /**
     * Updates direct item roles after this list resolves to list/tree/group.
     * @param {string} role
     * @return {void}
     */
    _updateDirectListItemRoles(role) {
      for (const child of this.children) {
        if (child.localName !== 'mdw-list-item') continue;
        const item = /** @type {HTMLElement & { _setListRole?: (role: string) => void }} */ (child);
        if (typeof item._setListRole === 'function') {
          item._setListRole(role);
        }
      }
    },

    _refreshListRole() {
      if (!this._shouldAutoResolveListRole()) {
        this.refreshTabIndexes();
        return;
      }
      const explicitRole = this._authoredListRole;
      const role = explicitRole
        || (this.parentElement?.localName === 'mdw-list-item' && this.slot === 'expansion' && 'group')
        || (hasTreeItems(this) && 'tree')
        || 'list';
      this._listRole = role;
      this._updatingListRole = true;
      try {
        this._ariaRole = role;
      } finally {
        this._updatingListRole = false;
      }
      this._updateDirectListItemRoles(role);
      this.refreshTabIndexes();
    },
  })
  .css`
    /* https://m3.material.io/components/lists/specs */

    :host {
      display: block;

      padding-block: 8px;

      color: rgb(var(--mdw-ink));
    }

  `
  .events({
    'mdw-list-item:expandablechange'() {
      this._refreshListRole();
    },
    'mdw-list-item:expandedchange'() {
      this.refreshTabIndexes();
    },
    keydown(event) {
      if (this._listRole !== 'tree') return;
      if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;

      const item = this._getKbdEventTarget(event);
      if (!item) return;
      const group = getChildTreeGroup(item);

      let handled = false;

      switch (event.key) {
        case 'ArrowRight':
        case 'Right': {
          if (!group) break;
          const treeItem = /** @type {TreeItemElement} */ (item);
          if (treeItem.disabledState) break;
          if (!treeItem.expanded) {
            treeItem.toggleExpanded(true);
            handled = treeItem.expanded;
            break;
          }
          const [firstChild] = getTreeItems(group, true);
          if (firstChild) {
            firstChild.focus();
            handled = true;
          }
          break;
        }
        case 'ArrowLeft':
        case 'Left': {
          const treeItem = /** @type {TreeItemElement} */ (item);
          if (group && treeItem.expanded && !treeItem.disabledState) {
            treeItem.toggleExpanded(false);
            handled = !treeItem.expanded;
            break;
          }
          const parentItem = /** @type {HTMLElement|null|undefined} */ (item.parentElement?.closest('mdw-list-item'));
          if (parentItem) {
            parentItem.focus();
            handled = true;
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
        this._refreshListRole();
      },
    },
  })
  .on({
    _roleAttributeChanged(oldValue, newValue) {
      if (this._updatingListRole) return;
      if (this.isConnected && !this._listRoleConnected) return;
      this._authoredListRole = newValue;
      if (this.isConnected) {
        this._refreshListRole();
      }
    },
    connected() {
      this._listRoleConnected = true;
      this._refreshListRole();
    },
    disconnected() {
      this._listRoleConnected = false;
    },
  })
  .autoRegister('mdw-list');
