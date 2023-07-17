// https://www.w3.org/TR/wai-aria-practices/#menu

import './Surface.js';
import CustomElement from '../core/CustomElement.js';
import { attemptFocus } from '../core/dom.js';
import DensityMixin from '../mixins/DensityMixin.js';
import KeyboardNavMixin from '../mixins/KeyboardNavMixin.js';
import PopupMixin from '../mixins/PopupMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(SurfaceMixin)
  .mixin(ShapeMixin)
  .mixin(PopupMixin)
  .mixin(DensityMixin)
  .mixin(KeyboardNavMixin)
  .set({
    scrollable: true,
    flow: 'corner',
    _useScrim: false,
    /** @type {WeakRef<HTMLElement>} */
    _cascader: null,
    /** @type {WeakRef<HTMLElement>} */
    _submenu: null,
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
  .recompose(({ refs: { shape, surface, dialog, scrim } }) => {
    surface.append(shape);
    dialog.prepend(surface);
    scrim.setAttribute('invisible', '');

    // Wrap slot in scroller
  })
  .css`
    /* https://m3.material.io/components/menus/specs */

    :host {
      --mdw-shape__size: var(--mdw-shape__extra-small);
      --mdw-bg: var(--mdw-color__surface-container);
      --mdw-ink: var(--mdw-color__on-surface);

      --mdw-surface__shadow__resting: var(--mdw-surface__shadow__2);
      --mdw-surface__shadow__raised: var(--mdw-surface__shadow__resting);
      display: block;

      inline-size: auto;
      min-inline-size: calc(var(--mdw-menu__inline-base) * 2);
      max-inline-size: 100vw;
    }

    #shape {
      background-color: rgb(var(--mdw-bg));
    }

    #form {
      display: contents;
    }
  `
  .methods({
    showModal(...args) {
      this._useScrim = true;
      const result = this.showPopup(...args);
      this._useScrim = false;
      return result;
    },
    focus() {
      const [firstItem] = this.kbdNavChildren;
      if (!attemptFocus(firstItem)) {
        this.focusNext(firstItem);
      }
    },
    /**
     * @param {HTMLElement} cascader Element that calls for submenu cascade
     */
    cascade(cascader) {
      this.cascader = cascader;
      this.showPopup(cascader, true, 'adjacent');
    },
  })
  .events({
    'mdw-menu-item:cascade'(event) {
      const menuItem = event.target;
      const subMenuId = event.detail;
      event.stopPropagation();

      const submenu = this.getRootNode().getElementById(subMenuId);
      this.submenu = submenu;
      submenu.cascade(menuItem);
    },
    'mdw-menu-item:cascader-blur'() {
      const submenu = this.submenu;
      if (!submenu) return;
      // Wait for focus event (if mouse focus on sub menu item)
      queueMicrotask(() => {
        // Stay open if submenu is focused
        if (submenu && submenu.matches(':focus-within,:focus')) return;

        submenu.close(false);
      });
    },

    '~click'(event) {
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
          // if (!this.submenu) break;
          if (getComputedStyle(this).direction === 'rtl') {
            if (event.key === 'ArrowLeft') break;
          } else if (event.key === 'ArrowRight') break;
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
  .autoRegister('mdw-menu');
