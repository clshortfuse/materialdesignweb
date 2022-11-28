import { attemptFocus } from '../core/dom.js';

/**
 * @template {typeof import('../core/CustomElement.js').default} T
 * @param {T} Base
 */
export default function RovingTabIndexedMixin(Base) {
  class RovingTabIndexed extends Base {
    static RTI_DEFAULT_QUERY = [
      'button:not(:disabled):not([tabindex="-1"])',
      '[href]:not(:disabled):not([tabindex="-1"])',
      'input:not(:disabled):not([tabindex="-1"])',
      'select:not(:disabled):not([tabindex="-1"])',
      'textarea:not(:disabled):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    /**
     * Query used to find roving tab index children
     */
    get rtiQuery() {
      return /** @type {typeof RovingTabIndexed} */ (this.static).RTI_DEFAULT_QUERY;
    }

    /**
     * List of roving tab index participating children
     * @return {NodeListOf<HTMLElement>}
     */
    get rtiChildren() {
      return this.querySelectorAll(this.rtiQuery);
    }

    /**
     * Flag whether disabled elements participating in roving tab index
     * should be focusable.
     */
    get rtiFocusableWhenDisabled() { return true; }

    /**
     * Focuses next element participating in roving tab index list
     * @param {HTMLElement} [current]
     * @param {boolean} [loop=true]
     * @param {boolean} [reverse]
     * @return {HTMLElement} focusedElement
     */
    rtiFocusNext(current = null, loop = true, reverse = false) {
      let foundCurrent = false;
      const array = reverse ? [...this.rtiChildren].reverse() : this.rtiChildren;
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
     * Alias for rtiFocusNext(list, current, true).
     * Selects previous element participating in roving tab index list
     * @param {HTMLElement} [current]
     * @param {boolean} [loop=true]
     * @return {HTMLElement}
     */
    rtiFocusPrevious(current, loop = true) {
      return this.rtiFocusNext(current, loop, true);
    }

    /** @type {HTMLElement['focus']} */
    focus(options = undefined) {
      super.focus(options);
      for (const candidate of this.rtiChildren) {
        if (candidate.getAttribute('tabindex') === '0' && candidate instanceof HTMLElement) {
          candidate.focus();
          return;
        }
      }
      this.rtiFocusNext();
    }

    /**
     * Refreshes roving tab index attributes based on rtiChildren
     */
    refreshTabIndexes() {
      if (this.rovingTabIndex !== 'true') return;
      /** @type {HTMLElement} */
      let currentlyFocusedChild = null;
      /** @type {HTMLElement} */
      let currentTabIndexChild = null;
      /** @type {HTMLElement} */
      let firstFocusableChild = null;
      for (const child of this.rtiChildren) {
        if (!currentlyFocusedChild && document.activeElement === child) {
          currentlyFocusedChild = child;
        } else if (!currentTabIndexChild && child.getAttribute('tabindex') === '0') {
          currentTabIndexChild = child;
        } else {
          if (!firstFocusableChild && child.getAttribute('aria-hidden') !== 'true'
        && (this.rtiFocusableWhenDisabled || child.getAttribute('aria-disabled') !== 'true')) {
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
    onRTIFocusIn(event) {
      if (this.rovingTabIndex !== 'true') return;
      const currentItem = /** @type {HTMLElement} */ (event.target);
      const participates = currentItem.matches(this.rtiQuery);
      if (!participates) return;
      if (currentItem.getAttribute('tabindex') !== '0') {
        currentItem.tabIndex = 0;
      }
      for (const item of this.rtiChildren) {
        if (item !== currentItem && item.hasAttribute('tabindex')) {
          item.tabIndex = -1;
          // item.setAttribute('tabindex', '-1');
        }
      }
    }

    connectedCallback() {
      super.connectedCallback();
      this.refreshTabIndexes();
      this.addEventListener('focusin', this.onRTIFocusIn);
    }
  }

  /** @type {'true'|'false'} */
  RovingTabIndexed.prototype.rovingTabIndex = RovingTabIndexed.idl('rovingTabIndex', { empty: 'true' });
  return RovingTabIndexed;
}
