import { attemptFocus, isRtl } from '../core/dom.js';

/**
 * @template {typeof import('../core/CustomElement.js').default} T
 * @param {T} Base
 */
export default function KeyboardNavMixin(Base) {
  class KeyboardNav extends Base {
    static DEFAULT_ELEMENT_QUERY = [
      'button',
      '[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]',
    ].join(', ');

    #ariaOrientationIsVertical() {
      return (this.ariaOrientation
          ?? this.getAttribute('aria-orientation')
          ?? this.ariaOrientationDefault) === 'vertical';
    }

    /**
     * Query used to find roving tab index children
     */
    get kbdNavQuery() {
      return /** @type {typeof KeyboardNav} */ (this.static).DEFAULT_ELEMENT_QUERY;
    }

    /**
     * List of roving tab index participating children
     * @return {NodeListOf<HTMLElement>}
     */
    get kbdNavChildren() {
      return this.querySelectorAll(this.kbdNavQuery);
    }

    /**
     * Flag whether disabled elements participating in roving tab index
     * should be focusable.
     */
    get kbdNavFocusableWhenDisabled() { return true; }

    /**
     * Focuses next element participating in roving tab index list
     * @param {HTMLElement} [current]
     * @param {boolean} [loop=true]
     * @param {boolean} [reverse]
     * @return {HTMLElement} focusedElement
     */
    focusNext(current = null, loop = true, reverse = false) {
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
        if (candidate.getAttribute('aria-hidden') === 'true') {
          continue;
        }
        if (attemptFocus(candidate)) {
          this.ariaActiveDescendantElement = candidate;
          return candidate;
        }
      }

      if (!loop) {
        if (document.activeElement !== current && current instanceof HTMLElement) {
          current.focus();
        }
        return current;
      }
      // Loop
      for (const candidate of array) {
        if (!candidate.hasAttribute('tabindex')) {
          continue;
        }
        if (candidate.getAttribute('aria-hidden') === 'true') {
          continue;
        }
        // Abort if we've looped all the way back to original element
        // Abort if candidate received focus
        if (attemptFocus(candidate)) {
          return candidate;
        }
        if (candidate === current) {
          return candidate;
        }
      }
      return null;
    }

    /**
     * Alias for focusNext(list, current, true).
     * Selects previous element
     * @param {HTMLElement} [current]
     * @param {boolean} [loop=true]
     * @return {HTMLElement}
     */
    focusPrevious(current, loop = true) {
      return this.focusNext(current, loop, true);
    }

    /** @type {HTMLElement['focus']} */
    focus(...options) {
      super.focus(...options);
      if (attemptFocus(this.ariaActiveDescendantElement, ...options)) {
        return;
      }
      for (const candidate of this.kbdNavChildren) {
        if (candidate.getAttribute('tabindex') === '0' && candidate instanceof HTMLElement) {
          this.ariaActiveDescendantElement = candidate;
          candidate.focus(...options);
          return;
        }
      }
      this.focusNext();
    }

    /**
     * Refreshes roving tab index attributes based on kbdNavChildren
     */
    refreshTabIndexes() {
      if (this.kbdNav !== 'true') return;
      /** @type {HTMLElement} */
      let currentlyFocusedChild = null;
      /** @type {HTMLElement} */
      let currentTabIndexChild = null;
      /** @type {HTMLElement} */
      let firstFocusableChild = null;
      for (const child of this.kbdNavChildren) {
        if (!currentlyFocusedChild && document.activeElement === child) {
          currentlyFocusedChild = child;
        } else if (!currentTabIndexChild && child.getAttribute('tabindex') === '0') {
          currentTabIndexChild = child;
        } else {
          if (!firstFocusableChild && child.getAttribute('aria-hidden') !== 'true'
        && (this.kbdNavFocusableWhenDisabled || child.getAttribute('aria-disabled') !== 'true')) {
            firstFocusableChild = child;
          }
          child.tabIndex = -1;
          // child.setAttribute('tabindex', '-1');
        }
        // Bind
        if (!child.hasAttribute('tabindex')) {
          child.tabIndex = (document.activeElement === child) ? 0 : -1;
        }
        // this.rtiBindChild(child);
      }
      if (currentlyFocusedChild) {
        currentlyFocusedChild.tabIndex = 0;
        // currentlyFocusedChild.setAttribute('tabindex', '0');
      } else if (currentTabIndexChild) {
        if (currentlyFocusedChild) {
          currentTabIndexChild.tabIndex = -1;
          // currentTabIndexChild.setAttribute('tabindex', '-1');
        }
      } else if (firstFocusableChild) {
        firstFocusableChild.tabIndex = 0;
        // firstFocusableChild.setAttribute('tabindex', '0');
      }
    }

    /** @param {FocusEvent} event */
    onKbdNavFocusIn(event) {
      if (this.kbdNav !== 'true') return;
      const currentItem = /** @type {HTMLElement} */ (event.target);
      const participates = currentItem.matches(this.kbdNavQuery);
      if (!participates) return;
      this.ariaActiveDescendantElement = currentItem;
      if (currentItem.getAttribute('tabindex') !== '0') {
        currentItem.tabIndex = 0;
      }
      for (const item of this.kbdNavChildren) {
        if (item !== currentItem && item.hasAttribute('tabindex')) {
          item.tabIndex = -1;
          // item.setAttribute('tabindex', '-1');
        }
      }
    }

    /** @return {'horizontal'|'vertical'} */
    get ariaOrientationDefault() { return 'vertical'; }

    /**
     * @param {KeyboardEvent} event
     * @return {void}
     */
    onKbdNavKeydown(event) {
      if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
      if (this.kbdNav !== 'true') return;

      switch (event.key) {
        case 'ArrowUp':
        case 'Up':
          if (this.#ariaOrientationIsVertical()) {
            this.focusPrevious();
          }
          break;
        case 'ArrowDown':
        case 'Down':
          if (this.#ariaOrientationIsVertical()) {
            this.focusNext();
          }
          break;
        case 'ArrowLeft':
        case 'Left':
          if (this.#ariaOrientationIsVertical()) return;
          if (isRtl(this)) {
            this.focusNext();
          } else {
            this.focusPrevious();
          }
          break;
        case 'ArrowRight':
        case 'Right':
          if (this.#ariaOrientationIsVertical()) return;
          if (isRtl(this)) {
            this.focusPrevious();
          } else {
            this.focusNext();
          }
          break;
        default:
          return;
      }
      event.preventDefault();
    }

    connectedCallback() {
      super.connectedCallback();
      this.refreshTabIndexes();
      this.addEventListener('focusin', this.onKbdNavFocusIn);
      this.addEventListener('keydown', this.onKbdNavKeydown);
    }
  }

  /** @type {'true'|'false'} */
  KeyboardNav.prototype.kbdNav = KeyboardNav.idl('kbdNav', { empty: 'true' });
  return KeyboardNav;
}