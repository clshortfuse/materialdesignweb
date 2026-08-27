import { attemptFocus, isFocused, isRtl } from '../core/dom.js';

import List from './List.js';
import ListCell from './ListCell.js';
import ListRow from './ListRow.js';

const GRID_ACTION_INTRINSIC_SELECTOR = 'a[href],button,input,select,textarea,'
  + '[role="button"],[role="checkbox"],[role="link"],[role="radio"],[role="switch"],'
  + '[contenteditable]:not([contenteditable="false"])';
const NESTED_ACTION_OWNER_ROLES = new Set([
  'combobox',
  'grid',
  'listbox',
  'menu',
  'menubar',
  'radiogroup',
  'tablist',
  'toolbar',
  'tree',
  'treegrid',
]);

/**
 * @typedef {HTMLElement & {
 *   _ariaRole?: string,
 *   actionable?: boolean,
 *   disabledState?: boolean,
 *   href?: string|null,
 *   refs?: Record<string, HTMLElement>,
 * }} ListRowElement
 */

/** @param {HTMLElement} element @return {boolean} */
function isNestedActionOwner(element) {
  const reflectedRole = typeof (/** @type {any} */ (element)).readAriaProperty === 'function'
    ? (/** @type {any} */ (element)).readAriaProperty('role')
    : element.role;
  return NESTED_ACTION_OWNER_ROLES.has(reflectedRole);
}

/** @param {Record<string, any>} owner @param {HTMLElement} target @return {string|null} */
function getAuthoredGridTabIndex(owner, target) {
  if (!owner._kbdManagedTabIndexes?.has(target)) return target.getAttribute('tabindex');
  const managedValue = target === owner._kbdTabStop ? '0' : '-1';
  return target.getAttribute('tabindex') === managedValue
    ? owner._kbdManagedTabIndexes.get(target)
    : target.getAttribute('tabindex');
}

/**
 * @param {Record<string, any>} owner
 * @param {HTMLElement} action
 * @param {HTMLElement|null} [target]
 * @return {HTMLElement|null}
 */
function getGridActionDescendant(owner, action, target = null) {
  for (const child of action.children) {
    if (!(child instanceof HTMLElement)) continue;
    const nestedOwner = isNestedActionOwner(child);
    if (!target
      && !nestedOwner
      && (child.matches(GRID_ACTION_INTRINSIC_SELECTOR)
        || (getAuthoredGridTabIndex(owner, child) != null && child.matches('[tabindex]')))) {
      target = child;
    }
    if (target !== child) {
      owner._restoreKbdTabIndex(child);
    }
    if (!nestedOwner) {
      target = getGridActionDescendant(owner, child, target);
    }
  }
  return target;
}

/**
 * @param {Record<string, any>} owner
 * @param {HTMLElement} action
 * @return {HTMLElement|null}
 */
function getGridActionTarget(owner, action) {
  if (isNestedActionOwner(action)) return null;
  let target = (action.matches(GRID_ACTION_INTRINSIC_SELECTOR)
    || (getAuthoredGridTabIndex(owner, action) != null && action.matches('[tabindex]')))
    ? action
    : null;
  target = getGridActionDescendant(owner, action, target);
  target ??= action.childElementCount === 0 ? action : null;
  if (target !== action) {
    owner._restoreKbdTabIndex(action);
  }
  return target;
}

/** @param {ListRowElement} row @return {HTMLElement|null} */
function getOwnedPrimaryActionTarget(row) {
  if (row.href != null && row.refs?.anchor?.isConnected) return row.refs.anchor;
  if (row.actionable && row.refs?.primaryAction?.isConnected) return row.refs.primaryAction;
  return null;
}

/** @param {ListRowElement} row @return {HTMLElement|null} */
function getPrimaryActionTarget(row) {
  return row.disabledState ? null : getOwnedPrimaryActionTarget(row);
}

/** @param {ListRowElement} row @return {HTMLElement[]} */
function getGridFocusTargets(row) {
  const owner = row.parentElement?.localName === 'mdw-list-grid'
    ? /** @type {Record<string, any>} */ (row.parentElement)
    : null;
  if (!owner || row.localName !== ListRow.elementName) return [];
  const primaryAction = getPrimaryActionTarget(row);
  const trailingActions = [];
  for (const action of row.children) {
    if (!(action instanceof HTMLElement)
      || action.localName !== ListCell.elementName
      || action.slot !== 'trailing-action') continue;
    const target = getGridActionTarget(owner, action);
    if (!target) continue;
    trailingActions.push(target);
  }
  const expansionAction = row.refs?.expansionAction?.isConnected
    ? row.refs.expansionAction
    : null;
  if (primaryAction) {
    return expansionAction
      ? [primaryAction, ...trailingActions, expansionAction]
      : [primaryAction, ...trailingActions];
  }
  return expansionAction ? [...trailingActions, expansionAction] : trailingActions;
}

/** @param {HTMLElement} target @return {boolean} */
function gridTargetEnabled(target) {
  return !(/** @type {HTMLButtonElement} */ (target)).disabled;
}

/** @param {ListRowElement} row @return {HTMLElement[]} */
function getRowTargets(row) { return getGridFocusTargets(row); }

/** @param {ListRowElement} row @return {number} */
function getRowColumnOffset(row) {
  return getPrimaryActionTarget(row) ? 0 : 1;
}

/**
 * @param {ListRowElement} row
 * @param {number} column
 * @yields {HTMLElement}
 * @return {IterableIterator<HTMLElement>}
 */
function* getNearestRowTargets(row, column) {
  const targets = getRowTargets(row);
  if (!targets.length) return;
  const index = Math.max(0, Math.min(column - getRowColumnOffset(row), targets.length - 1));
  if (gridTargetEnabled(targets[index])) {
    yield targets[index];
  }
  for (let offset = 1; offset < targets.length; offset += 1) {
    const before = index - offset;
    const after = index + offset;
    if (before >= 0 && gridTargetEnabled(targets[before])) {
      yield targets[before];
    }
    if (after < targets.length && gridTargetEnabled(targets[after])) {
      yield targets[after];
    }
  }
}

/**
 * @param {HTMLElement} row
 * @param {boolean} reverse
 * @return {ListRowElement|null}
 */
function getSiblingRow(row, reverse) {
  let sibling = reverse ? row.previousElementSibling : row.nextElementSibling;
  while (sibling) {
    if (sibling.localName === ListRow.elementName) return /** @type {ListRowElement} */ (sibling);
    sibling = reverse ? sibling.previousElementSibling : sibling.nextElementSibling;
  }
  return null;
}

/** @param {HTMLElement} target @return {ListRowElement|null} */
function getGridTargetOwner(target) {
  const root = target.getRootNode();
  if (root instanceof ShadowRoot && root.host.localName === ListRow.elementName) {
    return /** @type {ListRowElement} */ (root.host);
  }
  let action = target;
  let parent = action.parentElement;
  while (parent && parent.localName !== ListRow.elementName) {
    action = parent;
    parent = action.parentElement;
  }
  if (parent?.localName === ListRow.elementName
    && action.localName === ListCell.elementName
    && action.slot === 'trailing-action') {
    return /** @type {ListRowElement} */ (parent);
  }
  return null;
}

/**
 * @param {Record<string, any>} owner
 * @param {ListRowElement} row
 * @param {HTMLElement} target
 * @return {boolean}
 */
function rowOwnsGridTarget(owner, row, target) {
  if (target === getPrimaryActionTarget(row)
    || target === (row.refs?.expansionAction?.isConnected ? row.refs.expansionAction : null)) {
    return true;
  }
  let cell = target;
  while (cell.parentElement && cell.parentElement !== row) {
    cell = cell.parentElement;
  }
  return cell.parentElement === row
    && cell.localName === ListCell.elementName
    && cell.slot === 'trailing-action'
    && getGridActionTarget(owner, cell) === target;
}

/** @param {HTMLElement} target @return {boolean} */
function usesNativeNavigationKeys(target) {
  return target.matches(
    'input:not([type=button]):not([type=submit]):not([type=reset]):not([type=image]):not([type=file]):not([type=checkbox]),'
    + 'select,textarea,[contenteditable]:not([contenteditable="false"]),'
    + '[role=combobox],[role=listbox],[role=radio],[role=slider],[role=spinbutton],[role=textbox]',
  );
}

/** @param {Record<string, any>} list @param {HTMLElement} target */
function adoptGridTabIndex(list, target) {
  if (!list._kbdManagedTabIndexes?.has(target)) return;
  const managedValue = target === list._kbdTabStop ? '0' : '-1';
  const currentValue = target.getAttribute('tabindex');
  if (currentValue !== managedValue) {
    list._kbdManagedTabIndexes.set(target, currentValue);
  }
}

/** @param {Record<string, any>} list @param {HTMLElement} target @param {number} value */
function setGridTabIndex(list, target, value) {
  list._kbdManagedTabIndexes ??= new Map();
  if (list._kbdManagedTabIndexes.has(target)) {
    adoptGridTabIndex(list, target);
  } else {
    list._kbdManagedTabIndexes.set(target, target.getAttribute('tabindex'));
  }
  const newValue = `${value}`;
  if (target.getAttribute('tabindex') === newValue) return;
  target.tabIndex = value;
}

/** @param {Record<string, any>} list @param {HTMLElement} target */
function restoreGridTabIndex(list, target) {
  if (!list._kbdManagedTabIndexes?.has(target)) return;
  adoptGridTabIndex(list, target);
  const value = list._kbdManagedTabIndexes.get(target);
  if (target.getAttribute('tabindex') !== value) {
    if (value == null) {
      target.removeAttribute('tabindex');
    } else {
      target.setAttribute('tabindex', value);
    }
  }
  list._kbdManagedTabIndexes.delete(target);
  if (list._kbdTabStop === target) {
    list._kbdTabStop = null;
  }
}

/** @param {Record<string, any>} list @param {Set<HTMLElement>|null} [ownedTargets] */
function restoreGridTabIndexes(list, ownedTargets = null) {
  for (const target of list._kbdManagedTabIndexes?.keys() ?? []) {
    if (!ownedTargets?.has(target)) {
      restoreGridTabIndex(list, target);
    }
  }
}

/** Multi-action lists expose direct rows and row-owned actions as a layout grid. */
export default List
  .extend()
  .set({
    _ariaRole: 'grid',
    _listRole: 'grid',
  })
  .overrides({
    shouldUseKbdNav() { return this.kbdNav === 'true'; },
    _shouldUseLinearKbdNav() { return false; },
    refreshTabIndexes() {
      (/** @type {Record<string, any>} */ (this))._refreshGridTabIndexes();
    },
    _kbdOwnsKbdNavChild(child) {
      const owner = getGridTargetOwner(child);
      return owner?.parentElement === this && rowOwnsGridTarget(this, owner, child);
    },
    _getKbdEventTarget(event, composed = false) {
      if (!this.shouldUseKbdNav()) return null;
      for (const target of composed ? event.composedPath() : [event.target]) {
        if (!(target instanceof HTMLElement)) continue;
        if (this._kbdOwnsKbdNavChild(target)) return gridTargetEnabled(target) ? target : null;
      }
      return null;
    },
    /** @yields {HTMLElement} @return {IterableIterator<HTMLElement>} */
    * getKbdNavChildren() {
      for (const child of this.children) {
        if (child.localName !== ListRow.elementName) continue;
        yield* getRowTargets(/** @type {ListRowElement} */ (child));
      }
    },
  })
  .define({
    kbdNavFocusableWhenDisabled() { return false; },
    _kbdNavUsesDirectChildren() { return false; },
  })
  .methods({
    /** @param {HTMLElement} child @param {number} tabIndex */
    _setKbdTabIndex(child, tabIndex) { setGridTabIndex(this, child, tabIndex); },
    /** @param {HTMLElement} child */
    _restoreKbdTabIndex(child) { restoreGridTabIndex(this, child); },

    _refreshGridTabIndexes() {
      if (!this.shouldUseKbdNav()) {
        restoreGridTabIndexes(this);
        this._kbdTabStop = null;
        return;
      }
      const ownedTargets = new Set(this.getKbdNavChildren());
      restoreGridTabIndexes(this, ownedTargets);
      let focusedTarget = null;
      let firstTarget = null;
      for (const target of ownedTargets) {
        if (!gridTargetEnabled(target)) continue;
        firstTarget ??= target;
        if (isFocused(target)) {
          focusedTarget = target;
        }
      }
      const currentTarget = this._kbdTabStop
        && ownedTargets.has(this._kbdTabStop)
        && gridTargetEnabled(this._kbdTabStop)
        ? this._kbdTabStop
        : null;
      const tabStop = focusedTarget ?? currentTarget ?? firstTarget;
      for (const target of ownedTargets) {
        setGridTabIndex(this, target, target === tabStop ? 0 : -1);
      }
      this._kbdTabStop = tabStop;
      const focusedRow = document.activeElement;
      if (focusedRow?.parentElement !== this || focusedRow.localName !== ListRow.elementName) return;
      for (const candidate of getRowTargets(/** @type {ListRowElement} */ (focusedRow))) {
        if (!attemptFocus(candidate)) continue;
        if (tabStop && tabStop !== candidate) {
          setGridTabIndex(this, tabStop, -1);
        }
        setGridTabIndex(this, candidate, 0);
        this._kbdTabStop = candidate;
        return;
      }
    },

    /** @param {FocusEvent} event */
    _handleGridFocusIn(event) {
      if (!this.shouldUseKbdNav()) return;
      const current = this._getKbdEventTarget(event, true);
      if (!current) return;
      const row = getGridTargetOwner(current);
      if (!row || row.parentElement !== this) return;
      const rowTargets = new Set(getRowTargets(row));
      const previous = this._kbdTabStop;
      if (previous && previous !== current) {
        if (this._kbdOwnsKbdNavChild(previous)) {
          setGridTabIndex(this, previous, -1);
        } else {
          restoreGridTabIndex(this, previous);
        }
      }
      for (const target of rowTargets) {
        if (target !== current && target !== previous) {
          setGridTabIndex(this, target, -1);
        }
      }
      setGridTabIndex(this, current, 0);
      this._kbdTabStop = current;
    },

    /** @param {KeyboardEvent} event */
    _handleGridKeydown(event) {
      if (event.altKey || event.metaKey || event.shiftKey) return;
      let current = null;
      for (const target of event.composedPath()) {
        if (!(target instanceof HTMLElement)) continue;
        if (usesNativeNavigationKeys(target)) return;
        if (this._kbdOwnsKbdNavChild(target) && gridTargetEnabled(target)) {
          current = target;
          break;
        }
      }
      if (!current) return;
      const row = getGridTargetOwner(current);
      if (!row || row.parentElement !== this) return;
      const rowTargets = getRowTargets(row);
      const targetIndex = rowTargets.indexOf(current);
      if (targetIndex < 0) return;
      const column = targetIndex + getRowColumnOffset(row);
      /** @type {Iterable<HTMLElement>|null} */
      let candidates = null;

      /** @param {number} step */
      const horizontalTargets = (step) => (function* targets() {
        for (let index = targetIndex + step; index >= 0 && index < rowTargets.length; index += step) {
          if (gridTargetEnabled(rowTargets[index])) {
            yield rowTargets[index];
          }
        }
      }());
      /** @param {boolean} reverse */
      const verticalTargets = (reverse) => (function* targets() {
        for (let candidateRow = getSiblingRow(row, reverse); candidateRow;
          candidateRow = getSiblingRow(candidateRow, reverse)) {
          yield* getNearestRowTargets(candidateRow, column);
        }
      }());
      /** @param {boolean} reverse */
      const allTargets = (reverse) => (function* targets() {
        let candidateRow = reverse
          ? /** @type {ListRowElement|null} */ (this.lastElementChild)
          : /** @type {ListRowElement|null} */ (this.firstElementChild);
        while (candidateRow) {
          if (candidateRow.localName === ListRow.elementName) {
            const rowActions = getRowTargets(candidateRow);
            for (let index = reverse ? rowActions.length - 1 : 0;
              index >= 0 && index < rowActions.length;
              index += reverse ? -1 : 1) {
              if (gridTargetEnabled(rowActions[index])) {
                yield rowActions[index];
              }
            }
          }
          candidateRow = getSiblingRow(candidateRow, reverse);
        }
      }).call(this);

      switch (event.key) {
        case 'ArrowRight':
        case 'Right':
          if (!event.ctrlKey) {
            candidates = horizontalTargets(isRtl(this) ? -1 : 1);
          }
          break;
        case 'ArrowLeft':
        case 'Left':
          if (!event.ctrlKey) {
            candidates = horizontalTargets(isRtl(this) ? 1 : -1);
          }
          break;
        case 'ArrowDown':
        case 'Down':
          if (!event.ctrlKey) {
            candidates = verticalTargets(false);
          }
          break;
        case 'ArrowUp':
        case 'Up':
          if (!event.ctrlKey) {
            candidates = verticalTargets(true);
          }
          break;
        case 'Home':
          candidates = event.ctrlKey ? allTargets(false) : horizontalTargets(-1);
          break;
        case 'End':
          candidates = event.ctrlKey ? allTargets(true) : horizontalTargets(1);
          break;
        default:
      }
      if (!candidates) return;
      for (const target of candidates) {
        if (target === current) return;
        if (!attemptFocus(target)) continue;
        event.stopPropagation();
        event.preventDefault();
        return;
      }
    },
  })
  .events({
    keydown(event) { this._handleGridKeydown(event); },
  })
  .childEvents({
    slot: {
      slotchange() {
        if (this.isConnected) {
          this._refreshGridTabIndexes();
        }
      },
    },
  })
  .on({
    _ariaRoleAttributeChanged() {
      if (this._updatingAriaRole || this.getAttribute('role') === 'grid') return;
      this._updatingAriaRole = true;
      try {
        this._authoredAriaRole = 'grid';
        this.setAttribute('role', 'grid');
      } finally {
        this._updatingAriaRole = false;
      }
    },
    connected() {
      this.removeEventListener('focusin', this._handleGridFocusIn, true);
      this.addEventListener('focusin', this._handleGridFocusIn, true);
      if (this.getAttribute('role') !== 'grid') {
        this._updatingAriaRole = true;
        try {
          this._authoredAriaRole = 'grid';
          this.setAttribute('role', 'grid');
        } finally {
          this._updatingAriaRole = false;
        }
      }
      this._refreshGridTabIndexes();
    },
    disconnected() {
      this.removeEventListener('focusin', this._handleGridFocusIn, true);
      restoreGridTabIndexes(this);
      this._kbdTabStop = null;
    },
  })
  .autoRegister('mdw-list-grid');
