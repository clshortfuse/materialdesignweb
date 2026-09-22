import CustomElement from '../core/CustomElement.js';
import DensityMixin from '../mixins/DensityMixin.js';
import ElevationMixin from '../mixins/ElevationMixin.js';
import KeyboardNavMixin from '../mixins/KeyboardNavMixin.js';
import PopupMixin from '../mixins/PopupMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import MenuItem from './MenuItem.js';

/**
 * Menus provide a list of choices or actions in a temporary surface.
 * @see https://m3.material.io/components/menus/specs
 * @see https://www.w3.org/TR/wai-aria-practices/#menu
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(ElevationMixin)
  .mixin(ShapeMixin)
  .mixin(PopupMixin)
  .mixin(DensityMixin)
  .mixin(KeyboardNavMixin)
  .set({
    /** Placement strategy for the popup ('corner'). */
    flow: 'corner',

    /** When true, show a scrim behind the menu (used by `showModal`). */
    _useScrim: false,

    /**
     * Weak reference to the element that requested a submenu cascade. Stored
     * as a WeakRef to avoid retaining DOM nodes.
     * @type {WeakRef<HTMLElement>}
     */
    _cascader: null,

    /**
     * Weak reference to the currently opened submenu (if any).
     * @type {WeakRef<HTMLElement>}
     */
    _submenu: null,
  })
  .define({
    kbdNavQuery() {
      return 'mdw-menu-item';
    },
    /** Return the internal dialog element used for popup rendering (if any). */
    _dialog() {
      return /** @type {HTMLDialogElement} */ (this.refs.dialog);
    },
    /** Element that cascaded this submenu (if present). */
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
    /** Currently opened submenu element (if any). */
    submenu: {
      get() {
        return this._submenu?.deref();
      },
      /**
       * @param {HTMLElement} value
       */
      set(value) {
        this._submenu = value ? new WeakRef(value) : null;
      },
    },
  })
  .recompose(({ refs: { dialog, scrim } }) => {
    scrim.setAttribute('invisible', '');
    dialog.setAttribute('role', 'menu');
    dialog.removeAttribute('aria-modal');
    // Wrap slot in scroller
  })
  .css`
    /* https://m3.material.io/components/menus/specs */

    :host {
      --mdw-shape__size: var(--mdw-shape__extra-small);
      --mdw-bg: var(--mdw-color__surface-container);
      --mdw-ink: var(--mdw-color__on-surface);
      display: block;

      inline-size: auto;
      min-inline-size: calc(var(--mdw-menu__inline-base) * 2);
      max-inline-size: 100vw;

      filter: var(--mdw-elevation__drop-shadow__2);

      background-color: rgb(var(--mdw-bg));
    }

    #form {
      display: contents;
    }
  `
  .methods({
    /** @param {Parameters<InstanceType<ReturnType<PopupMixin>>['showPopup']>} args */
    showModal(...args) {
      this._useScrim = true;
      const result = this.showPopup(...args);
      this._useScrim = false;
      return result;
    },
    focus() {
      this.focusFirst();
    },
    /**
     * @param {HTMLElement} cascader Element that calls for submenu cascade
     */
    cascade(cascader) {
      this.cascader = cascader;
      this.showPopup(cascader, true, 'adjacent');
    },
    /** Closes this menu and each owning cascader menu after command activation. */
    _closeActivatedMenuChain() {
      const parent = this.cascader?.parentElement;
      const parentMenu = parent?.localName === this.localName
        ? /** @type {typeof this} */ (parent)
        : null;
      this.close(undefined, !parentMenu);
      parentMenu?._closeActivatedMenuChain();
    },
  })
  .on({
    openChanged(oldValue, newValue) {
      const cascader = this.cascader;
      if (cascader instanceof MenuItem) {
        /** @type {InstanceType<typeof MenuItem>} */ (cascader)._cascadeExpanded = newValue;
      }
    },
    disconnected() {
      if (this.open) {
        this.close(undefined, false);
      }
    },
  })
  .events({
    'mdw-menu-item:cascade'(event) {
      const menuItem = /** @type {HTMLElement} */ (event.target);
      if (!(menuItem instanceof MenuItem) || menuItem.parentElement !== this) return;
      const subMenuId = /** @type {CustomEvent<string>} */ (event).detail;
      event.stopPropagation();

      const root = /** @type {DocumentFragment|Document} */ (this.getRootNode());
      const submenu = /** @type {typeof this} */ (root.getElementById(subMenuId));
      if (!submenu || typeof submenu.cascade !== 'function') return;
      const previousSubmenu = /** @type {typeof this} */ (this.submenu);
      if (previousSubmenu && previousSubmenu !== submenu) {
        previousSubmenu.close(undefined, false);
      }
      this.submenu = submenu;
      submenu.cascade(menuItem);
    },
    'mdw-menu-item:cascader-blur'() {
      const submenu = /** @type {typeof this} */ (this.submenu);
      if (!submenu) return;
      // Wait for focus event (if mouse focus on sub menu item)
      queueMicrotask(() => {
        // Stay open if submenu is focused
        if (submenu.matches(':focus-within,:focus')) return;

        submenu.close(false);
      });
    },

    '~click'(event) {
      const menuItem = event.target;
      if (menuItem instanceof MenuItem && menuItem.parentElement === this) {
        const commandItem = /** @type {{disabledState: boolean, type: string|null, cascades: string|null}} */ (
          /** @type {unknown} */ (menuItem)
        );
        if (!commandItem.disabledState && commandItem.type == null && !commandItem.cascades) {
          this._closeActivatedMenuChain();
        }
        return;
      }
      if (this !== event.target) return;
      // Clicked self (scrim-like)
      event.stopPropagation();
      this.close(true);
    },
    keydown(event) {
      if (!this.open) return;

      switch (event.key) {
        case 'Tab':
          // Hide menu allowing focus to revert to calling element
          // If close is successfully, focus will return to spawning element
          // and browser will then tab from spawning to next.
          // If close is not successful, stop event.
          if (!this.close()) {
            event.stopPropagation();
            event.preventDefault();
          }
          break;
        // Unless menu hiding is cancelled
        case 'ArrowLeft':
        case 'ArrowRight':
          if (getComputedStyle(this).direction === 'rtl') {
            if (event.key === 'ArrowLeft') break;
          } else if (event.key === 'ArrowRight') {
            break;
          }
          // Fallthrough;
        case 'Escape':
        case 'Esc':
          event.stopPropagation();
          event.preventDefault();
          this.close(true);
          break;
        default:
      }
    },
    focusout() {
      if (!this.open) return;
      if (this.modal) return;
      // Wait until end of event loop cycle to see if focus really is lost
      queueMicrotask(() => {
        if (this.matches(':focus-within')) return;
        const { cascader, submenu } = this;

        if (cascader && cascader.matches(':is(:focus-within,:focus)')) return;
        if (submenu && submenu.matches(':is(:focus-within,:focus)')) return;
        this.close(false);
      });
    },
  })
  .childEvents({
    slot: {
      slotchange() {
        if (this.isConnected) {
          this.refreshTabIndexes();
          const submenu = /** @type {typeof this} */ (this.submenu);
          if (submenu && submenu.cascader?.parentElement !== this) {
            submenu.close(undefined, false);
          }
        }
      },
    },
  })
  .autoRegister('mdw-menu');
