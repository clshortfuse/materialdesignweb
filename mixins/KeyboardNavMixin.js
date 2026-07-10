import { attemptFocus, isFocused, isRtl } from '../core/dom.js';

import AriaReflectorMixin from './AriaReflectorMixin.js';

const DEFAULT_ELEMENT_QUERY = [
  'button',
  '[href]',
  'input',
  'select',
  'textarea',
  '[tabindex]',
].join(', ');

/**
 * Adds keyboard roving navigation utilities for focus management within a list.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function KeyboardNavMixin(Base) {
  return Base
    .mixin(AriaReflectorMixin)
    .set({
      /** @type {Map<HTMLElement, string|null>|null} */
      _kbdManagedTabIndexes: null,
    })
    .observe({
      /** Enable keyboard roving navigation when present (set to 'true'). */
      kbdNav: { empty: 'true' },
      /** Internal flag used to mark focusable children in the roving list. */
      _kbdFocusable: { empty: true },

    })
    .define({
      /**
       * Query used to find roving tab index children
       */
      kbdNavQuery() {
        return DEFAULT_ELEMENT_QUERY;
      },
      /**
       * Flag whether disabled elements participating in roving tab index
       * should be focusable.
       */
      kbdNavFocusableWhenDisabled() { return true; },
      /** @return {'horizontal'|'vertical'} */
      ariaOrientationDefault() { return 'vertical'; },
    })
    .define({
      /**
       * List of roving tab index participating children
       * @return {Iterable<HTMLElement>}
       */
      kbdNavChildren() {
        return /** @type {Iterable<HTMLElement>} */ (/** @type {any} */ (this).getKbdNavChildren());
      },
    })
    .methods({
      /**
       * Effective keyboard-navigation activation hook.
       * Override this when a component needs to narrow `kbdNav` by role/state.
       * @return {boolean}
       */
      shouldUseKbdNav() {
        return this.kbdNav === 'true';
      },
      /**
       * @return {Iterable<HTMLElement>}
       */
      getKbdNavChildren() {
        return this.querySelectorAll(this.kbdNavQuery);
      },
      _ariaOrientationIsVertical() {
        return (this.readAriaProperty('ariaOrientation')
          || this.ariaOrientationDefault) === 'vertical';
      },
      /**
       * @param {HTMLElement} child
       * @return {boolean}
       */
      _kbdChildNavigable(child) {
        return child.getAttribute('aria-hidden') !== 'true'
          && (this.kbdNavFocusableWhenDisabled || child.getAttribute('aria-disabled') !== 'true');
      },
      /**
       * Returns the managed keyboard child that directly received an event.
       * @param {Event} event
       * @return {HTMLElement|null}
       */
      _getKbdEventTarget(event) {
        if (!(event.target instanceof HTMLElement)) return null;
        for (const child of this.kbdNavChildren) {
          if (child === event.target && this._kbdChildNavigable(child)) return child;
        }
        return null;
      },
      /**
       * @param {HTMLElement} child
       * @param {number} tabIndex
       * @return {void}
       */
      _setKbdTabIndex(child, tabIndex) {
        this._kbdManagedTabIndexes ??= new Map();
        if (!this._kbdManagedTabIndexes.has(child)) {
          this._kbdManagedTabIndexes.set(child, child.getAttribute('tabindex'));
        }
        child.tabIndex = tabIndex;
      },
      /**
       * Restores tabindex values for children that are no longer managed.
       * @param {Set<HTMLElement>|null} [managedChildren]
       * @return {void}
       */
      _restoreKbdTabIndexes(managedChildren = null) {
        if (!this._kbdManagedTabIndexes) return;
        for (const [child, tabIndex] of this._kbdManagedTabIndexes) {
          if (managedChildren?.has(child)) continue;
          if (tabIndex == null) {
            child.removeAttribute('tabindex');
          } else {
            child.setAttribute('tabindex', tabIndex);
          }
          this._kbdManagedTabIndexes.delete(child);
        }
      },
      focusCurrentOrFirst() {
        this.refreshTabIndexes();
        if (!this.shouldUseKbdNav()) return null;
        let current;
        let first;
        for (const candidate of this.kbdNavChildren) {
          if (!candidate.hasAttribute('tabindex')) continue;
          if (!this._kbdChildNavigable(candidate)) continue;
          first ??= candidate;
          if (candidate.getAttribute('tabindex') === '0') {
            current = candidate;
            break;
          }
        }
        if (attemptFocus(current)) return current;
        if (attemptFocus(first)) return first;
        return null;
      },
      /**
       * Focuses next element participating in roving tab index list
       * @param {HTMLElement} [current]
       * @param {boolean} [loop=true]
       * @param {boolean} [reverse]
       * @return {HTMLElement|null} focusedElement
       */
      focusNext(current = null, loop = true, reverse = false) {
        this.refreshTabIndexes();
        if (!this.shouldUseKbdNav()) return null;
        let foundCurrent = false;
        const array = reverse ? [...this.kbdNavChildren].reverse() : this.kbdNavChildren;
        for (const candidate of array) {
          if (!foundCurrent) {
            foundCurrent = (current
              ? (candidate === current)
              : (candidate.getAttribute('tabindex') === '0'));
            continue;
          }
          if (!candidate.hasAttribute('tabindex')) {
            continue;
          }
          if (!this._kbdChildNavigable(candidate)) {
            continue;
          }
          if (attemptFocus(candidate)) {
            this.ariaActiveDescendantElement = candidate;
            return candidate;
          }
        }

        if (!loop) {
          if (!isFocused(current) && current instanceof HTMLElement) {
            current.focus();
          }
          return current;
        }
        // Loop
        for (const candidate of array) {
          if (!candidate.hasAttribute('tabindex')) {
            continue;
          }
          if (!this._kbdChildNavigable(candidate)) {
            continue;
          }
          // Abort if we've looped all the way back to original element
          // Abort if candidate received focus
          if (attemptFocus(candidate)) {
            this.ariaActiveDescendantElement = candidate;
            return candidate;
          }
          if (candidate === current) {
            return candidate;
          }
        }
        return null;
      },

      /**
       * Alias for focusNext(list, current, true).
       * Selects previous element
       * @param {HTMLElement} [current]
       * @param {boolean} [loop=true]
       * @return {HTMLElement|null}
       */
      focusPrevious(current, loop = true) {
        return this.focusNext(current, loop, true);
      },

      focusFirst() {
        this.refreshTabIndexes();
        if (!this.shouldUseKbdNav()) return null;
        for (const candidate of this.kbdNavChildren) {
          if (!candidate.hasAttribute('tabindex')) continue;
          if (!this._kbdChildNavigable(candidate)) continue;
          if (attemptFocus(candidate)) {
            this.ariaActiveDescendantElement = candidate;
            return candidate;
          }
        }
        return null;
      },

      focusLast() {
        this.refreshTabIndexes();
        if (!this.shouldUseKbdNav()) return null;
        for (const candidate of [...this.kbdNavChildren].reverse()) {
          if (!candidate.hasAttribute('tabindex')) continue;
          if (!this._kbdChildNavigable(candidate)) continue;
          if (attemptFocus(candidate)) {
            this.ariaActiveDescendantElement = candidate;
            return candidate;
          }
        }
        return null;
      },

      /** @type {HTMLElement['focus']} */
      focus(...options) {
        // super.focus(...options);
        if (attemptFocus(this.ariaActiveDescendantElement, ...options)) {
          return;
        }
        for (const candidate of this.kbdNavChildren) {
          if (candidate.getAttribute('tabindex') === '0' && this._kbdChildNavigable(candidate)) {
            this.ariaActiveDescendantElement = candidate;
            candidate.focus(...options);
            return;
          }
        }
        this.focusNext();
      },

      /**
       * Refreshes roving tab index attributes based on kbdNavChildren
       */
      refreshTabIndexes() {
        if (!this.shouldUseKbdNav()) {
          this._restoreKbdTabIndexes();
          return;
        }
        const children = [...this.kbdNavChildren];
        const childSet = new Set(children);
        this._restoreKbdTabIndexes(childSet);
        /** @type {HTMLElement} */
        let currentlyFocusedChild = null;
        /** @type {HTMLElement} */
        let currentTabIndexChild = null;
        /** @type {HTMLElement} */
        let firstFocusableChild = null;
        for (const child of children) {
          if (!firstFocusableChild && this._kbdChildNavigable(child)) {
            firstFocusableChild = child;
          }
          if (!currentlyFocusedChild && this._kbdChildNavigable(child) && isFocused(child)) {
            currentlyFocusedChild = child;
          }
          if (!currentTabIndexChild && this._kbdChildNavigable(child) && child.getAttribute('tabindex') === '0') {
            currentTabIndexChild = child;
          }
        }
        const activeChild = currentlyFocusedChild ?? currentTabIndexChild ?? firstFocusableChild;
        for (const child of children) {
          this._setKbdTabIndex(child, child === activeChild ? 0 : -1);
        }
      },
    })
    .events({
      focusin(event) {
        if (!this.shouldUseKbdNav()) return;
        if (!(event.target instanceof HTMLElement)) return;
        const currentItem = event.target;
        const children = [...this.kbdNavChildren];
        if (!children.includes(currentItem)) return;
        this.ariaActiveDescendantElement = currentItem;
        if (currentItem.getAttribute('tabindex') !== '0') {
          this._setKbdTabIndex(currentItem, 0);
        }
        for (const item of children) {
          if (item !== currentItem && item.hasAttribute('tabindex')) {
            this._setKbdTabIndex(item, -1);
          }
        }
      },
      keydown(event) {
        if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
        if (!this.shouldUseKbdNav()) return;

        /** @type {HTMLElement|null} */
        let focused = null;
        /** @type {HTMLElement|null} */
        let current = null;
        switch (event.key) {
          case 'ArrowUp':
          case 'Up':
            if (this._ariaOrientationIsVertical()) {
              current = this._getKbdEventTarget(event);
              if (!current) return;
              focused = this.focusPrevious(current);
            }
            break;
          case 'ArrowDown':
          case 'Down':
            if (this._ariaOrientationIsVertical()) {
              current = this._getKbdEventTarget(event);
              if (!current) return;
              focused = this.focusNext(current);
            }
            break;
          case 'ArrowLeft':
          case 'Left':
            if (this._ariaOrientationIsVertical()) return;
            current = this._getKbdEventTarget(event);
            if (!current) return;
            focused = isRtl(this) ? this.focusNext(current) : this.focusPrevious(current);
            break;
          case 'ArrowRight':
          case 'Right':
            if (this._ariaOrientationIsVertical()) return;
            current = this._getKbdEventTarget(event);
            if (!current) return;
            focused = isRtl(this) ? this.focusPrevious(current) : this.focusNext(current);
            break;
          case 'Home':
            current = this._getKbdEventTarget(event);
            if (!current) return;
            focused = this.focusFirst();
            break;
          case 'End':
            current = this._getKbdEventTarget(event);
            if (!current) return;
            focused = this.focusLast();
            break;
          default:
            return;
        }
        if (!focused) return;
        event.stopPropagation(); // Avoid kbd within kbd (sub menus)
        event.preventDefault();
      },
    })
    .on({
      kbdNavChanged() {
        this.refreshTabIndexes();
      },
      connected() {
        this.refreshTabIndexes();
      },
    });
}
