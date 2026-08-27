import ListItem from './ListItem.js';

/**
 * A tree-owned list item with one managed host tab stop and optional branch.
 * Direct `mdw-list-tree` parents own navigation and expansion-group topology.
 */
export default ListItem
  .extend()
  .set({
    _ariaRole: 'treeitem',
    _primaryCellDisclosure: false,
    _actionTabIndex: '-1',

    /** @type {HTMLElement|null} Direct expansion tree assigned by the owner. */
    _ownedTreeGroup: null,
  })
  .observe({
    /** Whether the owning tree assigned a direct expansion group. */
    _treeExpandable: 'boolean',
  })
  .overrides({
    /** @param {Event} event @return {boolean} */
    _isStateTargetEvent(event) {
      const stateTarget = this.stateTargetElement;
      const [origin] = event.composedPath();
      if (event instanceof FocusEvent && origin === this) return true;
      if (event instanceof KeyboardEvent && origin === this) {
        return this.href == null
          || (event.key !== ' ' && event.key !== 'Spacebar');
      }
      return origin === stateTarget;
    },

    getExpandableAriaElement() {
      const group = this._ownedTreeGroup;
      return group?.parentElement === this
        && group.slot === 'expansion'
        && (/** @type {any} */ (group))._listRole === 'group'
        ? this
        : null;
    },
  })
  .expressions({
    _showPrimaryInteraction({ actionable, href }) {
      return href == null && !actionable;
    },
    _showExpansionAction({ _expandable, _treeExpandable, actionable, href }) {
      return _expandable && _treeExpandable && href == null && actionable;
    },
    isInteractive() {
      return true;
    },
    _showStateLayer({ stateLayer }) {
      return stateLayer;
    },
    _showRippleContainer({ disabledState }) {
      return !disabledState;
    },
    _showExpandableIcon({ _expandable, _treeExpandable, actionable, href, trailingIcon, trailing }) {
      return _expandable
        && _treeExpandable
        && href == null
        && !actionable
        && !trailingIcon
        && !trailing;
    },
  })
  .events({
    click(event) {
      if (this.disabledState || event.target !== this) return;
      this.focus();
    },
  })
  .childEvents({
    expansionSlot: {
      slotchange() {
        if (!this.isConnected) return;
        this.dispatchEvent(new Event('mdw-list-tree-item:listtopologychange', {
          bubbles: true,
          composed: true,
        }));
      },
    },
    primaryInteraction: {
      click(event) {
        if (this.disabledState
          || this.refs.expansionAction?.isConnected
          || this.getExpandableAriaElement() !== this) return;
        this.toggleExpanded();
        event.preventDefault();
      },
    },
  })
  .methods({
    /** @param {HTMLElement|null} group */
    _setOwnedTreeGroup(group) {
      if (this._ownedTreeGroup === group) return;
      this._ownedTreeGroup = group;
      this._treeExpandable = group != null;
      this._updateExpandableAria();
    },
  })
  .on({
    connected() {
      if (this.parentElement?.localName === 'mdw-list-tree') {
        (/** @type {HTMLElement & Record<string, any>} */ (
          this.parentElement
        ))._syncDirectTreeItem?.(this);
      }
      this._updateExpandableAria();
    },
    disconnected() {
      this._setOwnedTreeGroup(null);
    },
  })
  .autoRegister('mdw-list-tree-item');
