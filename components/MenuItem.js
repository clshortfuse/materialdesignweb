// https://www.w3.org/TR/wai-aria-practices/#menu

import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import { isFocused } from '../core/dom.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';

import './Icon.js';
import ListOption from './ListOption.js';

/**
 * Menu items represent selectable options within a menu. They can trigger
 * actions, toggle state, or open nested submenus.
 * @see https://m3.material.io/components/menus/specs
 */
export default ListOption
  .extend()
  .mixin(FormAssociatedMixin)
  .set({
    /** Timeout handle used to schedule submenu cascade. */
    _cascadeTimeout: null,

    /** Milliseconds to delay before opening a cascaded submenu. */
    CASCADE_TIMEOUT: 500,

    /** Internal flag indicating a cascade is in progress. */
    _cascading: false,

  })
  .observe({
    /** Whether the submenu owned by this cascader is open. */
    _cascadeExpanded: 'boolean',

    type({ radio, checkbox }) {
      if (radio != null) return 'radio';
      if (checkbox != null) return 'checkbox';
      return null;
    },
  })
  .observe({
    /** ID of the submenu to open when this item cascades. */
    cascades: 'string',

    /** Event handler called when an ordinary menu item is activated. */
    onaction: /** @type {any} */ (EVENT_HANDLER_TYPE),

    /**
     * Backing field for the menu item's value attribute. Can be `null` to
     * indicate no explicit value; reflected to the `value` attribute.
     */
    _defaultValue: {
      attr: 'value',
      reflect: true,
      empty: null,
    },
  })
  .observe({
    /**
     * Non-null string representation of the default value used for form
     * association. Getter never returns null; setter writes to `_defaultValue`.
     */
    defaultValue: {
      reflect: false,
      get() {
        return this._defaultValue ?? '';
      },
      /** @param {string} value */
      set(value) {
        this._defaultValue = String(value);
      },
    },
    value: {
      reflect: false,
      get() {
        return this._defaultValue ?? 'on';
      },
      /**
       * @param {string} value
       * @return {void}
       */
      set(value) {
        this._defaultValue = String(value);
      },
    },
  })
  .overrides({
    /** @return {boolean} */
    _isRadioSelected() {
      return this.selected;
    },
    _updateFormAssociatedValue() {
      if (this.selected) {
        this.elementInternals.setFormValue(this.value);
        if (this.type === 'radio') {
          this._notifyRadioChange(this.name);
        }
      } else {
        this.elementInternals.setFormValue(null);
      }
    },
    formIPCEvent(event) {
      if ((event.target instanceof HTMLFormElement && event.target !== this.form)
        || this.type !== 'radio') return;
      const [name, source] = event.detail;
      if (!name || this.name !== name || source === this) return;
      this.selected = false;
    },
  })
  .expressions({
    computeTrailingIcon({ trailingIcon, cascades }) {
      if (!trailingIcon && cascades) return 'arrow_right';
      return trailingIcon;
    },
    computeMenuHref({ href, checkbox, radio, cascades, disabledState }) {
      if (disabledState || checkbox != null || radio != null || cascades) return null;
      return href;
    },
  })
  .methods({
    unscheduleCascade() {
      clearTimeout(this._cascadeTimeout);
      this._cascadeTimeout = null;
    },
    scheduleCascade() {
      if (this._cascadeTimeout) return;
      this._cascadeTimeout = setTimeout(this.cascade.bind(this), this.CASCADE_TIMEOUT);
    },
    cascade() {
      this.unscheduleCascade();
      if (!this.isConnected || this.disabledState || !this.cascades) return;
      this._cascading = true;
      // Dispatch event asking for cascade.
      // Captured by parent mdw-menu and used to track current submenu
      this.dispatchEvent(new CustomEvent('mdw-menu-item:cascade', { detail: this.cascades, bubbles: true }));
      this._cascading = false;
    },
  })
  .on({
    _selectedChanged() {
      this._updateFormAssociatedValue();
      if (this._selectedDirty) {
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
  })
  .events({
    mouseenter() {
      if (this.disabledState) return;
      if (!isFocused(this)) {
        this.focus();
      }
      if (!this.cascades) return;
      this.scheduleCascade();
    },
    mouseout: 'unscheduleCascade',
    '~click'() {
      if (this.disabledState) return;
      if (this.type === 'radio') {
        this.selected = true;
        return;
      }
      if (this.type === 'checkbox') {
        if (this.required && this.selected) return;
        this.selected = !this.selected;
        return;
      }

      if (this.cascades) {
        this.cascade();
        return;
      }
      this.dispatchEvent(new Event('action'));
    },
    keydown(event) {
      if (this.disabledState) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.stopPropagation();
          event.preventDefault();
        }
        return;
      }
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.stopPropagation();
          event.preventDefault();
          if (this.href == null) {
            this.click();
          } else {
            this.refs.anchor.click();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          if (!this.cascades) break;
          if (getComputedStyle(this).direction === 'rtl') {
            if (event.key === 'ArrowRight') break;
          } else if (event.key === 'ArrowLeft') {
            break;
          }
          event.stopPropagation();
          event.preventDefault();
          this.cascade();
          break;
        default:
      }
    },
    /**
     * Closes submenu if focus leaves cascader to something else (sibling menu item)
     * RelatedTarget is unreliable on Webkit
     */
    blur() {
      if (!this.cascades) return;
      if (this._cascading) return;
      this.dispatchEvent(new CustomEvent('mdw-menu-item:cascader-blur', { detail: this.cascades, bubbles: true }));
    },
  })
  .recompose(({ inline, html, refs }) => {
    const { checkbox: checkboxRef, radio: radioRef, row } = refs;
    const { anchor, trailing, trailingIcon } = refs;
    checkboxRef.remove();
    radioRef.remove();

    anchor.setAttribute('role', inline(({ checkbox, radio }) => {
      if (checkbox != null) return 'menuitemcheckbox';
      if (radio != null) return 'menuitemradio';
      return 'menuitem';
    }));

    // MenuItems use checked instead of selected as in list items.
    anchor.setAttribute('aria-checked', inline(({ checkbox, radio, selected }) => {
      if (checkbox == null && radio == null) return null;
      return `${selected}`;
    }));
    anchor.setAttribute('aria-controls', '{cascades}');
    anchor.setAttribute('aria-expanded', inline(({ cascades, _cascadeExpanded }) => (
      cascades ? `${_cascadeExpanded}` : null
    )));
    anchor.setAttribute('aria-haspopup', inline(({ cascades }) => (cascades ? 'menu' : null)));
    anchor.removeAttribute('aria-selected');
    anchor.setAttribute('href', '{computeMenuHref}');

    row.prepend(html`
      <mdw-icon id=selection
        mdw-if=${({ checkbox, radio }) => checkbox ?? radio ?? false}
        class=${({ checkbox, radio }) => checkbox || radio || 'leading'}
        selected={selected} icon=check></mdw-icon>
    `);

    trailing.setAttribute('type-style', 'label-large');

    trailingIcon.setAttribute('mdw-if', '{computeTrailingIcon}');
    trailingIcon.setAttribute('icon', '{computeTrailingIcon}');
  })
  .on({
    _formResetChanged(oldValue, newValue) {
      if (!newValue) return;
      this._selected = this.defaultSelected;
    },
    disconnected() {
      this.unscheduleCascade();
      this._cascading = false;
    },
    disabledStateChanged(oldValue, newValue) {
      if (newValue) {
        this.unscheduleCascade();
      }
    },
    cascadesChanged() {
      this.unscheduleCascade();
    },
  })
  .css`
    /* https://m3.material.io/components/menus/specs */

    :host {
      cursor: pointer;

      white-space: nowrap;
    }

    #row {
      gap: 12px;

      padding-inline: 12px;
    }

    #content {
      padding-block: calc(4px + (var(--mdw-density) * 2px))
    }

    #icon {
      transition-duration: 100ms;
      transition-property: opacity;
      will-change: opacity;
    }

    #trailing,
    #icon {
      color: rgb(var(--mdw-color__on-surface-variant));
    }

    #selection {
      opacity: 0;

      font-size: 18px;
    }

    #selection.trailing {
      font-size: 24px;
    }

    #selection[selected] {
      opacity: 1;
    }

    :host([disabled]) {
      cursor: not-allowed;
    }

    #anchor[selected] {
      background-color: transparent;
      color: inherit;
    }

    #anchor[href] {
      z-index: 1;
    }

    #content[selected] {
      color: inherit;
    }
  `
  .autoRegister('mdw-menu-item');
