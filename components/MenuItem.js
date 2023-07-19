// https://www.w3.org/TR/wai-aria-practices/#menu

import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';

import './Icon.js';
import ListOption from './ListOption.js';

export default ListOption
  .extend()
  .mixin(FormAssociatedMixin)
  .set({
    _cascadeTimeout: null,
    CASCADE_TIMEOUT: 500,
    _cascading: false,
  })
  .define({
    type() {
      if (this.radio != null) return 'radio';
      if (this.checkbox != null) return 'checkbox';
      return null;
    },
  })
  .observe({
    /** ID of menu to cascade */
    cascades: 'string',
    /** Can be null */
    _defaultValue: {
      attr: 'value',
      reflect: true,
      nullParser: String,
      empty: null,
    },
  })
  .observe({
    /** Never returns null */
    defaultValue: {
      reflect: false,
      get() {
        return this._defaultValue ?? '';
      },
      /** @param {string} value */
      set(value) {
        this._defaultValue = value;
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
        this._defaultValue = value;
      },
    },
  })
  .overrides({
    formIPCEvent(event) {
      if (event.target instanceof HTMLFormElement && event.target !== this.form) {
        console.warn('Control.formIPCEvent: Abort from wrong form');
        return;
      }
      if (this.type !== 'radio') {
        console.warn('Control.formIPCEvent: Abort from not radio');
        return;
      }
      const [name, value] = event.detail;
      if (this.name !== name) return;
      if (value === this.value) return;
      if (this.value === '1') {
        console.log('unchecking', this.name, this.value);
        this.selected = false;
      } else {
        this.selected = false;
      }
    },
  })
  .expressions({
    computeTrailingIcon({ trailingIcon, cascades }) {
      if (!trailingIcon && cascades) return 'arrow_right';
      return trailingIcon;
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
      this._cascading = true;
      // Dispatch event asking for cascade.
      // Captured by parent mdw-menu and used to track current submenu
      this.dispatchEvent(new CustomEvent('mdw-menu-item:cascade', { detail: this.cascades, bubbles: true }));
      this._cascading = false;
    },
  })
  .on({
    _selectedChanged(oldValue, newValue) {
      console.log('_selectedChanged', oldValue, newValue);
      if (newValue) {
        this.elementInternals.setFormValue(this.value);
        if (this.type === 'radio') {
          this._notifyRadioChange(this.name, this.value);
        }
      } else {
        this.elementInternals.setFormValue(null);
      }
      if (this._selectedDirty) {
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
  })
  .events({
    mouseenter() {
      if (this.disabledState) return;
      if (document.activeElement !== this) {
        this.focus();
      }
      if (!this.cascades) return;
      this.scheduleCascade();
    },
    mouseout: 'unscheduleCascade',
    '~click'() {
      if (this.disabledState) return;
      if (this.type === 'radio') {
        if (this.required) return;
        this.selected = true;
      } else if (this.type === 'checkbox') {
        if (this.required) return;
        this.selected = !this.selected;
        return;
      }

      if (this.cascades) {
        this.cascade();
      }
    },
    keydown(event) {
      if (this.disabledState) return;
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.stopPropagation();
          event.preventDefault();
          this.click();
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          if (!this.cascades) break;
          if (getComputedStyle(this).direction === 'rtl') {
            if (event.key === 'ArrowRight') break;
          } else if (event.key === 'ArrowLeft') break;
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
  .recompose(({ inline, html, refs: { checkbox: checkboxRef, radio: radioRef, anchor, trailing, trailingIcon } }) => {
    checkboxRef.remove();
    radioRef.remove();

    anchor.setAttribute('role', inline(({ checkbox, radio }) => {
      if (checkbox != null) return 'menuitemcheckbox';
      if (radio != null) return 'menuitemradio';
      return 'menuitem';
    }));

    // MenuItems use checked instead of selected as in list items.
    anchor.setAttribute('ariaChecked', anchor.getAttribute('aria-selected'));

    anchor.after(html`
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
  })
  .css`
    /* https://m3.material.io/components/menus/specs */

    :host {
      gap: 12px;

      padding-inline: 12px;

      cursor: pointer;

      white-space: nowrap;
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

    #content[selected] {
      color: inherit;
    }
  `
  .autoRegister('mdw-menu-item');
