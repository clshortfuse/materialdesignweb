// https://www.w3.org/TR/wai-aria-practices/#menu

import './Container.js';
import CustomElement from '../core/CustomElement.js';
import { attemptFocus } from '../core/dom.js';
import KeyboardNavMixin from '../mixins/KeyboardNavMixin.js';
import { canAnchorPopup } from '../utils/popup.js';

import styles from './Menu.css' assert { type: 'css' };

/**
 * @typedef {Object} MenuStack
 * @prop {InstanceType<import('./Menu.js').default>} element
 * @prop {Element} previousFocus
 * @prop {Object} [state]
 * @prop {Object} [previousState]
 * @prop {MouseEvent|PointerEvent|HTMLElement|Element} [originalEvent]
 * @prop {any} [pendingResizeOperation]
 */

const supportsHTMLDialogElement = typeof HTMLDialogElement !== 'undefined';
/** @type {MenuStack[]} */
const OPEN_MENUS = [];

/**
 * @return {void}
 */
function onWindowResize() {
  const lastOpenMenu = OPEN_MENUS.at(-1);
  if (!lastOpenMenu || !lastOpenMenu.originalEvent) {
    return;
  }
  if (lastOpenMenu.pendingResizeOperation) {
    cancelAnimationFrame(lastOpenMenu.pendingResizeOperation);
  }
  lastOpenMenu.pendingResizeOperation = requestAnimationFrame(() => {
    lastOpenMenu.element.updateMenuPosition(lastOpenMenu.originalEvent);
    lastOpenMenu.pendingResizeOperation = null;
  });
}

/**
 * @param {PopStateEvent} event
 */
function onPopState(event) {
  if (!event.state) return;
  const lastOpenMenu = OPEN_MENUS.at(-1);
  if (!lastOpenMenu || !lastOpenMenu.previousState) {
    return;
  }
  if ((lastOpenMenu.previousState === event.state) || Object.keys(event.state)
    .every((key) => event.state[key] === lastOpenMenu.previousState[key])) {
    lastOpenMenu.element.close();
  }
}

export default CustomElement
  .mixin(KeyboardNavMixin)
  .extend()
  .observe({
    open: 'boolean',
    flow: {
      type: 'string',
      /** @type {'corner'|'adjacent'|'overflow'|'vcenter'|'hcenter'|'center'} */
      value: null,
    },
    submenu: 'boolean',
    modal: 'boolean',
    _isNativeModal: 'boolean',
  })
  .set({
    returnValue: '',
    delegatesFocus: true,
    /** @type {WeakRef<HTMLElement>} */
    _cascader: null,
  })
  .define({
    kbdNavChildren() {
      const items = [...this.querySelectorAll('mdw-menu-item')];
      // eslint-disable-next-line unicorn/prefer-set-has
      const submenuItems = [...this.querySelectorAll(':scope mdw-menu mdw-menu-item')];
      return items.filter((el) => !submenuItems.includes(el));
    },
    _dialog() {
      return /** @type {HTMLDialogElement} */ (this.refs.dialog);
    },
    cascader: {
      get() {
        return this._cascader?.deref();
      },
      /**
       * @param {HTMLElement} value
       */
      set(value) {
        this._cascader = value ? new WeakRef(value) : null;
      },
    },
  })
  .css(styles)
  .html/* html */`
    <dialog id=dialog role=menu aria-hidden=${({ open }) => (open ? 'false' : 'true')}>
      <div id=scrim aria-hidden=true></div>
      <form id=form method=dialog role=none>
        <mdw-container id=container role=none>
          <slot id=slot on-slotchange={refreshTabIndexes}></slot>
        </mdw-container>
      </form>
    </dialog>
  `
  .methods({
    focus() {
      const [firstItem] = this.kbdNavChildren;
      if (!attemptFocus(firstItem)) {
        this.focusNext(firstItem);
      }
    },
    /**
     * @param {DOMRect|Element} [anchor]
     * @return {void}
     */
    updateMenuPosition(anchor) {
      const container = this.refs.container;
      container.style.setProperty('max-height', 'none');
      container.style.setProperty('width', 'auto');
      const newSize = Math.ceil(container.clientWidth / 56);
      container.style.removeProperty('width');
      container.style.setProperty('--mdw-menu__size', newSize.toString(10));

      /** @type {import('../utils/popup.js').CanAnchorPopUpOptions} */
      const anchorOptions = {
        anchor: anchor ?? this.getBoundingClientRect(),
        width: container.clientWidth,
        height: container.clientHeight,
        // margin,
      };

      const isPageRTL = (getComputedStyle(this).direction === 'rtl');
      const xStart = isPageRTL ? 'right' : 'left';
      const xEnd = isPageRTL ? 'left' : 'right';

      /* Automatic Positioning
       *
       * Positions:
       *   3      7      4
       *     ┌─────────┐
       *     │         │
       *   5 │    9    │ 6
       *     │         │
       *     └─────────┘
       *   1      8      2
       *
       * 1: Bottom Left
       * 2: Bottom Right
       * 3: Top Left
       * 4: Top Right
       * 5: VCenter Left
       * 6: VCenter Right
       * 7: HCenter Top
       * 8: HCenter Bottom
       * 9: VCenter HCenter
       *
       * Directions:
       * a - Down LTR
       * b - Down RTL
       * c - Up LTR
       * d - Up RTL
       * e - LTR
       * f - RTL
       * g - Down
       * h - Up
       * i - Center
       *
       *
       * 16 total combos
       * 1a 1b 1c 1d  └↘ └↙ └↗ └↖
       * 2a 2b 2c 2d  ┘↘ ┘↙ ┘↗ ┘↖
       * 3a 3b 3c 3d  ┌↘ ┌↙ ┌↗ ┌↖
       * 4a 4b 4c 4d  ┐↘ ┐↙ ┐↗ ┐↖
       *
       * Avoid using opposite angle
       *
       * 1a XX 1c 1d  └↘ ██ └↗ └↖
       * XX 2b 2c 2d  ██ ┘↙ ┘↗ ┘↖
       * 1a 3b 3c XX  ┌↘ ┌↙ ┌↗ ██
       * 4a 4b XX 4d  ┐↘ ┐↙ ██ ┐↖
       *
       *
       * Preference Order:
       * - Flow from corner           1a 2b 3c 4d    └↘ ┘↙ ┌↗ ┐↖
       * - Open adjacent to target    4a 3b 2c 1d    ┐↘ ┌↙ ┘↗ └↖
       * - Overlay target             3a 4b 1c 2d    ┌↘ ┐↙ └↗ ┘↖
       * - Open from horizontal side  5e 6f          │→ │←
       * - Open from center           9i             █·
       */

      /** @type {import('../utils/popup.js').CanAnchorPopUpOptions[]} */
      const preferences = [
        (!this.submenu && (this.flow ?? 'corner') === 'corner') ? [
          { clientY: 'bottom', clientX: xStart },
          { clientY: 'bottom', clientX: xEnd },
          { clientY: 'top', clientX: xStart },
          { clientY: 'top', clientX: xEnd },
        ] : [],
        (this.submenu || (this.flow ?? 'adjacent') === 'adjacent') ? [
          { clientY: 'top', clientX: xEnd, directionX: xEnd, directionY: 'down' },
          { clientY: 'top', clientX: xStart, directionX: xStart, directionY: 'down' },
          { clientY: 'bottom', clientX: xEnd, directionX: xEnd, directionY: 'up' },
          { clientY: 'bottom', clientX: xStart, directionX: xStart, directionY: 'up' },
        ] : [],
        (!this.submenu && (this.flow ?? 'overlay') === 'overlay') ? [
          { clientY: 'top', clientX: xStart, directionX: xEnd, directionY: 'down' },
          { clientY: 'top', clientX: xEnd, directionX: xStart, directionY: 'down' },
          { clientY: 'bottom', clientX: xStart, directionX: xEnd, directionY: 'up' },
          { clientY: 'bottom', clientX: xEnd, directionX: xStart, directionY: 'up' },
        ] : [],
        (!this.submenu && (this.flow ?? 'vcenter') === 'vcenter') ? [
          { clientY: 'center', clientX: xEnd, directionX: xEnd, directionY: 'center' },
          { clientY: 'center', clientX: xStart, directionX: xStart, directionY: 'center' },
        ] : [],
        (!this.submenu && (this.flow ?? 'hcenter') === 'hcenter') ? [
          { clientY: 'bottom', clientX: 'center', directionX: 'center', directionY: 'down' },
          { clientY: 'top', clientX: 'center', directionX: 'center', directionY: 'up' },
        ] : [],
        (!this.submenu && (this.flow ?? 'center') === 'center') ? [
          { clientY: 'center', clientX: 'center', directionX: 'center', directionY: 'center' },
        ] : [],
      ].flat();

      let anchorResult;
      for (const preference of preferences) {
        anchorResult = canAnchorPopup({
          ...anchorOptions,
          ...preference,
        });
        if (anchorResult) break;
      }

      if (!anchorResult) {
        anchorResult = canAnchorPopup({
          ...anchorOptions,
          ...preferences[0],
          force: true,
        });
      }

      container.style.setProperty('top', `${anchorResult.pageY}px`);
      container.style.setProperty('left', `${anchorResult.pageX}px`);
      container.style.setProperty('margin', '0');
      container.style.setProperty('transform-origin', `${anchorResult.transformOriginY} ${anchorResult.transformOriginX}`);
      container.scrollIntoView();
    },
    /**
     * @param {MouseEvent|PointerEvent|HTMLElement|Element} [source]
     * @return {boolean} handled
     */
    showModal(source = document.activeElement) {
      if (this.open) return false;
      this.modal = true;
      if (supportsHTMLDialogElement) {
        this._dialog.showModal();
        this._isNativeModal = true;
      }
      return this.show(source);
    },
    /**
     * @param {MouseEvent|PointerEvent|HTMLElement|Element} [source]
     * @return {boolean} handled
     */
    show(source = document.activeElement) {
      if (this.open) return false;
      this.open = true;

      const previousFocus = document.activeElement;
      this.updateMenuPosition(source);
      if (supportsHTMLDialogElement && !this._dialog.open) {
        this._dialog.show();
        const main = document.querySelector('main');
        if (main) {
          main.setAttribute('aria-hidden', 'true');
        }
      }

      const newState = { hash: Math.random().toString(36).slice(2, 18) };
      let previousState = null;

      if (!window.history.state) {
      // Create new previous state
        window.history.replaceState({
          hash: Math.random().toString(36).slice(2, 18),
        }, document.title);
      }
      previousState = window.history.state;
      window.history.pushState(newState, document.title);
      window.addEventListener('popstate', onPopState);
      window.addEventListener('resize', onWindowResize);
      window.addEventListener('scroll', onWindowResize);

      OPEN_MENUS.push({
        element: this,
        previousFocus,
        state: newState,
        previousState,
        originalEvent: source,
      });

      if (!this.submenu) this.focus();

      return true;
    },
    /**
     * @param {boolean} returnFocus Return focus to element focused during open
     * @return {boolean} handled
     */
    close(returnFocus = true) {
      if (!this.open) return false;
      this.modal = false;
      if (this._isNativeModal) {
        this._isNativeModal = false;
      } else {
        const main = document.querySelector('main');
        if (main) {
          main.removeAttribute('aria-hidden');
        }
      }
      // if (this.dialogElement.getAttribute('aria-hidden') === 'true') return false;
      if (supportsHTMLDialogElement && this._dialog.open) {
        const previousFocus = document.activeElement;
        // Closing a native dialog will return focus automatically.
        this._dialog.close();
        if (!attemptFocus(previousFocus, { preventScroll: true })) {
          document.activeElement?.blur?.();
        }
      }

      // Will invoke observed attribute change: ('aria-hidden', 'true');

      this.open = false;
      this.dispatchEvent(new Event('close'));

      const len = OPEN_MENUS.length;
      for (let i = len - 1; i >= 0; i--) {
        const entry = OPEN_MENUS[i];
        if (entry.element === this) {
          if (entry.state && window.history && window.history.state && entry.state.hash === window.history.state.hash) {
            window.removeEventListener('popstate', onPopState);
            window.history.back();
            window.addEventListener('popstate', onPopState);
          }
          if (returnFocus && entry.previousFocus instanceof HTMLElement) {
            entry.previousFocus?.focus({ preventScroll: true });
          }
          OPEN_MENUS.splice(i, 1);
          break;
        } else if (this.contains(entry.element)) {
          entry.element.close(false);
        }
      }
      if (!OPEN_MENUS.length) {
        window.removeEventListener('popstate', onPopState);
        window.removeEventListener('resize', onWindowResize);
      }
      return true;
    },
    /**
     * @param {HTMLElement} cascader Element that calls for submenu cascade
     */
    cascade(cascader) {
      this.cascader = cascader;
      this.show(cascader);
    },
  })
  .events({
    '~click'(event) {
      if (this !== event.target) return;
      // Clicked self (scrim-like)
      event.stopPropagation();
      this.close(true);
    },
    keydown(event) {
      if (!this || !this.open || this.getAttribute('aria-hidden') === 'true') {
        return;
      }

      if (event.key === 'Tab') {
        // Hide menu allowing focus to revert to calling element
        // To then allow browser default Tab interaction
        // Unless menu hiding is cancelled
        if (!this.close()) {
          event.stopPropagation();
          event.preventDefault();
        }
        return;
      }
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.stopPropagation();
        event.preventDefault();
        this.close();
      }
    },
    focusout(event) {
      if (!this.open) return;
      if (this.modal) return;
      // Wait until end of event loop cycle to see if focus really is lost
      queueMicrotask(() => {
        if (this.matches(':focus-within')) return;
        const activeElement = document.activeElement;
        if (activeElement
            && (this.cascader === activeElement || this.contains(activeElement))) {
          return;
        }
        this.close(false);
      });
    },
  })
  .autoRegister('mdw-menu');
